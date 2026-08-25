# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: owners and decision-makers at small-to-mid businesses and organizations
in Calgary, Alberta and across Canada, evaluating an agency to build or rebuild
their digital presence. They arrive comparing vendors, are not technical
specialists, and are deciding whether this team is credible and worth a
conversation. Their job on the marketing site is to judge competence quickly and
book a consultation.

Secondary: existing clients, who sign in to a client portal to track project
progress, approve work, review invoices and message the team. Internal staff use
a separate admin surface.

## Product Purpose

OAX Tech is a Calgary-based technology and digital-growth agency. It designs and
builds websites, custom software, and marketing and SEO strategies for
businesses. The marketing site exists to convert an evaluating visitor into a
booked consultation. Success is a booking or quote request.

## Positioning

Combined technology and marketing capability under one team: development, design,
marketing and SEO delivered together rather than split across vendors. Clients
work directly with the team that builds their project. Local to Calgary, serving
Alberta and Canada.

## Operating Context

Visitors evaluate on desktop and mobile, often comparing several agencies in one
session. The primary conversion path is a free 30-minute consultation booking;
the secondary is a quote request with optional file attachments. The site also
carries a services breakdown, project case studies, transparent package pricing,
published articles, and an FAQ.

Delivery follows a documented five-step process on the homepage (Discover,
Strategy, Design & Build, Launch, Grow), with longer six-step variants for the
services and marketing pages.

## Capabilities and Constraints

- Next.js App Router, TypeScript, Tailwind, Drizzle + Postgres.
- Four core services: Website Design & Development, Custom Software Solutions,
  Marketing Consulting, SEO Services.
- **Mobile applications** and **AI & automation** are real offerings delivered
  under Custom Software, scoped and priced after a consultation. They are
  deliberately not top-level services: both are software work, and the site's
  structure and its four drawing-layer colours are built around four
  disciplines. Confirmed by the business 2026-08-19.
- Website packages carry published prices. Software, marketing and SEO work is
  quoted after a conversation — no figure is listed for it anywhere.
- Primary CTA: "Book a Free Consultation" (30 minutes, free — confirmed).
  Secondary CTA: "Request a Quote".
- Authenticated client portal and admin, gated by Auth.js with argon2id
  passwords. Admin access requires `users.admin_role`; portal access requires a
  `client_users` membership row. Both re-read from the database per request.
- Integrations degrade honestly: every unconfigured integration reports "not
  configured" rather than simulating success. The site builds and runs with all
  environment variables empty.
- Self-hosted variable fonts, no third-party font requests.

**Undecided / not yet confirmed:** business email address, phone number, street
address, postal code, and X/Twitter profile are all `null` in `src/lib/site.ts`
and render as explicit "to be added" placeholders. Do not invent them.

## Brand Commitments

- Name: OAX Tech. Founded 2024. Calgary, Alberta, Canada.
- Tagline: "Calgary-based technology and digital-growth agency helping
  businesses move forward."
- Logo assets: `public/brand/oax-logo.svg`, `public/brand/oax-logo-white.png`.
- Voice: plain, concrete, non-hyperbolic. States what it does without
  guarantees.
- Confirmed social profiles: LinkedIn, Instagram.

## Evidence on Hand

**Real and usable:**
- Two named clients with confirmed permission to be listed: Spargo
  (savewithspargo.com) and GHSA (ghsa.ca).
- Three featured project case studies: Spargo, GHSA, and a Nasdaq trading
  automation project, with a detailed feature breakdown for Spargo.
- Three published articles, plus five marked coming-soon.
- Transparent website package pricing.

**Absent — must not be fabricated:**
- No testimonials or client quotes. `src/app/page.tsx` ships a deliberate
  placeholder stating real quotes appear only once clients approve them and
  "nothing placed here will be invented."
- No client results, performance figures, ranking guarantees or business
  metrics. `src/data/marketing.ts` carries this as a standing content rule.
- No client logo image files — only two confirmed names.
- No photography or video of any kind. `public/` contains only fonts and the
  logo.

## Product Principles

1. **Never invent evidence.** Unconfirmed facts render as visible, designed
   "to be added" states rather than plausible-looking filler. This applies to
   testimonials, metrics, contact details and client logos alike.
2. **Honest degradation over simulated success.** An unconfigured integration
   says so; it does not fake a delivered message or a reserved slot.
3. **Convert to a conversation.** Every surface drives toward the free
   consultation booking or a quote request.
4. **Credibility through specificity.** The real work — named projects, a
   documented process, transparent pricing — carries the persuasion that
   invented proof otherwise would.
5. **One team, technology and marketing together.** Positioning that a
   single-discipline competitor cannot truthfully copy.

## Accessibility & Inclusion

Established in the incumbent implementation and to be preserved: a single
always-visible `:focus-visible` treatment, 44px minimum tap targets, a skip
link, no horizontal scroll down to 320px, and full `prefers-reduced-motion`
honoring that neutralizes all animation and smooth scrolling.
