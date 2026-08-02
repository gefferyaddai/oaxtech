import type { Metadata } from "next";
import { ContentView } from "@/components/admin/section-views";
import { getContent, getTeam } from "@/lib/domain/repository";

export const metadata: Metadata = { title: "Website Content" };

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ create?: string }>;
}) {
  const [{ create }, content, team] = await Promise.all([searchParams, getContent(), getTeam()]);
  return <ContentView content={content} team={team} autoOpenCreate={create === "article"} />;
}
