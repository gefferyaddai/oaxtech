/**
 * ============================================================================
 * CREATE OR UPDATE ONE STAFF ACCOUNT
 * ============================================================================
 *
 * The production counterpart to `seed-users.ts`, which deliberately refuses to
 * run in production and creates demonstration client accounts alongside the
 * staff one. Pointing that script at a real database is the wrong tool: it
 * would try to attach client logins to fixture clients (`cl-1`, `cl-2`) that a
 * real database has no rows for, fail on the foreign key, and leave the job
 * half done.
 *
 * This script does exactly one thing — put a single real person in `users`
 * with an `admin_role` — and nothing else. That is the whole bootstrap: staff
 * access is the presence of `admin_role`, so this account can then sign in at
 * /admin/login and read the enquiries the site is capturing.
 *
 * USAGE
 *
 *   npm run admin:create
 *
 * It asks for anything it needs. That is the whole interface, and it is
 * deliberate: the env-variable form below is long enough to wrap in a terminal,
 * and a wrapped paste silently becomes two commands — the first half turning
 * into shell assignments that are never exported, so the script runs with none
 * of them. It reports a missing variable that was, from the operator's point
 * of view, right there on screen. Prompting removes that failure entirely.
 *
 * It also keeps the password out of shell history and off the screen, which
 * the env-variable form cannot do.
 *
 * NON-INTERACTIVE — for CI, or a one-shot against production. Any value
 * supplied this way is not prompted for. An environment variable set on the
 * command line always beats `.env.local`, so pointing at another database
 * stays explicit:
 *
 *   DATABASE_URL="postgres://..." ADMIN_EMAIL="..." ADMIN_NAME="..." ADMIN_PASSWORD="..." npm run admin:create
 *
 * ADMIN_ROLE is optional and defaults to "Super Admin".
 *
 * Re-running with the same email UPDATES that account's password, name and
 * role rather than creating a duplicate, which also makes this the password
 * reset: there is no self-serve reset flow yet.
 *
 * The password is read from the environment and never printed, logged or
 * defaulted. Nothing here writes it anywhere except as an Argon2id hash.
 */

// Must come first: populates process.env before anything reads it.
import "./load-env";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { hashPassword, passwordProblem } from "@/lib/auth/password";
import { closeDb, getDb } from "@/lib/db/client";
import { ADMIN_ROLES, type AdminRole } from "@/lib/domain/types";
import * as t from "@/lib/db/schema";

/* -------------------------------------------------------------------------- */
/* Prompts                                                                     */
/* -------------------------------------------------------------------------- */

/** Reads one visible line. */
async function ask(question: string): Promise<string> {
  const { createInterface } = await import("node:readline/promises");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

/**
 * Reads one line without echoing it.
 *
 * Raw mode and a manual character loop, rather than readline: readline always
 * echoes, and the usual workaround of monkey-patching its private
 * `_writeToOutput` breaks whenever Node changes that internal. Reading
 * characters directly is more code but depends on nothing private.
 *
 * Ctrl-C is handled explicitly. Raw mode swallows the interrupt signal, so
 * without this the terminal would be left in raw mode with no way out.
 */
function askSecret(question: string): Promise<string> {
  const { stdin, stdout } = process;

  return new Promise((resolve) => {
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let value = "";

    const finish = (result: string | null) => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
      stdout.write("\n");
      if (result === null) process.exit(130);
      resolve(result);
    };

    const onData = (chunk: string) => {
      for (const char of chunk) {
        switch (char) {
          case "\r":
          case "\n":
            return finish(value);
          case "\u0003": // Ctrl-C
            return finish(null);
          case "\u007f": // Backspace / Delete
          case "\b":
            value = value.slice(0, -1);
            break;
          default:
            // Ignore other control characters rather than storing them.
            if (char >= " ") value += char;
        }
      }
    };

    stdin.on("data", onData);
  });
}

/**
 * Returns the environment value, or asks for it.
 *
 * Refuses to prompt when there is no terminal attached — in CI that would hang
 * forever waiting on a keystroke that is never coming, which is far worse to
 * diagnose than a clear error.
 */
async function resolveValue(
  name: string,
  question: string,
  secret = false,
): Promise<string> {
  const fromEnv = process.env[name]?.trim();
  if (fromEnv) return fromEnv;

  if (!process.stdin.isTTY) {
    throw new Error(
      `${name} is required. No terminal is attached, so it cannot be asked for — set it as an environment variable.`,
    );
  }

  const answer = secret ? await askSecret(question) : await ask(question);
  if (!answer) throw new Error(`${name} is required.`);
  return answer;
}

function parseRole(raw: string | undefined): AdminRole {
  if (!raw) return "Super Admin";
  const match = ADMIN_ROLES.find((role) => role.toLowerCase() === raw.trim().toLowerCase());
  if (!match) {
    throw new Error(
      `ADMIN_ROLE "${raw}" is not a valid role. One of: ${ADMIN_ROLES.join(", ")}`,
    );
  }
  return match;
}

async function main(): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not set.");

  const interactive =
    process.stdin.isTTY &&
    !(process.env.ADMIN_EMAIL && process.env.ADMIN_NAME && process.env.ADMIN_PASSWORD);

  if (interactive) {
    console.log("\n  Staff account for the OAX Tech admin.");
    console.log("  The password is not shown as you type it.\n");
  }

  const email = (await resolveValue("ADMIN_EMAIL", "  Email          ")).toLowerCase();
  const name = await resolveValue("ADMIN_NAME", "  Full name      ");
  const password = await resolveValue("ADMIN_PASSWORD", "  Password       ", true);
  const role = parseRole(process.env.ADMIN_ROLE);

  /*
   * Checked here as well as in the sign-in flow. A weak password on the one
   * account that can read every client's files is the single worst credential
   * in the system, and this is the only place it gets set.
   *
   * Validated before the confirmation prompt so a too-short password is
   * rejected immediately, rather than after typing it twice.
   */
  const problem = passwordProblem(password);
  if (problem) throw new Error(problem);

  /*
   * Typed twice, but only when it was typed at all — a value from the
   * environment has been read from a file or a secret store and cannot have a
   * typo in the way a blind terminal entry can. Without this, one slip sets a
   * password nobody knows on the account that reads every client's files, and
   * the only symptom is a sign-in that refuses correct-looking credentials.
   */
  if (!process.env.ADMIN_PASSWORD?.trim()) {
    const again = await askSecret("  Confirm        ");
    if (again !== password) throw new Error("Passwords did not match. Nothing was changed.");
  }

  const passwordHash = await hashPassword(password);

  const [existing] = await db
    .select({ id: t.users.id })
    .from(t.users)
    .where(eq(t.users.email, email));

  if (existing) {
    /*
     * Updated in place rather than deleted and recreated. The user id is
     * referenced by team member links and by anything assigned to this person;
     * a new id would silently orphan all of it.
     *
     * `disabledAt` is cleared deliberately — running this against a disabled
     * account is a request to restore access, and leaving it set would produce
     * an account that accepts the password and then refuses the session, which
     * is the least debuggable outcome available.
     */
    await db
      .update(t.users)
      .set({ name, passwordHash, adminRole: role, disabledAt: null })
      .where(eq(t.users.id, existing.id));

    console.log(`\n  Updated staff account  ${email}`);
    console.log(`  Role                   ${role}`);
    console.log(`  Password               changed\n`);
    return;
  }

  await db.insert(t.users).values({
    id: `usr_${randomUUID()}`,
    name,
    email,
    // Set because this account was created by an operator with direct database
    // access, not by someone claiming an address they might not control.
    emailVerified: new Date(),
    passwordHash,
    adminRole: role,
  });

  console.log(`\n  Created staff account  ${email}`);
  console.log(`  Role                   ${role}`);
  console.log(`\n  Sign in at /admin/login. Nothing else needs to be configured.\n`);
}

main()
  .catch((error: unknown) => {
    console.error(`\nFailed: ${(error as Error).message}\n`);
    process.exitCode = 1;
  })
  .finally(closeDb);
