# Design

The OAX Tech marketing site is an **engineering drawing set**. Every section is
a numbered sheet with a title block, a drawing number and a revision. The
homepage is the cover sheet; the interior pages are details of it.

This file records the system as built, not as intended. Where the two differ,
the code is right and this file is wrong — fix this file.

## Why this world

The audience is a Calgary business owner comparing three agencies in one
sitting. The category default is a dark-navy page with a gradient mesh, glass
cards and a floating dashboard mockup, which is what the previous design was
drifting toward and what the competitor in the next tab is also shipping. A
drawing set says something a gradient cannot: this team documents what it
builds. It also carries the product's actual constraint gracefully — a drawing
hatches the areas that have not been cut yet, which is exactly the right way to
render testimonials and client results that do not exist.

## Grounds

Two full-bleed grounds alternate down every page. There is no third.

| Token | Value | Role |
| --- | --- | --- |
| `sheet` | `#E4E5E8` | Cool grey print stock. The default ground. |
| `sheet-sunk` | `#D8DAE0` | Alternating band, one step down. |
| `sheet-deep` | `#C7CAD2` | Hatch fills, pressed and disabled states. |
| `chalk` | `#F3F3F6` | Plates sitting on the sheet. |
| `ink` | `#0B0B10` | Near-black with a violet whisper. Header, footer, heavy bands. |
| `ink-raised` / `ink-card` | `#15151E` / `#101017` | Elevated surfaces on ink. |

The body carries a fixed 2rem drafting grid at 4.5% opacity. It reads as paper
tooth, not as a visible table, and it is `background-attachment: fixed` so the
page behaves like stock being drawn on rather than a pattern scrolling past.

## The action colour

`revision` `#6D28D9` — a deep exposure violet. It carries roughly 30% of the
surface: filled blocks, display accents, active states, dimension lines, the
final process station, and one full-bleed statement band.

The token keeps the name `revision` because it is the revision-stamp **role**,
not the hue, that the system is built around.

Measured: **7.1:1** carrying white as a fill, **5.6:1** on the grey ground. That
combination is why the violet is this deep — it clears AA in both directions,
where the orange it replaced could only do one and needed a second darker value
for text. This palette needs one value, which is a genuine simplification rather
than a like-for-like hue swap.

- `revision.onInk` `#A78BFA` — for small text on the ink ground (7.2:1). The
  DEFAULT is only 2.8:1 there, so anything on ink uses this.
- `revision.text` `#5B21B6` — a darker option (7.1:1 on grey). No longer
  strictly necessary; kept so component code needn't change.

**The second accent** is `info` / the `violet` alias, `#1E40AF` — a Prussian
blue at 6.9:1 on the grey ground, reserved for the metadata layer. The roles do
not overlap: **violet means "act on this", blue means "this is a reference".**

## Drawing layers

A drawing has layers, and every layer has its own pen colour. This product has
exactly four disciplines, so the disciplines **are** the layers. Defined in
`src/lib/layers.ts`, keyed by `Service.slug`.

| Layer | Discipline | Colour | on grey | white on it |
| --- | --- | --- | --- | --- |
| `L1` | Websites | `#1E40AF` Prussian blue | 6.9:1 | 8.7:1 |
| `L2` | Custom software | `#115E59` deep teal | 6.0:1 | 7.6:1 |
| `L3` | Marketing | `#BE185D` rose | 4.8:1 | 6.0:1 |
| `L4` | SEO | `#854D0E` ochre | 5.4:1 | 6.9:1 |

Every value clears AA on the grey ground **and** carries white as a fill, so a
layer colour is safe as both a small drawing number and an icon plate. The
`-ink` variants exist because the base values sit between 2.3:1 and 4.0:1 on the
dark ground and must never be used there.

The colour is functional, not decorative: the same discipline reads the same
colour on the homepage legend, its service card, the services page section and
the register strip. A visitor who scans the site twice starts reading the colour
before the label.

**A layer colour never carries an action.** Violet alone means "act on this", so
a filled layer plate can never be mistaken for a button. An unrecognised slug
falls back to graphite — "no layer assigned", not a fifth discipline.

Class strings in `layers.ts` are written out in full rather than composed
(`bg-layer-${key}`). Tailwind scans source text for literal class names, so an
interpolated one is never generated — the same failure that silently killed the
drawn rules earlier in this build. Verify with a grep of the built CSS after
adding a layer.

## Type

| Face | Use |
| --- | --- |
| **Big Shoulders Display** (variable, self-hosted) | Every heading, button, nav item and card title. Set uppercase, bold, and tight. |
| **Public Sans** (variable, self-hosted) | Body copy and UI text. |
| **Martian Mono** (variable, self-hosted) | The tally layer: drawing numbers, revisions, dates, counts, field labels. |

Big Shoulders is condensed, which is the only reason the oversized headlines
fit — a normal-width grotesque at `display-xl` would wrap into unreadable
two-word lines. The display scale runs from `display-xs` (1.5rem) to
`display-2xl` (8.5rem), with line-heights from 1.05 down to 0.84.

The **tally layer** is what makes a page read as a document rather than a
poster. It is always small (0.6875rem), tracked (0.14em), uppercase, and
tabular. Every sheet number, count and metadata field uses it.

### The app-surface exception

`[data-surface="app"]` on the admin and portal dashboard roots swaps the display
face back to the UI face and drops the uppercase heading treatment. Those are
Operate surfaces read at 13–15px all day; a condensed signage face is wrong
there. They keep the colour, linework and square corners, so they stay in the
same system.

## Structure

**Rank is carried by rule weight, never by colour or shadow.**

| Class | Weight | Use |
| --- | --- | --- |
| `.rule-bar` | 6px | Opens a section. |
| `.rule-heavy` | 3px | Opens a subsection. |
| `.rule-hair` | 1px | Separates rows. |

**Corners are square.** Every `borderRadius` token is `0`. Containers are
**clipped**, not rounded — `.plate-clipped` cuts the top-right corner so the
ground shows through it.

**Elevation is drawn, not blurred.** `.plate` shadows are hard offset copies
(`6px 6px 0 0`), the look of a second sheet slipped under the first. Hover
slides the plate off its shadow; pressing moves it onto the shadow. The only
soft shadow in the system is `overlay`, used for the mobile navigation panel.

## Components

Defined in `src/components/ui/Drawing.tsx`:

- **`CornerTicks`** — registration ticks at four corners. The `.sheet-frame`
  class covers the two-corner case with pseudo-elements and no markup.
- **`TitleBlock`** — the signature component. Rule-separated fields recording
  drawn-by, sheet, location, revision.
- **`DrawingNo`** — the sheet number as a graphic element.
- **`RevisionStamp`** — rotated, double-ruled. Used sparingly.
- **`DimensionLine`** — end ticks, a rule, and a label carrying a value. This
  is how the page points at things; it replaced the previous design's
  decorative connector dots, and unlike them it always carries a measurement.
- **`HatchPanel`** — a hatched void. Layout classes go on `contentClassName`,
  not `className`: the hatch is an absolutely positioned sibling, so a `flex`
  set on the container has one child to distribute and does nothing.
- **`ArrowLink`** — the standard forward action, with an optional slow idle
  loop for the one primary action per section.

## Motion

Defined in `src/components/ui/Motion.tsx`. One curve for the entire system:
`cubic-bezier(0.16, 1, 0.3, 1)`, a drafting arm settling.

The governing idea is that a drawing is **made**, so the page behaves like it
is being drafted as you scroll:

- **`DrawnRule`** — every section's bar rule draws itself from the left. The
  most-repeated motion on the site.
- **`PlotterPass`** — a plotter head travels the process spine once, laying the
  line down behind it, with stations striking in sequence behind it.
- **`ClipReveal`** — headlines rise from behind the rule above them. A clipping
  wrapper plus a translate, never a per-line split: the line count changes with
  the viewport, so anything depending on where lines break is wrong at some
  width.
- **`SlideIn`** — direction-aware entrance. Split sections slide their halves in
  from opposite edges.
- **`StaggerGrid`** — a grid whose children reveal in sequence. Use this rather
  than wrapping cards by hand, which is how stagger pacing drifts between pages.
- **`TallyMarquee`** — the one continuously moving element, a sliding register
  strip. Pauses on hover; renders as a static wrapped list under reduced motion.
- **`SheetIndexRail`** — the pinned sheet index (desktop only). The active
  marker extends like a drawn tick as you scroll.

Two implementation rules learned the hard way, both worth keeping:

1. **Animated transforms are inline styles, not utility classes.** Tailwind was
   not emitting `scale-x-0` / `scale-x-100` for `Motion.tsx`, so rules silently
   kept an inherited transform and never drew — a failure with no error and no
   visible cause.
2. **Every reveal has a failsafe.** `useInView` shows content immediately when
   `IntersectionObserver` is unavailable or the element is already on screen at
   mount. Content stranded at `opacity: 0` is far worse than a missed
   animation, and that path must stay closed.

**State is a mark, never a fade.** Things ink in, snap into register, or flip
solid. Nothing changes state by adjusting opacity, because a drawing cannot be
half-drawn. `.btn-outline` fills solid on hover the way a stamp inks over.

Named animations: `sheet-in` (entrance), `rule-draw` (a dimension is drawn, not
faded in), `arrow-travel`, `stamp-in`. `.off-register` is the donated
discipline — an idle plate sits a hair off-register and snaps true on
interaction, so the offset means "not yet engaged" rather than decorating.

All of it is neutralised under `prefers-reduced-motion`, including
`.off-register`, which is reset to `transform: none` so a reduced-motion visitor
gets the settled state rather than a snapped one.

## Honest empty states

The hatch is load-bearing, not decorative. 45-degree hatching is the drafting
convention for an area deliberately left uncut, and it is how this site draws
the content that does not exist yet:

- **`src/data/testimonials.ts`** is empty. No client has approved a quote. The
  homepage renders a complete, working carousel (scroll-snap, keyboard,
  indicators) in an "awaiting sign-off" state. Adding one real entry switches it
  on with no redesign.
- **`src/data/results.ts`** is empty. The results band draws hatched `FIG. 01`
  cells reading "not yet measured".
- **`ClientRegister`** draws to four cells and hatches the unfilled ones as
  `OPEN`, so two real clients read as a register of record rather than a thin
  logo strip.
- **Unconfirmed contact details** in `src/lib/site.ts` render as hatched, inert
  fields in the footer.

Never fill any of these with plausible filler. The rules for what qualifies are
in the data files' own header comments.

## Compatibility layer — delete as you go

Two blocks exist purely so pages this redesign did not rewrite by hand still
render in the new world:

1. **Colour aliases** in `tailwind.config.ts` (`cream`, `paper`, `mist`, `haze`,
   `tint`, `slate`, `charcoal`, `muted`, `cobalt`, `violet`, `space`) — roughly
   800 usages across the marketing pages, portal and admin. Tailwind emits
   nothing for a token that no longer exists, so renaming without these would
   silently strip colour rather than fail the build.
2. **`.card` / `.card-interactive` / `.surface-space`** in `globals.css`,
   redefined onto the plate treatment.

New work uses the semantic names (`sheet`, `ink`, `revision`, `graphite`,
`pencil`, `faint`, `.plate`). Delete an alias when its last usage goes.

## Coverage

The world is applied across **every marketing page**: home, about, team,
services, marketing & SEO, work, the Spargo case study, pricing, contact,
quote, book, resources and article pages, plus privacy, terms and 404.

The **client portal and admin are deliberately excluded** from the headline
face and uppercase treatment via `[data-surface="app"]`, but share the palette,
linework and square corners.

Each interior page opens with a **detail plate** — the same legend device as
the homepage cover sheet, carrying that page's own real content (see
`HeroVisuals.tsx`). Sections are numbered per page with a letter prefix
(`A01` on about, `S01` on services, and so on), so every page reads as its own
numbered set within the drawing set.

The previous world's orbital motif is fully removed: `OrbitalSystem`,
`OrbitalBackdrop`, `StarField`, `MagneticWrap` and the `useMagnetic` hook are
deleted, along with their CSS.

## Known gaps

- **Both logo files in `public/brand` are placeholders**, and
  `oax-logo-white.png` is not actually white. The header and footer put the
  logo on a paper nameplate, which is legible with any artwork and reads as a
  stamped plate. Real artwork should still replace both files.
- **Interior pages are converted, not composed.** They now carry the world's
  components, sheet numbering and motion, but their section order and layout
  are inherited from the previous design. None has been re-thought as a
  composition the way the homepage was.
- **Scroll-triggered motion is unverified in a browser.** The build, typecheck
  and detector are clean and the static rendering is confirmed, but the review
  environment's tab was backgrounded throughout, and Chrome suspends
  `requestAnimationFrame` and `IntersectionObserver` in hidden tabs. Nothing
  that depends on scrolling has been watched running.

## Build note

`next.config.ts` reads `distDir` from `NEXT_DIST_DIR`. `next dev` and
`next build` both write to `.next`, and running a production build while a dev
server is up corrupts both with webpack module errors that look like code bugs.
To preview a production build alongside `npm run dev`:

```
NEXT_DIST_DIR=.next-preview npm run build
NEXT_DIST_DIR=.next-preview PORT=3210 npm run start
```
