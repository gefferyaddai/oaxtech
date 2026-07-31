import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminCard, PageHeader, ProgressBar } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/States";
import { formatDate, formatDateWithYear, formatMoneyPrecise } from "@/lib/admin/format";
import {
  getClient,
  getInvoices,
  getProjects,
  getSupportTickets,
} from "@/lib/admin/repository";
import { PROJECT_STATUS_TONE, INVOICE_STATUS_TONE } from "@/lib/admin/types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const client = await getClient(id);
  return { title: client ? client.name : "Client not found" };
}

export default async function ClientDetailPage({ params }: Params) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  const [allProjects, allInvoices, allTickets] = await Promise.all([
    getProjects(),
    getInvoices(),
    getSupportTickets(),
  ]);

  const projects = allProjects.filter((project) => project.clientId === client.id);
  const invoices = allInvoices.filter((invoice) => invoice.clientId === client.id);
  const tickets = allTickets.filter((ticket) => ticket.clientId === client.id);

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <PageHeader
        eyebrow={
          <nav aria-label="Breadcrumb" className="mb-2">
            <Link href="/admin/clients" className="inline-flex items-center gap-1 text-xs text-slate hover:text-cobalt">
              <Icon name="ArrowLeft" className="h-3.5 w-3.5" />
              All clients
            </Link>
          </nav>
        }
        title={client.name}
        description={client.industry ?? undefined}
        actions={
          <StatusBadge tone={client.status === "Active" ? "success" : "neutral"}>
            {client.status}
          </StatusBadge>
        }
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <AdminCard title="Details">
          <dl className="space-y-3 text-sm">
            {[
              { label: "Primary contact", value: client.contactName },
              { label: "Email", value: client.email },
              { label: "Phone", value: client.phone ?? "Not provided" },
              { label: "Client since", value: formatDateWithYear(client.since) },
              { label: "Lifetime value", value: formatMoneyPrecise(client.lifetimeValue) },
            ].map((row) => (
              <div key={row.label} className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-2 last:border-0 last:pb-0">
                <dt className="text-slate">{row.label}</dt>
                <dd className="break-all font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </AdminCard>

        <AdminCard title="Projects" className="xl:col-span-2">
          {projects.length === 0 ? (
            <EmptyState icon="Layers" title="No projects" description="Projects for this client appear here." />
          ) : (
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project.id} className="rounded-lg border border-line p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link href={`/admin/projects/${project.id}`} className="font-medium text-ink hover:text-cobalt">
                      {project.name}
                    </Link>
                    <StatusBadge tone={PROJECT_STATUS_TONE[project.status]} showIcon>
                      {project.status}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-slate">
                    {project.service}
                    {project.deadline && ` · due ${formatDate(project.deadline)}`}
                  </p>
                  <ProgressBar
                    value={project.progressPercent}
                    label={`${project.name} progress`}
                    showValue
                    className="mt-2"
                  />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Invoices" className="xl:col-span-2">
          {invoices.length === 0 ? (
            <EmptyState icon="Receipt" title="No invoices" description="Invoices raised for this client appear here." />
          ) : (
            <ul className="divide-y divide-line-subtle">
              {invoices.map((invoice) => (
                <li key={invoice.id} className="flex flex-wrap items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="font-medium tabular-nums text-ink">{invoice.reference}</span>
                  <span className="text-xs text-slate">due {formatDate(invoice.dueAt)}</span>
                  <span className="ml-auto tabular-nums text-ink">{formatMoneyPrecise(invoice.amount)}</span>
                  <StatusBadge tone={INVOICE_STATUS_TONE[invoice.status]} showIcon>
                    {invoice.status}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Support">
          {tickets.length === 0 ? (
            <p className="text-sm text-slate">No support requests.</p>
          ) : (
            <ul className="space-y-2.5">
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <p className="text-sm text-ink">{ticket.subject}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-2xs tabular-nums text-muted">{ticket.reference}</span>
                    <StatusBadge tone={ticket.status === "Resolved" ? "success" : "warning"}>
                      {ticket.status}
                    </StatusBadge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
