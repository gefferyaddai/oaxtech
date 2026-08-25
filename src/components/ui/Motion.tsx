"use client";

import { Children, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { layerByIndex } from "@/lib/layers";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * MOTION
 * ============================================================================
 *
 * The drawing set's native motion, in one place.
 *
 * The governing idea: a drawing is MADE, and the page should behave like it is
 * being made as you scroll. So rules draw from their start point, plates slide
 * into register, station markers strike in sequence, and a plotter head travels
 * the spine. Nothing floats, pulses, or drifts without cause — the brief ruled
 * that out, and this world would not survive it anyway.
 *
 * Everything here animates `transform`, `opacity` or `clip-path` only, so it
 * stays on the compositor. Every effect fires once via IntersectionObserver and
 * then unobserves: a page that re-hides its own content when you scroll back up
 * makes the visitor wait for copy they already read.
 *
 * Reduced motion is honoured at the source, not just in CSS — each hook returns
 * the settled state immediately, so a reduced-motion visitor gets the finished
 * drawing rather than a snapped-together one.
 */

/* -------------------------------------------------------------------------- */
/* Shared observer                                                            */
/* -------------------------------------------------------------------------- */

function useInView<T extends HTMLElement>(options?: { threshold?: number; rootMargin?: string }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const threshold = options?.threshold ?? 0.2;
  const rootMargin = options?.rootMargin ?? "0px 0px -8% 0px";

  useEffect(() => {
    if (reducedMotion) {
      setInView(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    /*
     * Failsafe first. Content that animates in from `opacity: 0` is invisible
     * until something flips it, so every path that could fail to flip it has
     * to be closed:
     *
     *   - no IntersectionObserver (very old browser) -> show immediately;
     *   - already on screen at mount (deep link to an anchor, a restored
     *     scroll position, a short page) -> show immediately, because an
     *     observer's first callback is not guaranteed to arrive before paint.
     *
     * A blank section is a far worse outcome than a missed animation.
     */
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, threshold, rootMargin]);

  return { ref, inView, reducedMotion };
}

/* -------------------------------------------------------------------------- */
/* Drawn rule                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A rule that draws itself from its start point when it enters view.
 *
 * This is the single most-repeated motion on the site, because every section
 * opens on a bar rule. It is what makes a page of static type feel like it is
 * being drafted rather than loaded.
 */
export function DrawnRule({
  className,
  weight = "bar",
  tone = "ink",
  delay = 0,
}: {
  className?: string;
  weight?: "bar" | "heavy" | "hair";
  tone?: "ink" | "paper" | "revision";
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.6, rootMargin: "0px" });

  const height = { bar: "h-1.5", heavy: "h-[3px]", hair: "h-px" }[weight];
  const color = { ink: "bg-graphite", paper: "bg-white", revision: "bg-revision" }[tone];

  return (
    <div ref={ref} className={cn("w-full overflow-hidden", height, className)}>
      <div
        /* Transform and transition are inline rather than utility classes.
           Tailwind was not emitting `scale-x-0` / `scale-x-100` for this file,
           so the rule silently kept whatever transform it inherited and never
           drew — a failure with no error and no visible cause. Animated values
           are computed here anyway, so owning them outright is both more
           robust and easier to read. */
        style={{
          transform: `scaleX(${inView ? 1 : 0})`,
          transformOrigin: "left",
          transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: `${delay}ms`,
        }}
        className={cn("h-full w-full", color)}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Clip reveal                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Content that rises from behind the rule above it.
 *
 * A clipping wrapper plus a translate, rather than a per-line split: the
 * headline's line count changes with the viewport, so anything that depends on
 * knowing where the lines break is wrong at some width. This is robust at every
 * width and reads the same.
 */
export function ClipReveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "h1" | "h2" | "p";
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <Tag
        style={{
          display: "block",
          transform: inView ? "translateY(0)" : "translateY(110%)",
          opacity: inView ? 1 : 0,
          transition: "transform 850ms cubic-bezier(0.16, 1, 0.3, 1), opacity 850ms cubic-bezier(0.16, 1, 0.3, 1)",
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </Tag>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Slide in                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Direction-aware entrance. Split sections slide their two halves in from
 * opposite edges, which gives the scroll a left-right pulse that a uniform
 * fade-up cannot.
 */
export function SlideIn({
  children,
  className,
  from = "up",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  from?: "up" | "left" | "right";
  delay?: number;
  as?: "div" | "li" | "article" | "section";
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const hidden = {
    up: "translateY(2rem)",
    left: "translateX(-2.5rem)",
    right: "translateX(2.5rem)",
  }[from];

  return (
    <Tag
      ref={ref as never}
      style={{
        transform: inView ? "none" : hidden,
        opacity: inView ? 1 : 0,
        transition: "transform 750ms cubic-bezier(0.16, 1, 0.3, 1), opacity 750ms cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: inView ? `${delay}ms` : "0ms",
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* Stagger grid                                                               */
/* -------------------------------------------------------------------------- */

/**
 * A grid whose children reveal in sequence.
 *
 * Exists so a page can get a staggered grid by changing one element rather than
 * wrapping every card by hand — which is how stagger delays end up inconsistent
 * from page to page. Keep `step` at the default unless a grid has an unusual
 * number of items; the pacing is part of the system, not a per-page choice.
 */
export function StaggerGrid({
  children,
  className,
  step = 90,
  from = "up",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
  from?: "up" | "left" | "right";
  as?: "div" | "ul" | "ol";
}) {
  const items = Children.toArray(children);

  return (
    <Tag className={className}>
      {items.map((child, index) => (
        <SlideIn key={index} from={from} delay={index * step}>
          {child}
        </SlideIn>
      ))}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* Plotter pass                                                               */
/* -------------------------------------------------------------------------- */

/**
 * A plotter head that travels the length of a rule once, when the rule enters
 * view, leaving the drawn line behind it.
 *
 * This is the page's one piece of literal machinery: the thing that draws the
 * drawing. It runs once per section and never loops, so it reads as an event
 * rather than as decoration.
 */
export function PlotterPass({
  className,
  tone = "revision",
  duration = 1400,
}: {
  className?: string;
  tone?: "revision" | "ink" | "paper";
  duration?: number;
}) {
  const { ref, inView, reducedMotion } = useInView<HTMLDivElement>({ threshold: 0.3 });

  const head = { revision: "bg-revision", ink: "bg-graphite", paper: "bg-white" }[tone];
  const line = { revision: "bg-revision", ink: "bg-graphite", paper: "bg-ink-text" }[tone];

  return (
    <div ref={ref} aria-hidden="true" className={cn("relative h-0.5 w-full", className)}>
      {/* The drawn line, laid down behind the head */}
      <span
        className={cn("absolute inset-0", line)}
        style={{
          transform: `scaleX(${inView ? 1 : 0})`,
          transformOrigin: "left",
          transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      />
      {/* The head itself. Suppressed entirely under reduced motion — a marker
          parked mid-rule with no travel is a smudge, not a plotter. */}
      {!reducedMotion && (
        <span
          className={cn("absolute h-2 w-2", head)}
          style={{
            top: "-3px",
            left: inView ? "100%" : "0%",
            transition: `left ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tally marquee                                                              */
/* -------------------------------------------------------------------------- */

/**
 * A continuously sliding register strip.
 *
 * The page's one piece of perpetual motion, and it earns the exception: a
 * drawing set's index strip is a physical thing that feeds past, and a slow
 * horizontal crawl of real capability names reads as a machine running rather
 * than as an animated ornament. It pauses on hover so anyone trying to read an
 * item can, and it renders as a static wrapped list under reduced motion.
 *
 * The list is duplicated once and the track translates exactly -50%, which is
 * what makes the loop seamless; the duplicate is `aria-hidden` so a screen
 * reader hears the items once.
 */
export function TallyMarquee({
  items,
  className,
  speedSeconds = 42,
  tone = "ink",
}: {
  items: string[];
  className?: string;
  speedSeconds?: number;
  tone?: "ink" | "paper";
}) {
  const reducedMotion = usePrefersReducedMotion();
  const onInk = tone === "paper";

  const text = onInk ? "text-ink-text" : "text-graphite";

  /* The marks cycle through the four drawing-layer colours, so the strip reads
     as the four disciplines running past rather than as one repeated dot. */
  const row = (key: string, hidden: boolean) => (
    <ul key={key} aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <li key={item} className="flex shrink-0 items-center gap-5 px-5">
          <span className={cn("h-2 w-2 shrink-0", layerByIndex(index).fill)} />
          <span className={cn("tally whitespace-nowrap font-mono", text)}>{item}</span>
        </li>
      ))}
    </ul>
  );

  if (reducedMotion) {
    return (
      <div className={cn("flex flex-wrap justify-center gap-x-2 gap-y-3 py-4", className)}>
        {row("static", false)}
      </div>
    );
  }

  return (
    <div className={cn("group relative overflow-hidden py-4", className)}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {row("a", false)}
        {row("b", true)}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sheet index rail                                                           */
/* -------------------------------------------------------------------------- */

export interface SheetIndexEntry {
  /** The section's DOM id. */
  id: string;
  /** Sheet number, e.g. "01". */
  no: string;
  /** Short label, announced to screen readers. */
  label: string;
}

/**
 * The drawing set's index, pinned to the right edge.
 *
 * A drawing set has a sheet index, and on a page this long it does real work:
 * it tells you how far through you are and lets you jump. The active sheet is
 * marked by a solid orange bar that slides between entries as you scroll —
 * the page's clearest moving part, and the only one tied to scroll position.
 *
 * Desktop only. On a phone it would eat the gutter it needs, and the page is
 * already short enough per-section to thumb through.
 */
export function SheetIndexRail({ entries }: { entries: SheetIndexEntry[] }) {
  const [active, setActive] = useState(entries[0]?.id ?? "");

  useEffect(() => {
    const sections = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        // The sheet occupying the middle band of the viewport is the one you
        // are reading, so intersection ratio alone is not enough on a page
        // whose sections differ this much in height.
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <nav
      aria-label="Sheet index"
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="pointer-events-auto flex flex-col gap-1 border-l border-line pl-3">
        {entries.map((entry) => {
          const current = entry.id === active;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={current ? "true" : undefined}
                className="group/idx flex items-center gap-2 py-1"
              >
                {/* The marker. Width, not colour, carries the state — it
                    extends like a drawn tick when its sheet is active. */}
                <span
                  className={cn(
                    "h-0.5 transition-all duration-300 ease-draft",
                    current
                      ? "w-6 bg-revision"
                      : "w-2.5 bg-line group-hover/idx:w-4 group-hover/idx:bg-graphite",
                  )}
                />
                <span
                  className={cn(
                    "tally font-mono tabular-nums transition-colors duration-300",
                    current ? "text-graphite" : "text-faint group-hover/idx:text-graphite",
                  )}
                >
                  {entry.no}
                </span>
                <span className="sr-only">{entry.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
