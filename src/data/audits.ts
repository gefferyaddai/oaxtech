/**
 * ============================================================================
 * AUDIT PACKAGES
 * ============================================================================
 *
 * Fixed-price audits sold directly through the site, unlike everything else in
 * `pricing.ts` which is either a website package or quoted after a
 * conversation. Each one is delivered as a written report by email, with the
 * option to book a call to walk through it.
 *
 * PRICING
 * The business supplied ranges and then instructed that the LOWER end be used,
 * so these are single fixed prices rather than ranges — an audit you can buy
 * on the spot cannot have a negotiable price.
 *
 * THE BUNDLE DISCOUNT IS CALCULATED, NOT WRITTEN DOWN
 * `bundleSaving()` derives the saving from the actual numbers. This matters:
 * the brief asked for a bundle that saves 20–30% against buying separately AND
 * for the lower end of the $800–$1,200 range. Those do not both hold — the
 * three audits total $950, so $800 saves $150, which is 15.8%. Deriving the
 * figure means the page always states the true saving instead of a target that
 * was never hit. To reach a genuine 20%, the bundle needs to be $760.
 *
 * SCOPE
 * Deliverables list only what the business confirmed. The recorded walkthrough
 * floated for the marketing audit is deliberately absent: it was described as
 * something that would justify a HIGHER price, and these are set at the lower
 * end.
 */

export interface AuditPackage {
  slug: string;
  name: string;
  /** Fixed price in whole CAD. */
  price: number;
  icon: string;
  description: string;
  deliverables: string[];
}

export const auditPackages: AuditPackage[] = [
  {
    slug: "seo-audit",
    name: "SEO Audit",
    price: 300,
    icon: "SearchCheck",
    description:
      "Where your site stands in search today, and the specific things to fix first.",
    deliverables: [
      "Technical SEO review",
      "On-page analysis",
      "Keyword and local search visibility check",
      "Prioritised action list, not a data dump",
    ],
  },
  {
    slug: "marketing-audit",
    name: "Marketing Audit",
    price: 400,
    icon: "BarChart3",
    description:
      "A read across your channels: what is working, what is leaking, and where to spend next.",
    deliverables: [
      "Multi-channel review",
      "Audience and positioning review",
      "Campaign and content assessment",
      "Prioritised recommendations by expected effort",
    ],
  },
  {
    slug: "website-audit",
    name: "Website Audit",
    price: 250,
    icon: "Monitor",
    description:
      "How your site performs, where visitors drop off, and what to change first.",
    deliverables: [
      "Performance and Core Web Vitals review",
      "Mobile and responsive check",
      "Accessibility and usability observations",
      "Conversion path review",
    ],
  },
];

/** The bundle. Contents are every audit above. */
export const auditBundle = {
  slug: "audit-bundle",
  name: "Complete Audit Bundle",
  price: 800,
  icon: "Layers",
  description: "All three audits, run together and reported as one picture of the business.",
} as const;

/** Sum of the individual audits, used as the bundle's reference price. */
export function auditsTotal(): number {
  return auditPackages.reduce((total, audit) => total + audit.price, 0);
}

/**
 * The bundle saving, derived from the real numbers so the page can never
 * advertise a discount it does not actually give.
 */
export function bundleSaving(): { amount: number; percent: number } {
  const total = auditsTotal();
  const amount = total - auditBundle.price;
  return { amount, percent: Math.round((amount / total) * 100) };
}

export function formatCad(amount: number): string {
  return `$${amount.toLocaleString("en-CA")}`;
}

/**
 * How every audit is delivered. Stated plainly and with no turnaround promise,
 * because no turnaround time has been confirmed — a delivery window is exactly
 * the kind of commitment that must come from the business, not from the page.
 */
export const auditDelivery = [
  {
    label: "Purchase online",
    icon: "CreditCard",
    description: "Pay for the audit directly through the site. No proposal round first.",
  },
  {
    label: "Report by email",
    icon: "Mail",
    description:
      "Your written report arrives by email, with findings ordered by what to do first.",
  },
  {
    label: "Optional call",
    icon: "Calendar",
    description:
      "Book a consultation to walk through the results together and decide what happens next.",
  },
];
