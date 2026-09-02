/**
 * ============================================================================
 * ADMIN DATA ACCESS
 * ============================================================================
 *
 * The ONLY module that knows where admin data comes from. Every component and
 * page reads through these functions, so replacing the demo fixtures with real
 * queries is a change confined to this file.
 *
 * All functions are async and return plain serialisable objects, so they
 * already have the shape a database call would have — no signature changes are
 * needed when `DATABASE_URL` is wired up.
 *
 * TO CONNECT A DATABASE
 * ---------------------
 *   1. Set DATABASE_URL (see .env.example).
 *   2. Implement the queries inside each `if (isLive())` branch below.
 *   3. Delete nothing else. The UI is already written against these signatures.
 *
 * SERVER-ONLY. These functions read `process.env` and, once connected, will
 * hold database credentials. They must only ever be called from Server
 * Components, Route Handlers or Server Actions — never imported into a file
 * carrying "use client". Client components receive the results as props.
 */

import {
  demoActivity,
  demoApprovals,
  demoClients,
  demoConsultations,
  demoContent,
  demoFiles,
  demoInvoices,
  demoLeadSources,
  demoLeads,
  demoMessageEntries,
  demoMessages,
  demoMilestones,
  demoProjects,
  demoProposals,
  demoRevenueSeries,
  demoRevisions,
  demoSubscribers,
  demoSupportTickets,
  demoTasks,
  demoTeam,
} from "@/data/demo-data";
import * as q from "@/lib/db/queries";
import { getStore, submissionsArePersisted } from "@/lib/domain/store";
import { integrationStatus } from "@/lib/integrations";
import type {
  ActivityEvent,
  Approval,
  Client,
  Consultation,
  ContentItem,
  Invoice,
  Lead,
  LeadSourcePoint,
  Message,
  MessageEntry,
  Milestone,
  Project,
  ProjectFile,
  Proposal,
  PhaseStep,
  ProjectPhase,
  RevenuePoint,
  Revision,
  Subscriber,
  SupportTicket,
  Task,
  TeamMemberRecord,
} from "@/lib/domain/types";
import { PROJECT_PHASES } from "@/lib/domain/types";

/**
 * True once a database is configured. While false, every read below returns
 * demo fixtures and the UI shows its demo banner.
 */
export function isLive(): boolean {
  return integrationStatus.database();
}

/** Whether the admin is currently showing invented data. */
export function isDemoData(): boolean {
  return !isLive();
}

/**
 * Defensive copy. Callers get their own array, so a component that sorts or
 * mutates a result can never corrupt the module-level fixtures for the next
 * request — a real hazard in a long-lived server process.
 */
function copy<T>(rows: readonly T[]): T[] {
  return rows.map((row) => ({ ...row }));
}

/* -------------------------------------------------------------------------- */
/* Team                                                                        */
/* -------------------------------------------------------------------------- */

export async function getTeam(): Promise<TeamMemberRecord[]> {
  return isLive() ? q.selectTeam() : copy(demoTeam);
}

export async function getTeamMember(id: string): Promise<TeamMemberRecord | null> {
  const team = await getTeam();
  return team.find((member) => member.id === id) ?? null;
}

/**
 * Name lookup for rendering assignees. Returns null rather than a placeholder
 * string so callers decide how an unassigned record should read.
 */
export async function getTeamLookup(): Promise<Map<string, TeamMemberRecord>> {
  const team = await getTeam();
  return new Map(team.map((member) => [member.id, member]));
}

/* -------------------------------------------------------------------------- */
/* Leads                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Captured submissions first, then the demo fixtures.
 *
 * Anything a real person submitted through the website outranks invented
 * sample data, so a genuine enquiry is never buried below it. Once a database
 * is configured the fixtures drop away entirely.
 */
export async function getLeads(): Promise<Lead[]> {
  if (isLive()) return q.selectLeads();
  const { leads } = await getStore().read();
  const captured = leads.slice().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  return [...captured, ...copy(demoLeads)];
}

export async function getLead(id: string): Promise<Lead | null> {
  const leads = await getLeads();
  return leads.find((lead) => lead.id === id) ?? null;
}

/* -------------------------------------------------------------------------- */
/* Consultations                                                               */
/* -------------------------------------------------------------------------- */

export async function getConsultations(): Promise<Consultation[]> {
  if (isLive()) return q.selectConsultations();
  const { consultations } = await getStore().read();
  return [...consultations, ...copy(demoConsultations)];
}

/** Sorted soonest-first, excluding anything already finished or cancelled. */
export async function getUpcomingConsultations(limit?: number): Promise<Consultation[]> {
  const all = await getConsultations();
  const upcoming = all
    .filter((c) => c.status === "Confirmed" || c.status === "Pending")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/* -------------------------------------------------------------------------- */
/* Clients                                                                     */
/* -------------------------------------------------------------------------- */

export async function getClients(): Promise<Client[]> {
  return isLive() ? q.selectClients() : copy(demoClients);
}

export async function getClient(id: string): Promise<Client | null> {
  const clients = await getClients();
  return clients.find((client) => client.id === id) ?? null;
}

export async function getClientLookup(): Promise<Map<string, Client>> {
  const clients = await getClients();
  return new Map(clients.map((client) => [client.id, client]));
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Projects, with `nextMilestone` derived from the milestone list rather than
 * stored. A hand-written value would eventually contradict the milestones a
 * client sees in their portal.
 */
export async function getProjects(): Promise<Project[]> {
  const [records, milestones] = await Promise.all([
    isLive() ? q.selectProjects() : copy(demoProjects),
    getMilestones(),
  ]);
  return records.map((project) => ({
    ...project,
    nextMilestone:
      milestones.find(
        (milestone) => milestone.projectId === project.id && milestone.status !== "Completed",
      )?.name ?? null,
  }));
}

/* -------------------------------------------------------------------------- */
/* Milestones & revisions                                                      */
/* -------------------------------------------------------------------------- */

export async function getMilestones(): Promise<Milestone[]> {
  return isLive() ? q.selectMilestones() : copy(demoMilestones);
}

export async function getRevisions(): Promise<Revision[]> {
  return isLive() ? q.selectRevisions() : copy(demoRevisions);
}

export async function getMessageEntries(): Promise<MessageEntry[]> {
  return isLive() ? q.selectMessageEntries() : copy(demoMessageEntries);
}

/**
 * The phase stepper shown in the portal, derived from the ordered phase list
 * and the project's current phase. Deriving it means the stepper and the
 * project's `phase` field can never disagree.
 */
export function phaseSteps(current: ProjectPhase): PhaseStep[] {
  const index = PROJECT_PHASES.indexOf(current);
  return PROJECT_PHASES.map((label, position) => ({
    label,
    state:
      position < index ? "complete" : position === index ? "in-progress" : "upcoming",
  }));
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((project) => project.id === id) ?? null;
}

export async function getActiveProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.status !== "Completed");
}

export async function getProjectLookup(): Promise<Map<string, Project>> {
  const projects = await getProjects();
  return new Map(projects.map((project) => [project.id, project]));
}

/* -------------------------------------------------------------------------- */
/* Tasks                                                                       */
/* -------------------------------------------------------------------------- */

export async function getTasks(): Promise<Task[]> {
  return isLive() ? q.selectTasks() : copy(demoTasks);
}

/** Outstanding tasks, highest priority and soonest due first. */
export async function getTasksNeedingAttention(limit?: number): Promise<Task[]> {
  const order = { High: 0, Medium: 1, Low: 2 } as const;
  const open = (await getTasks())
    .filter((task) => !task.completed)
    .sort(
      (a, b) => order[a.priority] - order[b.priority] || a.dueDate.localeCompare(b.dueDate),
    );
  return limit ? open.slice(0, limit) : open;
}

/* -------------------------------------------------------------------------- */
/* Workflow                                                                    */
/* -------------------------------------------------------------------------- */

export async function getApprovals(): Promise<Approval[]> {
  return isLive() ? q.selectApprovals() : copy(demoApprovals);
}

export async function getPendingApprovals(): Promise<Approval[]> {
  const approvals = await getApprovals();
  return approvals.filter((approval) => approval.status === "Awaiting Client");
}

export async function getMessages(): Promise<Message[]> {
  return isLive() ? q.selectMessages() : copy(demoMessages);
}

export async function getProposals(): Promise<Proposal[]> {
  return isLive() ? q.selectProposals() : copy(demoProposals);
}

export async function getInvoices(): Promise<Invoice[]> {
  return isLive() ? q.selectInvoices() : copy(demoInvoices);
}

export async function getOutstandingInvoices(): Promise<Invoice[]> {
  const invoices = await getInvoices();
  return invoices.filter((invoice) => invoice.status === "Sent" || invoice.status === "Overdue");
}

export async function getFiles(): Promise<ProjectFile[]> {
  return isLive() ? q.selectFiles() : copy(demoFiles);
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
  return isLive() ? q.selectSupportTickets() : copy(demoSupportTickets);
}

export async function getOpenSupportTickets(): Promise<SupportTicket[]> {
  const tickets = await getSupportTickets();
  return tickets.filter((ticket) => ticket.status !== "Resolved");
}

/* -------------------------------------------------------------------------- */
/* Activity & analytics                                                        */
/* -------------------------------------------------------------------------- */

export async function getActivity(limit?: number): Promise<ActivityEvent[]> {
  const events = (isLive() ? await q.selectActivity() : copy(demoActivity)).sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  );
  return limit ? events.slice(0, limit) : events;
}

/*
 * These two were the last readers in this file with no `isLive()` guard, which
 * meant a configured database swapped every other panel to real records while
 * the dashboard and analytics charts kept serving fixtures — with the demo
 * banner switched off, and under a notice claiming the figures came from this
 * admin's own records.
 *
 * There is no query behind either one yet: revenue has to be derived from
 * invoices, and lead source from a field the lead capture does not record. So
 * live returns EMPTY rather than inventing a shape, and both charts draw their
 * own "not available" state. A blank panel is a fact about what we know; a
 * plausible curve is a claim, and this is the one place in the product where a
 * wrong number would be read as money.
 */
export async function getRevenueSeries(): Promise<RevenuePoint[]> {
  return isLive() ? [] : copy(demoRevenueSeries);
}

export async function getLeadSources(): Promise<LeadSourcePoint[]> {
  return isLive() ? [] : copy(demoLeadSources);
}

/* -------------------------------------------------------------------------- */
/* Website content                                                             */
/* -------------------------------------------------------------------------- */

export async function getContent(): Promise<ContentItem[]> {
  return isLive() ? q.selectContent() : copy(demoContent);
}

export async function getSubscribers(): Promise<Subscriber[]> {
  if (isLive()) return q.selectSubscribers();
  const { subscribers } = await getStore().read();
  return [...subscribers, ...copy(demoSubscribers)];
}

/* -------------------------------------------------------------------------- */
/* Dashboard summary                                                           */
/* -------------------------------------------------------------------------- */

export interface DashboardSummary {
  newLeads: number;
  /** Leads created in the previous comparable window, for the delta. */
  newLeadsPrevious: number;
  consultations: number;
  activeProjects: number;
  pendingApprovals: number;
  outstandingInvoices: number;
  outstandingInvoiceTotal: number;
  openSupportRequests: number;
}

/**
 * Every figure is derived from the records above rather than hardcoded, so a
 * summary card can never contradict the table it links to.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [leads, consultations, projects, approvals, invoices, tickets] = await Promise.all([
    getLeads(),
    getUpcomingConsultations(),
    getActiveProjects(),
    getPendingApprovals(),
    getOutstandingInvoices(),
    getOpenSupportTickets(),
  ]);

  const newLeads = leads.filter((lead) => lead.stage === "New").length;

  return {
    newLeads,
    /*
     * The previous window is not queried yet, so live reports it as unknown
     * (-1) and the dashboard omits the trend rather than comparing against a
     * hardcoded 1 — which produced a real-looking percentage swing out of a
     * number nobody measured.
     */
    newLeadsPrevious: isLive() ? -1 : 1,
    consultations: consultations.length,
    activeProjects: projects.length,
    pendingApprovals: approvals.length,
    outstandingInvoices: invoices.length,
    outstandingInvoiceTotal: invoices.reduce((sum, invoice) => sum + invoice.amount, 0),
    openSupportRequests: tickets.length,
  };
}

/* -------------------------------------------------------------------------- */
/* System status                                                               */
/* -------------------------------------------------------------------------- */

export interface SystemService {
  label: string;
  configured: boolean;
  /** What to set to enable it. Shown verbatim in the UI. */
  requires: string;
}

/**
 * Reports what is ACTUALLY configured. Never claims an integration works.
 */
export function getSystemStatus(): SystemService[] {
  return [
    { label: "Database", configured: integrationStatus.database(), requires: "DATABASE_URL" },
    {
      label: "Submission capture",
      configured: submissionsArePersisted(),
      requires: "DATABASE_URL (a development file store is used locally)",
    },
    { label: "Authentication", configured: integrationStatus.auth(), requires: "AUTH_SECRET, AUTH_PROVIDER_URL" },
    { label: "Email delivery", configured: integrationStatus.email(), requires: "EMAIL_API_KEY, EMAIL_TO_ADDRESS" },
    { label: "Calendar", configured: integrationStatus.calendar(), requires: "CALENDAR_API_KEY" },
    { label: "File storage", configured: integrationStatus.storage(), requires: "STORAGE_BUCKET, STORAGE_ACCESS_KEY" },
    { label: "Payments", configured: integrationStatus.payments(), requires: "PAYMENTS_SECRET_KEY" },
    { label: "Analytics", configured: integrationStatus.analytics(), requires: "NEXT_PUBLIC_ANALYTICS_ID" },
  ];
}
