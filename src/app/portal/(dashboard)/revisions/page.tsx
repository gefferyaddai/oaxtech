import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { RevisionsWidget } from "@/components/portal/widgets";
import { canPersistChanges } from "@/lib/domain/mutations";
import { getSession } from "@/lib/portal/auth";
import { getClientRevisions, getPrimaryProject } from "@/lib/portal/repository";

export const metadata: Metadata = { title: "Revision Requests" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const [revisions, project] = await Promise.all([
    getClientRevisions(clientId),
    getPrimaryProject(clientId),
  ]);

  return (
    <PortalPage title="Revision Requests" description="Changes you've asked for, and where they stand.">
      <RevisionsWidget
        revisions={revisions}
        projectId={project?.id ?? null}
        canPersist={canPersistChanges()}
      />
    </PortalPage>
  );
}
