/**
 * Sign-in rate limiting.
 *
 * Credentials authentication is an unauthenticated public endpoint that checks
 * a secret, which makes it a brute-force target. Without a limit, an attacker
 * can try passwords as fast as the server will hash them.
 *
 * Limited on two keys independently:
 *   - the email, so one account cannot be hammered from many addresses
 *   - the client IP, so one source cannot spray many accounts
 *
 * Backed by the database rather than memory because serverless instances do not
 * share memory — an in-process counter resets on every cold start and would
 * limit almost nothing.
 *
 * SERVER-ONLY.
 */

import { and, gte, sql } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { signInAttempts } from "@/lib/db/schema";

/** Failures allowed per key within the window before sign-in is refused. */
export const MAX_ATTEMPTS = 8;

/** Rolling window, in minutes. */
export const WINDOW_MINUTES = 15;

function windowStart(): Date {
  return new Date(Date.now() - WINDOW_MINUTES * 60_000);
}

/**
 * True when this key has exceeded the limit and must be refused.
 * Fails OPEN if the database is unreachable — an outage should not lock every
 * user out, and the password check still has to pass regardless.
 */
export async function isRateLimited(key: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(signInAttempts)
      .where(and(sql`${signInAttempts.key} = ${key}`, gte(signInAttempts.attemptedAt, windowStart())));
    return (row?.count ?? 0) >= MAX_ATTEMPTS;
  } catch {
    return false;
  }
}

/** Records one failed attempt. Successes are not recorded. */
export async function recordFailure(key: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.insert(signInAttempts).values({
      id: crypto.randomUUID(),
      key,
      attemptedAt: new Date(),
    });
  } catch {
    // Never let bookkeeping failure block the auth decision.
  }
}

/** Clears a key's failures after a successful sign-in. */
export async function clearFailures(key: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.delete(signInAttempts).where(sql`${signInAttempts.key} = ${key}`);
  } catch {
    /* ignore */
  }
}

/**
 * Deletes attempts older than the window. Called opportunistically on sign-in
 * so the table cannot grow without bound; a scheduled job would be better once
 * one exists.
 */
export async function pruneOldAttempts(): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.delete(signInAttempts).where(sql`${signInAttempts.attemptedAt} < ${windowStart()}`);
  } catch {
    /* ignore */
  }
}
