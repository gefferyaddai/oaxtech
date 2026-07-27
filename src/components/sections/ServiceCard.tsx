import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Pick<Service, "shortTitle" | "summary" | "icon" | "href" | "ctaLabel">;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <article className={cn("card card-interactive group relative flex h-full flex-col overflow-hidden p-5 sm:p-6", className)}>
      <span
        className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-cobalt/0 transition-colors duration-300 group-hover:bg-cobalt/[0.06]"
        aria-hidden="true"
      />
      <span className="relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-105">
        <Icon name={service.icon} className="h-5 w-5" />
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">{service.shortTitle}</h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate">{service.summary}</p>
      <Link
        href={service.href}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cobalt"
      >
        Learn More
        <Icon
          name="ArrowRight"
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        />
        <span className="sr-only"> about {service.shortTitle}</span>
      </Link>
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

/** Reusable icon + label + description grid used across many sections. */
export function FeatureGrid({ items, columns = 4, className, variant = "card" }: FeatureGridProps) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  }[columns];

  return (
    <ul className={cn("grid gap-4", cols, className)}>
      {items.map((item, index) => (
        <li
          key={item.label}
          className={cn(
            "group relative flex h-full flex-col",
            variant === "card" && "card card-interactive overflow-hidden p-5",
            variant === "plain" && "gap-1 border-t border-line pt-4",
          )}
        >
          {variant === "card" && (
            <span
              className="pointer-events-none absolute -right-2 -top-3 select-none font-display text-4xl font-semibold text-ink/[0.04]"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span
            className={cn(
              "relative mb-3 inline-flex items-center justify-center text-cobalt transition-transform duration-300 ease-out group-hover:-translate-y-0.5",
              variant === "card" ? "h-10 w-10 rounded-lg bg-cobalt-soft" : "h-8 w-8",
            )}
          >
            <Icon name={item.icon} className="h-5 w-5" />
          </span>
          <p className="relative font-display text-sm font-semibold text-ink">{item.label}</p>
          {item.description && (
            <p className="relative mt-1.5 text-sm leading-relaxed text-slate">{item.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
