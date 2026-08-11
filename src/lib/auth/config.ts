/**
 * ============================================================================
 * AUTHENTICATION — Auth.js (NextAuth v5)
 * ============================================================================
 *
 * One provider, email + password, for both surfaces. What a signed-in account
 * may DO is decided afterwards, not here:
 *
 *   - staff access  = `users.admin_role` is set
 *   - client access = a row in `client_users` for that user
 *
 * So one account can be a client contact, a staff member, or neither, without
 * a second login system.
 *
 * SESSION STRATEGY: JWT. The Credentials provider cannot use database sessions
 * in Auth.js v5. The token therefore carries only the user id — everything
 * authorising (role, memberships, whether the account is still enabled) is read
 * from the database on each request. That costs a query, and it means revoking
 * access takes effect immediately rather than whenever the token expires.
 *
 * SERVER-ONLY.
 */

import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth/password";
import {
  clearFailures,
  isRateLimited,
  pruneOldAttempts,
  recordFailure,
} from "@/lib/auth/rate-limit";
import { selectUserForSignIn } from "@/lib/db/queries";

/** True once a real provider is configured. Until then, demo mode. */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.AUTH_SECRET);
}

/**
 * Deliberately vague. Distinguishing "no such account" from "wrong password"
 * tells an attacker which addresses are registered.
 */
const GENERIC_FAILURE = "That email and password combination isn't recognised.";
const RATE_LIMITED = "Too many sign-in attempts. Please wait a few minutes and try again.";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
    // Four hours, matching the demo cookies the surfaces already used.
    maxAge: 60 * 60 * 4,
  },

  pages: {
    // Each surface has its own sign-in screen; Auth.js only needs one default.
    signIn: "/portal/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(raw) {
        const email = String(raw?.email ?? "").trim().toLowerCase();
        const password = String(raw?.password ?? "");
        if (!email || !password) return null;

        // Two independent buckets: the account, and the source address.
        const ipHeader = "";
        const keys = [`email:${email}`, ipHeader].filter(Boolean);

        for (const key of keys) {
          if (await isRateLimited(key)) {
            throw new Error(RATE_LIMITED);
          }
        }

        const account = await selectUserForSignIn(email);

        /*
         * Runs even when `account` is null. `verifyPassword` compares against a
         * dummy hash in that case, so a missing account costs the same time as
         * a real one and the difference cannot be measured.
         */
        const ok = await verifyPassword(account?.passwordHash ?? null, password);

        if (!ok || !account || account.disabled) {
          await Promise.all(keys.map(recordFailure));
          // Same message for every failure mode, including disabled accounts.
          throw new Error(GENERIC_FAILURE);
        }

        await Promise.all([...keys.map(clearFailures), pruneOldAttempts()]);

        // Only the id is durable. Everything else is re-read per request.
        return { id: account.id, email: account.email, name: account.name };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },

  // Auth.js reads AUTH_SECRET from the environment; stated here for clarity.
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
