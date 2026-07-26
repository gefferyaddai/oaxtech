import { NextResponse } from "next/server";
import { createCalendarBooking, integrationStatus } from "@/lib/integrations";
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

  if (!integrationStatus.calendar()) {
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

  return NextResponse.json({
    status: result.reason === "not_configured" ? "not_configured" : "error",
    detail: result.detail ?? "The booking could not be created.",
  });
}
