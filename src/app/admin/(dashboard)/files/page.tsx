import type { Metadata } from "next";
import { FilesView } from "@/components/admin/section-views";
import { getFiles, getProjects, getTeam } from "@/lib/domain/repository";

export const metadata: Metadata = { title: "Files" };

export default async function FilesPage() {
  const [files, projects, team] = await Promise.all([getFiles(), getProjects(), getTeam()]);
  return <FilesView files={files} projects={projects} team={team} />;
}
