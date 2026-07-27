"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface OrbitalNode {
  key: string;
  icon?: string;
  label: string;
  meta?: string;
}

interface OrbitalSystemProps {
  hub: { icon: string; label: string };
  nodes: OrbitalNode[];
  tone?: "light" | "dark";
  /** "avatar" drops the icon chip and shows the label large, centred — for people, not capabilities. */
  nodeStyle?: "tile" | "avatar";
  className?: string;
}

const RX = 44;
const RY = 39;

function ellipsePoint(index: number, count: number) {
  const angle = (-90 + (360 / count) * index) * (Math.PI / 180);
  return { x: 50 + RX * Math.cos(angle), y: 50 + RY * Math.sin(angle) };
}

/**
 * The signature hero device: a hub orbited by the page's own content — real
 * services, real packages, real people — rather than a stand-in dashboard
 * screenshot. Built from real markup so every label is legible, selectable
 * and never claims data that doesn't exist.
 */
export function OrbitalSystem({ hub, nodes, tone = "light", nodeStyle = "tile", className }: OrbitalSystemProps) {
  const [active, setActive] = useState<number | null>(null);
  const [travel, setTravel] = useState(false);
  const dark = tone === "dark";

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setTravel(!mq.matches);
  }, []);

  const arcPath = `M ${50 + RX} 50 A ${RX} ${RY} 0 1 1 ${50 - RX} 50 A ${RX} ${RY} 0 1 1 ${50 + RX} 50`;

  return (
    <div
      className={cn("relative mx-auto aspect-square w-[84%] max-w-[25rem] sm:w-full", className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl",
          dark ? "bg-cobalt/15" : "bg-cobalt/10",
        )}
      />

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <ellipse
          cx="50"
          cy="50"
          rx={RX}
          ry={RY}
          fill="none"
          stroke={dark ? "rgba(255,255,255,0.14)" : "rgba(9,11,18,0.10)"}
          strokeWidth="1"
        />
        {nodes.map((node, i) => {
          const pos = ellipsePoint(i, nodes.length);
          const isActive = active === i;
          return (
            <line
              key={node.key}
              x1="50"
              y1="50"
              x2={pos.x}
              y2={pos.y}
              stroke={isActive ? "var(--color-cobalt)" : dark ? "rgba(255,255,255,0.16)" : "rgba(9,11,18,0.12)"}
              strokeWidth={isActive ? 1.4 : 1}
              strokeDasharray="2.5 2.5"
              className="transition-[stroke,stroke-width] duration-300 ease-out"
            />
          );
        })}
        {travel && (
          <circle r="1.5" fill="var(--color-cobalt)" opacity="0.9">
            <animateMotion dur="10s" repeatCount="indefinite" path={arcPath} />
          </circle>
        )}
      </svg>

      <div
        className={cn(
          "orbit-hub absolute left-1/2 top-1/2 z-10 flex h-[5.5rem] w-[5.5rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border text-center shadow-float",
          dark ? "border-white/15 bg-space-card text-white" : "border-line bg-paper text-ink",
        )}
      >
        <Icon name={hub.icon} className="h-5 w-5 text-cobalt" />
        <p className="px-2 font-display text-[0.6rem] font-semibold leading-tight">{hub.label}</p>
      </div>

      {nodes.map((node, i) => {
        const pos = ellipsePoint(i, nodes.length);
        const isActive = active === i;
        return (
          <div
            key={node.key}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              animationDelay: `${i * 90}ms`,
            }}
            className={cn(
              "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 animate-fade-up items-center gap-2 rounded-xl border shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out",
              nodeStyle === "avatar" ? "h-12 w-12 flex-col justify-center px-1 py-1 sm:h-16 sm:w-16" : "p-2 sm:px-2.5 sm:py-2",
              dark ? "border-space-line bg-space-card" : "border-line bg-paper",
              isActive && cn("border-cobalt shadow-card-hover", nodeStyle === "avatar" ? "-translate-y-[calc(50%+4px)]" : "-translate-y-[calc(50%+4px)]"),
            )}
          >
            {nodeStyle === "avatar" ? (
              <span
                className={cn(
                  "font-display text-xs font-semibold leading-tight",
                  isActive ? "text-cobalt" : dark ? "text-white" : "text-ink",
                )}
              >
                {node.label}
              </span>
            ) : (
              <>
                {node.icon && (
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      dark ? "bg-white/10 text-white" : "bg-cobalt-soft text-cobalt",
                    )}
                  >
                    <Icon name={node.icon} className="h-3.5 w-3.5" />
                  </span>
                )}
                {/* Labels join from sm: up — at the ellipse's widest points a mobile
                    viewport has too little margin left for a nowrap label. */}
                <span className="hidden min-w-0 whitespace-nowrap sm:inline">
                  <span className={cn("block text-[0.7rem] font-medium leading-tight", dark ? "text-white" : "text-ink")}>
                    {node.label}
                  </span>
                  {node.meta && (
                    <span className={cn("block text-[0.625rem] leading-tight", dark ? "text-space-text" : "text-muted")}>
                      {node.meta}
                    </span>
                  )}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
