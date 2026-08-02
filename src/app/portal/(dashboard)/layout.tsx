import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DemoBanner } from "@/components/portal/DemoBanner";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { PortalTopbar } from "@/components/portal/PortalTopbar";
import { getSession, isDemoMode } from "@/lib/portal/auth";
import { getClientProjects } from "@/lib/portal/repository";

/**
 * The portal is never indexed. Also enforced by a header in next.config.ts.
 *
 * The template is spelled out in full (rather than leaning on the root
 * layout's) because the closest ancestor template wins — a parent template is
 * not re-applied to a child's result.
 */
export const metadata: Metadata = {
  title: {
    default: "Client Portal | OAX Tech",
    template: "%s · Client Portal | OAX Tech",
  },
  robots: { index: false, follow: false, nocache: true },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Protected layout: without a session every portal route redirects to login.
  if (!session) redirect("/portal/login");

  // Fetched once here and passed down, so no component reaches for data itself.
  const projects = await getClientProjects(session.clientId);

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] bg-mist">
      <PortalSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <PortalTopbar sessionLabel={session.label} projects={projects} />
        {(isDemoMode() || session.isDemo) && <DemoBanner />}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
