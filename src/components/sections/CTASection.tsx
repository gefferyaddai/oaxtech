import { Container } from "@/components/layout/Container";
import { ArcEdge, CornerTicks, TitleBlock, type EdgeGround } from "@/components/ui/Drawing";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
  /** Inset plate style used on the pricing and contact pages. */
  inset?: boolean;
  /** Sheet number shown in the closing title block. */
  sheetNo?: string;
  /**
   * Ground of the section directly above, so the closing band can arrive on an
   * arc. Defaults to the paper ground, which is what most pages end on; pass
   * the real one where a page closes on a different band or the arc tears a
   * paper-coloured gap across the bottom of it.
   */
  edgeFrom?: EdgeGround;
}

/**
 * The closing sheet, on the ink ground.
 *
 * This is the last thing on every page and the primary action's home, so it
 * gets the heaviest treatment in the system: full-bleed ink, an oversized
 * title, a hatched margin, and the actions as solid blocks rather than a row
 * of links. The hatching runs down the left edge the way a drawing marks the
 * bound edge of a sheet.
 */
export function CTASection({ title, description, actions, className, inset, sheetNo = "SHT 99", edgeFrom = "sheet" }: CTASectionProps) {
  const body = (
    <div className="relative">
      <CornerTicks tone="revision" />

      <div className="grid grid-cols-1 items-start gap-10 px-5 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.25fr_auto] lg:gap-16 lg:px-14 lg:py-20">
        <div className="min-w-0">
          <p className="eyebrow mb-6 text-ink-text">Next step</p>
          <h2 className="text-display-xl text-white">{title}</h2>
          {description && (
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-text">{description}</p>
          )}
          <TitleBlock
            tone="paper"
            className="mt-10 hidden lg:flex"
            fields={[
              { label: "Consultation", value: "30 min · Free" },
              { label: "Sheet", value: sheetNo },
              { label: "Location", value: "Calgary AB" },
            ]}
          />
        </div>

        <div className="flex w-full flex-col gap-4 lg:max-w-xs">{actions}</div>
      </div>
    </div>
  );

  if (inset) {
    return (
      <section className={cn("bg-sheet py-12 lg:py-16", className)}>
        <Container>
          <div className="surface-ink">{body}</div>
        </Container>
      </section>
    );
  }

  /*
   * The full-bleed variant is a band that leaves the paper, so it arrives on an
   * arc — the same rule the homepage sets for the ink and revision bands. The
   * inset variant above is a plate sitting ON the paper and keeps its square
   * edges: curvature marks the bands that lift off the stock, nothing else.
   *
   * No exit arc: the footer is `surface-ink` too, so this band runs straight
   * into it and a second curve would cut a paper seam into a continuous ground.
   */
  return (
    <>
      <ArcEdge from={edgeFrom} to="ink" />
      <section className={cn("surface-ink", className)}>
        <Container className="py-0">{body}</Container>
      </section>
    </>
  );
}
