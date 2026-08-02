import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { ProgressWidget } from "@/components/portal/widgets";
import { getSession } from "@/lib/portal/auth";
import { getPhaseSteps, getPrimaryProject } from "@/lib/portal/repository";

export const metadata: Metadata = { title: "Project Progress" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const [project, phases] = await Promise.all([
    getPrimaryProject(clientId),
    getPhaseSteps(clientId),
  ]);

  return (
    <PortalPage title="Project Progress" description="Where your project stands right now.">
      <ProgressWidget project={project} phases={phases} />
    </PortalPage>
  );
}
