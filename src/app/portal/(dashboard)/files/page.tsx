import { PortalPage } from "@/components/portal/PortalPage";
import { FilesWidget } from "@/components/portal/widgets";

export default function Page() {
  return (
    <PortalPage title="Files" description="Shared project files and folders.">
      <FilesWidget />
    </PortalPage>
  );
}
