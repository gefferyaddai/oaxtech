/**
 * ============================================================================
 * CLIENT PORTAL DATA ACCESS — SCOPED TO ONE CLIENT
 * ============================================================================
 *
 * The portal reads the SAME records as the admin (`src/lib/domain/repository`),
 * filtered down to the signed-in client. There is no separate portal dataset —
 * when a client approves a design here, the admin is looking at that record.
 *
 * EVERY function takes a `clientId` as its first argument. That is deliberate
 * and must stay that way: it makes it impossible to write a portal query that
 * forgets to scope itself. The id comes from the session
 * (`getSession().clientId`), never from a URL or a form field — otherwise one
 * client could read another's data by editing a parameter.
 *
 * SERVER-ONLY. Call these from Server Components or Server Actions and pass the
 * results into client components as props.
 */

import * as q from "@/lib/db/queries";
import * as domain from "@/lib/domain/repository";
import { isLive } from "@/lib/domain/repository";
import type {
  ActivityEvent,
  Approval,
  Client,
  FileFolder,
  Invoice,
  Message,
  MessageEntry,
  Milestone,
  PhaseStep,
  Project,
  ProjectFile,
  Proposal,
  Revision,
  SupportTicket,
  Task,
} from "@/lib/domain/types";
import { FILE_FOLDERS } from "@/lib/domain/types";
import { integrationStatus } from "@/lib/integrations";

export { isDemoData } from "@/lib/domain/repository";

/* -------------------------------------------------------------------------- */
/* Client & projects                                                           */
/* -------------------------------------------------------------------------- */

export async function getClientProfile(clientId: string): Promise<Client | null> {
  return domain.getClient(clientId);
}

export async function getClientProjects(clientId: string): Promise<Project[]> {
  if (isLive()) {
    const [records, milestones] = await Promise.all([
      q.selectProjectsForClient(clientId),
      getClientMilestones(clientId),
    ]);
    return records.map((project) => ({
      ...project,
      nextMilestone:
        milestones.find((m) => m.projectId === project.id && m.status !== "Completed")?.name ??
        null,
    }));
  }
  const projects = await domain.getProjects();
  return projects.filter((project) => project.clientId === clientId);
}

/**
 * The project the portal defaults to. A client with several projects gets the
 * most advanced in-flight one; a client with none gets null, and every widget
 * renders its empty state rather than throwing.
 */
export async function getPrimaryProject(clientId: string): Promise<Project | null> {
  const projects = await getClientProjects(clientId);
  const active = projects.filter((project) => project.status !== "Completed");
  return (active[0] ?? projects[0]) ?? null;
}

/** Ids of every project belonging to this client, for scoping child records. */
async function projectIds(clientId: string): Promise<Set<string>> {
  const projects = await getClientProjects(clientId);
  return new Set(projects.map((project) => project.id));
}

export async function getPhaseSteps(clientId: string): Promise<PhaseStep[]> {
  const project = await getPrimaryProject(clientId);
  return project ? domain.phaseSteps(project.phase) : [];
}

/* -------------------------------------------------------------------------- */
/* Project children                                                            */
/* -------------------------------------------------------------------------- */

export async function getClientMilestones(clientId: string): Promise<Milestone[]> {
  if (isLive()) return q.selectMilestonesForClient(clientId);
  const ids = await projectIds(clientId);
  const milestones = await domain.getMilestones();
  return milestones.filter((milestone) => ids.has(milestone.projectId));
}

export async function getClientTasks(clientId: string): Promise<Task[]> {
  if (isLive()) return q.selectTasksForClient(clientId);
  const ids = await projectIds(clientId);
  const tasks = await domain.getTasks();
  return tasks.filter((task) => task.projectId && ids.has(task.projectId));
}

export async function getClientApprovals(clientId: string): Promise<Approval[]> {
  if (isLive()) return q.selectApprovalsForClient(clientId);
  const ids = await projectIds(clientId);
  const approvals = await domain.getApprovals();
  return approvals.filter((approval) => ids.has(approval.projectId));
}

export async function getClientRevisions(clientId: string): Promise<Revision[]> {
  if (isLive()) return q.selectRevisionsForClient(clientId);
  const ids = await projectIds(clientId);
  const revisions = await domain.getRevisions();
  return revisions.filter((revision) => ids.has(revision.projectId));
}

/**
 * Files the client is allowed to see. The `visibleToClient` filter is a
 * security boundary, not a display preference — an internal working file must
 * never be returned here.
 */
export async function getClientFiles(clientId: string): Promise<ProjectFile[]> {
  if (isLive()) return q.selectFilesForClient(clientId);
  const ids = await projectIds(clientId);
  const files = await domain.getFiles();
  return files.filter((file) => ids.has(file.projectId) && file.visibleToClient);
}

export interface FolderSummary {
  name: FileFolder;
  fileCount: number;
}

/** Folder counts, derived from the client's visible files. */
export async function getClientFolders(clientId: string): Promise<FolderSummary[]> {
  const files = await getClientFiles(clientId);
  return FILE_FOLDERS.map((name) => ({
    name,
    fileCount: files.filter((file) => file.folder === name).length,
  }));
}

/* -------------------------------------------------------------------------- */
/* Communication & billing                                                     */
/* -------------------------------------------------------------------------- */

export async function getClientThreads(clientId: string): Promise<Message[]> {
  if (isLive()) return q.selectThreadsForClient(clientId);
  const messages = await domain.getMessages();
  return messages
    .filter((message) => message.clientId === clientId)
    .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
}

export async function getThreadEntries(
  clientId: string,
  threadId: string,
): Promise<MessageEntry[]> {
  if (isLive()) return q.selectEntriesForClientThread(clientId, threadId);
  // Verify the thread belongs to this client before returning its contents.
  const threads = await getClientThreads(clientId);
  if (!threads.some((thread) => thread.id === threadId)) return [];
  const entries = await domain.getMessageEntries();
  return entries
    .filter((entry) => entry.threadId === threadId)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

export async function getClientProposals(clientId: string): Promise<Proposal[]> {
  if (isLive()) return q.selectProposalsForClient(clientId);
  const proposals = await domain.getProposals();
  return proposals.filter((proposal) => proposal.clientId === clientId);
}

export async function getClientInvoices(clientId: string): Promise<Invoice[]> {
  if (isLive()) return q.selectInvoicesForClient(clientId);
  const invoices = await domain.getInvoices();
  return invoices.filter((invoice) => invoice.clientId === clientId);
}

/**
 * Whether the portal may show invoice amounts.
 *
 * With no payment processor connected there is no billing relationship behind
 * these numbers, so the portal withholds them rather than implying one exists.
 * Once PAYMENTS_SECRET_KEY is set, amounts appear.
 */
export function canShowInvoiceAmounts(): boolean {
  return integrationStatus.payments();
}

export async function getClientSupportTickets(clientId: string): Promise<SupportTicket[]> {
  if (isLive()) return q.selectSupportForClient(clientId);
  const tickets = await domain.getSupportTickets();
  return tickets.filter((ticket) => ticket.clientId === clientId);
}

/* -------------------------------------------------------------------------- */
/* Activity                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Activity relevant to this client. The org-wide feed contains events about
 * other clients, so it is filtered by the client's own display name — with a
 * database this becomes a `WHERE client_id = ?`.
 */
export async function getClientActivity(
  clientId: string,
  limit?: number,
): Promise<ActivityEvent[]> {
  // With a database the events carry a client_id, so this is a real WHERE.
  if (isLive()) {
    const events = await q.selectActivityForClient(clientId);
    return limit ? events.slice(0, limit) : events;
  }
  const [client, events] = await Promise.all([getClientProfile(clientId), domain.getActivity()]);
  if (!client) return [];
  const mine = events.filter((event) => event.actor === client.name);
  return limit ? mine.slice(0, limit) : mine;
}
