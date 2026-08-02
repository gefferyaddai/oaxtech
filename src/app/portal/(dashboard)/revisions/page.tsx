import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { RevisionsWidget } from "@/components/portal/widgets";
import { getSession } from "@/lib/portal/auth";
import { getClientRevisions } from "@/lib/portal/repository";

export const metadata: Metadata = { title: "Revision Requests" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const revisions = await getClientRevisions(clientId);

  return (
    <PortalPage title="Revision Requests" description="Changes you've asked for, and where they stand.">
      <RevisionsWidget revisions={revisions} />
    </PortalPage>
  );
}
