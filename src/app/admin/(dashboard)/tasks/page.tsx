import type { Metadata } from "next";
import { TasksView } from "@/components/admin/section-views";
import { getProjects, getTasks, getTeam } from "@/lib/admin/repository";

export const metadata: Metadata = { title: "Tasks" };

export default async function TasksPage() {
  const [tasks, team, projects] = await Promise.all([getTasks(), getTeam(), getProjects()]);
  return <TasksView tasks={tasks} team={team} projects={projects} />;
}
