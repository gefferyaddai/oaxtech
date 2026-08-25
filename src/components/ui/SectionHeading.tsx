import { DrawnRule } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Heading level — keeps the document outline logical on every page. */
  as?: "h2" | "h3";
  id?: string;
  action?: React.ReactNode;
  /** Sheet number shown on the rule, e.g. "SHT 03". */
  no?: string;
  /** Renders for the ink ground rather than the paper one. */
  tone?: "ink" | "paper";
}

/**
 * Section opening in the drawing grammar: a bar rule, the drawing number and
 * kicker sitting on it in the tally face, then the title set oversized.
 *
 * The API is unchanged from the previous design so every page that already
 * calls this picks up the new world without an edit. `no` and `tone` are new
 * and optional.
 */
export function SectionHeading({
  eyebrow, title, description, align = "center", className, as: Tag = "h2", id, action, no, tone = "ink",
}: SectionHeadingProps) {
  const centered = align === "center";
  const onInk = tone === "paper";

  return (
    <div className={cn("w-full", className)}>
      {/* The bar rule. Weight is what ranks a section here, so this is 6px
          and every subsection below it steps down to 3px or 1px. It draws
          itself from the left when the section enters view — the motion that
          repeats most often on the site, and the reason a page of static type
          reads as being drafted rather than loaded. */}
      <DrawnRule weight="bar" tone={onInk ? "paper" : "ink"} />

      <div
        className={cn(
          "flex flex-col gap-6 pt-5",
          action ? "sm:flex-row sm:items-end sm:justify-between sm:gap-10" : undefined,
          centered && "items-center text-center",
        )}
      >
        <div className={cn("flex min-w-0 flex-col", centered && "items-center")}>
          {(no || eyebrow) && (
            <div className="flex items-baseline gap-4">
              {no && (
                <span className={cn("tally font-mono", onInk ? "text-revision-onInk" : "text-revision-text")}>
                  {no}
                </span>
              )}
              {eyebrow && (
                <span className={cn("tally font-mono", onInk ? "text-ink-muted" : "text-faint")}>
                  {eyebrow}
                </span>
              )}
            </div>
          )}
          <Tag
            id={id}
            className={cn(
              "mt-3 text-display-lg",
              onInk ? "text-white" : "text-graphite",
              centered ? "max-w-[20ch]" : "max-w-[18ch]",
            )}
          >
            {title}
          </Tag>
          {description && (
            <p
              className={cn(
                "mt-4 max-w-prose text-base leading-relaxed",
                onInk ? "text-ink-text" : "text-pencil",
              )}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
