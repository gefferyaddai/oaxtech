import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { CompletedFilesWidget } from "@/components/portal/widgets";
import { getSession } from "@/lib/portal/auth";
import { getPrimaryProject } from "@/lib/portal/repository";

export const metadata: Metadata = { title: "Completed Files" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const project = await getPrimaryProject(clientId);

  return (
    <PortalPage title="Completed Files" description="Final assets, released once your project is signed off.">
      <CompletedFilesWidget project={project} />
    </PortalPage>
  );
}
