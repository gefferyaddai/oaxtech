import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { SupportWidget } from "@/components/portal/widgets";
import { canPersistChanges } from "@/lib/domain/mutations";
import { getSession } from "@/lib/portal/auth";
import { getClientSupportTickets } from "@/lib/portal/repository";

export const metadata: Metadata = { title: "Support" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const tickets = await getClientSupportTickets(clientId);

  return (
    <PortalPage title="Support" description="Requests you've raised with the team.">
      <SupportWidget tickets={tickets} canPersist={canPersistChanges()} />
    </PortalPage>
  );
}
