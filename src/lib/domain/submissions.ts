/**
 * ============================================================================
 * WEBSITE SUBMISSIONS → DOMAIN RECORDS
 * ============================================================================
 *
 * Pure mapping functions. Given a validated payload from one of the four public
 * forms, produce the record(s) the admin and portal read.
 *
 *   Request a Quote  → Lead
 *   Contact          → Lead
 *   Book a call      → Consultation + Lead   (linked by `leadId`)
 *   Newsletter       → Subscriber
 *
 * RULE: only map fields the form actually collects. Where a field cannot be
 * known from the submission it is null — never inferred, never invented. In
 * particular:
 *
 *   - `source` is null. No form asks how the person found us and no analytics
 *     provider is connected, so any value here would be a guess.
 *   - `assigneeId` is null. Nobody has picked the enquiry up yet.
 *   - `meetingUrl` is null. No calendar provider means no meeting to join.
 *
 * These functions are deliberately side-effect free so they can be unit-tested
 * and reused by an importer, a webhook or a backfill without dragging in a
 * database connection.
 */

import type {
  BookingInput,
  ContactInput,
  NewsletterInput,
  QuoteInput,
} from "@/lib/validation/schemas";
import type { Consultation, FollowUpStatus, Lead, Subscriber } from "@/lib/domain/types";

/**
 * Follow-up state a brand-new enquiry starts in.
 *
 * This is a business policy, not a fact about the submission: a new enquiry is
 * treated as needing contact the same day. Change it here rather than in the
 * individual mappers.
 */
const NEW_LEAD_FOLLOW_UP: FollowUpStatus = "Due today";

/** Stable, collision-free ids without pulling in a dependency. */
function id(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

/** Empty strings from optional form fields become null, not "". */
function orNull(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/* -------------------------------------------------------------------------- */
/* Quote → Lead                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The richest source of lead detail: service, package, budget, timeline and
 * selected features all come through the quote form.
 */
export function quoteToLead(input: QuoteInput, now = new Date()): Lead {
  const details = [
    input.description,
    input.pages ? `Pages: ${input.pages}` : null,
    input.features.length ? `Features: ${input.features.join(", ")}` : null,
    input.completionDate ? `Target completion: ${input.completionDate}` : null,
    input.currentWebsite ? `Current site: ${input.currentWebsite}` : null,
    `Package: ${input.packageChoice}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    id: id("ld"),
    name: input.name,
    company: orNull(input.company),
    email: input.email,
    phone: orNull(input.phone),
    service: input.service,
    budget: input.budget,
    stage: "New",
    source: null,
    origin: "quote",
    assigneeId: null,
    submittedAt: now.toISOString(),
    followUp: NEW_LEAD_FOLLOW_UP,
    notes: details,
  };
}

/* -------------------------------------------------------------------------- */
/* Contact → Lead                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Every contact subject is enquiry-shaped — the list has no support option,
 * because support requests come through the client portal instead. So all
 * contact submissions become leads, with the chosen subject as the service.
 */
export function contactToLead(input: ContactInput, now = new Date()): Lead {
  return {
    id: id("ld"),
    name: input.name,
    company: null,
    email: input.email,
    phone: orNull(input.phone),
    service: input.subject,
    // The contact form has no budget field. Null, not "unknown".
    budget: null,
    stage: "New",
    source: null,
    origin: "contact",
    assigneeId: null,
    submittedAt: now.toISOString(),
    followUp: NEW_LEAD_FOLLOW_UP,
    notes: input.message,
  };
}

/* -------------------------------------------------------------------------- */
/* Booking → Consultation + Lead                                               */
/* -------------------------------------------------------------------------- */

export interface BookingRecords {
  lead: Lead;
  consultation: Consultation;
}

/**
 * A booking produces two linked records: the person is a lead, and the call
 * they booked is a consultation. The lead enters the pipeline at the
 * "Consultation" stage because they have already gone further than an enquiry.
 *
 * `status` is "Pending", not "Confirmed": with no calendar provider connected
 * nothing has actually reserved that slot, so claiming it is confirmed would be
 * a lie the client could act on.
 */
export function bookingToRecords(input: BookingInput, now = new Date()): BookingRecords {
  const leadId = id("ld");

  const details = [
    input.description,
    input.currentWebsite ? `Current site: ${input.currentWebsite}` : null,
    `Requested slot: ${input.date} ${input.time} (${input.timeZone})`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    lead: {
      id: leadId,
      name: input.name,
      company: orNull(input.companyName),
      email: input.email,
      phone: input.phone,
      service: input.service,
      budget: orNull(input.budget),
      stage: "Consultation",
      source: null,
      origin: "booking",
      assigneeId: null,
      submittedAt: now.toISOString(),
      followUp: "Scheduled",
      notes: details,
    },
    consultation: {
      id: id("cs"),
      contactName: input.name,
      company: orNull(input.companyName),
      service: input.service,
      date: input.date,
      time: input.time,
      timeZone: input.timeZone,
      status: "Pending",
      meetingUrl: null,
      leadId,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Newsletter → Subscriber                                                     */
/* -------------------------------------------------------------------------- */

/**
 * `confirmed` is false: there is no double opt-in flow, so consent has not been
 * verified. Marking these confirmed would misrepresent consent, which matters
 * for CASL and GDPR compliance.
 */
export function newsletterToSubscriber(input: NewsletterInput, now = new Date()): Subscriber {
  return {
    id: id("sb"),
    email: input.email,
    subscribedAt: now.toISOString(),
    confirmed: false,
  };
}
