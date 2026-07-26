import { PortalPage } from "@/components/portal/PortalPage";
import { ApprovalsWidget } from "@/components/portal/widgets";

export default function Page() {
  return (
    <PortalPage title="Design Approvals" description="Designs waiting on your review.">
      <ApprovalsWidget />
    </PortalPage>
  );
}
