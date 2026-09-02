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
  { label: "LinkedIn", url: "https://www.linkedin.com/company/oax-tech/" },
  { label: "Instagram", url: "https://www.instagram.com/oax.tech/" },
  /*
   * X / Twitter was removed rather than left as a `null` placeholder: an inert
   * "Profile link to be added" row in the contact page's Connect block reads as
   * an unfinished site, not as an honest one. The `Placeholder<string>` type is
   * kept on the interface so a genuinely pending profile can still be declared
   * that way — add the entry back with its real URL when one exists.
   */
];

/**
 * Canonical origin, with an empty value treated as absent.
 *
 * `??` alone is not enough here. It falls back only on null/undefined, and a
 * host dashboard lets you save a variable with NO VALUE — which yields an empty
 * string, sails past `??`, and reaches `new URL("")` in `app/layout.tsx` as
 * `metadataBase`. That throws ERR_INVALID_URL during "Collecting page data" and
 * fails the whole production build, with the error pointing at /_not-found
 * rather than at the variable. An unset variable works; a variable set to
 * nothing does not, which is the opposite of what anyone expects.
 *
 * Trailing slashes are stripped so canonical tags never come out doubled, and
 * an unparseable value falls back rather than taking the build down.
 */
function siteUrl(): string {
  const FALLBACK = "https://oaxtech.dev";
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK;
  try {
    new URL(raw);
  } catch {
    return FALLBACK;
  }
  return raw.replace(/\/+$/, "");
}

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
  url: siteUrl(),

  /* --- CONFIRMED ---------------------------------------------------------- */
  /** Year the business was established. Drives the copyright range and schema. */
  foundedYear: 2024,

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
    /** Confirmed by the business 2026-09-02. */
    email: "info@oaxtech.dev" as Placeholder<string>,
    /**
     * Confirmed by the business 2026-09-02. Stored in display form; `telHref()`
     * strips everything but digits and `+`, so the leading +1 is what makes the
     * tel: link dial correctly from outside Canada rather than only on a
     * domestic handset.
     */
    phone: "+1 (825) 288-7601" as Placeholder<string>,
    /** PLACEHOLDER: business hours. Mockup shows "By appointment". */
    hours: "By appointment" as Placeholder<string>,
  },

  /** LinkedIn and Instagram confirmed. X / Twitter still unconfirmed. */
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

/**
 * Copyright range: "2024" in the founding year, "2024–2026" thereafter.
 * Uses an en dash, the correct character for a span of years.
 */
export function copyrightYears(now: Date = new Date()): string {
  const current = now.getFullYear();
  return current > siteConfig.foundedYear
    ? `${siteConfig.foundedYear}–${current}`
    : `${siteConfig.foundedYear}`;
}

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
