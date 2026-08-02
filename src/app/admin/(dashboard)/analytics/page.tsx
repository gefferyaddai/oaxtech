import type { Metadata } from "next";
import { LeadSourcesChart, RevenueChart } from "@/components/admin/charts";
import { AdminCard, MetricCard, PageHeader } from "@/components/admin/primitives";
import { SectionBoundary } from "@/components/admin/SectionBoundary";
import { TeamWorkload } from "@/components/admin/widgets";
import { Icon } from "@/components/ui/Icon";
import { formatMoney } from "@/lib/admin/format";
import {
  getClients,
  getDashboardSummary,
  getLeadSources,
  getLeads,
  getRevenueSeries,
  getTeam,
} from "@/lib/domain/repository";
import { integrationStatus } from "@/lib/integrations";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const [revenue, leadSources, leads, clients, team, summary] = await Promise.all([
    getRevenueSeries(),
    getLeadSources(),
    getLeads(),
    getClients(),
    getTeam(),
    getDashboardSummary(),
  ]);

  const totalRevenue = revenue.reduce((sum, point) => sum + point.revenue, 0);
  const converted = leads.filter((lead) => lead.stage === "Converted").length;
  const conversionRate = leads.length ? Math.round((converted / leads.length) * 100) : 0;

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Analytics"
        description="Revenue, pipeline and team performance."
      />

      {!integrationStatus.analytics() && (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-info/25 bg-info-soft p-3">
          <Icon name="Info" className="mt-0.5 h-4 w-4 shrink-0 text-info" />
          <p className="text-xs leading-relaxed text-charcoal">
            No web-analytics provider is connected, so traffic and acquisition figures are not
            available. The figures below are derived from records in this admin only. Set{" "}
            <code className="rounded bg-paper px-1">NEXT_PUBLIC_ANALYTICS_ID</code> to add
            traffic reporting.
          </p>
        </div>
      )}

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <li>
          <MetricCard label="Revenue (6 months)" value={formatMoney(totalRevenue)} icon="TrendingUp" href="/admin/invoices" />
        </li>
        <li>
          <MetricCard label="Total leads" value={leads.length} icon="Target" href="/admin/leads" />
        </li>
        <li>
          <MetricCard label="Conversion rate" value={`${conversionRate}%`} icon="Gauge" href="/admin/leads" comparison={`${converted} converted`} />
        </li>
        <li>
          <MetricCard label="Active clients" value={clients.filter((c) => c.status === "Active").length} icon="Users" href="/admin/clients" />
        </li>
      </ul>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <AdminCard title="Revenue overview" className="xl:col-span-2">
          <SectionBoundary>
            <RevenueChart data={revenue} />
          </SectionBoundary>
        </AdminCard>
        <AdminCard title="Lead sources">
          <SectionBoundary>
            <LeadSourcesChart data={leadSources} />
          </SectionBoundary>
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <AdminCard title="Team workload">
          <SectionBoundary>
            <TeamWorkload team={team} />
          </SectionBoundary>
        </AdminCard>
        <AdminCard title="Pipeline summary">
          <dl className="grid grid-cols-2 gap-3">
            {[
              { label: "New leads", value: summary.newLeads },
              { label: "Upcoming consultations", value: summary.consultations },
              { label: "Active projects", value: summary.activeProjects },
              { label: "Outstanding invoices", value: formatMoney(summary.outstandingInvoiceTotal) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-line bg-mist px-3 py-2.5">
                <dt className="text-2xs text-slate">{stat.label}</dt>
                <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-ink">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </AdminCard>
      </div>
    </div>
  );
}
