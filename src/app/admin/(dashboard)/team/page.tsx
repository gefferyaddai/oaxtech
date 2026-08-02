import type { Metadata } from "next";
import { TeamView } from "@/components/admin/section-views";
import { getTeam } from "@/lib/domain/repository";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const team = await getTeam();
  return <TeamView team={team} />;
}
