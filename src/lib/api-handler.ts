import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import {
  persistSubmission,
  sendEmail,
  verifySpamToken,
  type SubmissionOutcome,
} from "@/lib/integrations";
import { flattenFieldErrors } from "@/lib/validation/schemas";

type Kind = "contact" | "quote" | "booking" | "newsletter";

interface HandlerOptions<T> {
  schema: ZodSchema<T>;
  kind: Kind;
  subject: (data: T) => string;
  body: (data: T) => string;
  replyTo?: (data: T) => string | undefined;
}

/**
 * One shared submission pipeline for every form.
 *
 * 1. Parse JSON safely.
 * 2. Re-validate server-side with the SAME schema the browser used — the
 *    client check is convenience, this is the boundary.
 * 3. Reject honeypot hits and failed spam tokens.
 * 4. Attempt delivery, and report exactly what happened.
 *
 * It never returns `delivered` unless a configured service confirmed it.
 */
export async function handleSubmission<T extends { company_website?: string; spamToken?: string }>(
  request: Request,
  { schema, kind, subject, body, replyTo }: HandlerOptions<T>,
): Promise<NextResponse<SubmissionOutcome>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", detail: "The request body could not be read." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { status: "invalid", fieldErrors: flattenFieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot: a filled hidden field means a bot. Respond generically.
  if (data.company_website) {
    return NextResponse.json(
      { status: "error", detail: "This submission could not be processed." },
      { status: 400 },
    );
  }

  if (!(await verifySpamToken(data.spamToken))) {
    return NextResponse.json(
      {
        status: "error",
        detail: "Spam verification failed. Reload the page and try again.",
      },
      { status: 400 },
    );
  }

  /*
   * A submission reaches OAX Tech through either of two independent channels:
   * it is recorded in the submission store (where the admin reads it), or it is
   * emailed to the team. Neither depends on the other.
   *
   * The reply must reflect whether it arrived by EITHER route. Reporting "not
   * sent" purely because email is unconfigured would be wrong once the enquiry
   * is sitting in the admin's Leads screen — and would push the visitor to
   * contact us again through a channel we already have them on.
   */
  const captured = await persistSubmission(kind, data);

  const delivery = await sendEmail({
    subject: subject(data),
    body: body(data),
    replyTo: replyTo?.(data),
  });

  if (captured.ok || delivery.ok) {
    return NextResponse.json({ status: "delivered" });
  }

  // Neither channel worked. Report the configuration gap, not a false success.
  if (captured.reason === "not_configured" || delivery.reason === "not_configured") {
    return NextResponse.json({
      status: "not_configured",
      detail:
        delivery.detail ??
        captured.detail ??
        "This site isn't configured to receive messages yet, so this wasn't sent.",
    });
  }

  return NextResponse.json(
    {
      status: "error",
      detail: delivery.detail ?? "Delivery failed. Please try again shortly.",
    },
    { status: 502 },
  );
}
