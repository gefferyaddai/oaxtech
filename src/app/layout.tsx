import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Websites, Software, Marketing & SEO in Calgary`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "web design Calgary",
    "website development Calgary",
    "custom software Calgary",
    "SEO Calgary",
    "marketing consulting Calgary",
    "workflow automation",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: `${siteConfig.name} — Websites, Software, Marketing & SEO in Calgary`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Websites, Software, Marketing & SEO in Calgary`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f0ea",
  width: "device-width",
  initialScale: 1,
  // Never block a user from zooming.
  maximumScale: 5,
};

/**
 * Organization schema.
 * Only fields with confirmed values are emitted — unconfirmed contact details
 * are omitted entirely rather than filled with placeholder text.
 */
function organizationSchema() {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.regionCode,
      addressCountry: siteConfig.location.countryCode,
      ...(siteConfig.location.streetAddress
        ? { streetAddress: siteConfig.location.streetAddress }
        : {}),
      ...(siteConfig.location.postalCode ? { postalCode: siteConfig.location.postalCode } : {}),
    },
  };

  schema.foundingDate = String(siteConfig.foundedYear);

  if (siteConfig.contact.email) schema.email = siteConfig.contact.email;
  if (siteConfig.contact.phone) schema.telephone = siteConfig.contact.phone;

  const sameAs = siteConfig.socials.map((s) => s.url).filter((url): url is string => Boolean(url));
  if (sameAs.length) schema.sameAs = sameAs;

  return schema;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {/* Marketing chrome is suppressed on app surfaces — see SiteChrome. */}
        <SiteChrome>
          <Header />
        </SiteChrome>
        <main id="main">{children}</main>
        <SiteChrome>
          <Footer />
        </SiteChrome>
        <script
          type="application/ld+json"
          // Serialized from a typed object above; no user input is interpolated.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </body>
    </html>
  );
}
