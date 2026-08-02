import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminCard, Avatar, PageHeader, ProgressBar } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/States";
import { formatBytes, formatDate, formatDateWithYear, formatMoneyPrecise } from "@/lib/admin/format";
import {
  getApprovals,
  getClient,
  getFiles,
  getInvoices,
  getProject,
  getTasks,
  getTeamLookup,
} from "@/lib/domain/repository";
import { INVOICE_STATUS_TONE, PROJECT_STATUS_TONE } from "@/lib/domain/types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  return { title: project ? project.name : "Project not found" };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const [client, team, allTasks, allApprovals, allFiles, allInvoices] = await Promise.all([
    getClient(project.clientId),
    getTeamLookup(),
    getTasks(),
    getApprovals(),
    getFiles(),
    getInvoices(),
  ]);

  const owner = team.get(project.ownerId);
  const tasks = allTasks.filter((task) => task.projectId === project.id);
  const approvals = allApprovals.filter((approval) => approval.projectId === project.id);
  const files = allFiles.filter((file) => file.projectId === project.id);
  const invoices = allInvoices.filter((invoice) => invoice.projectId === project.id);

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <PageHeader
        eyebrow={
          <nav aria-label="Breadcrumb" className="mb-2">
            <Link href="/admin/projects" className="inline-flex items-center gap-1 text-xs text-slate hover:text-cobalt">
              <Icon name="ArrowLeft" className="h-3.5 w-3.5" />
              All projects
            </Link>
          </nav>
        }
        title={project.name}
        description={client ? `${client.name} · ${project.service}` : project.service}
        actions={
          <StatusBadge tone={PROJECT_STATUS_TONE[project.status]} showIcon>
            {project.status}
          </StatusBadge>
        }
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <AdminCard title="Progress" className="xl:col-span-2">
          <ProgressBar
            value={project.progressPercent}
            label={`${project.name} progress`}
            showValue
            tone={project.status === "At Risk" ? "danger" : "cobalt"}
          />
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Phase", value: project.phase },
              { label: "Next milestone", value: project.nextMilestone ?? "—" },
              { label: "Deadline", value: project.deadline ? formatDateWithYear(project.deadline) : "—" },
              { label: "Service", value: project.service },
            ].map((row) => (
              <div key={row.label}>
                <dt className="text-2xs uppercase tracking-wide text-slate">{row.label}</dt>
                <dd className="mt-0.5 text-sm text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </AdminCard>

        <AdminCard title="Owner">
          {owner ? (
            <div className="flex items-center gap-3">
              <Avatar initials={owner.initials} name={owner.name} className="h-10 w-10 text-xs" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{owner.name}</p>
                <p className="truncate text-xs text-slate">{owner.title}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">Unassigned</p>
          )}
          {client && (
            <div className="mt-4 border-t border-line pt-3">
              <p className="text-2xs uppercase tracking-wide text-slate">Client</p>
              <Link href={`/admin/clients/${client.id}`} className="mt-1 block text-sm font-medium text-ink hover:text-cobalt">
                {client.name}
              </Link>
            </div>
          )}
        </AdminCard>

        <AdminCard title="Tasks" className="xl:col-span-2">
          {tasks.length === 0 ? (
            <EmptyState icon="ClipboardCheck" title="No tasks" description="Tasks for this project appear here." />
          ) : (
            <ul className="divide-y divide-line-subtle">
              {tasks.map((task) => {
                const assignee = team.get(task.assigneeId);
                return (
                  <li key={task.id} className="flex flex-wrap items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <Icon
                      name={task.completed ? "CheckCircle2" : "Minus"}
                      className={task.completed ? "h-4 w-4 shrink-0 text-success" : "h-4 w-4 shrink-0 text-muted"}
                    />
                    <span className={task.completed ? "text-sm text-muted line-through" : "text-sm text-ink"}>
                      {task.title}
                    </span>
                    <span className="ml-auto text-xs text-slate">{formatDate(task.dueDate)}</span>
                    {assignee && <Avatar initials={assignee.initials} name={assignee.name} />}
                  </li>
                );
              })}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Approvals">
          {approvals.length === 0 ? (
            <p className="text-sm text-slate">No approvals requested.</p>
          ) : (
            <ul className="space-y-2.5">
              {approvals.map((approval) => (
                <li key={approval.id}>
                  <p className="text-sm text-ink">
                    {approval.title} <span className="text-muted">{approval.version}</span>
                  </p>
                  <StatusBadge
                    className="mt-1"
                    tone={approval.status === "Approved" ? "success" : approval.status === "Changes Requested" ? "warning" : "info"}
                  >
                    {approval.status}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Files" className="xl:col-span-2">
          {files.length === 0 ? (
            <p className="text-sm text-slate">No files uploaded.</p>
          ) : (
            <ul className="divide-y divide-line-subtle">
              {files.map((file) => (
                <li key={file.id} className="flex flex-wrap items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <Icon name="FileText" className="h-4 w-4 shrink-0 text-muted" />
                  <span className="min-w-0 truncate text-sm text-ink">{file.name}</span>
                  <span className="ml-auto shrink-0 text-xs tabular-nums text-slate">
                    {formatBytes(file.sizeBytes)}
                  </span>
                  <StatusBadge tone={file.visibleToClient ? "success" : "neutral"}>
                    {file.visibleToClient ? "Visible" : "Internal"}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Invoices">
          {invoices.length === 0 ? (
            <p className="text-sm text-slate">No invoices raised.</p>
          ) : (
            <ul className="space-y-2.5">
              {invoices.map((invoice) => (
                <li key={invoice.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm tabular-nums text-ink">{invoice.reference}</span>
                  <span className="text-sm tabular-nums text-slate">{formatMoneyPrecise(invoice.amount)}</span>
                  <StatusBadge tone={INVOICE_STATUS_TONE[invoice.status]}>{invoice.status}</StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
