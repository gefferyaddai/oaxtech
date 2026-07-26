import { PortalPage } from "@/components/portal/PortalPage";
import { CompletedFilesWidget } from "@/components/portal/widgets";

export default function Page() {
  return (
    <PortalPage title="Completed Files" description="Final deliverables, released at project completion.">
      <CompletedFilesWidget />
    </PortalPage>
  );
}
