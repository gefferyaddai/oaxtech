"use client";

import Link from "next/link";
import { Avatar, ProgressBar } from "@/components/admin/primitives";
import { ResourcePage } from "@/components/admin/ResourcePage";
import type { Column } from "@/components/admin/controls";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge, type BadgeTone } from "@/components/ui/StatusBadge";
import { formatBytes, formatDate, formatMoneyPrecise, formatRelative, formatTime } from "@/lib/admin/format";
import {
  INVOICE_STATUS_TONE,
  LEAD_STAGES,
  PRIORITIES,
  type AdminFile,
  type Approval,
  type Client,
  type Consultation,
  type ContentItem,
  type Invoice,
  type Lead,
  type Message,
  type Priority,
  type Proposal,
  type SupportTicket,
  type Task,
  type TeamMemberRecord,
} from "@/lib/admin/types";

/** Shared lookup helper — every view needs to resolve ids to display names. */
function lookup<T extends { id: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.id, row]));
}

const PRIORITY_TONE: Record<Priority, BadgeTone> = {
  High: "danger",
  Medium: "warning",
  Low: "neutral",
};

function Muted() {
  return <span className="text-muted">—</span>;
}

/* -------------------------------------------------------------------------- */
/* Leads                                                                       */
/* -------------------------------------------------------------------------- */

export function LeadsView({
  leads,
  team,
  autoOpenCreate,
}: {
  leads: Lead[];
  team: TeamMemberRecord[];
  autoOpenCreate?: boolean;
}) {
  const members = lookup(team);

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Lead",
      sortValue: (row) => row.company ?? row.name,
      cell: (row) => (
        <Link href={`/admin/leads/${row.id}`} className="font-medium text-ink hover:text-cobalt">
          {row.company ?? row.name}
        </Link>
      ),
    },
    { key: "service", header: "Service", sortValue: (row) => row.service, hideBelow: "md", cell: (row) => <span className="text-slate">{row.service}</span> },
    { key: "budget", header: "Budget", hideBelow: "lg", cell: (row) => (row.budget ? <span className="whitespace-nowrap text-slate">{row.budget}</span> : <Muted />) },
    { key: "stage", header: "Stage", sortValue: (row) => row.stage, cell: (row) => <StatusBadge tone={row.stage === "Converted" ? "success" : "info"}>{row.stage}</StatusBadge> },
    { key: "source", header: "Source", sortValue: (row) => row.source, hideBelow: "xl", cell: (row) => <span className="text-slate">{row.source}</span> },
    {
      key: "assignee",
      header: "Owner",
      hideBelow: "sm",
      cell: (row) => {
        const member = row.assigneeId ? members.get(row.assigneeId) : null;
        return member ? <Avatar initials={member.initials} name={member.name} /> : <span className="text-2xs text-muted">Unassigned</span>;
      },
    },
    { key: "submitted", header: "Received", sortValue: (row) => row.submittedAt, cell: (row) => <span className="whitespace-nowrap text-slate">{formatDate(row.submittedAt)}</span> },
  ];

  return (
    <ResourcePage
      title="Leads"
      description="Enquiries from the website's quote, contact and booking forms."
      rows={leads}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => `${row.name} ${row.company ?? ""} ${row.service} ${row.email}`}
      searchPlaceholder="Search by name, company or service…"
      filter={{ label: "Filter by stage", options: LEAD_STAGES, allLabel: "All stages", match: (row) => row.stage }}
      createLabel="Add Lead"
      createDescription="Record an enquiry that arrived outside the website forms."
      emptyTitle="No leads yet"
      emptyDescription="Quote requests, contact messages and consultation bookings appear here automatically."
      emptyIcon="Target"
      minWidth="56rem"
      autoOpenCreate={autoOpenCreate}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Consultations                                                               */
/* -------------------------------------------------------------------------- */

export function ConsultationsView({ consultations }: { consultations: Consultation[] }) {
  const columns: Column<Consultation>[] = [
    { key: "date", header: "Date", sortValue: (row) => `${row.date}T${row.time}`, cell: (row) => <span className="whitespace-nowrap font-medium text-ink">{formatDate(row.date)}</span> },
    { key: "time", header: "Time", cell: (row) => <span className="whitespace-nowrap text-slate">{formatTime(row.time)}</span> },
    { key: "contact", header: "Client or lead", sortValue: (row) => row.company ?? row.contactName, cell: (row) => <span className="text-ink">{row.company ?? row.contactName}</span> },
    { key: "service", header: "Service", hideBelow: "md", cell: (row) => <span className="text-slate">{row.service}</span> },
    { key: "status", header: "Status", sortValue: (row) => row.status, cell: (row) => <StatusBadge tone={row.status === "Confirmed" ? "success" : row.status === "Cancelled" ? "danger" : "warning"} showIcon>{row.status}</StatusBadge> },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (row) =>
        row.meetingUrl ? (
          <a href={row.meetingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">Join</a>
        ) : (
          <button type="button" disabled title="No meeting link — connect a calendar provider (CALENDAR_API_KEY)" className="btn btn-sm btn-neutral disabled:cursor-not-allowed disabled:opacity-55">Join</button>
        ),
    },
  ];

  return (
    <ResourcePage
      title="Consultations"
      description="Discovery calls booked through the website."
      rows={consultations}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => `${row.contactName} ${row.company ?? ""} ${row.service}`}
      searchPlaceholder="Search by client or service…"
      filter={{ label: "Filter by status", options: ["Confirmed", "Pending", "Cancelled", "Completed"], allLabel: "All statuses", match: (row) => row.status }}
      createLabel="Add Consultation"
      createDescription="Schedule a call booked outside the website."
      emptyTitle="No consultations booked"
      emptyDescription="Bookings from the website's consultation form appear here."
      emptyIcon="Calendar"
      minWidth="48rem"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Clients                                                                     */
/* -------------------------------------------------------------------------- */

export function ClientsView({ clients, autoOpenCreate }: { clients: Client[]; autoOpenCreate?: boolean }) {
  const columns: Column<Client>[] = [
    { key: "name", header: "Client", sortValue: (row) => row.name, cell: (row) => <Link href={`/admin/clients/${row.id}`} className="font-medium text-ink hover:text-cobalt">{row.name}</Link> },
    { key: "contact", header: "Contact", hideBelow: "md", cell: (row) => <span className="text-slate">{row.contactName}</span> },
    { key: "industry", header: "Industry", hideBelow: "xl", cell: (row) => (row.industry ? <span className="text-slate">{row.industry}</span> : <Muted />) },
    { key: "projects", header: "Projects", sortValue: (row) => row.activeProjects, align: "right", hideBelow: "sm", cell: (row) => <span className="tabular-nums text-slate">{row.activeProjects}</span> },
    { key: "since", header: "Client since", sortValue: (row) => row.since, hideBelow: "lg", cell: (row) => <span className="whitespace-nowrap text-slate">{formatDate(row.since)}</span> },
    { key: "status", header: "Status", sortValue: (row) => row.status, cell: (row) => <StatusBadge tone={row.status === "Active" ? "success" : row.status === "Archived" ? "neutral" : "info"}>{row.status}</StatusBadge> },
  ];

  return (
    <ResourcePage
      title="Clients"
      description="Organisations with an active or past engagement."
      rows={clients}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => `${row.name} ${row.contactName} ${row.industry ?? ""}`}
      searchPlaceholder="Search by client or contact…"
      filter={{ label: "Filter by status", options: ["Active", "Prospect", "Dormant", "Archived"], allLabel: "All statuses", match: (row) => row.status }}
      createLabel="Add Client"
      createDescription="Convert a lead or add an existing client."
      emptyTitle="No clients yet"
      emptyDescription="Converted leads become clients and appear here."
      emptyIcon="Users"
      minWidth="52rem"
      autoOpenCreate={autoOpenCreate}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Tasks                                                                       */
/* -------------------------------------------------------------------------- */

export function TasksView({ tasks, team, projects }: { tasks: Task[]; team: TeamMemberRecord[]; projects: { id: string; name: string }[] }) {
  const members = lookup(team);
  const projectById = lookup(projects);

  const columns: Column<Task>[] = [
    { key: "title", header: "Task", sortValue: (row) => row.title, cell: (row) => <span className={row.completed ? "text-muted line-through" : "text-ink"}>{row.title}</span> },
    { key: "priority", header: "Priority", sortValue: (row) => PRIORITIES.indexOf(row.priority), cell: (row) => <StatusBadge tone={PRIORITY_TONE[row.priority]}>{row.priority}</StatusBadge> },
    { key: "due", header: "Due", sortValue: (row) => row.dueDate, cell: (row) => <span className="whitespace-nowrap text-slate">{formatDate(row.dueDate)}</span> },
    { key: "assignee", header: "Assigned", hideBelow: "sm", cell: (row) => { const m = members.get(row.assigneeId); return m ? <Avatar initials={m.initials} name={m.name} /> : <Muted />; } },
    { key: "project", header: "Project", hideBelow: "md", cell: (row) => { const p = row.projectId ? projectById.get(row.projectId) : null; return p ? <Link href={`/admin/projects/${p.id}`} className="text-slate hover:text-cobalt">{p.name}</Link> : <Muted />; } },
    { key: "state", header: "State", sortValue: (row) => String(row.completed), cell: (row) => <StatusBadge tone={row.completed ? "success" : "neutral"}>{row.completed ? "Complete" : "Open"}</StatusBadge> },
  ];

  return (
    <ResourcePage
      title="Tasks"
      description="Work assigned across active projects."
      rows={tasks}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => row.title}
      searchPlaceholder="Search tasks…"
      filter={{ label: "Filter by priority", options: PRIORITIES, allLabel: "All priorities", match: (row) => row.priority }}
      createLabel="Add Task"
      createDescription="Create a task and assign it to a team member."
      emptyTitle="No tasks"
      emptyDescription="Tasks created against projects appear here."
      emptyIcon="ClipboardCheck"
      minWidth="52rem"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Approvals                                                                   */
/* -------------------------------------------------------------------------- */

export function ApprovalsView({ approvals, projects }: { approvals: Approval[]; projects: { id: string; name: string }[] }) {
  const projectById = lookup(projects);

  const columns: Column<Approval>[] = [
    { key: "title", header: "Item", sortValue: (row) => row.title, cell: (row) => <span className="font-medium text-ink">{row.title}</span> },
    { key: "version", header: "Version", cell: (row) => <span className="text-slate">{row.version}</span> },
    { key: "project", header: "Project", hideBelow: "md", cell: (row) => { const p = projectById.get(row.projectId); return p ? <Link href={`/admin/projects/${p.id}`} className="text-slate hover:text-cobalt">{p.name}</Link> : <Muted />; } },
    { key: "status", header: "Status", sortValue: (row) => row.status, cell: (row) => <StatusBadge tone={row.status === "Approved" ? "success" : row.status === "Changes Requested" ? "warning" : "info"} showIcon>{row.status}</StatusBadge> },
    { key: "comments", header: "Comments", align: "right", sortValue: (row) => row.commentCount, hideBelow: "sm", cell: (row) => <span className="tabular-nums text-slate">{row.commentCount}</span> },
    { key: "submitted", header: "Submitted", sortValue: (row) => row.submittedAt, hideBelow: "lg", cell: (row) => <span className="whitespace-nowrap text-slate">{formatDate(row.submittedAt)}</span> },
  ];

  return (
    <ResourcePage
      title="Approvals"
      description="Design and deliverable sign-offs awaiting a client decision."
      rows={approvals}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => row.title}
      searchPlaceholder="Search approvals…"
      filter={{ label: "Filter by status", options: ["Awaiting Client", "Approved", "Changes Requested"], allLabel: "All statuses", match: (row) => row.status }}
      createLabel="Request Approval"
      createDescription="Send a deliverable to a client for sign-off."
      emptyTitle="Nothing awaiting approval"
      emptyDescription="Items sent to clients for sign-off appear here."
      emptyIcon="CheckSquare"
      minWidth="52rem"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Messages                                                                    */
/* -------------------------------------------------------------------------- */

export function MessagesView({ messages, clients }: { messages: Message[]; clients: Client[] }) {
  const clientById = lookup(clients);

  const columns: Column<Message>[] = [
    { key: "subject", header: "Subject", sortValue: (row) => row.subject, cell: (row) => (<span className="flex items-center gap-2">{row.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt" aria-label="Unread" />}<span className={row.unread ? "font-medium text-ink" : "text-ink"}>{row.subject}</span></span>) },
    { key: "client", header: "Client", hideBelow: "md", cell: (row) => { const c = clientById.get(row.clientId); return c ? <Link href={`/admin/clients/${c.id}`} className="text-slate hover:text-cobalt">{c.name}</Link> : <Muted />; } },
    { key: "preview", header: "Latest", hideBelow: "xl", className: "max-w-xs", cell: (row) => <span className="block truncate text-slate">{row.preview}</span> },
    { key: "sender", header: "From", hideBelow: "sm", cell: (row) => <span className="text-slate">{row.lastSender === "client" ? "Client" : "Team"}</span> },
    { key: "activity", header: "Updated", sortValue: (row) => row.lastActivityAt, cell: (row) => <span className="whitespace-nowrap text-slate">{formatRelative(row.lastActivityAt)}</span> },
  ];

  return (
    <ResourcePage
      title="Messages"
      description="Conversations with clients across their projects."
      rows={messages}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => `${row.subject} ${row.preview}`}
      searchPlaceholder="Search messages…"
      filter={{ label: "Filter by sender", options: ["Client", "Team"], allLabel: "Anyone", match: (row) => (row.lastSender === "client" ? "Client" : "Team") }}
      createLabel="New Message"
      createDescription="Start a conversation with a client."
      emptyTitle="No messages"
      emptyDescription="Client conversations appear here."
      emptyIcon="MessageSquare"
      minWidth="52rem"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Proposals                                                                   */
/* -------------------------------------------------------------------------- */

export function ProposalsView({ proposals, clients, autoOpenCreate }: { proposals: Proposal[]; clients: Client[]; autoOpenCreate?: boolean }) {
  const clientById = lookup(clients);

  const columns: Column<Proposal>[] = [
    { key: "reference", header: "Reference", sortValue: (row) => row.reference, cell: (row) => <span className="font-medium tabular-nums text-ink">{row.reference}</span> },
    { key: "client", header: "Client", hideBelow: "sm", cell: (row) => { const c = clientById.get(row.clientId); return c ? <Link href={`/admin/clients/${c.id}`} className="text-slate hover:text-cobalt">{c.name}</Link> : <Muted />; } },
    { key: "service", header: "Service", hideBelow: "xl", cell: (row) => <span className="text-slate">{row.service}</span> },
    { key: "amount", header: "Amount", align: "right", sortValue: (row) => row.amount, cell: (row) => <span className="whitespace-nowrap tabular-nums text-ink">{formatMoneyPrecise(row.amount)}</span> },
    { key: "status", header: "Status", sortValue: (row) => row.status, cell: (row) => <StatusBadge tone={row.status === "Accepted" ? "success" : row.status === "Declined" ? "danger" : row.status === "Draft" ? "neutral" : "info"}>{row.status}</StatusBadge> },
    { key: "sent", header: "Sent", sortValue: (row) => row.sentAt ?? "", hideBelow: "lg", cell: (row) => (row.sentAt ? <span className="whitespace-nowrap text-slate">{formatDate(row.sentAt)}</span> : <Muted />) },
  ];

  return (
    <ResourcePage
      title="Proposals"
      description="Quotes issued to clients and prospects."
      rows={proposals}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => `${row.reference} ${row.service}`}
      searchPlaceholder="Search proposals…"
      filter={{ label: "Filter by status", options: ["Draft", "Sent", "Viewed", "Accepted", "Declined"], allLabel: "All statuses", match: (row) => row.status }}
      createLabel="Send Proposal"
      createDescription="Draft a proposal for review before it is sent."
      emptyTitle="No proposals"
      emptyDescription="Proposals issued to clients appear here."
      emptyIcon="FileText"
      minWidth="52rem"
      autoOpenCreate={autoOpenCreate}
      createNeedsConfirmation
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Invoices                                                                    */
/* -------------------------------------------------------------------------- */

export function InvoicesView({ invoices, clients, autoOpenCreate }: { invoices: Invoice[]; clients: Client[]; autoOpenCreate?: boolean }) {
  const clientById = lookup(clients);

  const columns: Column<Invoice>[] = [
    { key: "reference", header: "Invoice", sortValue: (row) => row.reference, cell: (row) => <span className="font-medium tabular-nums text-ink">{row.reference}</span> },
    { key: "client", header: "Client", hideBelow: "sm", cell: (row) => { const c = clientById.get(row.clientId); return c ? <Link href={`/admin/clients/${c.id}`} className="text-slate hover:text-cobalt">{c.name}</Link> : <Muted />; } },
    { key: "issued", header: "Issued", sortValue: (row) => row.issuedAt, hideBelow: "lg", cell: (row) => <span className="whitespace-nowrap text-slate">{formatDate(row.issuedAt)}</span> },
    { key: "due", header: "Due", sortValue: (row) => row.dueAt, hideBelow: "md", cell: (row) => <span className="whitespace-nowrap text-slate">{formatDate(row.dueAt)}</span> },
    { key: "amount", header: "Amount", align: "right", sortValue: (row) => row.amount, cell: (row) => <span className="whitespace-nowrap tabular-nums text-ink">{formatMoneyPrecise(row.amount)}</span> },
    { key: "status", header: "Status", sortValue: (row) => row.status, cell: (row) => <StatusBadge tone={INVOICE_STATUS_TONE[row.status]} showIcon>{row.status}</StatusBadge> },
  ];

  return (
    <ResourcePage
      title="Invoices"
      description="Billing across all clients and projects."
      rows={invoices}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => row.reference}
      searchPlaceholder="Search by reference…"
      filter={{ label: "Filter by status", options: ["Draft", "Sent", "Paid", "Overdue", "Void"], allLabel: "All statuses", match: (row) => row.status }}
      createLabel="Create Invoice"
      createDescription="Raise an invoice against a project."
      emptyTitle="No invoices"
      emptyDescription="Invoices raised against projects appear here."
      emptyIcon="Receipt"
      minWidth="52rem"
      autoOpenCreate={autoOpenCreate}
      createNeedsConfirmation
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Files                                                                       */
/* -------------------------------------------------------------------------- */

export function FilesView({ files, projects, team }: { files: AdminFile[]; projects: { id: string; name: string }[]; team: TeamMemberRecord[] }) {
  const projectById = lookup(projects);
  const members = lookup(team);

  const columns: Column<AdminFile>[] = [
    { key: "name", header: "File", sortValue: (row) => row.name, cell: (row) => (<span className="flex items-center gap-2"><Icon name="FileText" className="h-4 w-4 shrink-0 text-muted" /><span className="truncate text-ink">{row.name}</span></span>) },
    { key: "kind", header: "Type", sortValue: (row) => row.kind, hideBelow: "sm", cell: (row) => <span className="text-slate">{row.kind}</span> },
    { key: "size", header: "Size", align: "right", sortValue: (row) => row.sizeBytes, hideBelow: "md", cell: (row) => <span className="whitespace-nowrap tabular-nums text-slate">{formatBytes(row.sizeBytes)}</span> },
    { key: "project", header: "Project", hideBelow: "lg", cell: (row) => { const p = projectById.get(row.projectId); return p ? <Link href={`/admin/projects/${p.id}`} className="text-slate hover:text-cobalt">{p.name}</Link> : <Muted />; } },
    { key: "uploader", header: "Uploaded by", hideBelow: "xl", cell: (row) => { const m = members.get(row.uploadedById); return m ? <Avatar initials={m.initials} name={m.name} /> : <Muted />; } },
    { key: "visibility", header: "Client access", sortValue: (row) => String(row.visibleToClient), cell: (row) => <StatusBadge tone={row.visibleToClient ? "success" : "neutral"}>{row.visibleToClient ? "Visible" : "Internal"}</StatusBadge> },
  ];

  return (
    <ResourcePage
      title="Files"
      description="Deliverables and working files across projects."
      rows={files}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => `${row.name} ${row.kind}`}
      searchPlaceholder="Search files…"
      filter={{ label: "Filter by access", options: ["Visible", "Internal"], allLabel: "All files", match: (row) => (row.visibleToClient ? "Visible" : "Internal") }}
      createLabel="Upload File"
      createDescription="Upload a deliverable and choose whether the client can see it."
      emptyTitle="No files"
      emptyDescription="Files uploaded against projects appear here."
      emptyIcon="Archive"
      minWidth="56rem"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Support                                                                     */
/* -------------------------------------------------------------------------- */

export function SupportView({ tickets, clients, team }: { tickets: SupportTicket[]; clients: Client[]; team: TeamMemberRecord[] }) {
  const clientById = lookup(clients);
  const members = lookup(team);

  const columns: Column<SupportTicket>[] = [
    { key: "reference", header: "Ticket", sortValue: (row) => row.reference, cell: (row) => <span className="font-medium tabular-nums text-ink">{row.reference}</span> },
    { key: "subject", header: "Subject", sortValue: (row) => row.subject, cell: (row) => <span className="text-ink">{row.subject}</span> },
    { key: "client", header: "Client", hideBelow: "md", cell: (row) => { const c = clientById.get(row.clientId); return c ? <Link href={`/admin/clients/${c.id}`} className="text-slate hover:text-cobalt">{c.name}</Link> : <Muted />; } },
    { key: "priority", header: "Priority", sortValue: (row) => PRIORITIES.indexOf(row.priority), cell: (row) => <StatusBadge tone={PRIORITY_TONE[row.priority]}>{row.priority}</StatusBadge> },
    { key: "assignee", header: "Assigned", hideBelow: "sm", cell: (row) => { const m = row.assigneeId ? members.get(row.assigneeId) : null; return m ? <Avatar initials={m.initials} name={m.name} /> : <span className="text-2xs text-muted">Unassigned</span>; } },
    { key: "status", header: "Status", sortValue: (row) => row.status, cell: (row) => <StatusBadge tone={row.status === "Resolved" ? "success" : row.status === "In Progress" ? "info" : "warning"} showIcon>{row.status}</StatusBadge> },
  ];

  return (
    <ResourcePage
      title="Support"
      description="Requests raised by clients through their portal."
      rows={tickets}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => `${row.reference} ${row.subject}`}
      searchPlaceholder="Search tickets…"
      filter={{ label: "Filter by status", options: ["Open", "In Progress", "Resolved"], allLabel: "All statuses", match: (row) => row.status }}
      createLabel="New Ticket"
      createDescription="Log a support request received outside the portal."
      emptyTitle="No support requests"
      emptyDescription="Tickets raised from the client portal appear here."
      emptyIcon="LifeBuoy"
      minWidth="56rem"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Website content                                                             */
/* -------------------------------------------------------------------------- */

export function ContentView({ content, team, autoOpenCreate }: { content: ContentItem[]; team: TeamMemberRecord[]; autoOpenCreate?: boolean }) {
  const members = lookup(team);

  const columns: Column<ContentItem>[] = [
    { key: "title", header: "Title", sortValue: (row) => row.title, cell: (row) => <span className="font-medium text-ink">{row.title}</span> },
    { key: "path", header: "Path", hideBelow: "lg", cell: (row) => (row.path ? <Link href={row.path} className="truncate text-slate hover:text-cobalt">{row.path}</Link> : <Muted />) },
    { key: "author", header: "Author", hideBelow: "sm", cell: (row) => { const m = row.authorId ? members.get(row.authorId) : null; return m ? <Avatar initials={m.initials} name={m.name} /> : <Muted />; } },
    { key: "updated", header: "Updated", sortValue: (row) => row.updatedAt, cell: (row) => <span className="whitespace-nowrap text-slate">{formatDate(row.updatedAt)}</span> },
    { key: "status", header: "Status", sortValue: (row) => row.status, cell: (row) => <StatusBadge tone={row.status === "Published" ? "success" : row.status === "Scheduled" ? "info" : "neutral"}>{row.status}</StatusBadge> },
  ];

  return (
    <ResourcePage
      title="Website Content"
      description="Resource articles published on the public site."
      rows={content}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => row.title}
      searchPlaceholder="Search articles…"
      filter={{ label: "Filter by status", options: ["Published", "Draft", "Scheduled"], allLabel: "All statuses", match: (row) => row.status }}
      createLabel="Publish Article"
      createDescription="Add a resource article to the public site."
      emptyTitle="No articles"
      emptyDescription="Resource articles appear here."
      emptyIcon="PenSquare"
      minWidth="48rem"
      autoOpenCreate={autoOpenCreate}
      createNeedsConfirmation
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Team                                                                        */
/* -------------------------------------------------------------------------- */

export function TeamView({ team }: { team: TeamMemberRecord[] }) {
  const columns: Column<TeamMemberRecord>[] = [
    { key: "name", header: "Member", sortValue: (row) => row.name, cell: (row) => (<span className="flex items-center gap-2.5"><Avatar initials={row.initials} name={row.name} /><span className="font-medium text-ink">{row.name}</span></span>) },
    { key: "title", header: "Title", hideBelow: "lg", cell: (row) => <span className="text-slate">{row.title}</span> },
    { key: "role", header: "Role", sortValue: (row) => row.role, cell: (row) => <StatusBadge tone={row.role === "Super Admin" ? "info" : "neutral"}>{row.role}</StatusBadge> },
    { key: "projects", header: "Projects", align: "right", sortValue: (row) => row.activeProjects, hideBelow: "sm", cell: (row) => <span className="tabular-nums text-slate">{row.activeProjects}</span> },
    { key: "tasks", header: "Open tasks", align: "right", sortValue: (row) => row.assignedTasks, hideBelow: "md", cell: (row) => <span className="tabular-nums text-slate">{row.assignedTasks}</span> },
    { key: "workload", header: "Workload", sortValue: (row) => row.workloadPercent, className: "w-36", cell: (row) => <ProgressBar value={row.workloadPercent} label={`${row.name} workload`} showValue tone={row.workloadPercent >= 85 ? "danger" : row.workloadPercent >= 70 ? "warning" : "cobalt"} /> },
  ];

  return (
    <ResourcePage
      title="Team"
      description="Staff accounts and their assigned workload."
      rows={team}
      columns={columns}
      rowKey={(row) => row.id}
      searchable={(row) => `${row.name} ${row.title} ${row.role}`}
      searchPlaceholder="Search team…"
      filter={{ label: "Filter by role", options: ["Super Admin", "Project Manager", "Developer", "Marketing", "Finance", "Support", "Viewer"], allLabel: "All roles", match: (row) => row.role }}
      createLabel="Invite Member"
      createDescription="Invite a colleague and assign their role."
      emptyTitle="No team members"
      emptyDescription="Staff accounts appear here."
      emptyIcon="Users"
      minWidth="56rem"
      createNeedsConfirmation
    />
  );
}
