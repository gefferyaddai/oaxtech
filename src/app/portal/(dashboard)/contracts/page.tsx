import { PortalPage } from "@/components/portal/PortalPage";
import { ContractsWidget } from "@/components/portal/widgets";

export default function Page() {
  return (
    <PortalPage title="Proposals \& Contracts" description="Project documents and their status.">
      <ContractsWidget />
    </PortalPage>
  );
}
