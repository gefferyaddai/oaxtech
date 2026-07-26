import { PortalPage } from "@/components/portal/PortalPage";
import { SupportWidget } from "@/components/portal/widgets";

export default function Page() {
  return (
    <PortalPage title="Support" description="Open a request or track an existing one.">
      <SupportWidget />
    </PortalPage>
  );
}
