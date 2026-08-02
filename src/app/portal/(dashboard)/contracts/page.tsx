import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { ContractsWidget } from "@/components/portal/widgets";
import { getSession } from "@/lib/portal/auth";
import { getClientProposals } from "@/lib/portal/repository";

export const metadata: Metadata = { title: "Proposals & Contracts" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const proposals = await getClientProposals(clientId);

  return (
    <PortalPage title="Proposals & Contracts" description="Documents issued for your project.">
      <ContractsWidget proposals={proposals} />
    </PortalPage>
  );
}
