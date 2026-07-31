import type { Metadata } from "next";
import { SupportView } from "@/components/admin/section-views";
import { getClients, getSupportTickets, getTeam } from "@/lib/admin/repository";

export const metadata: Metadata = { title: "Support" };

export default async function SupportPage() {
  const [tickets, clients, team] = await Promise.all([
    getSupportTickets(),
    getClients(),
    getTeam(),
  ]);
  return <SupportView tickets={tickets} clients={clients} team={team} />;
}
