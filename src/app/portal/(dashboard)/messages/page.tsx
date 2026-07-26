import { PortalPage } from "@/components/portal/PortalPage";
import { MessagesWidget } from "@/components/portal/widgets";

export default function Page() {
  return (
    <PortalPage title="Messages" description="Your conversation with the project team.">
      <MessagesWidget />
    </PortalPage>
  );
}
