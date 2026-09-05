import { NextResponse } from "next/server";
import { createCalendarBooking, integrationStatus, persistSubmission, sendEmail } from "@/lib/integrations";
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

  /*
   * Email, which this route previously did not send AT ALL.
   *
   * Contact and quote both go through `api-handler`, which notifies the team.
   * Booking has its own route and skipped that entirely, so the highest-intent
   * submission on the site was the only one nobody was told about.
   *
   * Two messages, and they are deliberately different:
   *
   *   - the TEAM gets the enquiry with reply-to set to the person, so hitting
   *     reply answers them rather than the robot;
   *   - the PERSON gets an acknowledgement, because a booking form that says
   *     nothing afterwards reads as broken and the next thing they do is book
   *     with somebody else.
   *
   * Neither send is awaited before the reply is built, and neither can fail the
   * request: the booking is already recorded, and a mail provider having a bad
   * minute must not turn a captured consultation into an error the visitor sees.
   */
  const slotReserved = integrationStatus.calendar();
  const when = `${data.date} at ${data.time} (${data.timeZone})`;

  const teamNotice = sendEmail({
    subject: `Consultation request — ${data.name}`,
    replyTo: data.email,
    body: [
      `${data.name} requested a consultation.`,
      ``,
      `Service:   ${data.service}`,
      `Requested: ${when}`,
      `Email:     ${data.email}`,
      `Phone:     ${data.phone ?? "not provided"}`,
      data.companyName ? `Company:   ${data.companyName}` : null,
      data.budget ? `Budget:    ${data.budget}` : null,
      ``,
      data.description ? `Notes:\n${data.description}` : null,
      ``,
      slotReserved
        ? `This slot was reserved on the calendar.`
        : `NO slot has been reserved — calendar scheduling is not connected. Confirm the time with them directly.`,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });

  /*
   * The confirmation must not overstate what happened. With no calendar
   * connected the time is a REQUEST, not a booking, and telling someone their
   * slot is confirmed when nothing holds it is the one failure here that costs
   * a client rather than an email.
   */
  const confirmation = sendEmail({
    to: data.email,
    subject: slotReserved
      ? `Your consultation is booked — ${when}`
      : `We received your consultation request`,
    body: [
      `Hi ${data.name},`,
      ``,
      slotReserved
        ? `Your ${data.service} consultation is booked for ${when}. It is free and runs about 30 minutes.`
        : `Thanks for asking for a ${data.service} consultation. You asked for ${when}, and we will confirm the exact time by email shortly — nothing is held in the calendar yet.`,
      ``,
      `If you need to change anything, just reply to this message.`,
      ``,
      `— OAX Tech`,
      `Calgary, Alberta`,
    ].join("\n"),
  });

  /*
   * Non-blocking, but NOT silent.
   *
   * These sends must not hold up or fail the response — the booking is already
   * recorded. But discarding the result made a failing send indistinguishable
   * from a working one: `sendEmail` returns the provider's own message
   * ("domain is not verified", "invalid api key"), which is the single most
   * useful string in the whole pipeline, and it was going straight in the bin.
   *
   * Logged with a stable prefix so it can be grepped in the platform's function
   * logs, and it names WHICH of the two failed — the team notice and the
   * customer confirmation fail for different reasons: the confirmation goes to
   * an outside address, so it is the one that breaks when the sending domain is
   * unverified, while the notice to our own inbox may still arrive.
   */
  void Promise.allSettled([teamNotice, confirmation]).then(([team, customer]) => {
    for (const [label, outcome] of [
      ["team-notice", team],
      ["customer-confirmation", customer],
    ] as const) {
      if (outcome.status === "rejected") {
        console.error(`[booking-email] ${label} threw:`, outcome.reason);
      } else if (!outcome.value.ok) {
        console.error(
          `[booking-email] ${label} not sent — ${outcome.value.reason}:`,
          outcome.value.detail ?? "(no detail returned)",
        );
      } else {
        console.log(`[booking-email] ${label} sent`);
      }
    }
  });

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
