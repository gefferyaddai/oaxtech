import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Build output directory, overridable per process.
   *
   * `next dev` and `next build` both write to `.next`, so running a production
   * build while a dev server is up corrupts both: the dev server writes its
   * devtools chunks into the manifest the production server is reading, and
   * every request 500s with a webpack module resolution error that looks like
   * a code bug and is not one.
   *
   * Setting NEXT_DIST_DIR gives a second build its own directory, so you can
   * serve a production preview alongside `npm run dev`:
   *
   *   NEXT_DIST_DIR=.next-preview npm run build
   *   NEXT_DIST_DIR=.next-preview PORT=3100 npm run start
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // First-party brand SVGs live in /public/brand. Locked down with a strict
    // CSP so an SVG can never execute script through the image optimizer.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      {
        // /team was retired in favour of /learn-more, which carries the story
        // video instead of the profile-card roster. Permanent so search
        // engines transfer the old URL's standing rather than reindexing.
        source: "/team",
        destination: "/learn-more",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        /*
         * ====================================================================
         * BASELINE SECURITY HEADERS — every route, public included
         * ====================================================================
         *
         * Deliberately NOT including a Content-Security-Policy. A useful CSP
         * for this app needs a per-request nonce for the two inline scripts
         * (the splash-suppression stamp and the JSON-LD blocks), which a
         * static header cannot carry — a `script-src 'self' 'unsafe-inline'`
         * would be a CSP in name only. That belongs in middleware as a
         * follow-up; shipping the honest subset now beats shipping a policy
         * that advertises protection it does not provide.
         */
        source: "/:path*",
        headers: [
          /*
           * Clickjacking. `frame-ancestors` is the modern control and covers
           * more cases than X-Frame-Options, but the older header is still
           * honoured by some corporate proxies, so both are set and agree.
           */
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },

          /* Stop browsers second-guessing a declared Content-Type. */
          { key: "X-Content-Type-Options", value: "nosniff" },

          /*
           * Send the full URL within our own origin, but only the origin when
           * leaving it — outbound links never leak a path a visitor was on.
           */
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          /*
           * Nothing on this site uses these. Denying them means an injected
           * script or embedded frame cannot silently ask for them either.
           */
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },

          /*
           * Two years, subdomains included. `preload` is deliberately omitted:
           * submitting to the preload list is effectively irreversible and
           * should be a conscious decision once the domain has been serving
           * HTTPS-only for a while, not a side effect of this config.
           *
           * Ignored by browsers over plain HTTP, so it is inert in local dev.
           */
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
      {
        // Client portal is demo-only and must never be indexed.
        source: "/portal/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        // Internal admin. Never indexed, never cached by a shared proxy.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
