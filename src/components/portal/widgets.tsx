import { PortalCard } from "@/components/portal/PortalPage";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge, type BadgeTone } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/States";
import {
  demoActivity,
  demoApprovals,
  demoCompletedCategories,
  demoConversation,
  demoDocuments,
  demoFiles,
  demoFolders,
  demoInvoices,
  demoMilestones,
  demoPhases,
  demoProjects,
  demoRevisions,
  demoSupportRequests,
  demoThreads,
  type DemoProject,
} from "@/data/portal-demo";
import { cn } from "@/lib/utils";

const tone = (t: string): BadgeTone => t as BadgeTone;

/**
 * Shown if `demoProjects` is ever empty. This used to be `demoProjects[0]!`,
 * which runs at module scope — an empty array would have thrown on import and
 * taken down every portal screen rather than just this widget.
 */
const NO_PROJECT: DemoProject = {
  id: "no-project",
  name: "No active project",
  progressPercent: 0,
  phase: "No project data available",
  status: "—",
};

const project = demoProjects[0] ?? NO_PROJECT;

/* -- Summary tiles --------------------------------------------------------- */
export function SummaryTiles() {
  // Derived, never hardcoded — a tile that contradicts the widget below it
  // reads as a bug in the client's project, not in the demo data.
  const openApprovals = demoApprovals.filter((approval) => approval.awaitingAction).length;
  const nextMilestone = demoMilestones.find((milestone) => milestone.status !== "Completed");

  const tiles = [
    { label: "Project Progress", value: `${project.progressPercent}%`, note: project.phase, icon: "TrendingUp", status: project.status },
    {
      /* No `status` here: the tile renders status in success-green, which would
         contradict the tone the milestones table gives the same value. */
      label: "Next Milestone",
      value: nextMilestone?.name ?? "None scheduled",
      note: nextMilestone?.dueLabel ?? "No upcoming milestones.",
      icon: "CalendarCheck",
      status: null,
    },
    {
      label: "Open Approvals",
      value: `${openApprovals}`,
      note: openApprovals === 1 ? "Design awaiting your review" : "Designs awaiting your review",
      icon: "CheckSquare",
      status: null,
    },
    { label: "Outstanding Balance", value: "See invoice", note: "View your latest invoice", icon: "Receipt", status: null },
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
              <p className="text-xs text-muted">{tile.label}</p>
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
export function ProgressWidget() {
  return (
    <PortalCard title="Project Progress">
      <ol className="flex flex-wrap gap-x-2 gap-y-4 sm:flex-nowrap sm:justify-between">
        {demoPhases.map((phase) => (
          <li key={phase.label} className="flex min-w-[4.5rem] flex-1 flex-col items-center text-center">
            <span
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-full border-2",
                phase.state === "complete" && "border-success bg-success text-white",
                phase.state === "in-progress" && "border-cobalt bg-paper text-cobalt",
                phase.state === "upcoming" && "border-line-strong bg-paper",
              )}
            >
              {phase.state === "complete" && <Icon name="Check" className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            <p className="mt-2 text-xs font-medium text-ink">{phase.label}</p>
            <p className="text-2xs capitalize text-muted">{phase.state.replace("-", " ")}</p>
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
export function MilestonesWidget() {
  return (
    <PortalCard title="Milestones & Deadlines (Demo)">
      <div className="table-scroll">
        <table className="w-full min-w-[28rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th scope="col" className="pb-2 font-medium">Milestone</th>
              <th scope="col" className="pb-2 font-medium">Due Date</th>
              <th scope="col" className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoMilestones.map((milestone) => (
              <tr key={milestone.name} className="border-b border-line-subtle last:border-0">
                <th scope="row" className="py-3 text-left font-normal text-charcoal">{milestone.name}</th>
                <td className="py-3 text-slate">{milestone.dueLabel}</td>
                <td className="py-3">
                  <StatusBadge tone={tone(milestone.tone)} showIcon>{milestone.status}</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalCard>
  );
}

/* -- Activity -------------------------------------------------------------- */
export function ActivityWidget() {
  return (
    <PortalCard title="Sample project activity">
      <ul className="space-y-4">
        {demoActivity.map((entry) => (
          <li key={entry.title} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-mist text-cobalt">
              <Icon name={entry.icon} className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{entry.title}</p>
              <p className="text-xs text-slate">{entry.detail}</p>
            </div>
            <span className="shrink-0 text-xs text-muted">{entry.dateLabel}</span>
          </li>
        ))}
      </ul>
    </PortalCard>
  );
}

/* -- Files ----------------------------------------------------------------- */
export function FilesWidget() {
  return (
    <PortalCard title="Project Files">
      <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {demoFolders.map((folder) => (
          <li key={folder.name} className="rounded-lg border border-line bg-mist p-3 text-center">
            <Icon name="Archive" className="mx-auto h-6 w-6 text-cobalt" />
            <p className="mt-2 text-xs font-medium text-ink">{folder.name}</p>
            <p className="text-2xs text-muted">{folder.fileCount} files</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-lg border border-dashed border-cobalt-border bg-cobalt-soft p-4 text-center">
        <Icon name="Upload" className="mx-auto h-5 w-5 text-cobalt" />
        <p className="mt-1.5 text-sm font-medium text-cobalt">Upload Files</p>
        <p className="text-xs text-slate">File uploads become available once storage is connected.</p>
      </div>

      <div className="table-scroll mt-4">
        <table className="w-full min-w-[32rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th scope="col" className="pb-2 font-medium">Name</th>
              <th scope="col" className="pb-2 font-medium">Type</th>
              <th scope="col" className="pb-2 font-medium">Updated</th>
              <th scope="col" className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoFiles.map((file) => (
              <tr key={file.name} className="border-b border-line-subtle last:border-0">
                <th scope="row" className="py-3 text-left font-normal text-charcoal">
                  <span className="flex items-center gap-2">
                    <Icon name="FileText" className="h-4 w-4 shrink-0 text-muted" />
                    {file.name}
                  </span>
                </th>
                <td className="py-3 text-slate">{file.type}</td>
                <td className="py-3 text-slate">{file.updatedLabel}</td>
                <td className="py-3"><StatusBadge tone={tone(file.tone)}>{file.status}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalCard>
  );
}

/* -- Approvals ------------------------------------------------------------- */
export function ApprovalsWidget() {
  return (
    <PortalCard title="Design Approvals">
      <ul className="space-y-4">
        {demoApprovals.map((approval) => (
          <li key={approval.title} className="rounded-lg border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-sm font-semibold text-ink">{approval.title}</p>
                <p className="mt-1 text-xs text-slate">
                  {approval.version} · {approval.uploadedLabel}
                </p>
              </div>
              <StatusBadge tone={tone(approval.tone)} showIcon>{approval.status}</StatusBadge>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
              <Icon name="MessageSquare" className="h-3.5 w-3.5" />
              {approval.comments} comments
            </p>
            {approval.awaitingAction && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" disabled className="btn btn-sm btn-primary" title="Available in the live portal">
                  Approve Design
                </button>
                <button type="button" disabled className="btn btn-sm btn-neutral" title="Available in the live portal">
                  Request Changes
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">
        Approval actions are disabled in demo mode — approving a design here would not be recorded
        anywhere.
      </p>
    </PortalCard>
  );
}

/* -- Revisions ------------------------------------------------------------- */
export function RevisionsWidget() {
  return (
    <PortalCard
      title="Revision Requests"
      action={
        <button type="button" disabled className="btn btn-sm btn-primary" title="Available in the live portal">
          New Revision Request
        </button>
      }
    >
      <ul className="space-y-3">
        {demoRevisions.map((revision) => (
          <li key={revision.title} className="rounded-lg border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{revision.title}</p>
                <p className="mt-1 text-xs text-slate">
                  Priority: {revision.priority} · {revision.requestedLabel}
                </p>
              </div>
              <StatusBadge tone={tone(revision.tone)} showIcon>{revision.status}</StatusBadge>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <Icon name="MessageSquare" className="h-3.5 w-3.5" />
              {revision.comments}
            </p>
          </li>
        ))}
      </ul>
    </PortalCard>
  );
}

/* -- Messages -------------------------------------------------------------- */
export function MessagesWidget() {
  return (
    <PortalCard title="Messages">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <ul className="space-y-2">
          {demoThreads.map((thread, index) => (
            <li key={index}>
              <div
                className={cn(
                  "rounded-lg border p-3",
                  index === 0 ? "border-cobalt bg-cobalt-soft" : "border-line",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-ink">{thread.author}</p>
                  {thread.unread && <StatusBadge tone="info">New</StatusBadge>}
                </div>
                <p className="mt-1 truncate text-xs text-slate">{thread.preview}</p>
                <p className="mt-1 text-2xs text-muted">{thread.timeLabel}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col rounded-lg border border-line">
          <div className="border-b border-line-subtle px-4 py-3">
            <p className="text-sm font-medium text-ink">OAX Project Team</p>
          </div>
          <ul className="flex-1 space-y-3 p-4">
            {demoConversation.map((entry, index) => (
              <li
                key={index}
                className={cn("flex", entry.from === "client" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3.5 py-2.5",
                    entry.from === "client" ? "bg-cobalt text-white" : "bg-mist text-charcoal",
                  )}
                >
                  <p className="text-sm">{entry.body}</p>
                  <p className={cn("mt-1 text-2xs", entry.from === "client" ? "text-white/70" : "text-muted")}>
                    {entry.timeLabel}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 border-t border-line-subtle p-3">
            <label htmlFor="portal-message" className="sr-only">Write a message</label>
            <input
              id="portal-message"
              className="field-control min-h-[2.25rem] flex-1 py-1.5 text-sm"
              placeholder="Messaging is disabled in demo mode"
              disabled
            />
            <button type="button" disabled className="btn btn-sm btn-primary">
              <Icon name="Send" className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </PortalCard>
  );
}

/* -- Contracts ------------------------------------------------------------- */
export function ContractsWidget() {
  return (
    <PortalCard title="Proposals & Contracts">
      <div className="table-scroll">
        <table className="w-full min-w-[26rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th scope="col" className="pb-2 font-medium">Document</th>
              <th scope="col" className="pb-2 font-medium">Status</th>
              <th scope="col" className="pb-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {demoDocuments.map((doc) => (
              <tr key={doc.name} className="border-b border-line-subtle last:border-0">
                <th scope="row" className="py-3 text-left font-normal text-charcoal">{doc.name}</th>
                <td className="py-3"><StatusBadge tone={tone(doc.tone)} showIcon>{doc.status}</StatusBadge></td>
                <td className="py-3">
                  <span className="text-xs text-muted">Not available in demo</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">
        No document is signed, stored or legally binding in demo mode. Statuses shown are sample
        values only.
      </p>
    </PortalCard>
  );
}

/* -- Invoices -------------------------------------------------------------- */
export function InvoicesWidget() {
  return (
    <PortalCard title="Invoices & Payments">
      <div className="table-scroll">
        <table className="w-full min-w-[32rem] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th scope="col" className="pb-2 font-medium">Invoice</th>
              <th scope="col" className="pb-2 font-medium">Issued</th>
              <th scope="col" className="pb-2 font-medium">Amount</th>
              <th scope="col" className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoInvoices.map((invoice) => (
              <tr key={invoice.reference} className="border-b border-line-subtle last:border-0">
                <th scope="row" className="py-3 text-left font-normal text-charcoal">{invoice.reference}</th>
                <td className="py-3 text-slate">{invoice.issuedLabel}</td>
                <td className="py-3 text-slate">{invoice.amountLabel}</td>
                <td className="py-3"><StatusBadge tone={tone(invoice.tone)} showIcon>{invoice.status}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 flex items-start gap-2 text-xs text-muted">
        <Icon name="Lock" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        No payment processor is connected. Amounts are withheld and no transaction can be made from
        this screen.
      </p>
    </PortalCard>
  );
}

/* -- Completed files ------------------------------------------------------- */
export function CompletedFilesWidget() {
  return (
    <PortalCard title="Completed Files">
      <EmptyState
        icon="Lock"
        title="Final files appear here after project completion"
        description="Source files, credentials and final assets are released once the project is complete and signed off."
        className="border-dashed"
      />
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {demoCompletedCategories.map((category) => (
          <li key={category.name} className="rounded-lg border border-line bg-mist p-4 text-center">
            <p className="text-sm font-medium text-ink">{category.name}</p>
            <p className="mt-1 text-xs text-muted">({category.note})</p>
          </li>
        ))}
      </ul>
    </PortalCard>
  );
}

/* -- Support --------------------------------------------------------------- */
export function SupportWidget() {
  return (
    <PortalCard
      title="Support Requests"
      action={
        <button type="button" disabled className="btn btn-sm btn-primary" title="Available in the live portal">
          Create Support Request
        </button>
      }
    >
      <ul className="space-y-3">
        {demoSupportRequests.map((request) => (
          <li key={request.title} className="rounded-lg border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{request.title}</p>
                <p className="mt-1 text-xs text-slate">
                  Priority: {request.priority} · {request.updatedLabel}
                </p>
              </div>
              <StatusBadge tone={tone(request.tone)} showIcon>{request.status}</StatusBadge>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
              <Icon name="MessageSquare" className="h-3.5 w-3.5" />
              {request.comments}
            </p>
          </li>
        ))}
      </ul>
    </PortalCard>
  );
}
