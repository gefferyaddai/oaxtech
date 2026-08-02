import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminCard, Avatar, PageHeader } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateWithYear } from "@/lib/admin/format";
import { getConsultations, getLead, getTeamLookup } from "@/lib/domain/repository";

interface Params {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const lead = await getLead(id);
  return { title: lead ? (lead.company ?? lead.name) : "Lead not found" };
}

/** Where the record came from, in the public site's own terms. */
const ORIGIN_LABEL = {
  quote: "Request a Quote form",
  contact: "Contact form",
  booking: "Consultation booking form",
  newsletter: "Newsletter signup",
} as const;

export default async function LeadDetailPage({ params }: Params) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const [team, consultations] = await Promise.all([getTeamLookup(), getConsultations()]);
  const assignee = lead.assigneeId ? team.get(lead.assigneeId) : null;
  const related = consultations.filter((consultation) => consultation.leadId === lead.id);

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <PageHeader
        eyebrow={
          <nav aria-label="Breadcrumb" className="mb-2">
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-xs text-slate hover:text-cobalt">
              <Icon name="ArrowLeft" className="h-3.5 w-3.5" />
              All leads
            </Link>
          </nav>
        }
        title={lead.company ?? lead.name}
        description={lead.service}
        actions={<StatusBadge tone={lead.stage === "Converted" ? "success" : "info"}>{lead.stage}</StatusBadge>}
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <AdminCard title="Enquiry" className="xl:col-span-2">
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Contact name", value: lead.name },
              { label: "Email", value: lead.email },
              { label: "Phone", value: lead.phone ?? "Not provided" },
              { label: "Service", value: lead.service },
              { label: "Budget", value: lead.budget ?? "Not provided" },
              { label: "Source", value: lead.source ?? "Unknown — no attribution is collected" },
              { label: "Received", value: formatDateWithYear(lead.submittedAt) },
              { label: "Came from", value: ORIGIN_LABEL[lead.origin] },
            ].map((row) => (
              <div key={row.label}>
                <dt className="text-2xs uppercase tracking-wide text-slate">{row.label}</dt>
                <dd className="mt-0.5 break-words text-sm text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>

          {lead.notes && (
            <div className="mt-5 border-t border-line pt-4">
              <h3 className="text-2xs uppercase tracking-wide text-slate">Message</h3>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-charcoal">
                {lead.notes}
              </p>
            </div>
          )}
        </AdminCard>

        <div className="flex flex-col gap-4">
          <AdminCard title="Ownership">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate">Assigned to</span>
                {assignee ? (
                  <span className="flex items-center gap-2">
                    <Avatar initials={assignee.initials} name={assignee.name} />
                    <span className="font-medium text-ink">{assignee.name}</span>
                  </span>
                ) : (
                  <span className="text-muted">Unassigned</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate">Follow-up</span>
                <StatusBadge
                  tone={lead.followUp === "Overdue" ? "danger" : lead.followUp === "Due today" ? "warning" : "neutral"}
                >
                  {lead.followUp}
                </StatusBadge>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Consultations">
            {related.length === 0 ? (
              <p className="text-sm text-slate">No consultation booked for this lead.</p>
            ) : (
              <ul className="space-y-2">
                {related.map((consultation) => (
                  <li key={consultation.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-ink">{formatDateWithYear(consultation.date)}</span>
                    <StatusBadge tone={consultation.status === "Confirmed" ? "success" : "warning"}>
                      {consultation.status}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
