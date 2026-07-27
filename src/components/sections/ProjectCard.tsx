import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { OrbitalBackdrop } from "@/components/ui/OrbitalBackdrop";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  /** Reverses the media/copy order so alternating rows read naturally. */
  reversed?: boolean;
  className?: string;
}

/**
 * Featured project row. The "media" side is a built preview panel rather than a
 * screenshot dropped in as a background image, so the labels inside it stay
 * selectable and scale with the type system.
 */
export function ProjectCard({ project, reversed, className }: ProjectCardProps) {
  return (
    <article className={cn("card card-interactive overflow-hidden", className)}>
      <div
        className={cn(
          "grid gap-0 lg:grid-cols-2",
          reversed && "lg:[&>*:first-child]:order-2",
        )}
      >
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">{project.eyebrow}</p>
          <h3 className="mt-3 font-display text-display-sm">{project.name}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate sm:text-base">
            {project.summary}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-line bg-mist px-2.5 py-1 text-xs text-charcoal"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-cobalt"
              >
                Visit {project.externalLabel}
                <Icon
                  name="ArrowUpRight"
                  className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {project.caseStudyHref && (
              <Link
                href={project.caseStudyHref}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-cobalt"
              >
                View Project
                <Icon name="ArrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                <span className="sr-only"> — {project.name} case study</span>
              </Link>
            )}
          </div>

          <ul className="mt-7 grid gap-4 border-t border-line-subtle pt-6 sm:grid-cols-3">
            {project.highlights.map((highlight) => (
              <li key={highlight.label}>
                <Icon name={highlight.icon} className="mb-2 h-4.5 w-4.5 text-cobalt" />
                <p className="text-xs font-semibold text-ink">{highlight.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate">{highlight.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <ProjectPreview project={project} />
      </div>
    </article>
  );
}

/**
 * Lightweight, built-in-HTML preview of each project.
 *
 * Deliberately NOT a large screenshot: it keeps page weight low, avoids layout
 * shift, and means no important text lives inside an image. Rather than a
 * mocked-up browser window standing in for content that isn't there, the
 * preview surfaces the project's own real highlights against the orbital
 * motif that carries the rest of the site.
 */
function ProjectPreview({ project }: { project: Project }) {
  const dark = project.slug === "nasdaq-trading-automation";

  return (
    <div
      className={cn(
        "group/preview relative flex min-h-[280px] flex-col justify-center gap-7 overflow-hidden p-6 sm:p-8",
        dark ? "bg-space" : "bg-[linear-gradient(180deg,rgba(247,244,238,0.98),rgba(238,233,223,0.94))]",
      )}
    >
      <OrbitalBackdrop variant={dark ? "dark" : "light"} showNodes={false} className="opacity-70" />

      <div className="relative">
        <p className={cn("eyebrow", dark && "text-white/90")}>{project.eyebrow}</p>
        <p className={cn("mt-2 font-display text-xl font-semibold", dark ? "text-white" : "text-ink")}>
          {project.name}
        </p>
      </div>

      <ul className="relative grid grid-cols-3 gap-3">
        {project.highlights.map((h) => (
          <li
            key={h.label}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-3 text-center shadow-card transition-transform duration-300 ease-out group-hover/preview:-translate-y-0.5",
              dark ? "border-space-line bg-space-card" : "border-line bg-paper",
            )}
          >
            <Icon name={h.icon} className="h-5 w-5 text-cobalt" />
            <p className={cn("text-[0.65rem] font-medium leading-tight", dark ? "text-space-text" : "text-slate")}>
              {h.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface CompactProjectCardProps {
  project: Project;
}

/** Grid variant used when several projects appear side by side. */
export function CompactProjectCard({ project }: CompactProjectCardProps) {
  return (
    <article className="card card-interactive group flex h-full flex-col overflow-hidden">
      <div className="relative flex items-center justify-center gap-3 overflow-hidden border-b border-line bg-[linear-gradient(180deg,rgba(247,244,238,0.95),rgba(238,233,223,0.9))] py-8">
        <OrbitalBackdrop showNodes={false} className="opacity-60" />
        {project.highlights.slice(0, 3).map((h) => (
          <span
            key={h.label}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-paper text-cobalt shadow-card transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
          >
            <Icon name={h.icon} className="h-5 w-5" />
          </span>
        ))}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{project.eyebrow}</p>
        <h3 className="mt-2 font-display text-base font-semibold text-ink">{project.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{project.summary}</p>
        {project.caseStudyHref ? (
          <Link
            href={project.caseStudyHref}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cobalt"
          >
            View Project
            <Icon name="ArrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            <span className="sr-only"> — {project.name}</span>
          </Link>
        ) : project.externalUrl ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cobalt"
          >
            Visit {project.externalLabel}
            <Icon name="ArrowUpRight" className="h-4 w-4" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <span className="mt-4 text-sm text-muted">Private project</span>
        )}
      </div>
    </article>
  );
}
