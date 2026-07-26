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

  if (!integrationStatus.email() && !integrationStatus.database()) {
    return NextResponse.json({
      status: "not_configured",
      detail:
        "The newsletter isn't connected to a mailing list yet, so this address has NOT been subscribed.",
    });
  }

  const stored = await persistSubmission("newsletter", parsed.data);
  if (stored.ok) return NextResponse.json({ status: "delivered" });

  return NextResponse.json({
    status: "not_configured",
    detail: stored.detail ?? "The newsletter list isn't connected yet.",
  });
}
