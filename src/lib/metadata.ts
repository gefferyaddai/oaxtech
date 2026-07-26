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
 */
export function buildMetadata({ title, description, path, noIndex }: PageMetaInput): Metadata {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  const fullTitle = path === "/" ? title : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
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
