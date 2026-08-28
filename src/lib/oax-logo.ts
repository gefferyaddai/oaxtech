/**
 * OAX Tech logo geometry.
 *
 * The only artwork the business has supplied is a raster PNG
 * (`src/assets/oax-logo-new.png`), which cannot be drawn, masked or recoloured.
 * These paths were traced from it at source resolution and agree with the
 * original masks to 98-99.5% intersection-over-union, so the mark can be
 * animated and set on a dark ground without redrawing it by hand.
 *
 * Coordinate system: the emblem is centred on the origin and is exactly 100
 * units tall, so `translate`/`scale` values elsewhere can be reasoned about in
 * percentages of the emblem. The wordmark keeps its true offset from the
 * emblem, so the lockup spacing is the supplied artwork's, not an estimate.
 *
 * REPLACE-ME: if the official vector lands, swap these five strings and every
 * consumer updates. Nothing else here depends on how they were produced.
 */

/** `viewBox` covering the full horizontal lockup. */
export const LOGO_VIEW_BOX = "-42.43 -50 406.18 100";

/** Emblem extent in logo units — the emblem is a 100-unit-tall hexagon. */
export const EMBLEM = { left: -42.43, right: 42.43, top: -50, bottom: 50 } as const;

/** Wordmark extent in logo units. */
export const WORDMARK = { left: 59.96, right: 363.94, techLeft: 227.29 } as const;

/** Brand colours sampled from the supplied artwork. */
export const LOGO_COLORS = {
  purple: "#652de7",
  charcoal: "#292d30",
  black: "#060707",
} as const;

/**
 * The three emblem arms, as separate fills.
 *
 * Each is a 6-7 point polygon forming one blade of the pinwheel. Read
 * clockwise from twelve o'clock the order is purple, charcoal, black, which is
 * what lets a single angular sweep reveal them in brand order.
 */
export const EMBLEM_PATHS = {
  purple: "M-18.53 -37.65L0.8 -49.6L2.79 -49.8L42.63 -26.29L42.63 -2.79L22.51 8.96L22.51 -13.15Z",
  charcoal: "M42.63 1.39L42.23 25.5L0.6 50.2L-18.33 39.64L-18.33 15.74L0.6 26.29Z",
  black: "M-22.31 37.45L-42.43 25.9L-42.43 -22.91L-22.51 -35.06L-3.78 -24.3L-22.31 -12.35Z",
} as const;

/**
 * The wordmark, split into the two groups that animate independently.
 * `oax` carries the O counter as a reversed subpath, so it needs the default
 * nonzero fill rule; do not set `fill-rule="evenodd"` on it.
 */
export const WORDMARK_PATHS = {
  oax:
    "M111.95 -3.39L111.95 2.39L110.96 7.17L109.16 10.96L107.17 13.75L103.59 17.13L98.61 20.12L94.22 21.71L89.44 22.51L82.07 22.51L79.28 22.11L73.51 20.32L70.12 18.53L66.53 15.74L63.35 11.95L60.96 7.17L59.96 2.99L59.96 -3.98L60.76 -7.57L62.75 -11.95L64.54 -14.54L67.73 -17.73L72.31 -20.72L76.29 -22.31L80.88 -23.31L89.44 -23.51L92.23 -23.11L97.81 -21.51L101.59 -19.52L104.38 -17.53L108.57 -12.75L110.96 -7.97ZM107.77 21.71L114.74 7.77L116.14 5.78L117.93 1.79L120.52 -2.39L121.51 -4.98L131.08 -22.51L143.82 -22.51L144.22 -22.11L144.22 -21.51L149.6 -11.35L156.57 3.59L157.17 4.18L164.14 18.53L166.33 16.33L169.92 11.55L171.31 10.36L172.51 8.37L174.9 5.98L175.3 4.98L177.89 2.39L178.49 1.2L180.08 -0.4L180.08 -1L175.3 -6.57L174.9 -7.57L173.11 -9.36L167.13 -17.33L166.14 -18.13L163.15 -22.51L179.08 -22.51L181.67 -18.73L188.65 -10.16L197.01 -20.12L198.61 -22.51L214.14 -22.51L208.76 -15.54L207.37 -14.34L205.98 -12.15L204.38 -10.76L203.59 -9.36L196.41 -1L196.41 -0.4L197.41 0.4L201.2 5.58L203.39 7.77L210.96 17.53L212.95 19.52L214.14 21.71L198.01 21.71L187.85 8.96L187.45 8.96L185.26 11.55L184.66 12.75L178.88 19.32L177.29 21.71L151.39 21.71L149 16.93L128.69 16.93L133.67 7.17L144.22 7.17L142.03 1.59L141.04 0.2L137.25 -8.17L136.65 -7.77L136.06 -5.98L135.06 -4.78L130.68 4.38L121.51 21.51ZM97.81 -4.58L96.02 -7.77L94.02 -9.76L91.24 -11.35L86.65 -12.35L83.47 -12.15L80.48 -11.35L77.29 -9.36L74.5 -5.58L73.51 -1.59L73.51 1L74.1 3.59L76.1 7.17L77.89 8.76L80.68 10.36L83.67 11.16L88.25 11.16L91.24 10.36L94.02 8.76L95.82 6.97L97.81 3.39L98.21 1.79L98.21 -2.79Z",
  tech:
    "M326.69 -14.94L326.89 -14.14L323.11 -10.16L322.31 -10.16L318.53 -13.15L316.53 -13.94L313.15 -14.54L308.76 -14.14L304.78 -12.15L301.99 -9.36L300.2 -6.18L299.4 -2.99L299.4 1.59L300.2 4.78L301.79 7.77L303.98 10.16L306.97 12.15L310.36 13.15L315.54 12.95L318.73 11.75L320.92 10.36L322.11 8.96L323.11 8.76L327.09 12.55L326.89 13.15L324.7 15.34L320.72 17.73L317.33 18.92L313.35 19.52L309.16 19.32L306.37 18.73L302.19 16.93L299.4 14.94L297.21 12.75L295.02 9.56L293.82 6.97L292.63 1.59L292.63 -2.99L293.43 -6.97L295.22 -11.16L297.21 -13.94L301.59 -17.73L304.78 -19.32L309.56 -20.52L315.34 -20.52L318.13 -19.92L322.91 -17.93ZM239.44 18.92L239.24 -13.94L227.69 -14.14L227.29 -14.54L227.29 -19.72L227.69 -20.12L257.37 -20.12L257.57 -14.54L257.17 -14.14L245.62 -13.94L245.62 18.73ZM289.64 -20.12L289.84 -14.54L289.44 -14.14L269.12 -13.94L269.12 -3.98L287.05 -3.78L286.85 1.99L269.12 2.19L269.12 12.75L289.84 12.95L290.24 14.34L290.24 18.53L289.84 18.92L262.95 18.92L262.75 -19.72L263.15 -20.12ZM363.94 18.73L357.57 18.73L357.57 2.39L338.05 2.39L338.05 18.53L337.65 18.92L331.67 18.73L331.47 -19.52L331.87 -20.12L337.65 -20.12L338.05 -19.72L338.05 -3.78L338.84 -3.59L357.37 -3.59L357.57 -19.72L357.97 -20.12L363.75 -20.12Z",
} as const;
