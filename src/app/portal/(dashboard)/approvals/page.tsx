import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { ApprovalsWidget } from "@/components/portal/widgets";
import { canPersistChanges } from "@/lib/domain/mutations";
import { getSession } from "@/lib/portal/auth";
import { getClientApprovals } from "@/lib/portal/repository";

export const metadata: Metadata = { title: "Design Approvals" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const approvals = await getClientApprovals(clientId);

  return (
    <PortalPage title="Design Approvals" description="Designs waiting on your sign-off.">
      <ApprovalsWidget approvals={approvals} canPersist={canPersistChanges()} />
    </PortalPage>
  );
}
