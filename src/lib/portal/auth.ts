import { cookies } from "next/headers";
import { integrationStatus } from "@/lib/integrations";

/**
 * ============================================================================
 * PORTAL AUTHENTICATION ADAPTER
 * ============================================================================
 *
 * There is NO real authentication in this build, and this file does not
 * pretend otherwise.
 *
 * - No credentials are checked, because none exist.
 * - No password is stored in source, in a cookie, or in local storage.
 * - The demo session cookie carries a single flag and nothing else — no user
 *   identity, no token, no personal data.
 * - `isDemoMode()` is true whenever a real auth provider isn't configured, and
 *   every portal screen renders a visible demo banner while it is.
 *
 * To add real authentication:
 *   1. Set AUTH_SECRET and AUTH_PROVIDER_URL (see .env.example).
 *   2. Implement `RealAuthAdapter` below against your provider.
 *   3. Nothing else in the portal needs to change — every screen consumes
 *      `getSession()` through this interface.
 */

const DEMO_COOKIE = "oax_portal_demo";

/**
 * The cookie is scoped to /portal, so every write AND the delete must carry
 * the same path. Deleting without it emits `Path=/`, which the browser treats
 * as a different cookie entirely — the real session would survive sign-out.
 */
const DEMO_COOKIE_PATH = "/portal";

export interface PortalSession {
  /** True when this session is a demonstration, not a real signed-in user. */
  isDemo: boolean;
  /** Display label only. In demo mode this is a generic string, never a person. */
  label: string;
}

export interface AuthAdapter {
  signIn(): Promise<{ ok: true } | { ok: false; message: string }>;
  signOut(): Promise<void>;
  getSession(): Promise<PortalSession | null>;
}

export function isDemoMode(): boolean {
  return !integrationStatus.auth();
}

/**
 * Demo adapter. Grants a clearly-labelled demo session without validating any
 * credentials, because validating credentials that don't exist would be
 * security theatre.
 */
const demoAdapter: AuthAdapter = {
  async signIn() {
    const store = await cookies();
    store.set(DEMO_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: DEMO_COOKIE_PATH,
      maxAge: 60 * 60 * 4,
    });
    return { ok: true };
  },
  async signOut() {
    const store = await cookies();
    store.delete({ name: DEMO_COOKIE, path: DEMO_COOKIE_PATH });
  },
  async getSession() {
    const store = await cookies();
    if (store.get(DEMO_COOKIE)?.value !== "1") return null;
    return { isDemo: true, label: "Demo Account" };
  },
};

/**
 * Real adapter placeholder. Deliberately fails loudly rather than falling back
 * to the demo adapter, so a half-configured provider can never look like a
 * working login.
 */
const realAdapter: AuthAdapter = {
  async signIn() {
    return {
      ok: false,
      message:
        "An authentication provider is configured but the adapter has not been implemented yet. See src/lib/portal/auth.ts.",
    };
  },
  async signOut() {
    /* no-op until implemented */
  },
  async getSession() {
    return null;
  },
};

export function getAuthAdapter(): AuthAdapter {
  return isDemoMode() ? demoAdapter : realAdapter;
}

export async function getSession(): Promise<PortalSession | null> {
  return getAuthAdapter().getSession();
}
