import type { Metadata } from "next";
import { LeadsView } from "@/components/admin/section-views";
import { getLeads, getTeam } from "@/lib/domain/repository";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string }>;
}) {
  const [{ create }, leads, team] = await Promise.all([searchParams, getLeads(), getTeam()]);
  return <LeadsView leads={leads} team={team} autoOpenCreate={create === "lead"} />;
}
