import { cookies } from "next/headers";
import { integrationStatus } from "@/lib/integrations";

/**
 * ============================================================================
 * PORTAL AUTHENTICATION ADAPTER
 * ============================================================================
 *
 * Two adapters, chosen by whether AUTH_SECRET is set.
 *
 * REAL: Auth.js credentials, argon2id, rate limited. Which client a session may
 * read comes from the `client_users` membership table, re-read on every request.
 *
 * DEMO (AUTH_SECRET unset), which does not pretend otherwise:
 * - No credentials are checked, because none exist.
 * - No password is stored in source, in a cookie, or in local storage.
 * - The demo session cookie carries a single flag and nothing else — no user
 *   identity, no token, no personal data.
 * - `isDemoMode()` is true whenever a real auth provider isn't configured, and
 *   every portal screen renders a visible demo banner while it is.
 *
 * To turn on real authentication:
 *   1. Set AUTH_SECRET (see .env.example).
 *   2. Create a user and a `client_users` row — see scripts/seed-users.ts.
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
  /**
   * Which client this session may read. EVERY portal query is scoped by this —
   * see src/lib/portal/repository.ts.
   *
   * It comes from the session and nowhere else. Never accept a client id from a
   * URL, a query string or a form field: that would let one client read
   * another's projects, files and invoices by editing a parameter.
   */
  clientId: string;
  /** The signed-in account, when this is a real session. Null in demo mode. */
  userId?: string;
  /**
   * Every client this account may read. `clientId` is the active one.
   *
   * Switching between them must go through `setActiveClient`, which re-checks
   * membership server-side — a client id from a URL or form field is never
   * trusted.
   */
  memberships?: string[];
}

/** The client a demo session is signed in as. Development only. */
const DEMO_CLIENT_ID = "cl-1";

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
    return { isDemo: true, label: "Demo Account", clientId: DEMO_CLIENT_ID };
  },
};

/**
 * Real adapter, backed by Auth.js.
 *
 * Sign-in itself is handled by the Auth.js credentials flow (see
 * `src/lib/auth/config.ts` and `signInWithPassword` in `actions.ts`). This
 * adapter's job is turning an authenticated account into a PORTAL session —
 * which means answering "which client may this person read?".
 *
 * Both the account and its memberships are re-read on every call rather than
 * trusted from the token. Disabling an account, or removing someone's access to
 * a client, therefore takes effect on the next request instead of whenever the
 * JWT expires.
 */
const realAdapter: AuthAdapter = {
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
    const [{ auth }, { selectAccount, selectMemberships }] = await Promise.all([
      import("@/lib/auth/config"),
      import("@/lib/db/queries"),
    ]);

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return null;

    const account = await selectAccount(userId);
    if (!account || account.disabled) return null;

    /*
     * A portal session exists only if the account is a member of at least one
     * client. Staff without a membership get nothing here — they use /admin.
     */
    const memberships = await selectMemberships(userId);
    const clientId = memberships[0];
    if (!clientId) return null;

    return {
      isDemo: false,
      label: account.name ?? account.email,
      clientId,
      userId: account.id,
      memberships,
    };
  },
};

export function getAuthAdapter(): AuthAdapter {
  return isDemoMode() ? demoAdapter : realAdapter;
}

export async function getSession(): Promise<PortalSession | null> {
  return getAuthAdapter().getSession();
}
