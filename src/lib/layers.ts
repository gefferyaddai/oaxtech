/**
 * ============================================================================
 * DRAWING LAYERS
 * ============================================================================
 *
 * A drawing has layers, and every layer has its own pen colour. This product
 * has exactly four disciplines, so the disciplines ARE the layers.
 *
 * The point is consistency, not decoration: "Custom software" is teal on the
 * homepage legend, on its service card, on the services page and in the
 * register strip. A visitor who scans the site twice starts reading the colour
 * before the label.
 *
 * Two rules:
 *
 *   1. A layer colour NEVER carries an action. Violet alone means "act on
 *      this", so a filled layer plate can never be mistaken for a button.
 *   2. Class strings are written out in full rather than composed
 *      (`bg-layer-${key}`). Tailwind scans source text for literal class
 *      names, so an interpolated one is never generated — the exact failure
 *      that silently killed the drawn rules earlier in this build.
 */

export interface DrawingLayer {
  /** Layer number as it appears in the tally face. */
  no: string;
  /** Fill for icon plates and blocks, on the light ground. */
  fill: string;
  /** Text/border colour on the light ground. AA-safe at small sizes. */
  text: string;
  border: string;
  /** Text colour on the ink ground. The light-ground values are unusable there. */
  onInk: string;
}

/** Keyed by `Service.slug` — see `src/data/services.ts`. */
export const LAYERS: Record<string, DrawingLayer> = {
  "website-design": {
    no: "L1",
    fill: "bg-layer-web",
    text: "text-layer-web",
    border: "border-layer-web",
    onInk: "text-layer-web-ink",
  },
  "custom-software": {
    no: "L2",
    fill: "bg-layer-software",
    text: "text-layer-software",
    border: "border-layer-software",
    onInk: "text-layer-software-ink",
  },
  "marketing-consulting": {
    no: "L3",
    fill: "bg-layer-marketing",
    text: "text-layer-marketing",
    border: "border-layer-marketing",
    onInk: "text-layer-marketing-ink",
  },
  seo: {
    no: "L4",
    fill: "bg-layer-seo",
    text: "text-layer-seo",
    border: "border-layer-seo",
    onInk: "text-layer-seo-ink",
  },
};

/** Ordered, for anything that needs to cycle through the layers. */
export const LAYER_ORDER = Object.values(LAYERS);

/**
 * Falls back to graphite rather than to a colour: an unrecognised slug should
 * read as "no layer assigned", not as a fifth discipline.
 */
export function layerFor(slug: string | undefined): DrawingLayer {
  return (
    (slug && LAYERS[slug]) || {
      no: "—",
      fill: "bg-graphite",
      text: "text-graphite",
      border: "border-graphite",
      onInk: "text-ink-text",
    }
  );
}

/** Cycles the layer colours by index, for repeating marks. */
export function layerByIndex(index: number): DrawingLayer {
  return LAYER_ORDER[index % LAYER_ORDER.length];
}
