/**
 * ============================================================================
 * BUSINESS KICKSTARTER PACKAGES
 * ============================================================================
 *
 * Bundled launch packages: a website plus a fixed run of SEO, paid ads and
 * consulting, sold as one engagement over a defined term.
 *
 * PRICING MODEL
 * Each tier has a price RANGE and a TERM. The monthly figure is never stored —
 * it is derived from the range and the term by `monthlyFor()` below. That is
 * deliberate: a stored monthly value and a stored total drift apart the first
 * time one of them is edited, and a pricing page that contradicts itself is
 * worse than one with no monthly option at all.
 *
 * A NOTE ON THE MONTHLY FIGURES
 * The business initially floated flat retainers of roughly $900 / $1,500 /
 * $2,500 per month. Those do not reconcile with the ranges below: at six months
 * $1,500 totals $9,000 against a $5,000–$7,000 range, and at twelve months
 * $2,500 totals $30,000 against a $10,000–$15,000 range. The instruction was
 * that a payment plan should divide the price across the project's lifespan, so
 * that is what this implements. If the higher retainers are the real intent,
 * the RANGES are what need raising — change `priceMin`/`priceMax` here and the
 * monthly figures follow automatically.
 *
 * Every figure here was supplied by the business. Nothing is invented, and no
 * outcome, ranking or result is claimed anywhere in this file.
 */

export interface KickstarterInclusion {
  label: string;
  /** Set when the line carries a defined duration, e.g. "3 months". */
  term?: string;
}

export interface KickstarterTier {
  slug: string;
  name: string;
  /** One line on who the tier is for. */
  tagline: string;
  /** Lower bound of the quoted range, in whole CAD. */
  priceMin: number;
  /** Upper bound of the quoted range, in whole CAD. */
  priceMax: number;
  /** Engagement length in months. Drives the payment plan. */
  termMonths: number;
  /** Highlighted as the recommended tier. Exactly one should be true. */
  featured: boolean;
  /** The tier whose contents this one includes in full, if any. */
  inherits?: string;
  inclusions: KickstarterInclusion[];
}

export const kickstarterTiers: KickstarterTier[] = [
  {
    slug: "basic",
    name: "Basic",
    tagline: "A proper website and a three-month running start.",
    priceMin: 2500,
    priceMax: 3500,
    termMonths: 3,
    featured: false,
    inclusions: [
      { label: "Website design and development" },
      { label: "Custom domain" },
      { label: "SEO campaign", term: "3 months" },
      { label: "Paid ads campaign", term: "3 months" },
      { label: "Marketing strategy consultation", term: "3 months" },
    ],
  },
  {
    slug: "growth",
    name: "Growth",
    tagline: "Twice the runway, plus social and reporting.",
    priceMin: 5000,
    priceMax: 7000,
    termMonths: 6,
    featured: true,
    inherits: "Basic",
    inclusions: [
      { label: "Advanced or e-commerce website" },
      { label: "SEO campaign", term: "6 months" },
      { label: "Paid ads campaign", term: "6 months" },
      { label: "Social media management" },
      { label: "Analytics reporting", term: "Monthly" },
    ],
  },
  {
    slug: "scale",
    name: "Scale",
    tagline: "A full build-out with a year of campaigns behind it.",
    priceMin: 10000,
    priceMax: 15000,
    termMonths: 12,
    featured: false,
    inherits: "Growth",
    inclusions: [
      { label: "SEO campaign", term: "12 months" },
      { label: "Paid ads campaign", term: "12 months" },
      { label: "Custom software or automation" },
      { label: "AI and workflow integrations" },
      { label: "Google Workspace setup" },
      { label: "Strategy sessions", term: "Quarterly" },
      { label: "Priority support" },
    ],
  },
];

/** Formats a whole-dollar amount as CAD, e.g. 2500 -> "$2,500". */
export function formatCad(amount: number): string {
  return `$${amount.toLocaleString("en-CA")}`;
}

/** The quoted range for a tier, e.g. "$2,500–$3,500". Uses an en dash. */
export function rangeFor(tier: KickstarterTier): string {
  return `${formatCad(tier.priceMin)}–${formatCad(tier.priceMax)}`;
}

/**
 * The payment plan: the range divided across the term.
 *
 * Derived, never stored — see the note at the top of this file. Rounded to
 * whole dollars for display; the total is the figure that binds, and the final
 * instalment absorbs the rounding.
 */
export function monthlyFor(tier: KickstarterTier): {
  min: number;
  max: number;
  label: string;
} {
  const min = Math.round(tier.priceMin / tier.termMonths);
  const max = Math.round(tier.priceMax / tier.termMonths);
  return {
    min,
    max,
    label: `${formatCad(min)}–${formatCad(max)}`,
  };
}

/**
 * How the payment plan is explained on the page.
 *
 * Deliberately plain: it states the mechanism and that the total is unchanged,
 * and it promises no financing, no interest terms and no approval process,
 * none of which the business has confirmed exist.
 */
export const paymentPlanNote =
  "Every package can be paid across its term instead of up front. The monthly figure is simply the package price divided by the number of months it runs — the total is the same either way, and exact terms are confirmed in your written proposal.";
