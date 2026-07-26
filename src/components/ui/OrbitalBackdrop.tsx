import { cn } from "@/lib/utils";

interface OrbitalBackdropProps {
  className?: string;
  variant?: "light" | "dark";
  /** Show the small node dots that sit on the orbital paths. */
  showNodes?: boolean;
}

/**
 * The signature element: thin elliptical orbit lines echoing the OAX mark.
 *
 * Purely decorative, so it is aria-hidden and never sits above content. It
 * scales with its container via preserveAspectRatio="none" on the outer ring
 * only, keeping stroke weights visually consistent across breakpoints.
 */
export function OrbitalBackdrop({ className, variant = "light", showNodes = true }: OrbitalBackdropProps) {
  const stroke = variant === "dark" ? "rgba(255,255,255,0.14)" : "rgba(10,12,17,0.10)";
  const node = variant === "dark" ? "rgba(255,255,255,0.55)" : "rgba(26,92,255,0.55)";
  const nodeDim = variant === "dark" ? "rgba(255,255,255,0.25)" : "rgba(10,12,17,0.22)";

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <svg
        className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke={stroke} strokeWidth="1">
          <ellipse cx="400" cy="250" rx="330" ry="170" transform="rotate(-14 400 250)" />
          <ellipse cx="400" cy="250" rx="250" ry="215" transform="rotate(22 400 250)" />
          <ellipse cx="400" cy="250" rx="370" ry="110" transform="rotate(8 400 250)" />
        </g>
        {showNodes && (
          <g>
            <circle cx="112" cy="196" r="4" fill={node} />
            <circle cx="690" cy="300" r="4" fill={node} />
            <circle cx="404" cy="42" r="3" fill={nodeDim} />
            <circle cx="238" cy="428" r="3" fill={nodeDim} />
            <circle cx="640" cy="120" r="2.5" fill={nodeDim} />
          </g>
        )}
      </svg>
    </div>
  );
}
