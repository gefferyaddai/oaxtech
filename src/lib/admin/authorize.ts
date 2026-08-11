/**
 * ============================================================================
 * SERVER-SIDE AUTHORISATION
 * ============================================================================
 *
 * `src/lib/admin/permissions.ts` decides which controls to RENDER. This file
 * decides what a request is allowed to DO.
 *
 * The distinction matters: hiding a button stops an honest user from clicking
 * it. It does nothing about a crafted POST. Every mutation must call
 * `requireCapability()` before it changes anything, regardless of what the UI
 * did or did not show.
 *
 * These throw rather than returning false. A caller that forgets to check the
 * return value of a boolean is a silent authorisation bypass; a caller that
 * forgets to handle an exception gets a 500, which is loud and safe.
 *
 * SERVER-ONLY.
 */

import { getAdminSession, type AdminSession } from "@/lib/admin/auth";
import { can, type Capability } from "@/lib/admin/permissions";
import { getSession, type PortalSession } from "@/lib/portal/auth";

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/* -------------------------------------------------------------------------- */
/* Admin                                                                       */
/* -------------------------------------------------------------------------- */

/** The signed-in staff session, or throws. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new AuthorizationError("Not signed in as staff.");
  return session;
}

/**
 * Asserts the caller's role grants this capability.
 *
 * Call this at the top of every admin Server Action that writes. It is the only
 * thing standing between a crafted request and the database.
 */
export async function requireCapability(capability: Capability): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!can(session.role, capability)) {
    throw new AuthorizationError(
      `Role "${session.role}" does not have the "${capability}" capability.`,
    );
  }
  return session;
}

/* -------------------------------------------------------------------------- */
/* Portal                                                                      */
/* -------------------------------------------------------------------------- */

/** The signed-in client session, or throws. */
export async function requireClient(): Promise<PortalSession> {
  const session = await getSession();
  if (!session) throw new AuthorizationError("Not signed in.");
  return session;
}

/**
 * Resolves the client id a portal request may act on.
 *
 * Pass the id the request is *asking* for and this verifies the session
 * actually holds it; pass nothing and it returns the active one. Either way the
 * answer comes from the session's memberships, never from the caller.
 *
 * This is the check that stops one client reading another's data by editing a
 * URL or a hidden form field.
 */
export async function requireClientAccess(requestedClientId?: string): Promise<string> {
  const session = await requireClient();

  if (!requestedClientId || requestedClientId === session.clientId) {
    return session.clientId;
  }

  // Demo sessions hold exactly one client and cannot switch.
  const memberships = session.memberships ?? [session.clientId];
  if (!memberships.includes(requestedClientId)) {
    throw new AuthorizationError("This account does not have access to that client.");
  }

  /*
   * Belt and braces: re-check the membership against the database rather than
   * trusting the list carried on the session object.
   */
  if (session.userId) {
    const { hasMembership } = await import("@/lib/db/queries");
    if (!(await hasMembership(session.userId, requestedClientId))) {
      throw new AuthorizationError("This account does not have access to that client.");
    }
  }

  return requestedClientId;
}
