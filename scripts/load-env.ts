/**
 * ============================================================================
 * ENV LOADING FOR STANDALONE SCRIPTS
 * ============================================================================
 *
 * `next dev` and `next build` read `.env.local` automatically. A script run
 * through `tsx` does not — it is a plain Node process, and Next is nowhere in
 * it. That gap is why every script in this directory had to be invoked with
 * `DATABASE_URL=...` pasted in front of it, and why a value already sitting in
 * `.env.local` still produced "DATABASE_URL is not set."
 *
 * Import this first, for its side effect:
 *
 *   import "./load-env";
 *
 * PRECEDENCE. `process.loadEnvFile` does NOT overwrite a variable that is
 * already set, and the whole design depends on that: a `DATABASE_URL` passed
 * explicitly on the command line still wins over `.env.local`. Pointing a
 * script at production stays an explicit, visible act rather than something
 * the local file can quietly override.
 *
 * `.env.local` is read before `.env` for the same reason — first writer wins,
 * so the more specific file takes precedence.
 *
 * No dependency: `process.loadEnvFile` is built into Node. Nothing is added to
 * package.json for this.
 */

import path from "node:path";

/** Most specific first — an earlier file's value is not overwritten by a later one. */
const ENV_FILES = [".env.local", ".env"];

for (const file of ENV_FILES) {
  try {
    process.loadEnvFile(path.join(process.cwd(), file));
  } catch {
    /*
     * Missing file is the normal case, not an error — the project is designed
     * to run with no environment files at all. A malformed one is also
     * swallowed here rather than crashing the script before it can report the
     * specific variable it actually needs.
     */
  }
}
