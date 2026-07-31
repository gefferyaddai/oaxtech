import type { Metadata } from "next";
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

/**
 * `absolute` because a layout's title template does not apply to the page in
 * its own segment — without this the root template wins and the portal's
 * landing page is the only one missing "Client Portal".
 */
export const metadata: Metadata = {
  title: { absolute: "Overview · Client Portal | OAX Tech" },
};

export default function PortalOverviewPage() {
  return (
    <PortalPage
      title="Welcome back"
      description="Here's the latest on your project."
      actions={
        <>
          <button type="button" disabled className="btn btn-sm btn-primary" title="Available once storage is connected">
            <Icon name="Upload" className="h-4 w-4" />
            Upload File
          </button>
          <button type="button" disabled className="btn btn-sm btn-neutral" title="Available in the live portal">
            <Icon name="Mail" className="h-4 w-4" />
            Message OAX Tech
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <SummaryTiles />
        <div className="grid gap-4 xl:grid-cols-3">
          <ProgressWidget />
          <MilestonesWidget />
          <ActivityWidget />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <FilesWidget />
          <ApprovalsWidget />
          <RevisionsWidget />
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <MessagesWidget />
          <ContractsWidget />
          <InvoicesWidget />
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <SupportWidget />
        </div>
      </div>
    </PortalPage>
  );
}
