/**
 * ============================================================================
 * CAL.COM SCHEDULING CLIENT
 * ============================================================================
 *
 * Two calls, which is all the booking flow needs:
 *
 *   fetchMonthSlots()  what is actually free in a given month
 *   createBooking()    reserve one of those slots
 *
 * WHY CAL.COM AND NOT GOOGLE CALENDAR DIRECTLY
 * Google's API needs an OAuth consent screen, a service account with
 * domain-wide delegation, and a verification review before it can write to a
 * real person's calendar. Cal.com sits on top of that, already solved, behind
 * one API key — and it owns the parts this flow would otherwise have to build:
 * working hours, buffers, minimum notice, double-booking prevention, and the
 * confirmation email to both sides.
 *
 * VERSION PINNING
 * Cal.com's v2 API is versioned by a request header, and the two endpoints are
 * on DIFFERENT dates. That is not a mistake below — each endpoint's contract
 * froze when it did, and sending one date to both returns a shape that does
 * not match what is parsed here.
 *
 * SERVER-ONLY. The API key is not NEXT_PUBLIC_ and must never reach a browser.
 */

const API_BASE = "https://api.cal.com/v2";

/** Endpoint-specific API versions. See VERSION PINNING above. */
const SLOTS_API_VERSION = "2024-09-04";
const BOOKINGS_API_VERSION = "2024-08-13";

/** Outbound calls are capped so a slow provider cannot hold a request open. */
const TIMEOUT_MS = 10_000;

export interface CalcomConfig {
  apiKey: string;
  eventTypeId: number;
}

/**
 * Reads and validates the Cal.com environment.
 *
 * Returns null when either value is missing OR when the event type id is not
 * numeric — Cal.com's API rejects a non-numeric id with a 400 that reads like
 * an auth problem, so it is caught here where the message can be specific.
 */
export function calcomConfig(): CalcomConfig | null {
  const apiKey = process.env.CALENDAR_API_KEY;
  const rawId = process.env.CALENDAR_EVENT_TYPE_ID;
  if (!apiKey || !rawId) return null;

  const eventTypeId = Number(rawId);
  if (!Number.isInteger(eventTypeId) || eventTypeId <= 0) return null;

  return { apiKey, eventTypeId };
}

function headers(config: CalcomConfig, version: string): HeadersInit {
  return {
    Authorization: `Bearer ${config.apiKey}`,
    "cal-api-version": version,
    "Content-Type": "application/json",
  };
}

/* -------------------------------------------------------------------------- */
/* Availability                                                                */
/* -------------------------------------------------------------------------- */

/** yyyy-mm-dd in a specific IANA zone, which is the key the booking UI uses. */
function dateKeyIn(instant: Date, timeZone: string): string {
  // en-CA formats as yyyy-mm-dd, which is exactly the key format.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** 24-hour HH:mm in a specific IANA zone. */
function timeIn(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(instant);
}

export interface MonthSlots {
  /** Keyed yyyy-mm-dd, each value a sorted list of local "HH:mm" times. */
  byDate: Record<string, string[]>;
}

/**
 * Free slots for one calendar month, expressed in the visitor's own time zone.
 *
 * Cal.com returns UTC instants. Grouping them by UTC date would put an early
 * morning Calgary slot on the previous day for anyone west of UTC, so both the
 * date key AND the time are re-derived in `timeZone` rather than taken from
 * the raw string.
 *
 * The queried range is padded by a day on each end for the same reason: a slot
 * that is the 1st locally can be the last day of the previous month in UTC.
 *
 * Throws on transport or API failure — the caller decides whether to fall back
 * to sample data or surface the error.
 */
export async function fetchMonthSlots(
  config: CalcomConfig,
  year: number,
  monthIndex: number,
  timeZone: string,
): Promise<MonthSlots> {
  const start = new Date(Date.UTC(year, monthIndex, 1));
  start.setUTCDate(start.getUTCDate() - 1);
  const end = new Date(Date.UTC(year, monthIndex + 1, 0));
  end.setUTCDate(end.getUTCDate() + 1);

  const query = new URLSearchParams({
    eventTypeId: String(config.eventTypeId),
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    timeZone,
  });

  const response = await fetch(`${API_BASE}/slots?${query}`, {
    headers: headers(config, SLOTS_API_VERSION),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    // Availability changes constantly; a cached answer would offer taken slots.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Cal.com slots returned ${response.status}. ${(await response.text().catch(() => "")).slice(0, 300)}`.trim(),
    );
  }

  const payload = (await response.json()) as {
    data?: Record<string, Array<{ start?: string }>>;
  };

  const byDate: Record<string, string[]> = {};

  for (const entries of Object.values(payload.data ?? {})) {
    for (const entry of entries) {
      if (!entry.start) continue;
      const instant = new Date(entry.start);
      if (Number.isNaN(instant.getTime())) continue;

      const key = dateKeyIn(instant, timeZone);
      const time = timeIn(instant, timeZone);
      (byDate[key] ??= []).push(time);
    }
  }

  // Sort and de-duplicate: two Cal.com hosts free at the same moment produce
  // two entries for one bookable time, and the UI must show it once.
  for (const key of Object.keys(byDate)) {
    byDate[key] = [...new Set(byDate[key])].sort();
  }

  return { byDate };
}

/* -------------------------------------------------------------------------- */
/* Booking                                                                     */
/* -------------------------------------------------------------------------- */

export interface CreateBookingInput {
  /** The chosen instant, as a UTC ISO string. */
  startIso: string;
  name: string;
  email: string;
  timeZone: string;
  /** Free-text context shown to whoever takes the call. */
  notes?: string;
}

export interface BookingCreated {
  /** Cal.com's booking reference, worth recording against the lead. */
  uid: string;
}

/**
 * Reserves a slot.
 *
 * Cal.com is the authority on whether the time is still free — it re-checks on
 * write, so two visitors racing for the last slot produce one booking and one
 * clean rejection rather than a double-book. A 4xx here usually means exactly
 * that, and the message is worth showing to the visitor.
 *
 * Throws on failure. The caller maps that to an IntegrationResult.
 */
export async function createBooking(
  config: CalcomConfig,
  input: CreateBookingInput,
): Promise<BookingCreated> {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: headers(config, BOOKINGS_API_VERSION),
    body: JSON.stringify({
      start: input.startIso,
      eventTypeId: config.eventTypeId,
      attendee: {
        name: input.name,
        email: input.email,
        timeZone: input.timeZone,
        language: "en",
      },
      ...(input.notes ? { metadata: { notes: input.notes.slice(0, 500) } } : {}),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const body = (await response.json().catch(() => null)) as {
    status?: string;
    data?: { uid?: string };
    error?: { message?: string };
  } | null;

  if (!response.ok || body?.status === "error") {
    const message =
      body?.error?.message ?? `Cal.com booking returned ${response.status}.`;
    throw new Error(message);
  }

  return { uid: body?.data?.uid ?? "" };
}
