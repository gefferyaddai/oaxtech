import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { PricingPackage, QuotedPackage } from "@/data/pricing";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  pkg: PricingPackage;
  className?: string;
}

export function PricingCard({ pkg, className }: PricingCardProps) {
  return (
    <article
      className={cn(
        "card card-interactive relative flex h-full flex-col",
        pkg.featured && "border-cobalt shadow-card-hover",
        className,
      )}
    >
      {pkg.featured && (
        <p className="rounded-t-xl bg-cobalt py-1.5 text-center text-2xs font-semibold uppercase tracking-[0.12em] text-white">
          Most Popular
        </p>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-center font-display text-lg font-semibold text-ink">{pkg.name}</h3>

        <p className="mt-4 text-center">
          {pkg.pricePrefix && (
            <span className="block text-xs text-muted">{pkg.pricePrefix}</span>
          )}
          <span className="font-display text-display-sm font-semibold text-cobalt">{pkg.price}</span>
          {pkg.currency && (
            <span className="ml-1.5 text-xs font-medium text-muted">{pkg.currency}</span>
          )}
        </p>

        <ul className="mt-6 flex-1 space-y-3">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-charcoal">
              <Icon name="CheckCircle2" className="mt-0.5 h-4 w-4 shrink-0 text-cobalt" />
              {feature}
            </li>
          ))}
        </ul>

        <ButtonLink
          href={pkg.ctaHref}
          variant={pkg.featured ? "dark" : "neutral"}
          className="mt-7 w-full"
        >
          {pkg.ctaLabel}
          <span className="sr-only"> with the {pkg.name} package</span>
        </ButtonLink>
      </div>
    </article>
  );
}

interface QuotedPackageCardProps {
  pkg: QuotedPackage;
}

/** Used for SEO and marketing packages, which have no listed price. */
export function QuotedPackageCard({ pkg }: QuotedPackageCardProps) {
  return (
    <article className="card card-interactive group flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt">
          <Icon name={pkg.icon} className="h-5 w-5" />
        </span>
        <h3 className="font-display text-base font-semibold text-ink">{pkg.name}</h3>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate">{pkg.description}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-charcoal">
            <Icon name="CheckCircle2" className="mt-0.5 h-4 w-4 shrink-0 text-cobalt" />
            {feature}
          </li>
        ))}
      </ul>
      <a
        href={`/quote?package=${encodeURIComponent(pkg.name)}`}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-cobalt"
      >
        Request Pricing
        <Icon name="ArrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        <span className="sr-only"> for {pkg.name}</span>
      </a>
    </article>
  );
}
