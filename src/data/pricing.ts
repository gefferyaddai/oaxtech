/**
 * Pricing data.
 *
 * CONTENT RULE: only the three website package prices below were supplied.
 * No discounts, promotions, or additional prices are invented. SEO and
 * marketing packages intentionally have no price and route to "Request Pricing".
 * Payment terms stay general and defer to the written proposal.
 */

export interface PricingPackage {
  slug: string;
  name: string;
  /** Displayed price. `null` means pricing is quoted, not listed. */
  price: string | null;
  currency: "CAD" | null;
  /** Rendered above the price, e.g. "Starting at". */
  pricePrefix: string | null;
  features: string[];
  featured: boolean;
  ctaLabel: string;
  ctaHref: string;
}

export const websitePackages: PricingPackage[] = [
  {
    slug: "one-page-website",
    name: "One-Page Website",
    price: "$600",
    currency: "CAD",
    pricePrefix: null,
    features: [
      "One custom page",
      "Mobile-friendly design",
      "Contact form",
      "Basic SEO",
      "Analytics setup",
    ],
    featured: false,
    ctaLabel: "Get Started",
    ctaHref: "/quote?package=One-Page+Website",
  },
  {
    slug: "business-website",
    name: "Business Website",
    price: "$1,000",
    currency: "CAD",
    pricePrefix: "Starting at",
    features: [
      "Up to five pages",
      "Mobile-friendly design",
      "Contact forms",
      "Basic SEO",
      "Analytics setup",
    ],
    featured: true,
    ctaLabel: "Get Started",
    ctaHref: "/quote?package=Business+Website",
  },
  {
    slug: "advanced-website",
    name: "Advanced Website",
    price: "$1,500",
    currency: "CAD",
    pricePrefix: "Starting at",
    features: [
      "More than five pages",
      "Custom features",
      "Integrations",
      "Advanced forms",
      "SEO foundations",
    ],
    featured: false,
    ctaLabel: "Get Started",
    ctaHref: "/quote?package=Advanced+Website",
  },
];

export interface ComparisonRow {
  label: string;
  icon: string;
  values: [string, string, string];
}

export const comparisonRows: ComparisonRow[] = [
  { label: "Pages", icon: "FileText", values: ["1", "Up to 5", "5+"] },
  { label: "Revisions", icon: "RefreshCw", values: ["2 Rounds", "3 Rounds", "Unlimited"] },
  { label: "Timeline", icon: "Clock", values: ["3–5 Business Days", "1–2 Weeks", "2–4 Weeks"] },
  { label: "SEO", icon: "Search", values: ["Basic", "Basic", "Foundational"] },
  { label: "Analytics", icon: "BarChart3", values: ["Included", "Included", "Included"] },
  { label: "Support", icon: "LifeBuoy", values: ["Email", "Email & Chat", "Priority Support"] },
];

export const comparisonColumns = ["One-Page", "Business", "Advanced"] as const;

export interface QuotedPackage {
  name: string;
  icon: string;
  description: string;
  features: string[];
}

/** No prices — these are quoted after a conversation. */
export const seoPackages: QuotedPackage[] = [
  {
    name: "SEO Audit",
    icon: "Search",
    description: "A comprehensive audit to uncover growth opportunities.",
    features: ["Technical SEO review", "On-page analysis", "Basic SEO recommendations"],
  },
  {
    name: "Local SEO Package",
    icon: "MapPin",
    description: "Improve your visibility in local search results.",
    features: ["Google Business Profile optimization", "Local keyword targeting", "Citation & listing cleanup"],
  },
  {
    name: "Monthly SEO Package",
    icon: "TrendingUp",
    description: "Ongoing SEO to grow your rankings and organic traffic.",
    features: ["On-page optimization", "Content & keyword strategy", "Monthly performance reporting"],
  },
];

export const marketingPackages: QuotedPackage[] = [
  {
    name: "Strategy Consultation",
    icon: "Target",
    description: "Get a clear marketing strategy aligned with your business goals.",
    features: ["Audience & market analysis", "Channel recommendations", "Strategic roadmap"],
  },
  {
    name: "Campaign Planning",
    icon: "Megaphone",
    description: "Plan effective campaigns that convert.",
    features: ["Campaign strategy", "Budget & channel planning", "Creative direction"],
  },
  {
    name: "Monthly Marketing Support",
    icon: "Users",
    description: "Ongoing marketing support to keep your pipeline full.",
    features: ["Content & campaign management", "Performance tracking", "Monthly reporting & optimization"],
  },
];

/**
 * Payment information.
 * Kept deliberately general — exact terms live in each written proposal, so no
 * specific deposit percentage, schedule or fee is stated here.
 */
export const paymentInfo = [
  {
    label: "Deposit Requirements",
    icon: "Wallet",
    description: "A deposit is required to secure your project and begin work. Exact terms are confirmed in your proposal.",
  },
  {
    label: "Payment Schedule",
    icon: "CalendarRange",
    description: "Projects are billed according to the agreed milestone schedule outlined in your proposal.",
  },
  {
    label: "Additional Expenses",
    icon: "Receipt",
    description: "Third-party fees (plugins, licenses, stock assets) are billed at cost with prior approval.",
  },
  {
    label: "Maintenance Fees",
    icon: "Settings",
    description: "Ongoing maintenance is optional and can be added after launch based on your needs.",
  },
];

export const paymentFootnote = "All pricing and terms are confirmed in each custom proposal.";
