"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  EMBLEM,
  EMBLEM_PATHS,
  LOGO_COLORS,
  LOGO_VIEW_BOX,
  WORDMARK,
  WORDMARK_PATHS,
} from "@/lib/oax-logo";

/**
 * ============================================================================
 * SPLASH SCREEN
 * ============================================================================
 *
 * The logo assembles itself on a black ground, holds, then lifts off the page.
 *
 * It runs on document load only — a first visit, a refresh, a hard link in —
 * and not on client-side navigation between pages.
 *
 * The idea is that the wordmark is already there, tucked behind the emblem, and
 * the emblem hands it out — rather than two unrelated things sliding in from
 * opposite edges. Three mechanisms do that work:
 *
 *   1. AN ANGULAR SWEEP draws the emblem. Read clockwise from twelve o'clock
 *      the three arms fall in the order purple -> charcoal -> black, so one
 *      sweep reveals them in brand order without three separate animations.
 *      The sweep is a circle stroked at twice its own radius, used as a
 *      luminance mask: running `stroke-dashoffset` down to zero wipes a hard
 *      radial edge around the centre. This is the SVG equivalent
 *      of a trim path, and unlike a `conic-gradient` mask it needs neither
 *      `@property` support nor a per-frame JS ticker, and its edge stays crisp.
 *
 *   2. A CLIP WHOSE LEFT EDGE IS PINNED to the emblem's right edge and whose
 *      right edge sweeps outward. The letters surface in reading order, at the
 *      emblem's edge — O first, H last.
 *
 *      This is the one place the brief was inverted on purpose. Sliding a rigid
 *      wordmark rightward out of a fixed clip reveals its RIGHT edge first, so
 *      you would read "H", "CH", "ECH" before "OAX TECH" ever resolved. Moving
 *      the clip instead keeps the same "out from behind the emblem" read and
 *      spells the name forwards.
 *
 *   3. A SHORT LEFTWARD OFFSET on each wordmark group, resolving under the
 *      clip, so the letters are travelling as they surface instead of
 *      materialising in place. TECH carries a longer offset and a later start
 *      than OAX, which is what gives the lockup its unfurl.
 *
 * The emblem is NOT the letter O — it is a hexagonal pinwheel, and the wordmark
 * carries its own O. So the whole of "OAX TECH" emerges; dropping the O to
 * avoid reading "OOAX TECH" would have left the name with no O at all.
 *
 * On a pure black ground the artwork's black arm and near-black "OAX" would be
 * invisible, so the two NEUTRALS are inverted for dark (black -> white,
 * charcoal -> grey), preserving their tonal relationship. The purple is the
 * artwork's exact value and is never adjusted — the brand hue is not ours to
 * move.
 *
 * Everything animates `transform`, `opacity` and `stroke-dashoffset` only, so
 * it stays on the compositor.
 */

/* -------------------------------------------------------------------------- */
/* Timing                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The single source of truth for the sequence. The `<style>` block below reads
 * these, so retiming the splash means editing this object and nothing else.
 */
const T = {
  /** Emblem draws clockwise from twelve o'clock. */
  drawStart: 0,
  drawDuration: 700,
  /** Purple bloom, timed to peak as the purple arm completes. */
  glowStart: 120,
  glowDuration: 640,
  /**
   * The completed emblem settles 96% -> 100%.
   *
   * On `settle`, not an overshoot curve. An overshoot was tried and measured
   * at 0.16% of scale — about one pixel on a 608px lockup — so it read as
   * nothing at all while still being the kind of springy motion the brief
   * ruled out. A firm, smooth arrival is the whole effect here.
   */
  pulseStart: 700,
  pulseDuration: 220,
  /**
   * The wordmark surfaces from the emblem's edge and lands without bouncing.
   *
   * The clip finishes well before the slide does, on purpose: the letters are
   * all present by ~1.4s and the remaining 300ms is pure settle. Running both
   * for the same 850ms would either rush the landing or leave the last letters
   * arriving after the mark had already stopped moving.
   */
  wordStart: 850,
  revealDuration: 620,
  wordDuration: 850,
  /** TECH trails OAX, and still lands with it. */
  techDelay: 100,
  /** Completed lockup holds, then the ground lifts. */
  exitStart: 2200,
  exitDuration: 420,
} as const;

const TOTAL = T.exitStart + T.exitDuration;

/**
 * Easing.
 *
 * `settle` is the site's own curve, already carrying every rule, plate and
 * headline on the marketing pages — the splash should not introduce a second
 * motion vocabulary. `emerge` is deliberately less front-loaded: on the site's
 * curve the entire wordmark cleared the clip within 250ms, which reads as a
 * flicker rather than as letters being handed out.
 */
const EASE = {
  draw: "cubic-bezier(0.45, 0, 0.25, 1)",
  emerge: "cubic-bezier(0.33, 0.1, 0.2, 1)",
  settle: "cubic-bezier(0.16, 1, 0.3, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

/**
 * Reduced motion gets a brief, static hold instead of the sequence.
 *
 * `globals.css` already forces every animation to 0.01ms, so the keyframes
 * below collapse to their settled state on their own — but `animation-delay`
 * survives that rule, so the exit would still sit for 2.2s before snapping out.
 * Cutting the timer is what actually makes it brief.
 */
const REDUCED_TOTAL = 900;

/**
 * Surfaces that never take a splash, even on a cold load — landing straight in
 * a staff tool should not cost two and a half seconds.
 */
const EXCLUDED = ["/admin"];

/* -------------------------------------------------------------------------- */
/* Dark-ground palette                                                        */
/* -------------------------------------------------------------------------- */

const ON_DARK = {
  /** The artwork's black arm and "OAX", inverted to carry the same dominance. */
  primary: "#f6f6f8",
  /** The artwork's charcoal arm and "TECH", one step back as in the original. */
  secondary: "#a8acb6",
  /** Untouched brand purple. */
  purple: LOGO_COLORS.purple,
} as const;

/* -------------------------------------------------------------------------- */
/* Geometry                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The sweep circle. Stroked at slightly more than twice its radius so the
 * stroke spans the centre outward past the emblem's furthest corner (50.2
 * units), which is what turns a stroked ring into a solid wedge.
 */
const SWEEP = { radius: 27, width: 58 } as const;

/**
 * The dash pattern is the circle's real circumference rather than a normalised
 * `pathLength="1"`. `pathLength` on a basic shape only landed in Safari 15, and
 * where it is ignored a dasharray of 1 becomes a one-unit dotted ring — the
 * emblem would come up as a dashed smear instead of a solid wipe. The literal
 * circumference has no such floor.
 */
const SWEEP_LENGTH = 2 * Math.PI * SWEEP.radius;

/** How far each wordmark group is displaced at the start, in logo units. */
const OFFSET = { oax: -22, tech: -31 } as const;

/**
 * The clip's fixed left edge, a hair inside the emblem so no seam shows between
 * the emblem's right corner and the first letter to surface.
 */
const CLIP_LEFT = EMBLEM.right - 0.5;

/**
 * The clip stops just past the last letter rather than running on to the edge
 * of the viewBox. Any slack here is progress spent revealing nothing, which
 * showed up as the wordmark completing a third of a second early.
 */
const CLIP_WIDTH = WORDMARK.right - CLIP_LEFT + 2;

/* -------------------------------------------------------------------------- */
/* Mark                                                                       */
/* -------------------------------------------------------------------------- */

function SplashMark() {
  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      className="oax-splash__svg"
      aria-hidden="true"
    >
      <defs>
        {/* The trim path. A luminance mask, so the white stroke is what shows. */}
        <mask id="oax-splash-sweep" maskUnits="userSpaceOnUse" x="-60" y="-60" width="120" height="120">
          <circle
            className="oax-splash__sweep"
            cx="0"
            cy="0"
            r={SWEEP.radius}
            fill="none"
            stroke="#fff"
            strokeWidth={SWEEP.width}
            strokeDasharray={SWEEP_LENGTH}
            /* Rotated so the sweep starts at twelve o'clock rather than three. */
            transform="rotate(-90)"
          />
        </mask>

        {/* Left edge pinned to the emblem; right edge sweeps outward. */}
        <clipPath id="oax-splash-reveal" clipPathUnits="userSpaceOnUse">
          <rect
            className="oax-splash__reveal"
            x={CLIP_LEFT}
            y={-60}
            width={CLIP_WIDTH}
            height={120}
          />
        </clipPath>
      </defs>

      <g className="oax-splash__emblem" mask="url(#oax-splash-sweep)">
        <path d={EMBLEM_PATHS.purple} fill={ON_DARK.purple} />
        <path d={EMBLEM_PATHS.charcoal} fill={ON_DARK.secondary} />
        <path d={EMBLEM_PATHS.black} fill={ON_DARK.primary} />
      </g>

      <g clipPath="url(#oax-splash-reveal)">
        <path className="oax-splash__oax" d={WORDMARK_PATHS.oax} fill={ON_DARK.primary} />
        <path className="oax-splash__tech" d={WORDMARK_PATHS.tech} fill={ON_DARK.secondary} />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

/*
 * Kept beside the component rather than in globals.css: every declaration here
 * exists only for these ~2.6 seconds, and eight keyframe sets in the global
 * sheet would be read by everyone maintaining it and used by no one.
 */
const CSS = `
.oax-splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: #000;
  animation: oax-splash-exit ${T.exitDuration}ms ${T.exitStart}ms ${EASE.exit} both;
}

.oax-splash__stage {
  position: relative;
  width: min(86vw, 38rem);
  animation: oax-splash-lift ${T.exitDuration}ms ${T.exitStart}ms ${EASE.exit} both;
}

.oax-splash__svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

/* The purple light. A CSS gradient rather than an SVG filter so it can bloom
   past the emblem without padding the viewBox or paying for a blur pass. */
.oax-splash__glow {
  position: absolute;
  left: 14.9%;
  top: 28%;
  width: 30%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, ${LOGO_COLORS.purple} 0%, rgba(101, 45, 231, 0) 68%);
  filter: blur(14px);
  opacity: 0;
  pointer-events: none;
  animation: oax-splash-glow ${T.glowDuration}ms ${T.glowStart}ms ease-out both;
}

.oax-splash__sweep {
  animation: oax-splash-draw ${T.drawDuration}ms ${T.drawStart}ms ${EASE.draw} both;
}

.oax-splash__emblem {
  /* An SVG element pivots on the viewBox origin unless its reference box is
     its own fill box, and the pulse would otherwise swing the emblem across
     the frame instead of settling it in place. */
  transform-box: fill-box;
  transform-origin: center;
  animation: oax-splash-pulse ${T.pulseDuration}ms ${T.pulseStart}ms ${EASE.settle} both;
}

.oax-splash__reveal {
  /* Same reason. The origin is the rect's own left edge, which is pinned to
     the emblem, so the clip opens outward from behind the mark. */
  transform-box: fill-box;
  transform-origin: left center;
  animation: oax-splash-reveal ${T.revealDuration}ms ${T.wordStart}ms ${EASE.emerge} both;
}

.oax-splash__oax {
  animation: oax-splash-oax ${T.wordDuration}ms ${T.wordStart}ms ${EASE.settle} both;
}

.oax-splash__tech {
  animation: oax-splash-tech ${T.wordDuration - T.techDelay}ms ${T.wordStart + T.techDelay}ms
    ${EASE.settle} both;
}

@keyframes oax-splash-draw {
  from { stroke-dashoffset: ${SWEEP_LENGTH}; }
  to   { stroke-dashoffset: 0; }
}

@keyframes oax-splash-glow {
  0%   { opacity: 0; }
  45%  { opacity: 0.5; }
  100% { opacity: 0; }
}

@keyframes oax-splash-pulse {
  from { transform: scale(0.96); }
  to   { transform: scale(1); }
}

@keyframes oax-splash-reveal {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

@keyframes oax-splash-oax {
  from { transform: translateX(${OFFSET.oax}px); }
  to   { transform: translateX(0); }
}

@keyframes oax-splash-tech {
  from { transform: translateX(${OFFSET.tech}px); }
  to   { transform: translateX(0); }
}

@keyframes oax-splash-exit {
  from { opacity: 1; }
  to   { opacity: 0; }
}

/* The mark carries on past the viewer as the ground lifts, so the splash reads
   as something you move through rather than a curtain that dissolves. */
@keyframes oax-splash-lift {
  from { transform: scale(1); }
  to   { transform: scale(1.04); }
}
`;

/* -------------------------------------------------------------------------- */
/* Splash                                                                     */
/* -------------------------------------------------------------------------- */

export function SplashScreen() {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  /*
   * Starts `true` so the overlay is in the server-rendered HTML. Mounting it in
   * an effect instead would paint the page first and the splash second, which
   * is the one thing a splash screen must never do.
   */
  const [active, setActive] = useState(true);

  const excluded = EXCLUDED.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  /*
   * Runs once and never re-arms. The App Router keeps the root layout mounted
   * across client-side navigation, so once this settles to `false` it stays
   * there for the rest of the session and only a real document load — a fresh
   * visit, a refresh, a hard link out and back — brings it up again.
   *
   * The timer is deliberately NOT gated on `excluded`. A first load on /admin
   * renders nothing, but if the timer were skipped `active` would stay true,
   * and the first navigation out to a public page would fire a splash that was
   * never meant to run.
   */
  useEffect(() => {
    const timer = window.setTimeout(
      () => setActive(false),
      reducedMotion ? REDUCED_TOTAL : TOTAL,
    );
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  /* The page behind must not scroll under the overlay, and must keep the scroll
     position it had — so `overflow` is restored to whatever was there before
     rather than being cleared outright. */
  useEffect(() => {
    if (!active || excluded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active, excluded]);

  if (!active || excluded) return null;

  return (
    <div
      /* Decorative: the page underneath already carries the real content, and
         a second accessible name for the logo would be read out over it. */
      aria-hidden="true"
      className="oax-splash"
    >
      <style>{CSS}</style>
      <div className="oax-splash__stage">
        <span className="oax-splash__glow" />
        <SplashMark />
      </div>
    </div>
  );
}
