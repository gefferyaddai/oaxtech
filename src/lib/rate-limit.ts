/**
 * ============================================================================
 * GENERAL-PURPOSE REQUEST THROTTLE
 * ============================================================================
 *
 * The public form endpoints — contact, quote, booking, newsletter — are
 * unauthenticated POST handlers that write rows to the production database.
 * Without a limit, one script can fill the leads table faster than anyone can
 * clear it, and every one of those rows looks exactly like a real enquiry.
 *
 * A honeypot field catches the naive case, and it is worth keeping, but it is
 * a single check that any targeted bot clears on the second attempt. This is
 * the backstop.
 *
 * WHY THE DATABASE AND NOT MEMORY
 * The same reason the sign-in limiter gives: serverless instances do not share
 * memory. An in-process counter resets on every cold start, and under exactly
 * the traffic that would trigger it — many requests, many instances — it
 * limits almost nothing.
 *
 * It reuses the `sign_in_attempts` table rather than adding one. The table is
 * a generic `(key, attempted_at)` log; the key namespace is what separates a
 * sign-in from a form post. That means no migration, which matters when this
 * is going out the same day.
 *
 * FAILS OPEN. If the database is unreachable this returns "not limited" and
 * the request proceeds. An outage must not silently swallow real enquiries,
 * and the submission itself will fail loudly on its own if the database is
 * genuinely down.
 *
 * SERVER-ONLY.
 */

import { and, gte, sql } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { signInAttempts } from "@/lib/db/schema";

export interface RateLimitRule {
  /** Requests allowed within the window before further ones are refused. */
  limit: number;
  /** Rolling window, in minutes. */
  windowMinutes: number;
}

/**
 * Applied per IP across ALL public forms, not per form.
 *
 * Six in ten minutes is far more than any person filling in a contact form
 * will ever need — the generous direction is the right one to err in, because
 * the cost of refusing a real enquiry is much higher than the cost of letting
 * a bot through to the honeypot. Counting across forms rather than per form
 * stops the obvious evasion of rotating between the four endpoints.
 */
export const PUBLIC_FORM_LIMIT: RateLimitRule = { limit: 6, windowMinutes: 10 };

function windowStart(minutes: number): Date {
  return new Date(Date.now() - minutes * 60_000);
}

/**
 * The client's IP, as reported by the proxy in front of the app.
 *
 * `x-forwarded-for` accumulates a comma-separated chain and the ORIGINAL
 * client is the first entry. Trusting the first entry is only safe because a
 * managed proxy (Vercel, and every host in .env.example's class) overwrites
 * the header rather than appending to what the client sent — behind a proxy
 * that appends, or none at all, this value is attacker-controlled and the
 * limit becomes trivially evadable by spoofing the header.
 *
 * Returns null when no proxy header is present, which is the normal case in
 * local development. Callers skip limiting rather than collapsing every
 * request onto one shared bucket.
 */
export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || null;
}

/** True when this key has already used its allowance and must be refused. */
export async function isOverLimit(key: string, rule: RateLimitRule): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(signInAttempts)
      .where(
        and(
          sql`${signInAttempts.key} = ${key}`,
          gte(signInAttempts.attemptedAt, windowStart(rule.windowMinutes)),
        ),
      );
    return (row?.count ?? 0) >= rule.limit;
  } catch {
    return false;
  }
}

/** Records one use against a key. */
export async function recordHit(key: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.insert(signInAttempts).values({
      id: crypto.randomUUID(),
      key,
      attemptedAt: new Date(),
    });
  } catch {
    // Bookkeeping must never block the request it is counting.
  }
}

/**
 * Drops rows older than the window for this key.
 *
 * Called opportunistically, and only on the roughly one-in-twenty request that
 * draws it, so the table cannot grow without bound while the common path stays
 * a single insert. A scheduled job would be better once one exists.
 */
export async function pruneOccasionally(key: string, rule: RateLimitRule): Promise<void> {
  if (Math.random() > 0.05) return;
  const db = getDb();
  if (!db) return;
  try {
    await db
      .delete(signInAttempts)
      .where(
        and(
          sql`${signInAttempts.key} = ${key}`,
          sql`${signInAttempts.attemptedAt} < ${windowStart(rule.windowMinutes)}`,
        ),
      );
  } catch {
    /* ignore */
  }
}
