"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HatchPanel, RevisionStamp } from "@/components/ui/Drawing";
import { Icon } from "@/components/ui/Icon";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ClientResult } from "@/data/results";
import type { Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * PROOF
 * ============================================================================
 *
 * The social-proof sections, built as real, finished components that happen to
 * have no content yet.
 *
 * This is the deliberate choice behind the whole file. The business has no
 * approved testimonials and no published client results, and inventing either
 * is not an option — so instead of hiding these sections or filling them with
 * plausible filler, they are built completely and render a designed empty
 * state drawn in the system's own language: a hatched field, which on a
 * drawing means an area deliberately left uncut.
 *
 * The consequence that matters: the day a real quote is added to
 * `src/data/testimonials.ts`, the carousel below becomes a working carousel,
 * with transitions, keyboard support and indicators already built and tested.
 * Nothing has to be redesigned to switch it on.
 */

/* -------------------------------------------------------------------------- */
/* Client register                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The client list, drawn as a register rather than a logo wall.
 *
 * There are no logo files. A handful of small logos in a "trusted by" strip
 * reads as thin; the same names set large in the display face against ruled
 * cells reads as a register of record, which is both more honest and more
 * confident.
 *
 * An entry may carry a shorter `label` for the register — see `trustedBy` in
 * `src/data/projects.ts` for why. When it does, the full name is still what
 * screen readers announce and what a hover reveals: the abbreviation is a
 * typographic decision, and it should not be the only name a visitor who
 * cannot see the composition ever gets.
 */
export function ClientRegister({
  clients,
  className,
}: {
  clients: { name: string; label?: string }[];
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between border-b-rule border-graphite pb-2">
        <span className="tally font-mono text-graphite">Featured client register</span>
        <span className="tally font-mono text-faint nums">
          {String(clients.length).padStart(2, "0")} on record
        </span>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {clients.map((client, index) => (
          <li
            key={client.name}
            className="group flex items-center gap-4 border-b border-line py-6 sm:border-r sm:last:border-r-0 sm:pr-6 lg:py-8"
          >
            <span aria-hidden="true" className="tally font-mono text-revision-text nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              /* The abbreviation is shown; the full name is what gets
                 announced and what a hover surfaces. `title` alone would not
                 be enough — it is not reliably reachable by keyboard or by
                 assistive technology, so the accessible name is set outright. */
              title={client.label ? client.name : undefined}
              aria-label={client.label ? client.name : undefined}
              className="font-display text-display-sm font-extrabold uppercase leading-none text-graphite transition-colors duration-200 group-hover:text-revision"
            >
              {client.label ?? client.name}
            </span>
          </li>
        ))}

        {/* The register is drawn to four cells so the row is a composition
            rather than a stub. Unfilled cells are hatched and labelled — the
            same honesty the rest of the page runs on, and a standing reminder
            that this list is meant to grow. */}
        {Array.from({ length: Math.max(0, 4 - clients.length) }).map((_, index) => (
          <li
            key={`open-${index}`}
            className="hatch flex items-center border-b border-line py-6 opacity-40 sm:border-r sm:last:border-r-0 lg:py-8"
          >
            <span className="tally bg-sheet px-2 font-mono text-faint">Open</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Results ledger                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The measured-results band.
 *
 * Renders real figures when `src/data/results.ts` has any, and hatched cells
 * carrying the reason when it does not. The reason is stated in the visitor's
 * interest, not as an apology: a business that publishes only measurable,
 * approved figures is telling you something useful about how it will report on
 * your project.
 */
export function ResultsLedger({
  results,
  placeholderCells,
  className,
}: {
  results: ClientResult[];
  placeholderCells: number;
  className?: string;
}) {
  if (results.length > 0) {
    return (
      <ul className={cn("grid gap-px bg-line sm:grid-cols-3", className)}>
        {results.map((result) => (
          <li key={`${result.company}-${result.metric}`} className="bg-sheet p-6 lg:p-8">
            <p className="font-display text-display-lg font-extrabold leading-none text-revision nums">
              {result.value}
            </p>
            <p className="mt-3 font-display text-lg font-bold uppercase leading-none text-graphite">
              {result.metric}
            </p>
            <p className="mt-2 text-sm text-pencil">{result.company}</p>
            <p className="tally mt-4 border-t border-line pt-3 font-mono text-faint">
              {result.period} · {result.source}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={cn("grid gap-5 sm:grid-cols-3", className)}>
      {Array.from({ length: placeholderCells }).map((_, index) => (
        <HatchPanel
          key={index}
          className="min-h-[200px]"
          contentClassName="flex flex-col items-start justify-between gap-6 p-6"
        >
          {/* Labels sit on solid plates. Setting a background on the text
              itself paints one box per line and leaves a ragged right edge
              wherever a line happens to break. */}
          <span className="tally inline-block bg-sheet px-2 py-1 font-mono text-faint nums">
            FIG. {String(index + 1).padStart(2, "0")}
          </span>
          <p className="inline-block bg-sheet px-2 py-1 font-display text-lg font-bold uppercase leading-none text-graphite">
            Not yet measured
          </p>
        </HatchPanel>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Testimonial carousel                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A real carousel.
 *
 * Scroll-snap does the transition, so the track stays natively swipeable on
 * touch and keyboard-scrollable, and the arrows drive `scrollTo` rather than
 * re-rendering the list. The active index is read back from scroll position,
 * which keeps the indicators correct when the visitor swipes instead of using
 * the controls.
 *
 * `smooth` behaviour is dropped under `prefers-reduced-motion`, where a
 * sliding track is exactly the kind of movement the setting is asking us to
 * stop.
 */
export function TestimonialCarousel({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(index, testimonials.length - 1));
      const child = track.children[clamped] as HTMLElement | undefined;
      if (!child) return;
      track.scrollTo({
        left: child.offsetLeft - track.offsetLeft,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion, testimonials.length],
  );

  // Read the active slide back from scroll position so swipes stay in sync.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = trackRef.current;
        if (!node) return;
        const children = Array.from(node.children) as HTMLElement[];
        const midpoint = node.scrollLeft + node.clientWidth / 2;
        const index = children.findIndex(
          (child) => child.offsetLeft - node.offsetLeft + child.clientWidth > midpoint,
        );
        if (index >= 0) setActive(index);
      });
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (testimonials.length === 0) {
    return (
      <HatchPanel
        className={className}
        contentClassName="flex flex-col items-start gap-8 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10 lg:p-12"
      >
        {/* One solid plate behind the whole copy block. Backgrounding the
            individual lines instead paints a separate box per line and leaves
            a ragged edge down the right. */}
        <div className="max-w-xl bg-sheet p-6">
          <span className="tally font-mono text-faint">Sheet reserved</span>
          <p className="mt-3 font-display text-display-sm font-bold uppercase leading-none text-graphite">
            Client quotes pending approval
          </p>
          <p className="mt-4 text-base leading-relaxed text-pencil">
            We publish a client&apos;s words only once they have approved them in writing.
            Nothing invented will ever appear here. Until then, the work itself is on
            record — three projects, with what was actually built listed for each.
          </p>
        </div>
        <RevisionStamp className="shrink-0 bg-sheet">Awaiting sign-off</RevisionStamp>
      </HatchPanel>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((testimonial) => (
          <li
            key={`${testimonial.company}-${testimonial.name}`}
            className="plate w-[min(100%,42rem)] shrink-0 snap-start p-8 lg:p-12"
          >
            <Icon name="Quote" className="h-8 w-8 text-revision" />
            <blockquote className="mt-6 font-display text-display-sm leading-tight text-graphite">
              {testimonial.quote}
            </blockquote>
            <footer className="mt-8 border-t-rule border-graphite pt-4">
              <p className="font-display text-lg font-bold uppercase leading-none text-graphite">
                {testimonial.name}
              </p>
              <p className="tally mt-2 font-mono text-faint">
                {testimonial.role} · {testimonial.company}
              </p>
            </footer>
          </li>
        ))}
      </ul>

      {testimonials.length > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4 border-t-rule border-graphite pt-4">
          <ol className="flex gap-2" aria-label="Slide indicators">
            {testimonials.map((testimonial, index) => (
              <li key={testimonial.company + index}>
                <button
                  type="button"
                  onClick={() => scrollToIndex(index)}
                  aria-current={index === active ? "true" : undefined}
                  className={cn(
                    "h-2 w-8 transition-colors duration-200",
                    index === active ? "bg-revision" : "bg-line hover:bg-graphite",
                  )}
                >
                  <span className="sr-only">Go to testimonial {index + 1}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollToIndex(active - 1)}
              disabled={active === 0}
              className="flex h-11 w-11 items-center justify-center border-rule border-graphite text-graphite transition-colors hover:bg-graphite hover:text-sheet disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-graphite"
            >
              <Icon name="ArrowLeft" className="h-4 w-4" />
              <span className="sr-only">Previous testimonial</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(active + 1)}
              disabled={active === testimonials.length - 1}
              className="flex h-11 w-11 items-center justify-center border-rule border-graphite text-graphite transition-colors hover:bg-graphite hover:text-sheet disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-graphite"
            >
              <Icon name="ArrowRight" className="h-4 w-4" />
              <span className="sr-only">Next testimonial</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
