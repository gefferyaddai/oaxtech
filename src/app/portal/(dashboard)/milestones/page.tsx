import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { MilestonesWidget } from "@/components/portal/widgets";
import { getSession } from "@/lib/portal/auth";
import { getClientMilestones } from "@/lib/portal/repository";

export const metadata: Metadata = { title: "Milestones" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const milestones = await getClientMilestones(clientId);

  return (
    <PortalPage title="Milestones" description="Key dates across your project.">
      <MilestonesWidget milestones={milestones} />
    </PortalPage>
  );
}
