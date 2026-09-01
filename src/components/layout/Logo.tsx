import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Use the white lockup on dark backgrounds. */
  variant?: "dark" | "light";
  className?: string;
  /** Renders without the surrounding link (for use inside another link). */
  asStatic?: boolean;
  width?: number;
}

/** True aspect ratio of the lockup, from LOGO_VIEW_BOX (406.18 × 100). */
const LOCKUP_RATIO = 4.0618;

/**
 * SINGLE SWAP POINT FOR THE OAX TECH LOGO.
 *
 * The lockup ships as two vectors in /public/brand:
 *   - oax-logo.svg        (for light backgrounds)
 *   - oax-logo-white.svg  (for dark backgrounds — neutrals inverted, purple
 *                          untouched, matching the splash screen)
 *
 * Both are GENERATED from the traced geometry in `src/lib/oax-logo.ts` by
 * `npm run brand` — the same source the splash animation draws from, so the
 * header mark and the splash mark can never drift apart. To swap in official
 * artwork, replace the path strings in `oax-logo.ts` and re-run `npm run
 * brand`; nothing in this file changes.
 *
 * The logo is never recoloured, stretched or redrawn here — width and height
 * stay proportional via `height: auto`.
 */
export function Logo({ variant = "dark", className, asStatic, width = 132 }: LogoProps) {
  const image = (
    <Image
      src={variant === "light" ? "/brand/oax-logo-white.svg" : "/brand/oax-logo.svg"}
      alt="OAX Tech"
      width={width}
      height={Math.round(width / LOCKUP_RATIO)}
      className={cn("h-auto w-auto", className)}
      style={{ width, height: "auto" }}
      priority
      unoptimized
    />
  );

  if (asStatic) return image;

  return (
    <Link href="/" className="inline-flex shrink-0 items-center" aria-label="OAX Tech — home">
      {image}
    </Link>
  );
}
