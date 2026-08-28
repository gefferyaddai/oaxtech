# OAX Tech — Website

Production-ready marketing site and client portal for OAX Tech, a Calgary-based
technology and digital-growth agency.

Built with Next.js (App Router), TypeScript, Tailwind CSS, React Hook Form, Zod
and lucide-react. No other runtime dependencies.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — the site runs fully without it
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

---

## Routes

**Public**

| Route | Page |
| --- | --- |
| `/` | Home |
| `/services` | Services |
| `/services/marketing-seo` | Marketing & SEO |
| `/pricing` | Pricing & packages |
| `/work` | Our work (client-side filtering) |
| `/work/spargo` | Spargo case study |
| `/about` | About us |
| `/learn-more` | Learn more about us (story video) |
| `/book` | Book a consultation (4-step flow) |
| `/quote` | Request a quote |
| `/contact` | Contact |
| `/resources` | Resources (category filtering) |
| `/resources/[slug]` | Article detail — 8 routes, 3 published + 5 "coming soon" |
| `/privacy`, `/terms` | Legal placeholders (noindex) |
| `/sitemap.xml`, `/robots.txt` | Generated |

**Client portal** — all `noindex, nofollow`

`/portal/login` and `/portal`, `/portal/progress`, `/milestones`, `/files`,
`/approvals`, `/revisions`, `/messages`, `/contracts`, `/invoices`,
`/completed`, `/support`

**API** — `/api/contact`, `/api/quote`, `/api/booking`, `/api/newsletter`

---

## Architecture

```
src/
├─ app/              routes; portal dashboard lives in a (dashboard) route
│                    group so /portal/login isn't gated by its own auth check
├─ components/
│  ├─ layout/        Container, Header, MobileNavigation, Footer, Logo
│  ├─ ui/            Button, Icon, SectionHeading, StatusBadge, States,
│  │                 OrbitalBackdrop, StarField
│  ├─ sections/      PageHero, ServiceCard, ProjectCard, PricingCard,
│  │                 ProcessSteps, FAQAccordion, CTASection, ArticleCard,
│  │                 TeamMemberCard, FilterTabs, HeroVisuals
│  ├─ forms/         Fields, FileUpload, FormStatus, ContactForm,
│  │                 NewsletterForm
│  ├─ booking/       BookingFlow
│  ├─ quote/         QuoteForm
│  └─ portal/        PortalSidebar, PortalTopbar, PortalPage, DemoBanner,
│                    PortalLoginForm, widgets
├─ data/             typed content — navigation, services, projects, pricing,
│                    team, faqs, articles, marketing, availability,
│                    portal-demo
└─ lib/              site config, metadata, utils, api-handler,
                     validation/schemas, integrations, portal/auth
```

**Design tokens** live in `tailwind.config.ts` (colours, type scale, container
widths, spacing, radii, shadows, breakpoints) and `src/app/globals.css` (button,
card and form primitives). Changing the brand is a single-file edit.

**Fonts** are self-hosted variable WOFF2, subset to latin — Bricolage Grotesque
(display) and Public Sans (body), 67 KB total. No third-party font requests.

---

## ⚠️ Placeholders you must replace before launch

### 1. The logo — highest priority

`public/brand/oax-logo.svg` and `public/brand/oax-logo-white.svg` are
**placeholders**. The official logo was only available embedded in the
low-resolution mockup screenshots (roughly 100×22px), so it was deliberately
**not** redrawn or cropped — either would have distorted it.

Drop the real vector files in at those two exact paths. `Logo.tsx` is the single
swap point; no code changes needed.

### 2. Business contact details — `src/lib/site.ts`

Every unconfirmed value is `null` and renders as an explicit "to be added"
state. Replace:

- `contact.email` — currently `null`
- `contact.phone` — currently `null`
- `contact.hours` — currently `"By appointment"`; confirm or change
- `socials[]` — all three URLs are `null`
- `location.streetAddress` / `postalCode` — `null` (fine if remote-first)
- `url` — set `NEXT_PUBLIC_SITE_URL` to the real domain

The mockups showed `hello@oaxtech.com` and `(587) 123-4567`. Both look like
sample data, so **neither was used anywhere in the build.**

### 3. Story video — `src/data/company.ts`

`/learn-more` is built around a recorded video of the OAX Tech story. Until the
recording exists, `storyVideo.src` is `null` and `StoryVideoPlate` renders a
hatched field stamped "footage pending" — never a broken player or a fake
thumbnail.

To publish it, drop the files in `/public/video/` and set three fields in
`storyVideo`:

```ts
src:      "/video/oax-story.mp4",     // H.264 MP4, web-optimised
poster:   "/video/oax-story.jpg",     // 16:9 poster frame
captions: "/video/oax-story.en.vtt",  // WebVTT — required before going live
duration: "6:20",                     // shown in the plate header
```

Captions are not optional: a spoken-word company story is unusable without them
for deaf and hard-of-hearing visitors.

This replaced the old `/team` page, which led with five profile cards whose
photographs were never supplied. `/team` permanently redirects to `/learn-more`
(see `next.config.ts`). The internal admin roster is unaffected — it lives in
`src/data/demo-data.ts`.

### 4. Resources content — `src/data/articles.ts`

No Resources mockup was supplied with the brief, so the eight article titles
were written to match the five categories named in the brief. Replace with your
real editorial list. Three articles have full bodies; five are marked
`coming-soon` and render a clear placeholder page (never a broken link) and are
excluded from the sitemap and Article schema.

### 5. Legal pages

`/privacy` and `/terms` render a "still needs to be written" notice and are
`noindex`. These are legal documents specific to your business.

---


---

## Mocked integrations

Every external service sits behind an adapter in `src/lib/integrations/`. **The
site builds and runs with zero environment variables set.** In that state each
adapter returns `{ ok: false, reason: "not_configured" }` and the UI says so —
no form ever reports a success that did not happen.

| Service | Env vars | Behaviour when unset |
| --- | --- | --- |
| Email | `EMAIL_API_KEY`, `EMAIL_TO_ADDRESS` | Form validates, then states the message was **not** sent and offers booking instead |
| Calendar | `CALENDAR_API_KEY` | Booking states the slot was **not** reserved and no email was sent |
| File storage | `STORAGE_BUCKET`, `STORAGE_ACCESS_KEY` | Attachments stay client-side; the UI says they were not uploaded |
| Database | `DATABASE_URL` | Submissions are not persisted |
| Auth | `AUTH_SECRET`, `AUTH_PROVIDER_URL` | Portal runs in labelled demo mode |
| Payments | `PAYMENTS_SECRET_KEY` | Invoice amounts withheld; no transaction possible |
| Spam protection | `SPAM_PROTECTION_SECRET` | Honeypot still active; token check skipped with a dev warning |
| Analytics | `NEXT_PUBLIC_ANALYTICS_ID` | Not loaded |

**Booking availability** (`src/data/availability.ts`) is clearly marked sample
data. `IS_SAMPLE_AVAILABILITY` is `true`, and the booking step shows a notice
that the calendar is not live. Reschedule and cancel are visibly disabled rather
than pretending to work.

**Portal security.** No credentials are checked, because none exist. The login
fields are *disabled* in demo mode — a password box that accepts anything is
worse than none. The demo session is a single flag in a short-lived, http-only
cookie containing no personal data. No password is stored in source, in a
cookie, or in local storage. Approve / sign / pay / message controls are all
disabled and labelled.

---

## Verification

Run against this build:

- ✅ `npm run lint` — no ESLint warnings or errors
- ✅ `npm run typecheck` — clean
- ✅ `npm run build` — succeeds, 43 pages generated
- ✅ All 21 public routes return 200; unknown paths return 404
- ✅ `/portal` redirects to `/portal/login` without a session; both return 200 with one
- ✅ `X-Robots-Tag: noindex, nofollow` present on all portal routes
- ✅ All static assets resolve (fonts, brand SVGs)
- ✅ Exactly one `<h1>` per page; `lang="en-CA"`; skip link present
- ✅ Every `<img>` has an `alt` attribute
- ✅ Every `target="_blank"` link carries `rel="noopener noreferrer"`
- ✅ `https://savewithspargo.com` and `https://ghsa.ca` preserved exactly
- ✅ No invented contact details, testimonials or statistics in rendered HTML
- ✅ No secrets committed; `.env*.local` gitignored

### Not verified — needs a real browser

These were built to spec but could not be confirmed in a headless container:

- Visual fidelity against the mockups at each breakpoint
- Absence of horizontal overflow at 320px (`overflow-x: clip` is set on `body`
  and no fixed widths exceed the viewport, but confirm visually)
- Browser console cleanliness at runtime
- Lighthouse scores
- Keyboard traversal end to end (focus traps, accordions, filters and the
  booking calendar are all implemented with native semantics and were built for
  this, but deserve a manual pass)

---

## Accessibility notes

Semantic HTML throughout; visible focus ring on every interactive element;
`prefers-reduced-motion` respected globally; status is never conveyed by colour
alone (every badge carries text); the mobile menu and portal drawer are modal
dialogs with focus trapping, Escape handling and focus restoration; form errors
are associated via `aria-describedby` and `aria-invalid`; filters announce
result counts via a polite live region; tables scroll horizontally rather than
shrinking text.

---

## Assumptions made

1. **Two Our Work mockups were supplied.** The later one was used as primary —
   it replaces invented client logos and testimonials with honest placeholders,
   which also matches the content-accuracy rules in the brief.
2. **No Resources mockup was supplied.** Article titles were written to match
   the five specified categories.
3. **Project previews are built in HTML/CSS**, not embedded screenshots. This
   keeps page weight low, prevents layout shift, and keeps all text selectable,
   searchable and responsive.
4. **Payment terms stay general** and defer to the written proposal, since no
   specific deposit percentage or schedule was supplied.
