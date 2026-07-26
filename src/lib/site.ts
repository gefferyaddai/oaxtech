/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH FOR BUSINESS INFORMATION
 * ============================================================================
 *
 * Anything that has NOT been confirmed by the business is set to `null` and
 * rendered as an explicit "to be added" state — never invented.
 *
 * To go live, replace each `null` below with the real value. The UI updates
 * automatically: `null` fields render a neutral placeholder, and links,
 * `mailto:`/`tel:` hrefs, schema.org markup and the footer all switch on
 * automatically once a value exists.
 *
 * DO NOT invent an email address, phone number, street address, social URL,
 * business hours or response-time guarantee here.
 */

export type Placeholder<T> = T | null;

export interface SocialLink {
  label: string;
  /** null = profile not yet created / URL not confirmed. Rendered inert. */
  url: Placeholder<string>;
}

/**
 * Declared separately (and typed) so the `as const` on `siteConfig` doesn't
 * narrow every `url` to the literal type `null` — these become real strings.
 */
const SOCIAL_LINKS: SocialLink[] = [
  { label: "LinkedIn", url: null },
  { label: "Instagram", url: null },
  { label: "X / Twitter", url: null },
];

export const siteConfig = {
  name: "OAX Tech",
  legalName: "OAX Tech",
  tagline: "Calgary-based technology and digital-growth agency helping businesses move forward.",
  description:
    "OAX Tech is a Calgary-based technology and digital-growth agency. We design and build websites, custom software, and marketing and SEO strategies that help businesses grow.",

  /**
   * Canonical origin. Override per environment with NEXT_PUBLIC_SITE_URL.
   * Used for canonical tags, Open Graph URLs, sitemap and robots.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://oaxtech.com",

  /* --- CONFIRMED ---------------------------------------------------------- */
  location: {
    city: "Calgary",
    region: "Alberta",
    regionCode: "AB",
    country: "Canada",
    countryCode: "CA",
    /** Formatted for display. */
    display: "Calgary, Alberta, Canada",
    /** PLACEHOLDER — no street address supplied. Leave null if remote-first. */
    streetAddress: null as Placeholder<string>,
    postalCode: null as Placeholder<string>,
  },

  /* --- NOT YET CONFIRMED — replace before launch -------------------------- */
  contact: {
    /** PLACEHOLDER: business email address. */
    email: null as Placeholder<string>,
    /** PLACEHOLDER: business phone number. */
    phone: null as Placeholder<string>,
    /** PLACEHOLDER: business hours. Mockup shows "By appointment". */
    hours: "By appointment" as Placeholder<string>,
  },

  /** PLACEHOLDER: every social URL is unconfirmed. */
  socials: SOCIAL_LINKS,

  /* --- CONFIRMED PROJECT LINKS -------------------------------------------- */
  externalLinks: {
    spargo: "https://savewithspargo.com",
    ghsa: "https://ghsa.ca",
  },

  /** Free consultation offer — confirmed in the brief. */
  consultation: {
    durationMinutes: 30,
    price: "Free",
  },
} as const;

/** Copy used anywhere a placeholder value would otherwise be rendered. */
export const PLACEHOLDER_LABELS = {
  email: "Email address to be added",
  phone: "Phone number to be added",
  social: "Profile link to be added",
  hours: "Hours to be confirmed",
} as const;

/** Returns a mailto: href only when a real address is configured. */
export function mailtoHref(): string | null {
  return siteConfig.contact.email ? `mailto:${siteConfig.contact.email}` : null;
}

/** Returns a tel: href only when a real number is configured. */
export function telHref(): string | null {
  return siteConfig.contact.phone
    ? `tel:${siteConfig.contact.phone.replace(/[^\d+]/g, "")}`
    : null;
}

export type SiteConfig = typeof siteConfig;
