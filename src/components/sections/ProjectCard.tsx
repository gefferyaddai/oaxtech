import { ArrowLink, CornerTicks } from "@/components/ui/Drawing";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Projects rendered as detail sheets.
 *
 * The previous design put a decorative orbital panel beside each project. This
 * replaces it with the thing a drawing set would actually carry: a schedule.
 * Each project's real highlights are listed as numbered rows against rules,
 * which is both more informative and more honest — it shows what was built
 * rather than gesturing at a screenshot that does not exist.
 */

interface ProjectCardProps {
  project: Project;
  /** Reverses the media/copy order so alternating rows read naturally. */
  reversed?: boolean;
  className?: string;
}

export function ProjectCard({ project, reversed, className }: ProjectCardProps) {
  return (
    <article
      className={cn("plate relative", className)}
      style={{ viewTransitionName: `project-${project.slug}` }}
    >
      <CornerTicks />
      <div className={cn("grid gap-0 lg:grid-cols-2", reversed && "lg:[&>*:first-child]:order-2")}>
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">{project.eyebrow}</p>
          <h3 className="mt-4 text-display-md">{project.name}</h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-pencil">{project.summary}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="tally border border-graphite px-2.5 py-1 font-mono text-graphite">
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/ext inline-flex items-center gap-2 font-display text-base font-bold uppercase tracking-wide text-revision-text underline decoration-revision/50 decoration-2 underline-offset-[6px] transition-colors hover:decoration-revision"
              >
                Visit {project.externalLabel}
                <Icon
                  name="ArrowUpRight"
                  className="h-4 w-4 transition-transform duration-200 group-hover/ext:-translate-y-0.5 group-hover/ext:translate-x-0.5"
                />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {project.caseStudyHref && (
              <ArrowLink href={project.caseStudyHref} srSuffix={`— ${project.name} case study`}>
                View project
              </ArrowLink>
            )}
          </div>
        </div>

        <ProjectSchedule project={project} />
      </div>
    </article>
  );
}

/**
 * The schedule: the project's real highlights as numbered rows.
 *
 * Built in HTML rather than dropped in as an image, so nothing important lives
 * inside a raster, the text stays selectable, and there is no layout shift.
 */
function ProjectSchedule({ project }: { project: Project }) {
  return (
    <div className="flex flex-col justify-center border-t border-line bg-sheet-sunk p-6 sm:p-8 lg:border-l lg:border-t-0">
      <div className="flex items-baseline justify-between border-b-rule border-graphite pb-2">
        <span className="tally font-mono text-graphite">Schedule</span>
        <span className="tally font-mono text-faint nums">
          {String(project.highlights.length).padStart(2, "0")} items
        </span>
      </div>

      <ul>
        {project.highlights.map((highlight, index) => (
          <li key={highlight.label} className="flex gap-4 border-b border-line py-4 last:border-b-0">
            <span aria-hidden="true" className="tally shrink-0 pt-1 font-mono text-revision-text nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-graphite bg-chalk text-graphite">
              <Icon name={highlight.icon} className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-base font-bold uppercase leading-none text-graphite">
                {highlight.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-pencil">{highlight.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface CompactProjectCardProps {
  project: Project;
  /** Sheet number printed on the card's head rule. */
  no?: string;
}

/**
 * Grid variant used when several projects appear side by side.
 *
 * The head is an ink band carrying the drawing number and the project's
 * capability icons, so a row of these reads as a set of sheets rather than a
 * row of identical white boxes.
 */
export function CompactProjectCard({ project, no }: CompactProjectCardProps) {
  return (
    <article className="plate plate-interactive group flex h-full flex-col">
      <div className="relative flex items-center justify-between gap-3 bg-ink px-5 py-4">
        <span aria-hidden="true" className="tally font-mono text-revision-onInk nums">
          {no ?? project.eyebrow}
        </span>
        <span className="flex gap-2">
          {project.highlights.slice(0, 3).map((h) => (
            <span
              key={h.label}
              className="inline-flex h-9 w-9 items-center justify-center border border-ink-line text-ink-text transition-colors duration-200 group-hover:border-revision-onInk group-hover:text-revision-onInk"
            >
              <Icon name={h.icon} className="h-4 w-4" />
            </span>
          ))}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-display-xs text-graphite">{project.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-pencil">{project.summary}</p>

        <div className="mt-5 border-t border-line pt-4">
          {project.caseStudyHref ? (
            <ArrowLink
              href={project.caseStudyHref}
              tone="revision"
              className="text-sm"
              srSuffix={`— ${project.name}`}
            >
              View project
            </ArrowLink>
          ) : project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/ext inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-revision-text underline decoration-revision/50 decoration-2 underline-offset-[6px]"
            >
              Visit {project.externalLabel}
              <Icon
                name="ArrowUpRight"
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover/ext:-translate-y-0.5 group-hover/ext:translate-x-0.5"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span className="tally font-mono text-faint">Private project</span>
          )}
        </div>
      </div>
    </article>
  );
}
