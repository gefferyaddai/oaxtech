import { ArrowLink } from "@/components/ui/Drawing";
import { Icon } from "@/components/ui/Icon";
import type { Service } from "@/data/services";
import { layerFor } from "@/lib/layers";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Pick<Service, "shortTitle" | "summary" | "icon" | "href" | "ctaLabel"> &
    Partial<Pick<Service, "slug">>;
  className?: string;
  /** Sheet number printed large behind the card's head. */
  no?: string;
}

/**
 * A service rendered as a detail sheet.
 *
 * The card is a clipped plate — the top-right corner is cut away so the ground
 * shows through, which is the system's container shape everywhere. Elevation
 * is a hard offset copy of the plate rather than a blur, and hovering slides
 * the plate off its shadow instead of glowing.
 */
export function ServiceCard({ service, className, no }: ServiceCardProps) {
  /* Each discipline is a drawing layer with its own pen colour. The card's
     icon plate and layer tag carry it; the action link stays violet, because
     violet is the only colour on this site that means "act on this". */
  const layer = layerFor(service.slug);

  return (
    <article
      className={cn(
        "plate plate-clipped plate-interactive group relative flex h-full flex-col p-6",
        className,
      )}
    >
      {/* The drawing number, set large and low-contrast as a ground mark. It
          is aria-hidden: the visible heading already names the service, and a
          screen reader has no use for a decorative sheet number. */}
      {no && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-14 select-none font-display text-[3.5rem] font-extrabold leading-none text-graphite/[0.07] nums"
        >
          {no}
        </span>
      )}

      {/* Icon plate — square, ruled, filled with this discipline's layer
          colour. Not a rounded tile. */}
      <div className="relative mb-6 flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-12 w-12 shrink-0 items-center justify-center border-rule border-graphite text-white transition-colors duration-200 group-hover:bg-graphite",
            layer.fill,
          )}
        >
          <Icon name={service.icon} className="h-5 w-5" />
        </span>
        <span className={cn("tally font-mono", layer.text)}>{layer.no}</span>
      </div>

      <h3 className="relative text-display-xs text-graphite">{service.shortTitle}</h3>

      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-pencil">{service.summary}</p>

      <div className="relative mt-6 border-t border-line pt-4">
        <ArrowLink href={service.href} tone="revision" className="text-sm" srSuffix={`about ${service.shortTitle}`}>
          Learn more
        </ArrowLink>
      </div>
    </article>
  );
}

interface FeatureItem {
  label: string;
  icon: string;
  description?: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  variant?: "card" | "plain";
}

/**
 * Icon + label + description grid used across many sections.
 *
 * The `plain` variant is a spec list: a heavy rule per row, a numbered tally,
 * and the label in the display face. The `card` variant puts the same content
 * on plates.
 */
export function FeatureGrid({ items, columns = 4, className, variant = "card" }: FeatureGridProps) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  }[columns];

  return (
    <ul className={cn("grid gap-5", cols, className)}>
      {items.map((item, index) => (
        <li
          key={item.label}
          className={cn(
            "group relative flex h-full flex-col",
            variant === "card" && "plate plate-clipped plate-interactive p-5",
            variant === "plain" && "gap-2 border-t-[3px] border-graphite pt-4",
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center text-revision transition-transform duration-200 ease-draft group-hover:-translate-y-0.5",
                variant === "card"
                  ? "h-10 w-10 border-rule border-graphite bg-revision text-white"
                  : "h-8 w-8",
              )}
            >
              <Icon name={item.icon} className="h-4.5 w-4.5" />
            </span>
            <span aria-hidden="true" className="tally font-mono text-faint nums">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <p className="mt-3 font-display text-lg font-bold uppercase leading-none text-graphite">
            {item.label}
          </p>
          {item.description && (
            <p className="mt-2 text-sm leading-relaxed text-pencil">{item.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
