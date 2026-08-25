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
  async headers() {
    return [
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
