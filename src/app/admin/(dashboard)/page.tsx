import type { Metadata } from "next";
import Link from "next/link";
import { RevenueChart, LeadSourcesChart } from "@/components/admin/charts";
import { LeadPipeline } from "@/components/admin/LeadPipeline";
import { AdminCard, MetricCard, PageHeader } from "@/components/admin/primitives";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { SectionBoundary } from "@/components/admin/SectionBoundary";
import { TaskList } from "@/components/admin/TaskList";
import {
  ActivityFeed,
  QuickActions,
  SystemOverview,
  TeamWorkload,
  UpcomingConsultations,
} from "@/components/admin/widgets";
import { Icon } from "@/components/ui/Icon";
import { formatMoney, greeting, percentChange } from "@/lib/admin/format";
import { canPersistChanges } from "@/lib/domain/mutations";
import {
  getActiveProjects,
  getActivity,
  getClients,
  getDashboardSummary,
  getLeadSources,
  getLeads,
  getProjects,
  getRevenueSeries,
  getSystemStatus,
  getTasks,
  getTasksNeedingAttention,
  getTeam,
  getUpcomingConsultations,
} from "@/lib/domain/repository";

export const metadata: Metadata = {
  title: { absolute: "Overview · Admin | OAX Tech" },
};

export default async function AdminOverviewPage() {
  const [
    summary,
    leads,
    team,
    clients,
    projects,
    activeProjects,
    tasks,
    attentionTasks,
    consultations,
    activity,
    revenue,
    leadSources,
  ] = await Promise.all([
    getDashboardSummary(),
    getLeads(),
    getTeam(),
    getClients(),
    getProjects(),
    getActiveProjects(),
    getTasks(),
    getTasksNeedingAttention(6),
    getUpcomingConsultations(4),
    getActivity(6),
    getRevenueSeries(),
    getLeadSources(),
  ]);

  const services = getSystemStatus();
  const leadDelta = percentChange(summary.newLeads, summary.newLeadsPrevious);

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <PageHeader
        eyebrow={
          <p className="text-2xs font-semibold uppercase tracking-[0.12em] text-cobalt">
            {greeting()}
          </p>
        }
        title="Here's what's happening across OAX Tech."
        actions={
          <>
            <label className="min-w-0">
              <span className="sr-only">Select date range</span>
              <select className="field-control min-h-[2.25rem] py-1.5 text-sm" defaultValue="30">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </label>
            <Link href="/admin/analytics" className="btn btn-sm btn-primary">
              <Icon name="BarChart3" className="h-4 w-4" />
              View Reports
            </Link>
          </>
        }
      />

      {/* Summary cards ---------------------------------------------------- */}
      <section aria-label="Summary" className="mt-5">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <li>
            <MetricCard
              label="New Leads"
              value={summary.newLeads}
              icon="Target"
              href="/admin/leads"
              comparison={leadDelta === null ? "No baseline" : `${leadDelta > 0 ? "+" : ""}${leadDelta}% vs previous`}
              trend={leadDelta === null ? "flat" : leadDelta > 0 ? "up" : leadDelta < 0 ? "down" : "flat"}
            />
          </li>
          <li>
            <MetricCard
              label="Consultations"
              value={summary.consultations}
              icon="Calendar"
              href="/admin/consultations"
              comparison="Upcoming"
            />
          </li>
          <li>
            <MetricCard
              label="Active Projects"
              value={summary.activeProjects}
              icon="Layers"
              href="/admin/projects"
              comparison={`${projects.length - summary.activeProjects} completed`}
            />
          </li>
          <li>
            <MetricCard
              label="Pending Approvals"
              value={summary.pendingApprovals}
              icon="CheckSquare"
              href="/admin/approvals"
              comparison="Awaiting client"
              trend={summary.pendingApprovals > 0 ? "up" : "flat"}
              invertTrend
            />
          </li>
          <li>
            <MetricCard
              label="Outstanding Invoices"
              value={formatMoney(summary.outstandingInvoiceTotal)}
              icon="Receipt"
              href="/admin/invoices"
              comparison={`${summary.outstandingInvoices} unpaid`}
              trend={summary.outstandingInvoices > 0 ? "up" : "flat"}
              invertTrend
            />
          </li>
          <li>
            <MetricCard
              label="Open Support Requests"
              value={summary.openSupportRequests}
              icon="LifeBuoy"
              href="/admin/support"
              comparison="Needs a response"
              trend={summary.openSupportRequests > 0 ? "up" : "flat"}
              invertTrend
            />
          </li>
        </ul>
      </section>

      {/* Revenue + lead sources ------------------------------------------- */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <AdminCard
          title="Revenue overview"
          description="Revenue, payments received and outstanding balance."
          className="xl:col-span-2"
        >
          <SectionBoundary>
            <RevenueChart data={revenue} />
          </SectionBoundary>
        </AdminCard>

        <AdminCard title="Lead sources" description="Where enquiries came from.">
          <SectionBoundary>
            <LeadSourcesChart data={leadSources} />
          </SectionBoundary>
        </AdminCard>
      </div>

      {/* Lead pipeline ---------------------------------------------------- */}
      <div className="mt-4">
        <AdminCard
          title="Lead pipeline"
          description="Move a lead between stages using the control on its card."
          action={
            <Link href="/admin/leads" className="btn btn-sm btn-neutral">
              All leads
            </Link>
          }
        >
          <SectionBoundary>
            <LeadPipeline leads={leads} team={team} canPersist={canPersistChanges()} />
          </SectionBoundary>
        </AdminCard>
      </div>

      {/* Consultations + tasks -------------------------------------------- */}
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <AdminCard
          title="Upcoming consultations"
          action={
            <Link href="/admin/consultations" className="btn btn-sm btn-neutral">
              View all
            </Link>
          }
        >
          <SectionBoundary>
            <UpcomingConsultations consultations={consultations} />
          </SectionBoundary>
        </AdminCard>

        <AdminCard
          title="Tasks requiring attention"
          action={
            <Link href="/admin/tasks" className="btn btn-sm btn-neutral">
              All tasks
            </Link>
          }
        >
          <SectionBoundary>
            <TaskList
              tasks={attentionTasks}
              team={team}
              projects={projects}
              canPersist={canPersistChanges()}
            />
          </SectionBoundary>
        </AdminCard>
      </div>

      {/* Active projects -------------------------------------------------- */}
      <div className="mt-4">
        <AdminCard
          title="Active projects"
          action={
            <Link href="/admin/projects" className="btn btn-sm btn-neutral">
              All projects
            </Link>
          }
          flush
        >
          <SectionBoundary>
            <div className="px-4 py-4 sm:px-5">
              <ProjectsTable projects={activeProjects} clients={clients} team={team} />
            </div>
          </SectionBoundary>
        </AdminCard>
      </div>

      {/* Activity, workload, quick actions, system ------------------------ */}
      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        <AdminCard title="Recent client activity" className="xl:col-span-2">
          <SectionBoundary>
            <ActivityFeed events={activity} />
          </SectionBoundary>
        </AdminCard>

        <AdminCard title="Team workload">
          <SectionBoundary>
            <TeamWorkload team={team} />
          </SectionBoundary>
        </AdminCard>

        <div className="flex flex-col gap-4">
          <AdminCard title="Quick actions">
            <QuickActions />
          </AdminCard>
        </div>
      </div>

      <div className="mt-4">
        <AdminCard title="System overview">
          <SectionBoundary>
            <SystemOverview
              services={services}
              counts={{
                teamMembers: team.length,
                activeClients: clients.filter((client) => client.status === "Active").length,
                activeProjects: activeProjects.length,
                openTasks: tasks.filter((task) => !task.completed).length,
              }}
            />
          </SectionBoundary>
        </AdminCard>
      </div>
    </div>
  );
}
