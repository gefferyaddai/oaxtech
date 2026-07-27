"use client";

import { useMemo, useState } from "react";
import { FilterTabs } from "@/components/sections/FilterTabs";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { EmptyState } from "@/components/ui/States";
import { ButtonLink } from "@/components/ui/Button";
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from "@/data/projects";
import { withViewTransition } from "@/lib/view-transition";

type Filter = "All Projects" | ProjectCategory;

const FILTERS: readonly Filter[] = ["All Projects", ...PROJECT_CATEGORIES] as const;

interface WorkFilterProps {
  projects: Project[];
}

/**
 * Client-side project filtering.
 *
 * All projects are rendered from data already on the page, so switching filters
 * costs no network request. The result count is announced politely so screen
 * reader users know the list changed.
 */
export function WorkFilter({ projects }: WorkFilterProps) {
  const [active, setActive] = useState<Filter>("All Projects");

  const counts = useMemo(() => {
    const map: Record<string, number> = { "All Projects": projects.length };
    for (const category of PROJECT_CATEGORIES) {
      map[category] = projects.filter((p) => p.categories.includes(category)).length;
    }
    return map;
  }, [projects]);

  const visible = useMemo(
    () =>
      active === "All Projects"
        ? projects
        : projects.filter((p) => p.categories.includes(active)),
    [active, projects],
  );

  return (
    <div>
      <FilterTabs
        options={FILTERS}
        active={active}
        onChange={(next) => withViewTransition(() => setActive(next))}
        label="Filter projects by category"
        counts={counts}
      />

      <p className="sr-only" role="status" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {active === "All Projects" ? "" : ` in ${active}`}.
      </p>

      {visible.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="Filter"
          title={`No projects in ${active} yet`}
          description="We're adding new work as it goes live. In the meantime, tell us what you're trying to build."
          action={
            <ButtonLink href="/quote" variant="outline" size="sm">
              Start a Project
            </ButtonLink>
          }
        />
      ) : (
        <div className="mt-8 space-y-5">
          {visible.map((project, index) => (
            <ProjectCard key={project.slug} project={project} reversed={index % 2 === 1} />
          ))}
        </div>
      )}
    </div>
  );
}
