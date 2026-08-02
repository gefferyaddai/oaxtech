import type { Metadata } from "next";
import Link from "next/link";
import { AdminCard, PageHeader } from "@/components/admin/primitives";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { SectionBoundary } from "@/components/admin/SectionBoundary";
import { Icon } from "@/components/ui/Icon";
import { getClients, getProjects, getTeam } from "@/lib/domain/repository";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const [projects, clients, team] = await Promise.all([getProjects(), getClients(), getTeam()]);

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <PageHeader
        title="Projects"
        description="Every engagement, active and completed."
        actions={
          <Link href="/admin/projects?create=project" className="btn btn-sm btn-primary">
            <Icon name="Plus" className="h-4 w-4" />
            Create Project
          </Link>
        }
      />
      <AdminCard className="mt-5">
        <SectionBoundary>
          <ProjectsTable projects={projects} clients={clients} team={team} />
        </SectionBoundary>
      </AdminCard>
    </div>
  );
}
