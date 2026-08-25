/**
 * ============================================================================
 * MEASURED CLIENT RESULTS
 * ============================================================================
 *
 * CONTENT RULE — this is the same rule `src/data/marketing.ts` states for the
 * marketing and SEO pages, applied to the homepage's results band: no ranking
 * guarantees, no client results, and no performance figures until they are
 * measured, attributable and approved.
 *
 * The array is empty. The homepage draws the band as hatched, clearly-labelled
 * empty cells rather than hiding the section or filling it with plausible
 * round numbers — a hatched field on a drawing means "nothing here yet", which
 * is the truth, and it keeps the layout the real figures will slot into.
 *
 * Before adding an entry you need all four of:
 *   1. a real measurement, from a source you can point at (Analytics, Search
 *      Console, the client's own reporting);
 *   2. a defined before/after window — a number with no period is not a result;
 *   3. attribution you would defend out loud, since correlation over a quarter
 *      is not proof the work caused it;
 *   4. the client's written permission to publish it.
 *
 * If any of the four is missing, leave it out.
 */

export interface ClientResult {
  /** The figure, formatted for display, e.g. "2.4x" or "+180%". */
  value: string;
  /** What was measured, e.g. "Organic sessions". */
  metric: string;
  /** The measurement window, e.g. "6 months post-launch". */
  period: string;
  /** Client organisation, as approved for publication. */
  company: string;
  /** Where the figure comes from, e.g. "Google Search Console". */
  source: string;
  /** ISO date the written approval was given. Recorded, not displayed. */
  approvedOn: string;
}

export const clientResults: ClientResult[] = [];

/**
 * How many empty cells the homepage band draws while `clientResults` is empty.
 * Keeps the section a deliberate composition rather than a collapsed row.
 */
export const RESULTS_PLACEHOLDER_CELLS = 3;
