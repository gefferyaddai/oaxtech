"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth/config";

/**
 * Credentials sign-in, shared by both surfaces.
 *
 * `redirect: false` so the caller decides where to go — the portal and the
 * admin land in different places, and an error must re-render the form rather
 * than bouncing to Auth.js's own page.
 *
 * The message returned to the browser is whatever `authorize()` produced, which
 * is deliberately generic: it never distinguishes "no such account" from "wrong
 * password", and never says an account is disabled.
 */
export async function signInWithPassword(
  _previous: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      /*
       * Auth.js wraps the thrown message. `cause.err` holds the original, which
       * is either the generic failure or the rate-limit notice — both safe to
       * show. Anything unrecognised falls back to the generic message rather
       * than leaking an internal error.
       */
      const cause = (error.cause as { err?: Error } | undefined)?.err;
      return {
        error: cause?.message ?? "That email and password combination isn't recognised.",
      };
    }
    throw error;
  }
}

/** Ends the Auth.js session. Each surface redirects to its own sign-in page. */
export async function signOutEverywhere(redirectTo: string): Promise<void> {
  await signOut({ redirectTo });
}
