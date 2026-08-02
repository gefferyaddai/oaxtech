import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { FilesWidget } from "@/components/portal/widgets";
import { getSession } from "@/lib/portal/auth";
import { getClientFiles, getClientFolders } from "@/lib/portal/repository";
import { integrationStatus } from "@/lib/integrations";

export const metadata: Metadata = { title: "Files" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const [files, folders] = await Promise.all([
    getClientFiles(clientId),
    getClientFolders(clientId),
  ]);

  return (
    <PortalPage title="Files" description="Deliverables shared with you by the project team.">
      <FilesWidget folders={folders} files={files} storageConfigured={integrationStatus.storage()} />
    </PortalPage>
  );
}
