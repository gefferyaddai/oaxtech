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

/**
 * SINGLE SWAP POINT FOR THE OAX TECH LOGO.
 *
 * The official logo ships as two files in /public/brand:
 *   - oax-logo.svg        (for light backgrounds)
 *   - oax-logo-white.png  (for dark backgrounds)
 *
 * Both are currently PLACEHOLDERS. Replacing those two files with the
 * official vector artwork updates every instance across the site. The
 * logo is never recoloured, stretched or redrawn in code — width and
 * height stay proportional via `height: auto`.
 */
export function Logo({ variant = "dark", className, asStatic, width = 132 }: LogoProps) {
  const image = (
    <Image
      src={variant === "light" ? "/brand/oax-logo-white.png" : "/brand/oax-logo.svg"}
      alt="OAX Tech"
      width={width}
      height={Math.round((width / 200) * 44)}
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
