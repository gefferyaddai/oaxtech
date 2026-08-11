/**
 * ============================================================================
 * ADMIN AUTHENTICATION ADAPTER
 * ============================================================================
 *
 * Two adapters. Which one is used depends on whether AUTH_SECRET is set.
 *
 * REAL (AUTH_SECRET set): Auth.js credentials, argon2id, rate limited. Staff
 * access is the presence of `users.admin_role` — signing in is not the same as
 * being staff.
 *
 * DEMO (AUTH_SECRET unset): no credentials are checked, because none exist. The
 * UI states this plainly on every screen. Concretely:
 *   - No credentials are checked, because none exist.
 *   - No password is stored in source, in a cookie, or in local storage.
 *   - The demo session cookie carries a role string and nothing else — no user
 *     identity, no token, no personal data.
 *   - The cookie is httpOnly and scoped to /admin, so it is never readable from
 *     JavaScript and never sent to another part of the site.
 *
 * ⚠️  DEVELOPMENT ONLY. Demo mode grants admin access to anyone who can reach
 * the URL. Do NOT deploy this publicly with `AUTH_SECRET` unset. In production
 * with no provider configured, `/admin` refuses to open at all — see
 * `demoAccessAllowed()` below.
 *
 * TO TURN ON REAL AUTHENTICATION
 *   1. Set AUTH_SECRET (see .env.example).
 *   2. Create a user with an `admin_role` — see scripts/seed-users.ts.
 *   3. Nothing else changes — every admin screen reads `getAdminSession()`.
 */

import { cookies } from "next/headers";
import { integrationStatus } from "@/lib/integrations";
import { ADMIN_ROLES, type AdminRole } from "@/lib/domain/types";

const ADMIN_COOKIE = "oax_admin_demo";

/**
 * Scoped to /admin. Every write AND delete must carry this same path — a
 * delete without it emits `Path=/`, which the browser treats as a different
 * cookie, and the session would survive sign-out.
 */
const ADMIN_COOKIE_PATH = "/admin";

/** Four hours, matching the client portal. */
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 4;

export interface AdminSession {
  /** True when this is a demonstration session, not a real signed-in user. */
  isDemo: boolean;
  /** Display label only. In demo mode this is generic, never a real person. */
  label: string;
  role: AdminRole;
  /** The signed-in account, when this is a real session. Absent in demo mode. */
  userId?: string;
}

export interface AdminAuthAdapter {
  signIn(role?: AdminRole): Promise<{ ok: true } | { ok: false; message: string }>;
  signOut(): Promise<void>;
  getSession(): Promise<AdminSession | null>;
}

/** True whenever a real auth provider is not configured. */
export function isAdminDemoMode(): boolean {
  return !integrationStatus.auth();
}

/** Re-exported so screens can name the variable that turns demo mode off. */
export const AUTH_ENV_VAR = "AUTH_SECRET";

/**
 * Demo admin access is allowed only outside production. This is the guard that
 * stops an unconfigured deployment from exposing an open admin panel to the
 * internet — the failure mode that matters most here.
 */
export function demoAccessAllowed(): boolean {
  return process.env.NODE_ENV !== "production";
}

function isAdminRole(value: string): value is AdminRole {
  return (ADMIN_ROLES as string[]).includes(value);
}

/**
 * Demo adapter. Grants a clearly-labelled session without validating any
 * credentials, because validating credentials that do not exist would be
 * security theatre.
 */
const demoAdapter: AdminAuthAdapter = {
  async signIn(role = "Super Admin") {
    if (!demoAccessAllowed()) {
      return {
        ok: false,
        message:
          "Demo admin access is disabled in production. Set AUTH_SECRET and create a staff account to sign in.",
      };
    }
    const store = await cookies();
    store.set(ADMIN_COOKIE, role, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: ADMIN_COOKIE_PATH,
      maxAge: ADMIN_COOKIE_MAX_AGE,
    });
    return { ok: true };
  },

  async signOut() {
    const store = await cookies();
    store.delete({ name: ADMIN_COOKIE, path: ADMIN_COOKIE_PATH });
  },

  async getSession() {
    if (!demoAccessAllowed()) return null;
    const store = await cookies();
    const value = store.get(ADMIN_COOKIE)?.value;
    if (!value || !isAdminRole(value)) return null;
    return { isDemo: true, label: "Demo Administrator", role: value };
  },
};

/**
 * Real adapter, backed by Auth.js.
 *
 * Staff access is the presence of `users.admin_role`. An authenticated account
 * without one gets no admin session at all — being able to sign in is not the
 * same as being staff.
 *
 * The role is re-read from the database on every call, so changing or removing
 * it takes effect on the next request rather than when the token expires.
 */
const realAdapter: AdminAuthAdapter = {
  async signIn() {
    // Credentials sign-in goes through the Auth.js route, not here.
    return {
      ok: false,
      message: "Use the sign-in form. This adapter does not accept credentials directly.",
    };
  },

  async signOut() {
    const { signOut } = await import("@/lib/auth/config");
    await signOut({ redirect: false });
  },

  async getSession() {
    const [{ auth }, { selectAccount }] = await Promise.all([
      import("@/lib/auth/config"),
      import("@/lib/db/queries"),
    ]);

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return null;

    const account = await selectAccount(userId);
    if (!account || account.disabled) return null;

    // No role means not staff, regardless of a valid login.
    if (!account.adminRole) return null;

    return {
      isDemo: false,
      label: account.name ?? account.email,
      role: account.adminRole,
      userId: account.id,
    };
  },
};

export function getAdminAuthAdapter(): AdminAuthAdapter {
  return isAdminDemoMode() ? demoAdapter : realAdapter;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  return getAdminAuthAdapter().getSession();
}
