/**
 * ============================================================================
 * BRAND ASSET GENERATOR
 * ============================================================================
 *
 * Renders every shipped brand raster and vector from ONE source of truth:
 * the traced geometry in `src/lib/oax-logo.ts`. Nothing here redraws the mark
 * by hand, so replacing those path strings when the official vector lands
 * regenerates the whole set.
 *
 *   npm run brand
 *
 * Outputs:
 *   public/brand/oax-logo.svg         header/footer lockup, light backgrounds
 *   public/brand/oax-logo-white.svg   header/footer lockup, dark backgrounds
 *   src/app/icon.svg                  browser tab icon (emblem only)
 *   src/app/apple-icon.png            180×180, opaque — Apple requires opaque
 *   src/app/opengraph-image.png       1200×630 link preview card
 *
 * The three files under `src/app/` are Next.js file-convention icons: their
 * filenames alone generate the <link rel="icon">, apple-touch-icon and
 * og:image tags. There is no metadata to keep in sync.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  EMBLEM_PATHS,
  LOGO_COLORS,
  LOGO_VIEW_BOX,
  WORDMARK_PATHS,
} from "../src/lib/oax-logo";

const ROOT = process.cwd();

/**
 * On a dark ground the artwork's black arm and near-black "OAX" would be
 * invisible, so the two NEUTRALS are inverted while their tonal relationship
 * is preserved. The purple is the artwork's exact value and is never adjusted.
 * These match `ON_DARK` in SplashScreen.tsx — the mark reads identically
 * whether it is animating on the splash or sitting static in the header.
 */
const ON_DARK = {
  primary: "#f6f6f8",
  secondary: "#a8acb6",
  purple: LOGO_COLORS.purple,
} as const;

/** Near-black ink ground, matching the site's dark full-bleed surface. */
const GROUND = "#0B0B10";

interface Palette {
  purple: string;
  charcoal: string;
  black: string;
}

const LIGHT_BG: Palette = {
  purple: LOGO_COLORS.purple,
  charcoal: LOGO_COLORS.charcoal,
  black: LOGO_COLORS.black,
};

const DARK_BG: Palette = {
  purple: ON_DARK.purple,
  charcoal: ON_DARK.secondary,
  black: ON_DARK.primary,
};

/**
 * The full horizontal lockup: three emblem arms plus the two wordmark groups.
 *
 * `oax` carries the O counter as a reversed subpath, so it needs the default
 * nonzero fill rule — do not add fill-rule="evenodd" here.
 */
function lockup(palette: Palette): string {
  return [
    `<path fill="${palette.purple}" d="${EMBLEM_PATHS.purple}"/>`,
    `<path fill="${palette.charcoal}" d="${EMBLEM_PATHS.charcoal}"/>`,
    `<path fill="${palette.black}" d="${EMBLEM_PATHS.black}"/>`,
    `<path fill="${palette.black}" d="${WORDMARK_PATHS.oax}"/>`,
    `<path fill="${palette.charcoal}" d="${WORDMARK_PATHS.tech}"/>`,
  ].join("\n  ");
}

function lockupSvg(palette: Palette): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEW_BOX}" role="img" aria-label="OAX Tech">
  ${lockup(palette)}
</svg>
`;
}

/** The emblem alone, centred in a square frame with even optical padding. */
function emblemSvg(palette: Palette, ground?: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-56 -56 112 112" role="img" aria-label="OAX Tech">
  ${ground ? `<rect x="-56" y="-56" width="112" height="112" fill="${ground}"/>\n  ` : ""}<path fill="${palette.purple}" d="${EMBLEM_PATHS.purple}"/>
  <path fill="${palette.charcoal}" d="${EMBLEM_PATHS.charcoal}"/>
  <path fill="${palette.black}" d="${EMBLEM_PATHS.black}"/>
</svg>
`;
}

/**
 * Link preview card, 1200×630.
 *
 * The lockup is set left-aligned over the site's near-black ground with a
 * single purple rule beneath it, rather than centred — a centred lockup on a
 * flat ground is the default every generated OG card already looks like.
 */
function ogSvg(): string {
  const W = 1200;
  const H = 630;
  // The lockup is 406.18 units wide; scale so it occupies 46% of the card.
  const scale = (W * 0.46) / 406.18;
  const x = 96 + 42.43 * scale;
  const y = 262;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${GROUND}"/>
  <g transform="translate(${x} ${y}) scale(${scale})">
    ${lockup(DARK_BG)}
  </g>
  <rect x="96" y="330" width="128" height="5" fill="${LOGO_COLORS.purple}"/>
  <text x="96" y="392" font-family="Public Sans, Helvetica Neue, Arial, sans-serif" font-size="31" font-weight="600" fill="#E4E5E8" letter-spacing="-0.4">Websites, software, marketing &amp; SEO</text>
  <text x="96" y="438" font-family="Public Sans, Helvetica Neue, Arial, sans-serif" font-size="31" font-weight="400" fill="#8A8F99" letter-spacing="-0.2">Calgary, Alberta</text>
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="${LOGO_COLORS.purple}"/>
</svg>
`;
}

async function write(relative: string, contents: string | Buffer): Promise<void> {
  const target = path.join(ROOT, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents);
  const size = typeof contents === "string" ? Buffer.byteLength(contents) : contents.length;
  console.log(`  ${relative.padEnd(34)} ${(size / 1024).toFixed(1)} KB`);
}

async function main(): Promise<void> {
  console.log("Generating brand assets from src/lib/oax-logo.ts\n");

  await write("public/brand/oax-logo.svg", lockupSvg(LIGHT_BG));
  await write("public/brand/oax-logo-white.svg", lockupSvg(DARK_BG));

  // Tab icon. SVG so it stays crisp at every density and in both themes.
  await write("src/app/icon.svg", emblemSvg(LIGHT_BG));

  // Apple touch icon must be opaque — iOS composites it onto the home screen
  // with no transparency handling and a transparent PNG renders black.
  await write(
    "src/app/apple-icon.png",
    await sharp(Buffer.from(emblemSvg(DARK_BG, GROUND))).resize(180, 180).png().toBuffer(),
  );

  await write(
    "src/app/opengraph-image.png",
    await sharp(Buffer.from(ogSvg())).png({ quality: 90 }).toBuffer(),
  );

  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
