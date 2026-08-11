/**
 * Password hashing.
 *
 * argon2id with the library defaults, which follow the OWASP recommendation
 * (m=19456 KiB, t=2, p=1). Do not lower these to speed up sign-in — the cost is
 * the entire point.
 *
 * SERVER-ONLY. A hash must never be sent to the browser, logged, or included
 * in an error message.
 */

import { hash, verify } from "@node-rs/argon2";

/**
 * A dummy hash of a random value, used to spend the same CPU time when an
 * account does not exist as when it does.
 *
 * Without this, "no such user" returns in microseconds while a real user costs
 * ~50ms, and the difference tells an attacker which email addresses are
 * registered. Comparing against this keeps the timing indistinguishable.
 */
const DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHR2YWx1ZQ$JhKQ0Z8kM1kZ0YQ9m0YvXqXpJ0Q0vX0Z0Y0Q0vX0Z0Y";

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain);
}

/**
 * Verifies a password. Pass `null` for `storedHash` when the account does not
 * exist — the comparison still runs, so the response time does not leak whether
 * the email is registered.
 */
export async function verifyPassword(
  storedHash: string | null,
  plain: string,
): Promise<boolean> {
  if (!storedHash) {
    // Burn equivalent time, then fail regardless of the outcome.
    await verify(DUMMY_HASH, plain).catch(() => false);
    return false;
  }
  try {
    return await verify(storedHash, plain);
  } catch {
    // A malformed stored hash is a failure to authenticate, not a crash.
    return false;
  }
}

/**
 * Minimum viable policy: length over composition rules.
 *
 * NIST SP 800-63B advises against forced character-class mixes — they push
 * people toward predictable substitutions — and recommends length plus a
 * check against known-breached passwords. The breach check belongs in Phase 5
 * once an outbound HTTP allowance exists.
 */
export const PASSWORD_MIN_LENGTH = 12;

export function passwordProblem(plain: string): string | null {
  if (plain.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (plain.length > 200) {
    // Bounded so a huge input cannot be used to exhaust CPU through argon2.
    return "Password must be 200 characters or fewer.";
  }
  return null;
}
