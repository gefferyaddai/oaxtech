import { Container } from "@/components/layout/Container";
import { CornerTicks, TitleBlock } from "@/components/ui/Drawing";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface HeroBullet {
  label: string;
  icon: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  bullets?: HeroBullet[];
  /** Visual placed alongside the copy on large screens. */
  visual?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
  /** Centred, no visual — used by simpler pages. */
  centered?: boolean;
  /** Sheet number for the title block. Defaults to the cover sheet. */
  sheetNo?: string;
}

/**
 * Shared hero for every public page except the homepage, which composes its
 * own first viewport (the hero carries the run's thesis and a shared component
 * would flatten it).
 *
 * Rendered as the top of a drawing sheet: a bordered field with registration
 * ticks, the title set oversized against the sheet's left edge, and a title
 * block at the foot recording where you are in the set.
 *
 * On mobile the copy always comes first; the visual stacks below and never
 * covers the headline.
 */
export function PageHero({
  eyebrow, title, description, actions, bullets, visual, breadcrumb, className, centered,
  sheetNo = "SHT 00",
}: PageHeroProps) {
  return (
    <section className={cn("relative border-b-[3px] border-graphite bg-sheet", className)}>
      <Container className="relative py-10 md:py-14 lg:py-16">
        {breadcrumb}

        <div className="relative border border-line px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <CornerTicks />

          <div
            className={cn(
              "grid grid-cols-1 items-start gap-10",
              visual && !centered ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14" : "",
              centered && "justify-items-center text-center",
            )}
          >
            <div className={cn("min-w-0", centered && "max-w-3xl")}>
              {eyebrow && (
                <p className={cn("eyebrow mb-5 animate-sheet-in", centered && "justify-center")}>
                  {eyebrow}
                </p>
              )}
              <h1 className="animate-sheet-in text-display-xl [animation-delay:60ms]">{title}</h1>
              {description && (
                <p
                  className={cn(
                    "mt-6 max-w-prose animate-sheet-in text-lg leading-relaxed text-pencil [animation-delay:120ms]",
                    centered && "mx-auto",
                  )}
                >
                  {description}
                </p>
              )}
              {actions && (
                <div
                  className={cn(
                    "mt-9 flex flex-wrap animate-sheet-in gap-4 [animation-delay:180ms]",
                    centered && "justify-center",
                  )}
                >
                  {actions}
                </div>
              )}
              {bullets && bullets.length > 0 && (
                <ul
                  className={cn(
                    "mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5",
                    centered && "justify-center",
                  )}
                >
                  {bullets.map((bullet) => (
                    <li key={bullet.label} className="tally flex items-center gap-2 font-mono text-graphite">
                      <Icon name={bullet.icon} className="h-3.5 w-3.5 shrink-0 text-revision" />
                      {bullet.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {visual && !centered && <div className="min-w-0">{visual}</div>}
          </div>

          <TitleBlock
            className="mt-10"
            fields={[
              { label: "Drawn by", value: "OAX Tech" },
              { label: "Sheet", value: sheetNo },
              { label: "Location", value: "Calgary AB" },
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
