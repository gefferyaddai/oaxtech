/**
 * ============================================================================
 * INTEGRATION ADAPTERS
 * ============================================================================
 *
 * Every external service sits behind an adapter with one rule:
 *
 *   If the service is not configured, say so. Never report success.
 *
 * The site builds and runs with zero environment variables set. In that state
 * every adapter returns `{ ok: false, reason: "not_configured" }` and the UI
 * shows an honest "not connected yet" message instead of a fake confirmation.
 *
 * Server-only: none of these values are prefixed NEXT_PUBLIC_, so no key here
 * is ever sent to the browser.
 */

export type IntegrationResult =
  | { ok: true; detail?: string }
  | { ok: false; reason: "not_configured" | "failed"; detail?: string };

const NOT_CONFIGURED = (service: string): IntegrationResult => ({
  ok: false,
  reason: "not_configured",
  detail: `${service} is not configured. Set the required environment variables (see .env.example) to enable it.`,
});

/* -------------------------------------------------------------------------- */
/* Configuration probes                                                        */
/* -------------------------------------------------------------------------- */

export const integrationStatus = {
  email: () => Boolean(process.env.EMAIL_API_KEY && process.env.EMAIL_TO_ADDRESS),
  /*
   * Both halves are required. A key without an event type id cannot resolve
   * which consultation is being booked, and Cal.com's rejection for a missing
   * id reads like an auth failure — so it is treated as unconfigured here
   * rather than surfacing a misleading error at booking time.
   */
  calendar: () => Boolean(process.env.CALENDAR_API_KEY && process.env.CALENDAR_EVENT_TYPE_ID),
  storage: () => Boolean(process.env.STORAGE_BUCKET && process.env.STORAGE_ACCESS_KEY),
  database: () => Boolean(process.env.DATABASE_URL),
  payments: () => Boolean(process.env.PAYMENTS_SECRET_KEY),
  auth: () => Boolean(process.env.AUTH_SECRET),
  /*
   * Vercel Analytics is mounted unconditionally in the root layout and needs no
   * key, so this no longer asks whether a variable is set — it asks whether the
   * app is running somewhere the platform actually injects the script. Locally
   * the component is inert, and reporting "configured" there would promise
   * numbers that are never collected.
   */
  analytics: () => process.env.VERCEL === "1",
  spamProtection: () => Boolean(process.env.SPAM_PROTECTION_SECRET),
};

/* -------------------------------------------------------------------------- */
/* Email delivery                                                              */
/* -------------------------------------------------------------------------- */

export interface EmailMessage {
  subject: string;
  /** Plain-text body. Values are already validated and escaped upstream. */
  body: string;
  replyTo?: string;
}

/**
 * Sends one notification to the OAX Tech inbox via Resend.
 *
 * `from` MUST be on a domain verified in the Resend dashboard — an unverified
 * sender is the single most common reason this returns a 403 with everything
 * else correct. It falls back to Resend's shared `onboarding@resend.dev`
 * sender, which works immediately without domain verification but can only
 * deliver to the account owner's own address. That fallback is a bridge for
 * launch day, not a destination: mail from it will not reach a client.
 *
 * `replyTo` is what makes the notification useful — it carries the enquirer's
 * address, so hitting reply in the inbox answers the person rather than the
 * robot.
 */
export async function sendEmail(message: EmailMessage): Promise<IntegrationResult> {
  if (!integrationStatus.email()) return NOT_CONFIGURED("Email delivery");

  const from = process.env.EMAIL_FROM_ADDRESS || "OAX Tech <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [process.env.EMAIL_TO_ADDRESS],
        subject: message.subject,
        text: message.body,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      // A hung provider must not hold the visitor's request open indefinitely.
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      /*
       * Read the provider's own message — Resend explains exactly what is
       * wrong ("domain is not verified", "invalid api key") and that detail is
       * what turns a failed launch-day send into a two-minute fix. It is
       * surfaced to the caller, which logs it; it is never shown to a visitor.
       */
      const detail = await response.text().catch(() => "");
      return {
        ok: false,
        reason: "failed",
        detail: `Resend returned ${response.status}. ${detail}`.trim(),
      };
    }

    return { ok: true };
  } catch (error) {
    const detail =
      (error as Error)?.name === "TimeoutError"
        ? "Email provider did not respond within 10 seconds."
        : (error as Error).message;
    return { ok: false, reason: "failed", detail };
  }
}

/* -------------------------------------------------------------------------- */
/* Calendar scheduling                                                         */
/* -------------------------------------------------------------------------- */

export interface BookingRequest {
  service: string;
  /** ISO date, yyyy-mm-dd */
  date: string;
  /** 24h local time, HH:mm */
  time: string;
  timeZone: string;
  name: string;
  email: string;
}

/**
 * Turns a local date + time + zone into the UTC instant Cal.com expects.
 *
 * Doing this with `new Date("2026-09-01T09:00")` would interpret the string in
 * the SERVER's zone, not the visitor's — which on a host running UTC books
 * every Calgary morning six hours early. So the offset for that specific zone
 * on that specific date is measured (which also gets daylight saving right,
 * since the offset is resolved on the date in question rather than today) and
 * subtracted.
 */
function toUtcInstant(date: string, time: string, timeZone: string): string | null {
  const naive = new Date(`${date}T${time}:00Z`);
  if (Number.isNaN(naive.getTime())) return null;

  // What clock time does `naive` show in the target zone? The difference
  // between that and the input is the zone's offset at that moment.
  const shown = new Date(naive.toLocaleString("en-US", { timeZone }));
  const reference = new Date(naive.toLocaleString("en-US", { timeZone: "UTC" }));
  const offsetMs = shown.getTime() - reference.getTime();

  return new Date(naive.getTime() - offsetMs).toISOString();
}

/**
 * Reserves the chosen slot on the real calendar.
 *
 * Returns `ok: true` only once Cal.com confirms the booking exists — a
 * rejected slot, an expired key or a timeout all come back as a failure the
 * booking UI reports honestly, because telling someone a consultation is
 * booked when it is not is the worst outcome this flow has.
 */
export async function createCalendarBooking(request: BookingRequest): Promise<IntegrationResult> {
  const { calcomConfig, createBooking } = await import("@/lib/integrations/calcom");

  const config = calcomConfig();
  if (!config) return NOT_CONFIGURED("Calendar scheduling");

  const startIso = toUtcInstant(request.date, request.time, request.timeZone);
  if (!startIso) {
    return { ok: false, reason: "failed", detail: "That date and time could not be read." };
  }

  try {
    const { uid } = await createBooking(config, {
      startIso,
      name: request.name,
      email: request.email,
      timeZone: request.timeZone,
      notes: `Service of interest: ${request.service}`,
    });
    return { ok: true, detail: uid ? `Cal.com booking ${uid}` : undefined };
  } catch (error) {
    const detail =
      (error as Error)?.name === "TimeoutError"
        ? "The scheduling provider did not respond in time. Your slot was not reserved."
        : (error as Error).message;
    return { ok: false, reason: "failed", detail };
  }
}

/* -------------------------------------------------------------------------- */
/* File storage                                                                */
/* -------------------------------------------------------------------------- */

export interface StoredFile {
  /** Private object key. Never rendered to the browser. */
  key: string;
}

export async function storeUpload(
  file: { name: string; size: number; type: string },
): Promise<IntegrationResult & { file?: StoredFile }> {
  if (!integrationStatus.storage()) return NOT_CONFIGURED("File storage");
  void file;
  // Uploads must land in a PRIVATE bucket. Never return a public URL.
  return {
    ok: false,
    reason: "not_configured",
    detail: "Storage credentials are present but no storage client is wired up yet.",
  };
}

/* -------------------------------------------------------------------------- */
/* Spam protection                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Integration point for Turnstile / hCaptcha / reCAPTCHA.
 *
 * No provider is wired up yet. Until one is, this FAILS OPEN: it returns
 * `true` and logs, rather than rejecting the submission.
 *
 * That direction is deliberate. `src/lib/api-handler.ts` gates contact, quote,
 * booking and newsletter on this one function, so failing closed here takes
 * every form on the site down the moment SPAM_PROTECTION_SECRET is set — which
 * is precisely when someone believes they have just made things safer, and the
 * failure is invisible from the inside. A spam message that gets through costs
 * one deletion; a rejected enquiry costs a client and never shows up in a log
 * anyone is reading.
 *
 * The honeypot in `api-handler.ts` still runs regardless, so this is not the
 * only defence.
 *
 * To implement: POST `token` to the provider's siteverify endpoint, return its
 * verdict, and delete the fail-open branch below.
 */
export async function verifySpamToken(token: string | undefined): Promise<boolean> {
  if (!integrationStatus.spamProtection()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[spam-protection] Not configured — skipping verification.");
    }
    return true;
  }

  void token;
  console.error(
    "[spam-protection] SPAM_PROTECTION_SECRET is set, but no provider is wired up. " +
      "Submissions are passing UNVERIFIED. Implement verifySpamToken() or unset " +
      "the variable.",
  );
  return true;
}

/* -------------------------------------------------------------------------- */
/* Database / persistence                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Routes a validated submission into the submission store.
 *
 * The mapping from form payload to domain record lives in
 * `src/lib/domain/submissions.ts`; where it is written is decided by
 * `src/lib/domain/store.ts`. This function only connects the two.
 *
 * The import is dynamic because this module is also reached from contexts that
 * must not pull in `node:fs` — keeping it lazy means the store is only loaded
 * when a submission is actually being persisted.
 */
export async function persistSubmission(
  kind: "contact" | "quote" | "booking" | "newsletter",
  payload: unknown,
): Promise<IntegrationResult> {
  const [{ getStore }, mappers] = await Promise.all([
    import("@/lib/domain/store"),
    import("@/lib/domain/submissions"),
  ]);
  const store = getStore();

  try {
    switch (kind) {
      case "quote": {
        const lead = mappers.quoteToLead(payload as Parameters<typeof mappers.quoteToLead>[0]);
        return toIntegrationResult(await store.addLead(lead));
      }
      case "contact": {
        const lead = mappers.contactToLead(payload as Parameters<typeof mappers.contactToLead>[0]);
        return toIntegrationResult(await store.addLead(lead));
      }
      case "booking": {
        const { lead, consultation } = mappers.bookingToRecords(
          payload as Parameters<typeof mappers.bookingToRecords>[0],
        );
        return toIntegrationResult(await store.addConsultation(consultation, lead));
      }
      case "newsletter": {
        const subscriber = mappers.newsletterToSubscriber(
          payload as Parameters<typeof mappers.newsletterToSubscriber>[0],
        );
        return toIntegrationResult(await store.addSubscriber(subscriber));
      }
    }
  } catch (error) {
    return { ok: false, reason: "failed", detail: (error as Error).message };
  }
}

function toIntegrationResult(result: {
  ok: boolean;
  reason?: "not_configured" | "failed";
  detail?: string;
}): IntegrationResult {
  if (result.ok) return { ok: true };
  return {
    ok: false,
    reason: result.reason ?? "failed",
    detail: result.detail,
  };
}

/* -------------------------------------------------------------------------- */
/* Payments                                                                    */
/* -------------------------------------------------------------------------- */

export function paymentsEnabled(): boolean {
  return integrationStatus.payments();
}

/* -------------------------------------------------------------------------- */
/* Shared submission outcome                                                   */
/* -------------------------------------------------------------------------- */

export type SubmissionOutcome =
  /** Everything a configured service needed to do was done. */
  | { status: "delivered" }
  /**
   * The submission reached OAX Tech and is recorded, but a service that would
   * normally complete the job is not connected — so something the visitor
   * might reasonably assume happened, did NOT. A booking is the clearest case:
   * we have the request, but no calendar reserved the slot.
   *
   * This is a success for the visitor (we have their enquiry) that still has to
   * state plainly what has not happened.
   */
  | { status: "received"; detail: string }
  /** Input was valid, but no delivery service is configured yet. */
  | { status: "not_configured"; detail: string }
  /** Something genuinely went wrong. */
  | { status: "error"; detail: string }
  /** Field-level validation failed. */
  | { status: "invalid"; fieldErrors: Record<string, string[]> };
