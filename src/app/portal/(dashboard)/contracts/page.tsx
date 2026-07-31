import type { Metadata } from "next";
import { PortalPage } from "@/components/portal/PortalPage";
import { ContractsWidget } from "@/components/portal/widgets";

export const metadata: Metadata = { title: "Proposals & Contracts" };

export default function Page() {
  return (
    <PortalPage title="Proposals \& Contracts" description="Project documents and their status.">
      <ContractsWidget />
    </PortalPage>
  );
}
