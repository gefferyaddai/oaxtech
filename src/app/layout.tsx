import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SplashScreen } from "@/components/layout/SplashScreen";
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

/**
 * The direction contract for this build, emitted as a real HTML comment.
 *
 * React strips JSX comments before they ever reach the markup, so a `{/* … *\/}`
 * block here would document the decision for whoever opens this file and for
 * nobody auditing the built page. Setting it through `dangerouslySetInnerHTML`
 * on a hidden, aria-hidden container is what actually survives `next build`,
 * which is the point: the contract has to be greppable in the output.
 */
const DIRECTION_CONTRACT = `<!--
  THESIS: This site is an engineering drawing set — every section a sheet carrying
  its own title block, drawing number and revision. It refuses the dark-navy agency
  page with its gradient mesh, glass cards and floating dashboard mockup.

  OWN-WORLD: Cool grey stock (#E4E5E8) and near-black ink (#0B0B10) as two full-bleed
  grounds, a deep exposure violet (#6D28D9) carrying the action at ~30% coverage, one
  Prussian blue (#1E40AF) reserved for the metadata layer, hairline linework and
  45-degree hatch. The cyanotype/diazo end of technical printing rather than the
  warm-paper end. Big Shoulders Display set oversized, uppercase and tight; Martian
  Mono for drawing numbers and specs. Square corners everywhere; containers are
  clipped, never rounded.

  STORY: A Calgary business owner sees a team that documents what it builds, reads
  real projects and transparent pricing, and books a free consultation.

  FIRST VIEWPORT: A sheet border with corner ticks frames the viewport. The headline
  runs four tight lines across the left two-thirds over a heavy rule; a dimension
  line measures from the last word to the booking block, a solid revision-orange
  rectangle at lower left. The title block sits bottom-right carrying SHEET 01 /
  REV 2026.08 / CALGARY AB.

  FORM: The Title Block — candidate 1 of 7, user-picked over the roll's assignment;
  seed key 61bdf409.

  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
  review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
-->`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body>
        {/*
          Sets the splash's two opening states on <html> during head parse,
          BEFORE anything below is laid out. Both matching rule sets live in
          globals.css, which is head-loaded and therefore already applied.

            data-splash-seen    already shown this session — suppress it
                                entirely, so a returning visitor never sees a
                                single frame of a sequence they have watched.

            data-splash-active  first load of the session — hold the site back
                                until the splash finishes, so the sequence owns
                                the opening instead of sharing it with a page
                                assembling itself underneath. SplashScreen.tsx
                                removes this as the black ground starts lifting.

          The two are mutually exclusive by construction: the hold is applied
          only when the splash has NOT been seen.

          /admin is excluded here as well as in the component. Without that,
          landing straight in a staff tool would cost 2.3s of blank screen —
          and the hold is stamped before React has any say in it.

          Inline and synchronous on purpose: next/script or an effect would
          both run after first paint, which is exactly the frame being avoided.
          It reads no user input and writes only attributes.

          The try/catch is not decorative — Safari private mode and "block all
          cookies" make sessionStorage THROW on access, and an unguarded read
          here would leave every page held back with nothing to release it.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement," +
              "s=sessionStorage.getItem('oax_splash_seen')==='1'," +
              "a=location.pathname==='/admin'||location.pathname.indexOf('/admin/')===0;" +
              "if(s)d.setAttribute('data-splash-seen','');" +
              "if(!s&&!a)d.setAttribute('data-splash-active','');" +
              "}catch(e){}",
          }}
        />
        <div hidden aria-hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        {/* Runs on document load only, not on client-side navigation. Outside
            SiteChrome: the splash covers the client portal too, and is
            suppressed on /admin by its own exclusion list rather than by the
            marketing-chrome rule, which is about the header and footer. */}
        <SplashScreen />
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

        {/*
          Vercel Analytics.

          Mounted in the ROOT LAYOUT rather than on one page: it records a view
          per route, so anywhere it is absent is simply invisible in the
          numbers. A homepage-only install would report every visitor as having
          landed and never moved, which is worse than no analytics at all
          because it looks like data.

          No environment variable and no cookie banner: the script is injected
          by the platform at deploy time and the product is cookieless, which
          is why it needs neither NEXT_PUBLIC_ANALYTICS_ID nor consent plumbing.
          It is inert in local development.
        */}
        <Analytics />
      </body>
    </html>
  );
}
