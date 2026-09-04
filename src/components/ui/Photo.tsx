import Image, { type StaticImageData } from "next/image";
import { CornerTicks } from "@/components/ui/Drawing";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Photographic plate                                                          */
/* -------------------------------------------------------------------------- */

/**
 * A photograph mounted on the drawing.
 *
 * The screening treatment lives in `.photo-plate` in globals.css; this handles
 * the mount — registration ticks, the figure number and the caption block, all
 * in the tally layer. A photograph on a technical sheet is a FIGURE: it is
 * numbered, captioned, and referred to, rather than dropped in for atmosphere.
 * Numbering them is what stops the images reading as decoration.
 *
 * Images are STATIC IMPORTS (`import shot from "@/assets/…"`), not string
 * paths. Next then knows the intrinsic dimensions at build time, so every plate
 * reserves its exact space before the bytes arrive and the page never shifts
 * as the photographs load — which matters most on the pages where a plate sits
 * above the fold.
 *
 * `alt` is required and takes no default. A decorative default would let an
 * empty string ship silently on an image that carries meaning.
 */
export function PhotoPlate({
  src,
  alt,
  fig,
  caption,
  className,
  imageClassName,
  tone = "sheet",
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  src: StaticImageData;
  /** Required. Describe the photograph, not the layout. */
  alt: string;
  /** Figure number, e.g. "FIG. 04". Omitted plates render no caption block. */
  fig?: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
  /** `ink` swaps the screen so the image lifts off the dark ground. */
  tone?: "sheet" | "ink";
  priority?: boolean;
  sizes?: string;
}) {
  const onInk = tone === "ink";

  return (
    <figure className={cn("relative", className)}>
      <div className={cn("photo-plate relative", onInk && "photo-plate-ink", imageClassName)}>
        <Image
          src={src}
          alt={alt}
          placeholder="blur"
          priority={priority}
          sizes={sizes}
          className="h-full w-full object-cover"
        />
        <CornerTicks tone={onInk ? "paper" : "ink"} />
      </div>

      {(fig || caption) && (
        <figcaption
          className={cn(
            "mt-2 flex items-baseline gap-3 border-t pt-2",
            onInk ? "border-ink-line" : "border-line",
          )}
        >
          {fig && (
            <span
              className={cn(
                "tally shrink-0 font-mono nums",
                onInk ? "text-revision-onInk" : "text-revision-text",
              )}
            >
              {fig}
            </span>
          )}
          {caption && (
            <span className={cn("text-xs leading-relaxed", onInk ? "text-ink-text" : "text-faint")}>
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Plate loop                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A short silent video mounted as a plate.
 *
 * Autoplay only works muted, and the source carries an audio track that nobody
 * asked to hear on a marketing page, so `muted` is not optional here — it is
 * both the policy requirement and the correct behaviour.
 *
 * `preload="metadata"` keeps the poster frame cheap: the file is several
 * megabytes and this is ambient, so it must never compete with the page's real
 * content for bandwidth.
 *
 * Under `prefers-reduced-motion` the video is not rendered at all and the
 * poster image stands in its place. Pausing a looping background is not enough
 * — a reduced-motion visitor should not be made to download it either.
 */
export function PlateLoop({
  src,
  poster,
  alt,
  fig,
  caption,
  className,
  imageClassName,
  tone = "sheet",
}: {
  /** Path under /public, e.g. "/video/08-code.mp4". */
  src: string;
  /** Still shown before playback, and instead of it under reduced motion. */
  poster: StaticImageData;
  alt: string;
  fig?: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
  tone?: "sheet" | "ink";
}) {
  const onInk = tone === "ink";

  return (
    <figure className={cn("relative", className)}>
      <div className={cn("photo-plate relative", onInk && "photo-plate-ink", imageClassName)}>
        {/* Reduced motion: the still only. */}
        <Image
          src={poster}
          alt={alt}
          placeholder="blur"
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="h-full w-full object-cover motion-safe:hidden"
        />
        <video
          className="hidden h-full w-full object-cover motion-safe:block"
          src={src}
          poster={poster.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
        />
        <CornerTicks tone={onInk ? "paper" : "ink"} />
      </div>

      {(fig || caption) && (
        <figcaption
          className={cn(
            "mt-2 flex items-baseline gap-3 border-t pt-2",
            onInk ? "border-ink-line" : "border-line",
          )}
        >
          {fig && (
            <span
              className={cn(
                "tally shrink-0 font-mono nums",
                onInk ? "text-revision-onInk" : "text-revision-text",
              )}
            >
              {fig}
            </span>
          )}
          {caption && (
            <span className={cn("text-xs leading-relaxed", onInk ? "text-ink-text" : "text-faint")}>
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
