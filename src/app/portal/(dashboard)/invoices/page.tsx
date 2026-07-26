import { PortalPage } from "@/components/portal/PortalPage";
import { InvoicesWidget } from "@/components/portal/widgets";

export default function Page() {
  return (
    <PortalPage title="Invoices \& Payments" description="Billing records for your project.">
      <InvoicesWidget />
    </PortalPage>
  );
}
