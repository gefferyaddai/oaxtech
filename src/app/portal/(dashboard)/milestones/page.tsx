import type { Metadata } from "next";
import { PortalPage } from "@/components/portal/PortalPage";
import { MilestonesWidget } from "@/components/portal/widgets";

export const metadata: Metadata = { title: "Milestones" };

export default function Page() {
  return (
    <PortalPage title="Milestones" description="Key dates and their current status.">
      <MilestonesWidget />
    </PortalPage>
  );
}
