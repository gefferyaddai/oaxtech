/**
 * ============================================================================
 * DATABASE QUERIES
 * ============================================================================
 *
 * Maps database rows onto the domain types. This is the only place that knows
 * about column names — `src/lib/domain/repository.ts` calls these and returns
 * the results unchanged.
 *
 * Row-to-domain mapping is explicit rather than a spread, so a schema change
 * that drops or renames a column fails to compile instead of silently
 * producing an object with a missing field.
 *
 * SERVER-ONLY.
 */

import { and, asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import * as t from "@/lib/db/schema";
import type {
  ActivityEvent,
  Approval,
  Client,
  Consultation,
  ContentItem,
  Invoice,
  Lead,
  Message,
  MessageEntry,
  Milestone,
  ProjectFile,
  ProjectRecord,
  Proposal,
  Revision,
  Subscriber,
  SupportTicket,
  Task,
  TeamMemberRecord,
} from "@/lib/domain/types";

/** Thrown when a query runs without a configured database. */
function db() {
  const database = getDb();
  if (!database) {
    throw new Error(
      "A database query ran with no DATABASE_URL configured. Check isLive() before calling into this module.",
    );
  }
  return database;
}

/** Postgres `timestamptz` comes back as a Date; the domain wants ISO strings. */
function iso(value: Date | string | null): string {
  if (value === null) return "";
  return value instanceof Date ? value.toISOString() : value;
}

function isoOrNull(value: Date | string | null): string | null {
  return value === null ? null : iso(value);
}

/* -------------------------------------------------------------------------- */
/* Team                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Workload counts are computed from the tasks and projects tables rather than
 * stored on the member, so they cannot go stale.
 */
export async function selectTeam(): Promise<TeamMemberRecord[]> {
  const database = db();
  const [members, allTasks, allProjects] = await Promise.all([
    database.select().from(t.teamMembers).orderBy(asc(t.teamMembers.name)),
    database.select().from(t.tasks),
    database.select().from(t.projects),
  ]);

  return members.map((member) => {
    const assigned = allTasks.filter((task) => task.assigneeId === member.id);
    const open = assigned.filter((task) => !task.completed).length;
    const done = assigned.filter((task) => task.completed).length;
    const activeProjects = allProjects.filter(
      (project) => project.ownerId === member.id && project.status !== "Completed",
    ).length;

    return {
      id: member.id,
      slug: member.slug,
      name: member.name,
      initials: member.initials,
      role: member.role,
      title: member.title,
      assignedTasks: open,
      completedTasks: done,
      activeProjects,
      // Capacity of 12 open tasks is a working assumption, not a measurement.
      workloadPercent: Math.min(100, Math.round((open / 12) * 100)),
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Leads & consultations                                                       */
/* -------------------------------------------------------------------------- */

export async function selectLeads(): Promise<Lead[]> {
  const rows = await db().select().from(t.leads).orderBy(desc(t.leads.submittedAt));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    service: row.service,
    budget: row.budget,
    stage: row.stage,
    source: row.source,
    origin: row.origin,
    assigneeId: row.assigneeId,
    submittedAt: iso(row.submittedAt),
    followUp: row.followUp,
    notes: row.notes,
  }));
}

export async function selectConsultations(): Promise<Consultation[]> {
  const rows = await db()
    .select()
    .from(t.consultations)
    .orderBy(asc(t.consultations.date), asc(t.consultations.time));
  return rows.map((row) => ({
    id: row.id,
    contactName: row.contactName,
    company: row.company,
    service: row.service,
    date: row.date,
    time: row.time,
    timeZone: row.timeZone,
    status: row.status,
    meetingUrl: row.meetingUrl,
    leadId: row.leadId,
  }));
}

/* -------------------------------------------------------------------------- */
/* Clients & projects                                                          */
/* -------------------------------------------------------------------------- */

export async function selectClients(): Promise<Client[]> {
  const database = db();
  const [rows, allProjects] = await Promise.all([
    database.select().from(t.clients).orderBy(asc(t.clients.name)),
    database.select().from(t.projects),
  ]);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    contactName: row.contactName,
    email: row.email,
    phone: row.phone,
    status: row.status,
    industry: row.industry,
    since: row.since,
    // Derived, so it always matches the projects table.
    activeProjects: allProjects.filter(
      (project) => project.clientId === row.id && project.status !== "Completed",
    ).length,
    lifetimeValue: row.lifetimeValue,
  }));
}

/** Stored shape. `nextMilestone` is derived by the repository. */
export async function selectProjects(): Promise<ProjectRecord[]> {
  const rows = await db().select().from(t.projects).orderBy(asc(t.projects.name));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    clientId: row.clientId,
    service: row.service,
    progressPercent: row.progressPercent,
    phase: row.phase,
    deadline: row.deadline,
    ownerId: row.ownerId,
    status: row.status,
  }));
}

export async function selectMilestones(): Promise<Milestone[]> {
  const rows = await db().select().from(t.milestones).orderBy(asc(t.milestones.dueDate));
  return rows.map((row) => ({
    id: row.id,
    projectId: row.projectId,
    name: row.name,
    dueDate: row.dueDate,
    status: row.status,
  }));
}

export async function selectTasks(): Promise<Task[]> {
  const rows = await db().select().from(t.tasks).orderBy(asc(t.tasks.dueDate));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    priority: row.priority,
    dueDate: row.dueDate,
    assigneeId: row.assigneeId,
    projectId: row.projectId,
    completed: row.completed,
  }));
}

/* -------------------------------------------------------------------------- */
/* Workflow                                                                    */
/* -------------------------------------------------------------------------- */

export async function selectApprovals(): Promise<Approval[]> {
  const rows = await db().select().from(t.approvals).orderBy(desc(t.approvals.submittedAt));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    projectId: row.projectId,
    version: row.version,
    status: row.status,
    submittedAt: iso(row.submittedAt),
    commentCount: row.commentCount,
  }));
}

export async function selectRevisions(): Promise<Revision[]> {
  const rows = await db().select().from(t.revisions).orderBy(desc(t.revisions.requestedAt));
  return rows.map((row) => ({
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    priority: row.priority,
    status: row.status,
    requestedAt: iso(row.requestedAt),
    commentCount: row.commentCount,
  }));
}

export async function selectMessages(): Promise<Message[]> {
  const rows = await db()
    .select()
    .from(t.messageThreads)
    .orderBy(desc(t.messageThreads.lastActivityAt));
  return rows.map((row) => ({
    id: row.id,
    subject: row.subject,
    clientId: row.clientId,
    projectId: row.projectId,
    preview: row.preview,
    lastActivityAt: iso(row.lastActivityAt),
    unread: row.unread,
    lastSender: row.lastSender,
  }));
}

export async function selectMessageEntries(): Promise<MessageEntry[]> {
  const rows = await db().select().from(t.messageEntries).orderBy(asc(t.messageEntries.sentAt));
  return rows.map((row) => ({
    id: row.id,
    threadId: row.threadId,
    from: row.from,
    body: row.body,
    sentAt: iso(row.sentAt),
  }));
}

export async function selectProposals(): Promise<Proposal[]> {
  const rows = await db().select().from(t.proposals).orderBy(desc(t.proposals.reference));
  return rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    title: row.title,
    clientId: row.clientId,
    service: row.service,
    amount: row.amount,
    status: row.status,
    sentAt: isoOrNull(row.sentAt),
    validUntil: row.validUntil,
  }));
}

export async function selectInvoices(): Promise<Invoice[]> {
  const rows = await db().select().from(t.invoices).orderBy(desc(t.invoices.issuedAt));
  return rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    clientId: row.clientId,
    projectId: row.projectId,
    amount: row.amount,
    status: row.status,
    issuedAt: row.issuedAt,
    dueAt: row.dueAt,
    paidAt: row.paidAt,
  }));
}

export async function selectFiles(): Promise<ProjectFile[]> {
  const rows = await db().select().from(t.projectFiles).orderBy(desc(t.projectFiles.uploadedAt));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    kind: row.kind,
    sizeBytes: row.sizeBytes,
    projectId: row.projectId,
    folder: row.folder,
    uploadedById: row.uploadedById,
    uploadedAt: iso(row.uploadedAt),
    visibleToClient: row.visibleToClient,
  }));
}

export async function selectSupportTickets(): Promise<SupportTicket[]> {
  const rows = await db().select().from(t.supportTickets).orderBy(desc(t.supportTickets.openedAt));
  return rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    subject: row.subject,
    clientId: row.clientId,
    priority: row.priority,
    status: row.status,
    openedAt: iso(row.openedAt),
    assigneeId: row.assigneeId,
  }));
}

/* -------------------------------------------------------------------------- */
/* Activity & content                                                          */
/* -------------------------------------------------------------------------- */

export async function selectActivity(): Promise<ActivityEvent[]> {
  const rows = await db()
    .select()
    .from(t.activityEvents)
    .orderBy(desc(t.activityEvents.occurredAt));
  return rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    summary: row.summary,
    actor: row.actor,
    occurredAt: iso(row.occurredAt),
    href: row.href,
  }));
}

/** Activity scoped to one client — a real WHERE, not a name match. */
export async function selectActivityForClient(clientId: string): Promise<ActivityEvent[]> {
  const rows = await db()
    .select()
    .from(t.activityEvents)
    .where(eq(t.activityEvents.clientId, clientId))
    .orderBy(desc(t.activityEvents.occurredAt));
  return rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    summary: row.summary,
    actor: row.actor,
    occurredAt: iso(row.occurredAt),
    href: row.href,
  }));
}

export async function selectContent(): Promise<ContentItem[]> {
  const rows = await db().select().from(t.contentItems).orderBy(desc(t.contentItems.updatedAt));
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    path: row.path,
    status: row.status,
    updatedAt: row.updatedAt,
    authorId: row.authorId,
  }));
}

export async function selectSubscribers(): Promise<Subscriber[]> {
  const rows = await db().select().from(t.subscribers).orderBy(desc(t.subscribers.subscribedAt));
  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    subscribedAt: iso(row.subscribedAt),
    confirmed: row.confirmed,
  }));
}

/* -------------------------------------------------------------------------- */
/* Client-scoped reads                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The portal's queries, scoped in SQL rather than filtered in JavaScript.
 *
 * Filtering after the fact works, but it means the database hands the process
 * every client's rows and one missing `.filter()` becomes a data breach. A
 * `WHERE` clause makes the database itself refuse to return them — defence in
 * depth, and far less data over the wire.
 */

export async function selectProjectsForClient(clientId: string): Promise<ProjectRecord[]> {
  const rows = await db()
    .select()
    .from(t.projects)
    .where(eq(t.projects.clientId, clientId))
    .orderBy(asc(t.projects.name));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    clientId: row.clientId,
    service: row.service,
    progressPercent: row.progressPercent,
    phase: row.phase,
    deadline: row.deadline,
    ownerId: row.ownerId,
    status: row.status,
  }));
}

export async function selectMilestonesForClient(clientId: string): Promise<Milestone[]> {
  const rows = await db()
    .select({
      id: t.milestones.id,
      projectId: t.milestones.projectId,
      name: t.milestones.name,
      dueDate: t.milestones.dueDate,
      status: t.milestones.status,
    })
    .from(t.milestones)
    .innerJoin(t.projects, eq(t.projects.id, t.milestones.projectId))
    .where(eq(t.projects.clientId, clientId))
    .orderBy(asc(t.milestones.dueDate));
  return rows;
}

/**
 * Only files the client is allowed to see. Both conditions are in the WHERE —
 * an internal file is never returned, not merely never rendered.
 */
export async function selectFilesForClient(clientId: string): Promise<ProjectFile[]> {
  const rows = await db()
    .select({
      id: t.projectFiles.id,
      name: t.projectFiles.name,
      kind: t.projectFiles.kind,
      sizeBytes: t.projectFiles.sizeBytes,
      projectId: t.projectFiles.projectId,
      folder: t.projectFiles.folder,
      uploadedById: t.projectFiles.uploadedById,
      uploadedAt: t.projectFiles.uploadedAt,
      visibleToClient: t.projectFiles.visibleToClient,
    })
    .from(t.projectFiles)
    .innerJoin(t.projects, eq(t.projects.id, t.projectFiles.projectId))
    .where(and(eq(t.projects.clientId, clientId), eq(t.projectFiles.visibleToClient, true)))
    .orderBy(desc(t.projectFiles.uploadedAt));
  return rows.map((row) => ({ ...row, uploadedAt: iso(row.uploadedAt) }));
}

export async function selectApprovalsForClient(clientId: string): Promise<Approval[]> {
  const rows = await db()
    .select({
      id: t.approvals.id,
      title: t.approvals.title,
      projectId: t.approvals.projectId,
      version: t.approvals.version,
      status: t.approvals.status,
      submittedAt: t.approvals.submittedAt,
      commentCount: t.approvals.commentCount,
    })
    .from(t.approvals)
    .innerJoin(t.projects, eq(t.projects.id, t.approvals.projectId))
    .where(eq(t.projects.clientId, clientId))
    .orderBy(desc(t.approvals.submittedAt));
  return rows.map((row) => ({ ...row, submittedAt: iso(row.submittedAt) }));
}

export async function selectRevisionsForClient(clientId: string): Promise<Revision[]> {
  const rows = await db()
    .select({
      id: t.revisions.id,
      projectId: t.revisions.projectId,
      title: t.revisions.title,
      priority: t.revisions.priority,
      status: t.revisions.status,
      requestedAt: t.revisions.requestedAt,
      commentCount: t.revisions.commentCount,
    })
    .from(t.revisions)
    .innerJoin(t.projects, eq(t.projects.id, t.revisions.projectId))
    .where(eq(t.projects.clientId, clientId))
    .orderBy(desc(t.revisions.requestedAt));
  return rows.map((row) => ({ ...row, requestedAt: iso(row.requestedAt) }));
}

export async function selectTasksForClient(clientId: string): Promise<Task[]> {
  const rows = await db()
    .select({
      id: t.tasks.id,
      title: t.tasks.title,
      priority: t.tasks.priority,
      dueDate: t.tasks.dueDate,
      assigneeId: t.tasks.assigneeId,
      projectId: t.tasks.projectId,
      completed: t.tasks.completed,
    })
    .from(t.tasks)
    .innerJoin(t.projects, eq(t.projects.id, t.tasks.projectId))
    .where(eq(t.projects.clientId, clientId))
    .orderBy(asc(t.tasks.dueDate));
  return rows;
}

export async function selectInvoicesForClient(clientId: string): Promise<Invoice[]> {
  const rows = await db()
    .select()
    .from(t.invoices)
    .where(eq(t.invoices.clientId, clientId))
    .orderBy(desc(t.invoices.issuedAt));
  return rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    clientId: row.clientId,
    projectId: row.projectId,
    amount: row.amount,
    status: row.status,
    issuedAt: row.issuedAt,
    dueAt: row.dueAt,
    paidAt: row.paidAt,
  }));
}

export async function selectProposalsForClient(clientId: string): Promise<Proposal[]> {
  const rows = await db()
    .select()
    .from(t.proposals)
    .where(eq(t.proposals.clientId, clientId))
    .orderBy(desc(t.proposals.reference));
  return rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    title: row.title,
    clientId: row.clientId,
    service: row.service,
    amount: row.amount,
    status: row.status,
    sentAt: isoOrNull(row.sentAt),
    validUntil: row.validUntil,
  }));
}

export async function selectSupportForClient(clientId: string): Promise<SupportTicket[]> {
  const rows = await db()
    .select()
    .from(t.supportTickets)
    .where(eq(t.supportTickets.clientId, clientId))
    .orderBy(desc(t.supportTickets.openedAt));
  return rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    subject: row.subject,
    clientId: row.clientId,
    priority: row.priority,
    status: row.status,
    openedAt: iso(row.openedAt),
    assigneeId: row.assigneeId,
  }));
}

export async function selectThreadsForClient(clientId: string): Promise<Message[]> {
  const rows = await db()
    .select()
    .from(t.messageThreads)
    .where(eq(t.messageThreads.clientId, clientId))
    .orderBy(desc(t.messageThreads.lastActivityAt));
  return rows.map((row) => ({
    id: row.id,
    subject: row.subject,
    clientId: row.clientId,
    projectId: row.projectId,
    preview: row.preview,
    lastActivityAt: iso(row.lastActivityAt),
    unread: row.unread,
    lastSender: row.lastSender,
  }));
}

/** Thread ownership is re-checked in the join, not assumed from the caller. */
export async function selectEntriesForClientThread(
  clientId: string,
  threadId: string,
): Promise<MessageEntry[]> {
  const rows = await db()
    .select({
      id: t.messageEntries.id,
      threadId: t.messageEntries.threadId,
      from: t.messageEntries.from,
      body: t.messageEntries.body,
      sentAt: t.messageEntries.sentAt,
    })
    .from(t.messageEntries)
    .innerJoin(t.messageThreads, eq(t.messageThreads.id, t.messageEntries.threadId))
    .where(and(eq(t.messageThreads.clientId, clientId), eq(t.messageEntries.threadId, threadId)))
    .orderBy(asc(t.messageEntries.sentAt));
  return rows.map((row) => ({ ...row, sentAt: iso(row.sentAt) }));
}

/* -------------------------------------------------------------------------- */
/* Writes                                                                      */
/* -------------------------------------------------------------------------- */

export async function insertLead(lead: Lead): Promise<void> {
  await db()
    .insert(t.leads)
    .values({
      ...lead,
      submittedAt: new Date(lead.submittedAt),
    });
}

/**
 * Both rows in one transaction. A consultation whose lead failed to insert
 * would be an orphaned meeting with no contact details.
 */
export async function insertBooking(consultation: Consultation, lead: Lead): Promise<void> {
  await db().transaction(async (tx) => {
    await tx.insert(t.leads).values({ ...lead, submittedAt: new Date(lead.submittedAt) });
    await tx.insert(t.consultations).values(consultation);
  });
}

/** Idempotent: re-subscribing an existing address is a no-op, not an error. */
export async function insertSubscriber(subscriber: Subscriber): Promise<void> {
  await db()
    .insert(t.subscribers)
    .values({ ...subscriber, subscribedAt: new Date(subscriber.subscribedAt) })
    .onConflictDoNothing({ target: t.subscribers.email });
}

/* -------------------------------------------------------------------------- */
/* Health                                                                      */
/* -------------------------------------------------------------------------- */

/** Confirms the database is reachable and migrated. Used by system status. */
export async function checkConnection(): Promise<{ ok: boolean; detail?: string }> {
  try {
    await db().select().from(t.teamMembers).limit(1);
    return { ok: true };
  } catch (error) {
    return { ok: false, detail: (error as Error).message };
  }
}

export { and, eq };
