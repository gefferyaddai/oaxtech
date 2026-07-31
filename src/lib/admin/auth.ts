/**
 * ============================================================================
 * ADMIN AUTHENTICATION ADAPTER
 * ============================================================================
 *
 * THERE IS NO REAL AUTHENTICATION IN THIS BUILD. This file does not pretend
 * otherwise, and the UI states it plainly on every screen.
 *
 * What that means concretely:
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
 * TO ADD REAL AUTHENTICATION
 *   1. Set AUTH_SECRET and AUTH_PROVIDER_URL (see .env.example).
 *   2. Implement `realAdapter` below against your provider, mapping the
 *      provider's groups onto `AdminRole`.
 *   3. Nothing else changes — every admin screen reads `getAdminSession()`.
 */

import { cookies } from "next/headers";
import { integrationStatus } from "@/lib/integrations";
import { ADMIN_ROLES, type AdminRole } from "@/lib/admin/types";

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
          "Demo admin access is disabled in production. Configure AUTH_SECRET and AUTH_PROVIDER_URL, then implement the real adapter in src/lib/admin/auth.ts.",
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
 * Real adapter placeholder. Fails loudly rather than falling back to the demo
 * adapter, so a half-configured provider can never look like a working login.
 */
const realAdapter: AdminAuthAdapter = {
  async signIn() {
    return {
      ok: false,
      message:
        "An authentication provider is configured but the admin adapter has not been implemented yet. See src/lib/admin/auth.ts.",
    };
  },
  async signOut() {
    /* no-op until implemented */
  },
  async getSession() {
    return null;
  },
};

export function getAdminAuthAdapter(): AdminAuthAdapter {
  return isAdminDemoMode() ? demoAdapter : realAdapter;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  return getAdminAuthAdapter().getSession();
}
