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
    <article className={cn("card card-interactive group flex h-full flex-col p-5 sm:p-6", className)}>
      <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt">
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
      {items.map((item) => (
        <li
          key={item.label}
          className={cn(
            "flex h-full flex-col",
            variant === "card" ? "card p-5" : "gap-1",
          )}
        >
          <span
            className={cn(
              "mb-3 inline-flex items-center justify-center text-cobalt",
              variant === "card" ? "h-10 w-10 rounded-lg bg-cobalt-soft" : "h-8 w-8",
            )}
          >
            <Icon name={item.icon} className="h-5 w-5" />
          </span>
          <p className="font-display text-sm font-semibold text-ink">{item.label}</p>
          {item.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-slate">{item.description}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
