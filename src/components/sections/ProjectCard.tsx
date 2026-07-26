import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
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
    <article className={cn("card overflow-hidden", className)}>
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
 * shift, and means no important text lives inside an image.
 */
function ProjectPreview({ project }: { project: Project }) {
  const dark = project.slug === "nasdaq-trading-automation";

  return (
    <div
      className={cn(
        "relative flex min-h-[280px] items-center justify-center overflow-hidden p-6 sm:p-8",
        dark ? "bg-space" : "bg-mist",
      )}
    >
      <div
        className={cn(
          "w-full max-w-sm rounded-xl border shadow-card",
          dark ? "border-space-line bg-space-raised" : "border-line bg-paper",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 border-b px-3 py-2.5",
            dark ? "border-space-line" : "border-line-subtle",
          )}
        >
          <span className="h-2 w-2 rounded-full bg-danger/60" />
          <span className="h-2 w-2 rounded-full bg-warning/60" />
          <span className="h-2 w-2 rounded-full bg-success/60" />
          <span
            className={cn(
              "ml-2 truncate text-2xs",
              dark ? "text-space-text" : "text-muted",
            )}
          >
            {project.name}
          </span>
        </div>

        <div className="space-y-3 p-4">
          <div
            className={cn(
              "h-2 w-3/5 rounded-full",
              dark ? "bg-white/15" : "bg-line-strong",
            )}
          />
          <div
            className={cn("h-2 w-2/5 rounded-full", dark ? "bg-white/10" : "bg-line")}
          />
          <div className="grid grid-cols-3 gap-2 pt-1">
            {project.highlights.map((h) => (
              <div
                key={h.label}
                className={cn(
                  "rounded-lg border p-2.5",
                  dark ? "border-space-line bg-space" : "border-line bg-mist",
                )}
              >
                <Icon
                  name={h.icon}
                  className={cn("h-4 w-4", dark ? "text-cobalt" : "text-cobalt")}
                />
                <p
                  className={cn(
                    "mt-1.5 text-[0.6875rem] leading-tight",
                    dark ? "text-space-text" : "text-slate",
                  )}
                >
                  {h.label}
                </p>
              </div>
            ))}
          </div>
          <div
            className={cn(
              "flex h-16 items-end gap-1 rounded-lg border p-2",
              dark ? "border-space-line bg-space" : "border-line bg-mist",
            )}
            aria-hidden="true"
          >
            {[38, 52, 44, 68, 58, 80, 72, 92].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm bg-cobalt/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
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
      <div className="border-b border-line bg-mist p-5">
        <div className="rounded-lg border border-line bg-paper p-3">
          <div className="mb-2.5 h-1.5 w-2/5 rounded-full bg-line-strong" />
          <div className="flex gap-1.5">
            {project.highlights.slice(0, 3).map((h) => (
              <span
                key={h.label}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-cobalt-soft text-cobalt"
              >
                <Icon name={h.icon} className="h-3.5 w-3.5" />
              </span>
            ))}
          </div>
        </div>
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
