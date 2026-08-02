import type { Metadata } from "next";
import { InvoicesView } from "@/components/admin/section-views";
import { getClients, getInvoices } from "@/lib/domain/repository";

export const metadata: Metadata = { title: "Invoices" };

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string }>;
}) {
  const [{ create }, invoices, clients] = await Promise.all([
    searchParams,
    getInvoices(),
    getClients(),
  ]);
  return <InvoicesView invoices={invoices} clients={clients} autoOpenCreate={create === "invoice"} />;
}
