import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalPage } from "@/components/portal/PortalPage";
import { InvoicesWidget } from "@/components/portal/widgets";
import { getSession } from "@/lib/portal/auth";
import { canShowInvoiceAmounts, getClientInvoices } from "@/lib/portal/repository";

export const metadata: Metadata = { title: "Invoices & Payments" };

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/portal/login");
  const { clientId } = session;

  const invoices = await getClientInvoices(clientId);

  return (
    <PortalPage title="Invoices & Payments" description="Billing for your project.">
      <InvoicesWidget invoices={invoices} showAmounts={canShowInvoiceAmounts()} />
    </PortalPage>
  );
}
