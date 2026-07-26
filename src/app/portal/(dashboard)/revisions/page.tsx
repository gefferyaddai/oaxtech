import { PortalPage } from "@/components/portal/PortalPage";
import { RevisionsWidget } from "@/components/portal/widgets";

export default function Page() {
  return (
    <PortalPage title="Revision Requests" description="Changes you've asked for and where they stand.">
      <RevisionsWidget />
    </PortalPage>
  );
}
