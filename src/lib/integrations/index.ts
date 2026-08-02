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
  calendar: () => Boolean(process.env.CALENDAR_API_KEY),
  storage: () => Boolean(process.env.STORAGE_BUCKET && process.env.STORAGE_ACCESS_KEY),
  database: () => Boolean(process.env.DATABASE_URL),
  payments: () => Boolean(process.env.PAYMENTS_SECRET_KEY),
  auth: () => Boolean(process.env.AUTH_SECRET && process.env.AUTH_PROVIDER_URL),
  analytics: () => Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ID),
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

export async function sendEmail(message: EmailMessage): Promise<IntegrationResult> {
  if (!integrationStatus.email()) return NOT_CONFIGURED("Email delivery");

  // ---------------------------------------------------------------------
  // Wire the real provider here (Resend, Postmark, SES, SendGrid...).
  // Keep the shape: return { ok: true } only after the provider confirms.
  // ---------------------------------------------------------------------
  try {
    // const res = await fetch("https://api.provider.com/send", { ... });
    // if (!res.ok) return { ok: false, reason: "failed", detail: await res.text() };
    void message;
    return {
      ok: false,
      reason: "not_configured",
      detail: "Email credentials are present but no provider client is wired up yet.",
    };
  } catch (error) {
    return { ok: false, reason: "failed", detail: (error as Error).message };
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

export async function createCalendarBooking(request: BookingRequest): Promise<IntegrationResult> {
  if (!integrationStatus.calendar()) return NOT_CONFIGURED("Calendar scheduling");
  void request;
  return {
    ok: false,
    reason: "not_configured",
    detail: "Calendar credentials are present but no scheduling client is wired up yet.",
  };
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
 * With no provider configured this returns `true` so local development works,
 * but it logs loudly so the gap is visible before launch.
 */
export async function verifySpamToken(token: string | undefined): Promise<boolean> {
  if (!integrationStatus.spamProtection()) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[spam-protection] Not configured — skipping verification.");
    }
    return true;
  }
  if (!token) return false;
  // const res = await fetch(VERIFY_URL, { method: "POST", body: ... });
  return false;
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
