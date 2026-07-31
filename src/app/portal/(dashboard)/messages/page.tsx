import type { Metadata } from "next";
import { PortalPage } from "@/components/portal/PortalPage";
import { MessagesWidget } from "@/components/portal/widgets";

export const metadata: Metadata = { title: "Messages" };

export default function Page() {
  return (
    <PortalPage title="Messages" description="Your conversation with the project team.">
      <MessagesWidget />
    </PortalPage>
  );
}
