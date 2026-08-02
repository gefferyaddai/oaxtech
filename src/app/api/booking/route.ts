import { NextResponse } from "next/server";
import { createCalendarBooking, integrationStatus, persistSubmission } from "@/lib/integrations";
import { bookingSchema, flattenFieldErrors } from "@/lib/validation/schemas";

/**
 * Booking requires BOTH a calendar and email to be configured before it can
 * report success. With neither connected it returns `not_configured`, and the
 * UI tells the visitor plainly that nothing has been reserved.
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

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { status: "invalid", fieldErrors: flattenFieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const data = parsed.data;
  if (data.company_website) {
    return NextResponse.json(
      { status: "error", detail: "This submission could not be processed." },
      { status: 400 },
    );
  }

  /*
   * Capture FIRST, before any integration check.
   *
   * Previously this route returned early when no calendar was configured, which
   * meant the request was validated and then thrown away — the visitor's
   * details never reached anyone. Recording the lead and consultation is
   * independent of whether a calendar can reserve the slot, so it happens
   * regardless.
   */
  const captured = await persistSubmission("booking", data);

  if (!integrationStatus.calendar()) {
    // We have the request; nothing has reserved the time.
    if (captured.ok) {
      return NextResponse.json({
        status: "received",
        detail:
          "We've received your request and the team will be in touch to confirm. Note that no time slot has been reserved automatically — calendar scheduling isn't connected yet, so we'll confirm the exact time with you by email.",
      });
    }
    return NextResponse.json({
      status: "not_configured",
      detail:
        "Calendar scheduling isn't connected yet, so this time slot has NOT been reserved and no confirmation email has been sent.",
    });
  }

  const result = await createCalendarBooking({
    service: data.service,
    date: data.date,
    time: data.time,
    timeZone: data.timeZone,
    name: data.name,
    email: data.email,
  });

  if (result.ok) return NextResponse.json({ status: "delivered" });

  // The calendar is configured but failed. The request is still recorded.
  if (captured.ok) {
    return NextResponse.json({
      status: "received",
      detail:
        "We've received your request, but the booking could not be added to our calendar automatically. The team will confirm your time by email.",
    });
  }

  return NextResponse.json({
    status: result.reason === "not_configured" ? "not_configured" : "error",
    detail: result.detail ?? "The booking could not be created.",
  });
}
