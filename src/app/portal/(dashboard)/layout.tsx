import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DemoBanner } from "@/components/portal/DemoBanner";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { PortalTopbar } from "@/components/portal/PortalTopbar";
import { getSession, isDemoMode } from "@/lib/portal/auth";

/** The portal is never indexed. Also enforced by a header in next.config.ts. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Protected layout: without a session every portal route redirects to login.
  if (!session) redirect("/portal/login");

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] bg-mist">
      <PortalSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <PortalTopbar sessionLabel={session.label} />
        {(isDemoMode() || session.isDemo) && <DemoBanner />}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
