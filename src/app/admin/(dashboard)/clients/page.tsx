import type { Metadata } from "next";
import { ClientsView } from "@/components/admin/section-views";
import { getClients } from "@/lib/domain/repository";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string }>;
}) {
  const [{ create }, clients] = await Promise.all([searchParams, getClients()]);
  return <ClientsView clients={clients} autoOpenCreate={create === "client"} />;
}
