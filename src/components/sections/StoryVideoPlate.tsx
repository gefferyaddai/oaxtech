import { CornerTicks, RevisionStamp, TitleBlock } from "@/components/ui/Drawing";
import { Icon } from "@/components/ui/Icon";
import type { StoryVideo } from "@/data/company";

/**
 * The company story video, drawn as a plate belonging to the same set as the
 * hero visuals: bordered field, registration ticks, a ruled header carrying the
 * reel number and runtime, and a title block at the foot.
 *
 * TWO STATES, and the empty one is deliberate:
 *
 *   - `video.src` set   → a native <video> with controls and a poster frame.
 *   - `video.src` null  → a hatched field stamped "footage pending".
 *
 * The placeholder is the site's standing convention for a field left
 * deliberately unfilled. It is not a broken player and not a fake thumbnail:
 * until the recording exists, the honest thing to show is that it does not.
 *
 * No autoplay, no loop, no muted-background treatment. This is a person
 * talking — it plays when a visitor asks it to, at the volume they chose.
 */
export function StoryVideoPlate({ video }: { video: StoryVideo }) {
  const hasVideo = Boolean(video.src);

  return (
    <div className="relative border border-line bg-chalk p-4 sm:p-6">
      <CornerTicks />

      <div className="flex items-baseline justify-between border-b-rule border-graphite pb-2">
        <span className="tally font-mono text-graphite">Reel 01 — {video.title}</span>
        <span className="tally font-mono text-faint nums">
          {video.duration ?? "--:--"}
        </span>
      </div>

      <div className="mt-4">
        {hasVideo ? (
          <video
            /* `controls` and nothing else: the browser's own player is
               keyboard-accessible and localized, which a hand-rolled one would
               have to re-earn for no gain here. */
            controls
            preload="metadata"
            poster={video.poster ?? undefined}
            className="aspect-video w-full border-rule border-graphite bg-ink"
          >
            <source src={video.src ?? undefined} type="video/mp4" />
            {video.captions && (
              <track
                kind="captions"
                src={video.captions}
                srcLang="en"
                label="English"
                default
              />
            )}
            {/* Shown only by a browser that cannot play the element at all. */}
            <p className="p-6 text-sm text-white">
              Your browser cannot play this video.{" "}
              <a href={video.src ?? "#"} className="underline">
                Download it instead
              </a>
              .
            </p>
          </video>
        ) : (
          <PendingFootage />
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate">{video.description}</p>

      <TitleBlock
        className="mt-6"
        fields={[
          { label: "Recorded by", value: "OAX Tech" },
          { label: "Subject", value: "Company story" },
          { label: "Status", value: hasVideo ? "Published" : "Pending" },
        ]}
      />
    </div>
  );
}

/**
 * The unfilled field. Marked as a placeholder in the visible copy, not just in
 * the styling, so nobody mistakes it for a video that failed to load.
 */
function PendingFootage() {
  return (
    <div
      className="relative flex aspect-video w-full flex-col items-center justify-center gap-5 border-rule border-graphite bg-sheet-sunk px-6 text-center"
      role="img"
      aria-label="Placeholder: the OAX Tech story video has not been recorded yet."
    >
      <span aria-hidden="true" className="hatch absolute inset-0" />

      <span className="relative flex h-14 w-14 items-center justify-center border-rule border-graphite bg-sheet text-graphite">
        <Icon name="Play" className="h-6 w-6" />
      </span>

      <div className="relative bg-sheet-sunk px-4">
        <RevisionStamp>Footage pending</RevisionStamp>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate">
          The story video is being recorded. Everything it covers is written out
          on this page in the meantime.
        </p>
      </div>
    </div>
  );
}