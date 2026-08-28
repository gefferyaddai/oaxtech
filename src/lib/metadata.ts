import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

interface PageMetaInput {
  title: string;
  description: string;
  /** Route path beginning with "/" — used for the canonical URL. */
  path: string;
  /** Portal, login and confirmation routes must not be indexed. */
  noIndex?: boolean;
}

/**
 * Builds a complete metadata object: unique title + description, canonical URL,
 * Open Graph and Twitter/X cards.
 *
 * TITLE SUFFIXING — why `absolute`:
 *
 * The root layout declares `title.template` = "%s | OAX Tech", which Next
 * applies to any descendant that sets a plain string title. This function
 * already appends the site name itself (it needs the full string for the Open
 * Graph and Twitter cards, which the template does NOT reach). Returning a
 * plain string therefore got it suffixed twice — every public page rendered
 * "About Us | OAX Tech | OAX Tech".
 *
 * `title.absolute` opts this one value out of the parent template while
 * leaving the template in place for the pages that legitimately depend on it:
 * the portal and admin screens set bare titles ("Messages", "Tasks") and get
 * their suffix from their own layout's template.
 */
export function buildMetadata({ title, description, path, noIndex }: PageMetaInput): Metadata {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  // The homepage title already leads with the brand, so it is not suffixed.
  const fullTitle = path === "/" ? title : `${title} | ${siteConfig.name}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url,
      locale: "en_CA",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noIndex
      ? { robots: { index: false, follow: false, nocache: true } }
      : {}),
  };
}
