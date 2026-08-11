import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import {
  ActivityWidget,
  ApprovalsWidget,
  ContractsWidget,
  FilesWidget,
  InvoicesWidget,
  MessagesWidget,
  MilestonesWidget,
  ProgressWidget,
  RevisionsWidget,
  SummaryTiles,
  SupportWidget,
} from "@/components/portal/widgets";
import { Icon } from "@/components/ui/Icon";
import { canPersistChanges } from "@/lib/domain/mutations";
import { getSession } from "@/lib/portal/auth";
import {
  canShowInvoiceAmounts,
  getClientActivity,
  getClientApprovals,
  getClientFiles,
  getClientFolders,
  getClientInvoices,
  getClientMilestones,
  getClientProposals,
  getClientRevisions,
  getClientSupportTickets,
  getClientThreads,
  getPhaseSteps,
  getPrimaryProject,
  getThreadEntries,
} from "@/lib/portal/repository";
import { integrationStatus } from "@/lib/integrations";

/**
 * `absolute` because a layout's title template does not apply to the page in
 * its own segment.
 */
export const metadata: Metadata = {
  title: { absolute: "Overview · Client Portal | OAX Tech" },
};

export default async function PortalOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const [
    project,
    phases,
    milestones,
    approvals,
    revisions,
    files,
    folders,
    threads,
    proposals,
    invoices,
    tickets,
    activity,
  ] = await Promise.all([
    getPrimaryProject(clientId),
    getPhaseSteps(clientId),
    getClientMilestones(clientId),
    getClientApprovals(clientId),
    getClientRevisions(clientId),
    getClientFiles(clientId),
    getClientFolders(clientId),
    getClientThreads(clientId),
    getClientProposals(clientId),
    getClientInvoices(clientId),
    getClientSupportTickets(clientId),
    getClientActivity(clientId, 4),
  ]);

  const entries = threads[0] ? await getThreadEntries(clientId, threads[0].id) : [];
  const nextMilestone = milestones.find((milestone) => milestone.status !== "Completed") ?? null;
  const openApprovals = approvals.filter((a) => a.status === "Awaiting Client").length;
  const outstandingInvoices = invoices.filter(
    (invoice) => invoice.status === "Sent" || invoice.status === "Overdue",
  ).length;

  return (
    <PortalPage
      title="Welcome back"
      description="Here's the latest on your project."
      actions={
        <>
          <button
            type="button"
            disabled
            className="btn btn-sm btn-primary"
            title="Available once storage is connected"
          >
            <Icon name="Upload" className="h-4 w-4" />
            Upload File
          </button>
          <button
            type="button"
            disabled
            className="btn btn-sm btn-neutral"
            title="Available once the portal is connected"
          >
            <Icon name="Mail" className="h-4 w-4" />
            Message OAX Tech
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <SummaryTiles
          project={project}
          nextMilestone={nextMilestone}
          openApprovals={openApprovals}
          outstandingInvoices={outstandingInvoices}
        />
        <div className="grid gap-4 xl:grid-cols-3">
          <ProgressWidget project={project} phases={phases} />
          <MilestonesWidget milestones={milestones} />
          <ActivityWidget events={activity} />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <FilesWidget
            folders={folders}
            files={files}
            storageConfigured={integrationStatus.storage()}
          />
          <ApprovalsWidget approvals={approvals} canPersist={canPersistChanges()} />
          <RevisionsWidget
            revisions={revisions}
            projectId={project?.id ?? null}
            canPersist={canPersistChanges()}
          />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <MessagesWidget threads={threads} entries={entries} canPersist={canPersistChanges()} />
          <ContractsWidget proposals={proposals} />
          <InvoicesWidget invoices={invoices} showAmounts={canShowInvoiceAmounts()} />
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <SupportWidget tickets={tickets} canPersist={canPersistChanges()} />
        </div>
      </div>
    </PortalPage>
  );
}
