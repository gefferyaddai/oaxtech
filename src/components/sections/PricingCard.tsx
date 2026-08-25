import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { PricingPackage, QuotedPackage } from "@/data/pricing";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  pkg: PricingPackage;
  className?: string;
}

/**
 * A package rendered as a spec sheet.
 *
 * The price is the largest thing on the card because transparent pricing is
 * one of the few genuinely persuasive assets this business has — a competitor
 * hiding theirs behind a contact form cannot copy it. Features are ruled rows
 * with square marks rather than a bulleted list, so the card reads as a
 * schedule of what is included.
 *
 * The featured package inverts to the ink ground instead of gaining a coloured
 * border: on a page of light plates, the dark one is unmissable.
 */
export function PricingCard({ pkg, className }: PricingCardProps) {
  const featured = pkg.featured;

  return (
    <article
      className={cn(
        "plate plate-interactive relative flex h-full flex-col",
        featured && "plate-ink",
        className,
      )}
    >
      {featured && (
        <p className="tally bg-revision py-2 text-center font-mono text-white">Most popular</p>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h3
          className={cn(
            "font-display text-xl font-bold uppercase leading-none",
            featured ? "text-white" : "text-graphite",
          )}
        >
          {pkg.name}
        </h3>

        <div className={cn("mt-5 border-t-rule pt-4", featured ? "border-ink-text/50" : "border-graphite")}>
          {/* The prefix slot is always rendered, empty or not. Only some
              packages carry a "starting at", and letting the row collapse
              puts the prices in a three-card row on three different
              baselines — the one misalignment a pricing table cannot afford. */}
          <span
            className={cn(
              "tally block font-mono",
              featured ? "text-ink-muted" : "text-faint",
            )}
          >
            {pkg.pricePrefix || "\u00A0"}
          </span>
          <p className="mt-1 flex items-baseline gap-2">
            <span
              className={cn(
                "font-display text-display-md font-extrabold leading-none nums",
                featured ? "text-revision-onInk" : "text-revision",
              )}
            >
              {pkg.price}
            </span>
            {pkg.currency && (
              <span className={cn("tally font-mono", featured ? "text-ink-muted" : "text-faint")}>
                {pkg.currency}
              </span>
            )}
          </p>
        </div>

        <ul className="mt-6 flex-1">
          {pkg.features.map((feature) => (
            <li
              key={feature}
              className={cn(
                "flex items-start gap-3 border-b py-2.5 text-sm last:border-b-0",
                featured ? "border-ink-line text-ink-text" : "border-line text-pencil",
              )}
            >
              <Icon
                name="Check"
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  featured ? "text-revision-onInk" : "text-revision-text",
                )}
              />
              {feature}
            </li>
          ))}
        </ul>

        <ButtonLink
          href={pkg.ctaHref}
          variant={featured ? "primary" : "outline"}
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
    <article className="plate plate-clipped plate-interactive group flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border-rule border-graphite bg-revision text-white transition-colors duration-200 group-hover:bg-graphite">
          <Icon name={pkg.icon} className="h-5 w-5" />
        </span>
        <h3 className="font-display text-lg font-bold uppercase leading-none text-graphite">
          {pkg.name}
        </h3>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-pencil">{pkg.description}</p>

      <ul className="mt-5 flex-1">
        {pkg.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 border-b border-line py-2.5 text-sm text-pencil last:border-b-0"
          >
            <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-revision-text" />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={`/quote?package=${encodeURIComponent(pkg.name)}`}
        className="mt-6 inline-flex items-center gap-2 border-t border-line pt-4 font-display text-sm font-bold uppercase tracking-wide text-revision-text"
      >
        Request pricing
        <Icon
          name="ArrowRight"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5"
        />
        <span className="sr-only"> for {pkg.name}</span>
      </a>
    </article>
  );
}
