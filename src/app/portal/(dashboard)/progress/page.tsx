import type { Metadata } from "next";
import { PortalPage } from "@/components/portal/PortalPage";
import { ProgressWidget } from "@/components/portal/widgets";

export const metadata: Metadata = { title: "Project Progress" };

export default function Page() {
  return (
    <PortalPage title="Project Progress" description="Where your project stands across each phase.">
      <ProgressWidget />
    </PortalPage>
  );
}
