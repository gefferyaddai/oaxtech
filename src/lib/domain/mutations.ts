/**
 * ============================================================================
 * WRITES
 * ============================================================================
 *
 * The counterpart to `repository.ts`. Every change to a record goes through
 * here, so there is one place that knows how writes reach storage.
 *
 * TWO RULES, both enforced by callers rather than here:
 *
 *   1. AUTHORISATION happens in the Server Action, before calling in — via
 *      `requireCapability()` (admin) or `requireClientAccess()` (portal).
 *      These functions assume the caller is already allowed to do this.
 *
 *   2. WRITES REQUIRE A DATABASE. With none configured there is nowhere
 *      durable to put anything, so every function returns `not_configured`
 *      rather than mutating an in-memory fixture that vanishes on the next
 *      request — which would look like it worked and silently lose the change.
 *
 * SERVER-ONLY.
 */

import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import * as t from "@/lib/db/schema";
import { isLive } from "@/lib/domain/repository";
import type {
  ActivityKind,
  ApprovalStatus,
  LeadStage,
  Priority,
  RevisionStatus,
} from "@/lib/domain/types";

export type MutationResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "not_found" | "failed"; detail: string };

const NO_DATABASE: MutationResult = {
  ok: false,
  reason: "not_configured",
  detail:
    "No database is configured, so this change could not be saved. Set DATABASE_URL to enable it.",
};

/** True when changes can actually be persisted. Drives whether UI enables controls. */
export function canPersistChanges(): boolean {
  return isLive();
}

function db() {
  const database = getDb();
  if (!database) throw new Error("No database configured.");
  return database;
}

function failed(error: unknown): MutationResult {
  return { ok: false, reason: "failed", detail: (error as Error).message };
}

function id(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * Records an activity event.
 *
 * Best-effort: a feed entry failing to write must not roll back the change it
 * describes. Callers pass the client so the portal can scope its feed.
 */
async function recordActivity(input: {
  kind: ActivityKind;
  summary: string;
  actor: string;
  clientId: string | null;
  href: string | null;
}): Promise<void> {
  try {
    await db().insert(t.activityEvents).values({
      id: id("ac"),
      kind: input.kind,
      summary: input.summary,
      actor: input.actor,
      clientId: input.clientId,
      occurredAt: new Date(),
      href: input.href,
    });
  } catch {
    /* ignore — the record itself already changed */
  }
}

/* -------------------------------------------------------------------------- */
/* Leads                                                                       */
/* -------------------------------------------------------------------------- */

export async function setLeadStage(leadId: string, stage: LeadStage): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    const rows = await db()
      .update(t.leads)
      .set({ stage })
      .where(eq(t.leads.id, leadId))
      .returning({ id: t.leads.id });
    if (rows.length === 0) {
      return { ok: false, reason: "not_found", detail: "That lead no longer exists." };
    }
    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

export async function assignLead(
  leadId: string,
  assigneeId: string | null,
): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    await db().update(t.leads).set({ assigneeId }).where(eq(t.leads.id, leadId));
    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

/* -------------------------------------------------------------------------- */
/* Tasks                                                                       */
/* -------------------------------------------------------------------------- */

export async function setTaskCompleted(
  taskId: string,
  completed: boolean,
): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    const rows = await db()
      .update(t.tasks)
      .set({ completed })
      .where(eq(t.tasks.id, taskId))
      .returning({ id: t.tasks.id });
    if (rows.length === 0) {
      return { ok: false, reason: "not_found", detail: "That task no longer exists." };
    }
    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

export async function createTask(input: {
  title: string;
  priority: Priority;
  dueDate: string;
  assigneeId: string;
  projectId: string | null;
}): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    await db().insert(t.tasks).values({ id: id("tk"), ...input, completed: false });
    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

/* -------------------------------------------------------------------------- */
/* Approvals — the cross-surface path                                          */
/* -------------------------------------------------------------------------- */

/**
 * A client's decision on a deliverable.
 *
 * `clientId` is passed separately and checked in the WHERE clause, so a client
 * cannot act on an approval belonging to someone else even if they know its id.
 * The Server Action has already verified membership; this is the second lock.
 */
export async function decideApproval(
  approvalId: string,
  clientId: string,
  decision: Extract<ApprovalStatus, "Approved" | "Changes Requested">,
  actor: string,
): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    const rows = await db()
      .update(t.approvals)
      .set({ status: decision })
      .from(t.projects)
      .where(
        and(
          eq(t.approvals.id, approvalId),
          eq(t.projects.id, t.approvals.projectId),
          eq(t.projects.clientId, clientId),
        ),
      )
      .returning({ id: t.approvals.id, title: t.approvals.title });

    if (rows.length === 0) {
      return {
        ok: false,
        reason: "not_found",
        detail: "That item is no longer awaiting your approval.",
      };
    }

    await recordActivity({
      kind: decision === "Approved" ? "design_approved" : "revision_requested",
      summary:
        decision === "Approved"
          ? `Approved “${rows[0].title}”`
          : `Requested changes on “${rows[0].title}”`,
      actor,
      clientId,
      href: "/admin/approvals",
    });

    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

/* -------------------------------------------------------------------------- */
/* Revisions                                                                   */
/* -------------------------------------------------------------------------- */

export async function createRevision(input: {
  projectId: string;
  clientId: string;
  title: string;
  priority: Priority;
  actor: string;
}): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    // Confirm the project belongs to this client before attaching anything.
    const [project] = await db()
      .select({ id: t.projects.id })
      .from(t.projects)
      .where(and(eq(t.projects.id, input.projectId), eq(t.projects.clientId, input.clientId)))
      .limit(1);

    if (!project) {
      return { ok: false, reason: "not_found", detail: "That project could not be found." };
    }

    await db().insert(t.revisions).values({
      id: id("rv"),
      projectId: input.projectId,
      title: input.title,
      priority: input.priority,
      status: "Requested",
      requestedAt: new Date(),
      commentCount: 0,
    });

    await recordActivity({
      kind: "revision_requested",
      summary: `Requested a revision: “${input.title}”`,
      actor: input.actor,
      clientId: input.clientId,
      href: "/admin/projects",
    });

    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

export async function setRevisionStatus(
  revisionId: string,
  status: RevisionStatus,
): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    await db().update(t.revisions).set({ status }).where(eq(t.revisions.id, revisionId));
    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

/* -------------------------------------------------------------------------- */
/* Support                                                                     */
/* -------------------------------------------------------------------------- */

/** Sequential per year, e.g. SUP-2026-019. */
async function nextReference(prefix: string, table: "support"): Promise<string> {
  const year = new Date().getFullYear();
  void table;
  const [row] = await db()
    .select({ count: sql<number>`count(*)::int` })
    .from(t.supportTickets);
  return `${prefix}-${year}-${String((row?.count ?? 0) + 1).padStart(3, "0")}`;
}

export async function createSupportTicket(input: {
  clientId: string;
  subject: string;
  priority: Priority;
  actor: string;
}): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    const reference = await nextReference("SUP", "support");
    await db().insert(t.supportTickets).values({
      id: id("st"),
      reference,
      subject: input.subject,
      clientId: input.clientId,
      priority: input.priority,
      status: "Open",
      openedAt: new Date(),
      assigneeId: null,
    });

    await recordActivity({
      kind: "support_opened",
      summary: `Opened ${reference} — ${input.subject}`,
      actor: input.actor,
      clientId: input.clientId,
      href: "/admin/support",
    });

    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

export async function setSupportStatus(
  ticketId: string,
  status: "Open" | "In Progress" | "Resolved",
): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    await db().update(t.supportTickets).set({ status }).where(eq(t.supportTickets.id, ticketId));
    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

/* -------------------------------------------------------------------------- */
/* Messages                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Appends to a thread and updates its summary in one transaction — a thread
 * whose preview disagrees with its last message is a confusing bug.
 */
export async function postMessage(input: {
  threadId: string;
  clientId: string;
  from: "team" | "client";
  body: string;
}): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    const [thread] = await db()
      .select({ id: t.messageThreads.id })
      .from(t.messageThreads)
      .where(
        and(eq(t.messageThreads.id, input.threadId), eq(t.messageThreads.clientId, input.clientId)),
      )
      .limit(1);

    if (!thread) {
      return { ok: false, reason: "not_found", detail: "That conversation could not be found." };
    }

    const now = new Date();
    await db().transaction(async (tx) => {
      await tx.insert(t.messageEntries).values({
        id: id("me"),
        threadId: input.threadId,
        from: input.from,
        body: input.body,
        sentAt: now,
      });
      await tx
        .update(t.messageThreads)
        .set({
          preview: input.body.slice(0, 140),
          lastActivityAt: now,
          lastSender: input.from,
          // Unread for the *other* party.
          unread: input.from === "client",
        })
        .where(eq(t.messageThreads.id, input.threadId));
    });

    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

/* -------------------------------------------------------------------------- */
/* Creation — admin                                                            */
/* -------------------------------------------------------------------------- */

export async function createLead(input: {
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service: string;
  budget: string | null;
}): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    await db().insert(t.leads).values({
      id: id("ld"),
      ...input,
      stage: "New",
      // Recorded by staff, so the channel genuinely is unknown.
      source: null,
      origin: "contact",
      assigneeId: null,
      submittedAt: new Date(),
      followUp: "Due today",
      notes: null,
    });
    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}

export async function createClient(input: {
  name: string;
  contactName: string;
  email: string;
  phone: string | null;
  industry: string | null;
}): Promise<MutationResult> {
  if (!isLive()) return NO_DATABASE;
  try {
    await db()
      .insert(t.clients)
      .values({
        id: id("cl"),
        ...input,
        status: "Active",
        since: new Date().toISOString().slice(0, 10),
        lifetimeValue: 0,
      });
    return { ok: true };
  } catch (error) {
    return failed(error);
  }
}
