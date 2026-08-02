/**
 * Role-based permissions.
 *
 * Capabilities are coarse on purpose — one per meaningful area of risk rather
 * than one per button. The UI uses `can()` to decide whether to render a
 * destructive or financial control at all.
 *
 * ⚠️  This is a UI-layer guard. It hides controls a role should not use; it is
 * NOT a security boundary. Once a backend exists, every mutation must re-check
 * the caller's role on the server. Never trust a hidden button to be a
 * substitute for authorisation.
 */

import type { AdminRole } from "@/lib/domain/types";

export type Capability =
  /** Create or edit leads, clients, projects, tasks. */
  | "manage:records"
  /** Issue, void or mark invoices paid; send proposals. */
  | "manage:finance"
  /** Publish or unpublish website content. */
  | "manage:content"
  /** Add, remove or change the role of a team member. */
  | "manage:team"
  /** Change organisation-wide settings and integrations. */
  | "manage:settings"
  /** Permanently delete a record. */
  | "delete:records"
  /** Respond to support tickets. */
  | "manage:support";

const MATRIX: Record<AdminRole, Capability[]> = {
  "Super Admin": [
    "manage:records",
    "manage:finance",
    "manage:content",
    "manage:team",
    "manage:settings",
    "delete:records",
    "manage:support",
  ],
  "Project Manager": ["manage:records", "manage:support"],
  Developer: ["manage:records"],
  Marketing: ["manage:records", "manage:content"],
  Finance: ["manage:finance"],
  Support: ["manage:support"],
  Viewer: [],
};

export function can(role: AdminRole, capability: Capability): boolean {
  return MATRIX[role].includes(capability);
}

/** Human-readable summary, used on the Team and Settings screens. */
export function capabilitiesFor(role: AdminRole): Capability[] {
  return MATRIX[role];
}

/**
 * Actions that must never fire without an explicit confirmation step,
 * regardless of role. Financial, destructive, access-granting or publishing.
 */
export const REQUIRES_CONFIRMATION: Capability[] = [
  "manage:finance",
  "manage:team",
  "manage:content",
  "delete:records",
];

export function requiresConfirmation(capability: Capability): boolean {
  return REQUIRES_CONFIRMATION.includes(capability);
}
