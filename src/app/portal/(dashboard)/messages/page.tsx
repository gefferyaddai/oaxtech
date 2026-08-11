import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { MessagesWidget } from "@/components/portal/widgets";
import { canPersistChanges } from "@/lib/domain/mutations";
import { getSession } from "@/lib/portal/auth";
import { getClientThreads, getThreadEntries } from "@/lib/portal/repository";

export const metadata: Metadata = { title: "Messages" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const threads = await getClientThreads(clientId);
  const entries = threads[0] ? await getThreadEntries(clientId, threads[0].id) : [];

  return (
    <PortalPage title="Messages" description="Your conversation with the project team.">
      <MessagesWidget threads={threads} entries={entries} canPersist={canPersistChanges()} />
    </PortalPage>
  );
}
