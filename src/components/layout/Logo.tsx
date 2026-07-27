import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Use the knocked-out lockup on dark backgrounds. */
  variant?: "dark" | "light";
  className?: string;
  /** Renders without the surrounding link (for use inside another link). */
  asStatic?: boolean;
  /** Rendered height in px. The mark is near-square, so height is what fits. */
  height?: number;
}

/** Intrinsic pixel dimensions of the artwork — a stacked, near-square lockup. */
const INTRINSIC = { width: 280, height: 272 };

/**
 * SINGLE SWAP POINT FOR THE OAX TECH LOGO.
 *
 * The official mark lives at /public/brand/oax-logo-white.png: a stacked
 * lockup (planet above the "OAX TECH" wordmark) drawn in solid dark ink on a
 * transparent background. Despite the filename it is the DARK artwork, so it
 * is used as-is on light surfaces (header, light sections).
 *
 * On dark surfaces (footer, portal sidebar) the same file is knocked out to
 * white with a filter. That is safe only because the mark is a single-colour
 * silhouette — `brightness(0)` flattens it to black, `invert(1)` flips it to
 * pure white, and the transparent background is untouched. Replace this with a
 * real white asset when one exists and drop the filter.
 *
 * The logo is never stretched or redrawn: it is sized by height and the width
 * follows from the intrinsic aspect ratio.
 */
export function Logo({ variant = "dark", className, asStatic, height = 40 }: LogoProps) {
  const width = Math.round((height / INTRINSIC.height) * INTRINSIC.width);

  const image = (
    <Image
      src="/brand/oax-logo-white.png"
      alt="OAX Tech"
      width={width}
      height={height}
      className={cn(
        "w-auto",
        // Knock the dark mark out to white where it sits on a dark surface.
        variant === "light" && "brightness-0 invert",
        className,
      )}
      style={{ height, width: "auto" }}
      priority
    />
  );

  if (asStatic) return image;

  return (
    <Link href="/" className="inline-flex shrink-0 items-center" aria-label="OAX Tech — home">
      {image}
    </Link>
  );
}
