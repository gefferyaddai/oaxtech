import { NextResponse } from "next/server";
import { integrationStatus, persistSubmission } from "@/lib/integrations";
import { flattenFieldErrors, newsletterSchema } from "@/lib/validation/schemas";

/**
 * Validates the address, but only claims a subscription when a real list
 * backend exists. Otherwise it says so.
 */
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", detail: "The request body could not be read." },
      { status: 400 },
    );
  }

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { status: "invalid", fieldErrors: flattenFieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  if (parsed.data.company_website) {
    return NextResponse.json(
      { status: "error", detail: "This submission could not be processed." },
      { status: 400 },
    );
  }

  /*
   * Record the address first. This used to return early when no mailing list
   * was configured, discarding the sign-up entirely.
   */
  const stored = await persistSubmission("newsletter", parsed.data);

  // A configured mailing list is what makes someone genuinely subscribed.
  if (stored.ok && integrationStatus.email()) {
    return NextResponse.json({ status: "delivered" });
  }

  if (stored.ok) {
    return NextResponse.json({
      status: "received",
      detail:
        "We've recorded your address. No mailing list is connected yet, so you are not subscribed and will not receive anything until it is — we'll confirm before sending you the first issue.",
    });
  }

  return NextResponse.json({
    status: "not_configured",
    detail: stored.detail ?? "The newsletter isn't connected to a mailing list yet.",
  });
}
