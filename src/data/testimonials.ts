/**
 * ============================================================================
 * CLIENT TESTIMONIALS
 * ============================================================================
 *
 * CONTENT RULE — read before adding anything here.
 *
 * This array is empty because no client has approved a quote for publication
 * yet. That is a fact about the business, not a gap in the build: the homepage
 * renders a designed "awaiting approval" state for this section, and the
 * moment a real entry lands here it switches to a working carousel with no
 * other change required.
 *
 * Do NOT add:
 *   - invented, illustrative or "placeholder" quotes, even temporarily;
 *   - real feedback that has not been approved IN WRITING for public use;
 *   - a name, role or company the client has not agreed to have published.
 *
 * A fabricated testimonial on an agency site is the single fastest way to
 * lose the trust the rest of the page is working to build, and it is the kind
 * of claim that cannot be quietly walked back once it has been indexed.
 *
 * To publish one: get written approval, then add the entry below with the
 * date that approval was given.
 */

export interface Testimonial {
  /** The quote itself, as approved. Do not edit for punch. */
  quote: string;
  /** Person's name, as they agreed it should appear. */
  name: string;
  /** Their role at the time of the engagement. */
  role: string;
  /** Client organisation. Must match an entry the client agreed to. */
  company: string;
  /** ISO date the written approval was given. Recorded, not displayed. */
  approvedOn: string;
  /** Which project this relates to, when it maps to one in `projects.ts`. */
  projectSlug?: string;
}

export const testimonials: Testimonial[] = [];
