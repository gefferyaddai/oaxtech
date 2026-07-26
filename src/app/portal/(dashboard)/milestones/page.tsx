import { PortalPage } from "@/components/portal/PortalPage";
import { MilestonesWidget } from "@/components/portal/widgets";

export default function Page() {
  return (
    <PortalPage title="Milestones" description="Key dates and their current status.">
      <MilestonesWidget />
    </PortalPage>
  );
}
