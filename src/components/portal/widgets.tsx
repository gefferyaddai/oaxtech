import { PortalCard } from "@/components/portal/PortalPage";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/States";
import { formatBytes, formatDate, formatMoneyPrecise, formatRelative } from "@/lib/admin/format";
import type { FolderSummary } from "@/lib/portal/repository";
import {
  INVOICE_STATUS_TONE,
  MILESTONE_TONE,
  REVISION_TONE,
  type ActivityEvent,
  type Approval,
  type Invoice,
  type Message,
  type MessageEntry,
  type Milestone,
  type PhaseStep,
  type Project,
  type ProjectFile,
  type Proposal,
  type Revision,
  type SupportTicket,
} from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Every widget takes its data as props.
 *
 * Nothing here imports fixtures. The page fetches through
 * `src/lib/portal/repository.ts` — scoped to the signed-in client — and passes
 * the results down, so these components work unchanged against a database.
 */

const APPROVAL_TONE = {
  "Awaiting Client": "warning",
  Approved: "success",
  "Changes Requested": "info",
} as const;

const SUPPORT_TONE = {
  Open: "warning",
  "In Progress": "info",
  Resolved: "success",
} as const;

const PROPOSAL_TONE = {
  Draft: "neutral",
  Sent: "info",
  Viewed: "info",
  Accepted: "success",
  Declined: "danger",
} as const;

/* -- Summary tiles --------------------------------------------------------- */

interface SummaryTilesProps {
  project: Project | null;
  nextMilestone: Milestone | null;
  openApprovals: number;
  outstandingInvoices: number;
}

export function SummaryTiles({
  project,
  nextMilestone,
  openApprovals,
  outstandingInvoices,
}: SummaryTilesProps) {
  const tiles = [
    {
      label: "Project Progress",
      value: project ? `${project.progressPercent}%` : "—",
      note: project ? `${project.phase} phase` : "No active project",
      icon: "TrendingUp",
      status: project?.status ?? null,
    },
    {
      label: "Next Milestone",
      value: nextMilestone?.name ?? "None scheduled",
      note: nextMilestone ? formatDate(nextMilestone.dueDate) : "No upcoming milestones",
      icon: "CalendarCheck",
      status: null,
    },
    {
      label: "Open Approvals",
      value: `${openApprovals}`,
      note: openApprovals === 1 ? "Awaiting your review" : "Awaiting your review",
      icon: "CheckSquare",
      status: null,
    },
    {
      label: "Outstanding Invoices",
      value: `${outstandingInvoices}`,
      note: outstandingInvoices === 0 ? "Nothing due" : "View your latest invoice",
      icon: "Receipt",
      status: null,
    },
  ];

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => (
        <li key={tile.label} className="card p-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt">
              <Icon name={tile.icon} className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-slate">{tile.label}</p>
              <p className="mt-0.5 font-display text-base font-semibold text-ink">{tile.value}</p>
              {tile.status && (
                <p className="mt-1 text-xs font-medium text-success">{tile.status}</p>
              )}
              <p className="mt-0.5 text-xs text-slate">{tile.note}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* -- Progress -------------------------------------------------------------- */

export function ProgressWidget({
  project,
  phases,
}: {
  project: Project | null;
  phases: PhaseStep[];
}) {
  if (!project) {
    return (
      <PortalCard title="Project Progress">
        <EmptyState
          icon="Layers"
          title="No active project"
          description="Your project appears here once work begins."
        />
      </PortalCard>
    );
  }

  return (
    <PortalCard title="Project Progress">
      <ol className="flex flex-wrap gap-x-2 gap-y-4 sm:flex-nowrap sm:justify-between">
        {phases.map((phase) => (
          <li
            key={phase.label}
            className="flex min-w-[4.5rem] flex-1 flex-col items-center text-center"
          >
            <span
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-full border-2",
                phase.state === "complete" && "border-success bg-success text-white",
                phase.state === "in-progress" && "border-cobalt bg-paper text-cobalt",
                phase.state === "upcoming" && "border-line-strong bg-paper",
              )}
            >
              {phase.state === "complete" && (
                <Icon name="Check" className="h-3.5 w-3.5" strokeWidth={3} />
              )}
            </span>
            <p className="mt-2 text-xs font-medium text-ink">{phase.label}</p>
            <p className="text-2xs capitalize text-slate">{phase.state.replace("-", " ")}</p>
          </li>
        ))}
      </ol>

      <div className="mt-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-haze">
          <div
            className="h-full rounded-full bg-cobalt"
            style={{ width: `${project.progressPercent}%` }}
            role="progressbar"
            aria-valuenow={project.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall project progress"
          />
        </div>
        <p className="mt-2 text-right text-xs text-slate">{project.progressPercent}% complete</p>
      </div>
    </PortalCard>
  );
}

/* -- Milestones ------------------------------------------------------------ */

export function MilestonesWidget({ milestones }: { milestones: Milestone[] }) {
  return (
    <PortalCard title="Milestones & Deadlines">
      {milestones.length === 0 ? (
        <EmptyState
          icon="CalendarCheck"
          title="No milestones yet"
          description="Key dates appear here once your project is scheduled."
        />
      ) : (
        <div className="table-scroll">
          <table className="w-full min-w-[28rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-slate">
                <th scope="col" className="pb-2 font-medium">Milestone</th>
                <th scope="col" className="pb-2 font-medium">Due Date</th>
                <th scope="col" className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((milestone) => (
                <tr key={milestone.id} className="border-b border-line-subtle last:border-0">
                  <th scope="row" className="py-3 text-left font-normal text-charcoal">
                    {milestone.name}
                  </th>
                  <td className="py-3 text-slate">{formatDate(milestone.dueDate)}</td>
                  <td className="py-3">
                    <StatusBadge tone={MILESTONE_TONE[milestone.status]} showIcon>
                      {milestone.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalCard>
  );
}

/* -- Activity -------------------------------------------------------------- */

const ACTIVITY_ICON: Record<string, string> = {
  design_approved: "CheckCircle2",
  file_uploaded: "Upload",
  revision_requested: "PenSquare",
  invoice_paid: "Receipt",
  support_opened: "LifeBuoy",
  lead_created: "Target",
  consultation_booked: "Calendar",
};

export function ActivityWidget({ events }: { events: ActivityEvent[] }) {
  return (
    <PortalCard title="Recent activity">
      {events.length === 0 ? (
        <EmptyState
          icon="Activity"
          title="No recent activity"
          description="Updates on your project appear here."
        />
      ) : (
        <ul className="space-y-4">
          {events.map((entry) => (
            <li key={entry.id} className="flex gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-mist text-cobalt">
                <Icon name={ACTIVITY_ICON[entry.kind] ?? "Activity"} className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{entry.summary}</p>
              </div>
              <span className="shrink-0 text-xs text-slate">
                {formatRelative(entry.occurredAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </PortalCard>
  );
}

/* -- Files ----------------------------------------------------------------- */

export function FilesWidget({
  folders,
  files,
  storageConfigured,
}: {
  folders: FolderSummary[];
  files: ProjectFile[];
  storageConfigured: boolean;
}) {
  return (
    <PortalCard title="Project Files">
      <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {folders.map((folder) => (
          <li
            key={folder.name}
            className="rounded-lg border border-line bg-mist p-3 text-center"
          >
            <Icon name="Archive" className="mx-auto h-6 w-6 text-cobalt" />
            <p className="mt-2 text-xs font-medium text-ink">{folder.name}</p>
            <p className="text-2xs text-slate">
              {folder.fileCount} {folder.fileCount === 1 ? "file" : "files"}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-lg border border-dashed border-cobalt-border bg-cobalt-soft p-4 text-center">
        <Icon name="Upload" className="mx-auto h-5 w-5 text-cobalt" />
        <p className="mt-1.5 text-sm font-medium text-cobalt">Upload Files</p>
        <p className="text-xs text-slate">
          {storageConfigured
            ? "Drop a file here to share it with the project team."
            : "File uploads become available once storage is connected."}
        </p>
      </div>

      {files.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon="Archive"
            title="No files shared yet"
            description="Deliverables shared by the team appear here."
          />
        </div>
      ) : (
        <div className="table-scroll mt-4">
          <table className="w-full min-w-[32rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-slate">
                <th scope="col" className="pb-2 font-medium">Name</th>
                <th scope="col" className="pb-2 font-medium">Type</th>
                <th scope="col" className="pb-2 font-medium">Size</th>
                <th scope="col" className="pb-2 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b border-line-subtle last:border-0">
                  <th scope="row" className="py-3 text-left font-normal text-charcoal">
                    <span className="flex items-center gap-2">
                      <Icon name="FileText" className="h-4 w-4 shrink-0 text-slate" />
                      {file.name}
                    </span>
                  </th>
                  <td className="py-3 text-slate">{file.kind}</td>
                  <td className="py-3 tabular-nums text-slate">{formatBytes(file.sizeBytes)}</td>
                  <td className="py-3 text-slate">{formatDate(file.uploadedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalCard>
  );
}

/* -- Approvals ------------------------------------------------------------- */

export function ApprovalsWidget({ approvals }: { approvals: Approval[] }) {
  return (
    <PortalCard title="Design Approvals">
      {approvals.length === 0 ? (
        <EmptyState
          icon="CheckSquare"
          title="Nothing awaiting approval"
          description="Designs sent for your sign-off appear here."
        />
      ) : (
        <ul className="space-y-4">
          {approvals.map((approval) => (
            <li key={approval.id} className="rounded-lg border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{approval.title}</p>
                  <p className="mt-1 text-xs text-slate">
                    {approval.version} · {formatDate(approval.submittedAt)}
                  </p>
                </div>
                <StatusBadge tone={APPROVAL_TONE[approval.status]} showIcon>
                  {approval.status}
                </StatusBadge>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate">
                <Icon name="MessageSquare" className="h-3.5 w-3.5" />
                {approval.commentCount} comments
              </p>
              {approval.status === "Awaiting Client" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled
                    className="btn btn-sm btn-primary"
                    title="Available once the portal is connected"
                  >
                    Approve Design
                  </button>
                  <button
                    type="button"
                    disabled
                    className="btn btn-sm btn-neutral"
                    title="Available once the portal is connected"
                  >
                    Request Changes
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-slate">
        Approval actions are disabled — no database is configured, so approving a design here
        would not be recorded anywhere.
      </p>
    </PortalCard>
  );
}

/* -- Revisions ------------------------------------------------------------- */

export function RevisionsWidget({ revisions }: { revisions: Revision[] }) {
  return (
    <PortalCard
      title="Revision Requests"
      action={
        <button
          type="button"
          disabled
          className="btn btn-sm btn-primary"
          title="Available once the portal is connected"
        >
          New Revision Request
        </button>
      }
    >
      {revisions.length === 0 ? (
        <EmptyState
          icon="PenSquare"
          title="No revision requests"
          description="Changes you ask for appear here with their status."
        />
      ) : (
        <ul className="space-y-3">
          {revisions.map((revision) => (
            <li key={revision.id} className="rounded-lg border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{revision.title}</p>
                  <p className="mt-1 text-xs text-slate">
                    Priority: {revision.priority} · {formatDate(revision.requestedAt)}
                  </p>
                </div>
                <StatusBadge tone={REVISION_TONE[revision.status]} showIcon>
                  {revision.status}
                </StatusBadge>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate">
                <Icon name="MessageSquare" className="h-3.5 w-3.5" />
                {revision.commentCount} comments
              </p>
            </li>
          ))}
        </ul>
      )}
    </PortalCard>
  );
}

/* -- Messages -------------------------------------------------------------- */

export function MessagesWidget({
  threads,
  entries,
}: {
  threads: Message[];
  entries: MessageEntry[];
}) {
  return (
    <PortalCard title="Messages">
      {threads.length === 0 ? (
        <EmptyState
          icon="MessageSquare"
          title="No messages"
          description="Conversations with your project team appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <ul className="space-y-2">
            {threads.map((thread, index) => (
              <li key={thread.id}>
                <div
                  className={cn(
                    "rounded-lg border p-3",
                    index === 0 ? "border-cobalt bg-cobalt-soft" : "border-line",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-ink">{thread.subject}</p>
                    {thread.unread && <StatusBadge tone="info">New</StatusBadge>}
                  </div>
                  <p className="mt-1 truncate text-xs text-slate">{thread.preview}</p>
                  <p className="mt-1 text-2xs text-slate">
                    {formatRelative(thread.lastActivityAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col rounded-lg border border-line">
            <div className="border-b border-line-subtle px-4 py-3">
              <p className="text-sm font-medium text-ink">
                {threads[0]?.subject ?? "Conversation"}
              </p>
            </div>
            <ul className="flex-1 space-y-3 p-4">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className={cn("flex", entry.from === "client" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-3.5 py-2.5",
                      entry.from === "client" ? "bg-cobalt text-white" : "bg-mist text-charcoal",
                    )}
                  >
                    <p className="text-sm">{entry.body}</p>
                    <p
                      className={cn(
                        "mt-1 text-2xs",
                        entry.from === "client" ? "text-white/70" : "text-slate",
                      )}
                    >
                      {formatRelative(entry.sentAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 border-t border-line-subtle p-3">
              <label htmlFor="portal-message" className="sr-only">
                Write a message
              </label>
              <input
                id="portal-message"
                className="field-control min-h-[2.25rem] flex-1 py-1.5 text-sm"
                placeholder="Messaging is disabled until the portal is connected"
                disabled
              />
              <button type="button" disabled className="btn btn-sm btn-primary">
                <Icon name="Send" className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalCard>
  );
}

/* -- Proposals & contracts ------------------------------------------------- */

export function ContractsWidget({ proposals }: { proposals: Proposal[] }) {
  return (
    <PortalCard title="Proposals & Contracts">
      {proposals.length === 0 ? (
        <EmptyState
          icon="FileText"
          title="No documents"
          description="Proposals and agreements appear here once issued."
        />
      ) : (
        <div className="table-scroll">
          <table className="w-full min-w-[26rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-slate">
                <th scope="col" className="pb-2 font-medium">Document</th>
                <th scope="col" className="pb-2 font-medium">Reference</th>
                <th scope="col" className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="border-b border-line-subtle last:border-0">
                  <th scope="row" className="py-3 text-left font-normal text-charcoal">
                    {proposal.title}
                  </th>
                  <td className="py-3 tabular-nums text-slate">{proposal.reference}</td>
                  <td className="py-3">
                    <StatusBadge tone={PROPOSAL_TONE[proposal.status]} showIcon>
                      {proposal.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-slate">
        No document is signed, stored or legally binding here — no document-signing service is
        connected.
      </p>
    </PortalCard>
  );
}

/* -- Invoices -------------------------------------------------------------- */

export function InvoicesWidget({
  invoices,
  showAmounts,
}: {
  invoices: Invoice[];
  showAmounts: boolean;
}) {
  return (
    <PortalCard title="Invoices & Payments">
      {invoices.length === 0 ? (
        <EmptyState
          icon="Receipt"
          title="No invoices"
          description="Invoices for your project appear here."
        />
      ) : (
        <div className="table-scroll">
          <table className="w-full min-w-[32rem] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-slate">
                <th scope="col" className="pb-2 font-medium">Invoice</th>
                <th scope="col" className="pb-2 font-medium">Issued</th>
                <th scope="col" className="pb-2 font-medium">Amount</th>
                <th scope="col" className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-line-subtle last:border-0">
                  <th scope="row" className="py-3 text-left font-normal tabular-nums text-charcoal">
                    {invoice.reference}
                  </th>
                  <td className="py-3 text-slate">{formatDate(invoice.issuedAt)}</td>
                  <td className="py-3 tabular-nums text-slate">
                    {showAmounts ? formatMoneyPrecise(invoice.amount) : "—"}
                  </td>
                  <td className="py-3">
                    <StatusBadge tone={INVOICE_STATUS_TONE[invoice.status]} showIcon>
                      {invoice.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!showAmounts && (
        <p className="mt-4 flex items-start gap-2 text-xs text-slate">
          <Icon name="Lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          No payment processor is connected. Amounts are withheld and no transaction can be made
          from this screen.
        </p>
      )}
    </PortalCard>
  );
}

/* -- Completed files ------------------------------------------------------- */

/** Presentational only — describes what is released at project completion. */
const COMPLETED_CATEGORIES = [
  { name: "Source Files", note: "Released at completion" },
  { name: "Credentials & Handover", note: "Released at completion" },
  { name: "Final Assets", note: "Released at completion" },
];

export function CompletedFilesWidget({ project }: { project: Project | null }) {
  const complete = project?.status === "Completed";

  return (
    <PortalCard title="Completed Files">
      <EmptyState
        icon="Lock"
        title={
          complete
            ? "Final files are being prepared"
            : "Final files appear here after project completion"
        }
        description="Source files, credentials and final assets are released once the project is complete and signed off."
        className="border-dashed"
      />
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {COMPLETED_CATEGORIES.map((category) => (
          <li
            key={category.name}
            className="rounded-lg border border-line bg-mist p-4 text-center"
          >
            <p className="text-sm font-medium text-ink">{category.name}</p>
            <p className="mt-1 text-xs text-slate">({category.note})</p>
          </li>
        ))}
      </ul>
    </PortalCard>
  );
}

/* -- Support --------------------------------------------------------------- */

export function SupportWidget({ tickets }: { tickets: SupportTicket[] }) {
  return (
    <PortalCard
      title="Support Requests"
      action={
        <button
          type="button"
          disabled
          className="btn btn-sm btn-primary"
          title="Available once the portal is connected"
        >
          Create Support Request
        </button>
      }
    >
      {tickets.length === 0 ? (
        <EmptyState
          icon="LifeBuoy"
          title="No support requests"
          description="Requests you raise appear here with their status."
        />
      ) : (
        <ul className="space-y-3">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="rounded-lg border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{ticket.subject}</p>
                  <p className="mt-1 text-xs text-slate">
                    Priority: {ticket.priority} · {formatDate(ticket.openedAt)}
                  </p>
                </div>
                <StatusBadge tone={SUPPORT_TONE[ticket.status]} showIcon>
                  {ticket.status}
                </StatusBadge>
              </div>
              <p className="mt-2 text-xs tabular-nums text-slate">{ticket.reference}</p>
            </li>
          ))}
        </ul>
      )}
    </PortalCard>
  );
}
