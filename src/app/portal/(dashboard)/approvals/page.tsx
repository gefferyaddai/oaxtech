import type { Metadata } from "next";
import { PortalPage } from "@/components/portal/PortalPage";
import { ApprovalsWidget } from "@/components/portal/widgets";

export const metadata: Metadata = { title: "Design Approvals" };

export default function Page() {
  return (
    <PortalPage title="Design Approvals" description="Designs waiting on your review.">
      <ApprovalsWidget />
    </PortalPage>
  );
}
