import type { Config } from "tailwindcss";

/**
 * OAX Tech design tokens — "The Title Block".
 *
 * The site is an engineering drawing set: every section is a sheet with a title
 * block, a drawing number and a revision. Two full-bleed grounds alternate
 * (cool grey stock and near-black ink), a deep violet carries every action, and
 * hairline linework does the work that borders and drop shadows used to.
 *
 * The palette is the cyanotype/diazo end of technical printing rather than the
 * warm-paper end: grey stock, black structure, violet as the exposed line, and
 * one Prussian blue reserved for the metadata layer.
 *
 * Every colour, radius, container width and type step is declared here.
 * Components consume these tokens rather than hard-coding values.
 *
 * Contrast is measured, not estimated, and recorded per token below. The violet
 * is deliberately deep: at #6D28D9 it clears AA on the grey ground (5.6:1) AND
 * carries white as a fill (7.1:1). The previous orange could not do both and
 * needed a second, darker value for text — this palette needs one value, which
 * is a real simplification rather than a like-for-like hue swap.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    // Breakpoints: mobile-first, 320px baseline is handled by the default
    // (unprefixed) styles rather than a named breakpoint.
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        /* ---- Ground one: grey stock ----------------------------------- */
        /* The light ground. Cool grey with a faint blue cast — print stock,
           not stationery. 15.6:1 against ink. */
        sheet: "#E4E5E8",
        /* One step down — alternating bands and inset panels */
        "sheet-sunk": "#D8DAE0",
        /* Two steps down — hatch fills, pressed and disabled states */
        "sheet-deep": "#C7CAD2",
        /* Up one — cards and plates that sit on the sheet */
        chalk: "#F3F3F6",

        /* ---- Ground two: ink ------------------------------------------ */
        /* The dark ground. Full-bleed bands, header, footer, work section. */
        ink: {
          DEFAULT: "#0B0B10",
          raised: "#15151E",
          card: "#101017",
          /* Linework on the dark ground */
          line: "#2B2B39",
          /* Body copy on the dark ground — 11.7:1 */
          text: "#C6C7D2",
          /* Secondary copy on the dark ground — 6.2:1 */
          muted: "#8D8FA1",
        },

        /* ---- Type on paper -------------------------------------------- */
        /* Headings and heavy type — 15.6:1 */
        graphite: "#0B0B10",
        /* Body copy — 8.9:1 */
        pencil: "#383A4D",
        /* Secondary copy and captions — 4.9:1 */
        faint: "#5E6173",

        /* ---- The action colour ---------------------------------------- */
        /* The exposure violet. Carries roughly 30% of the surface: filled
           blocks, display accents, active states, dimension lines. White on it
           is 7.1:1, so it is safe as a button ground; on the grey stock it is
           5.6:1, so unlike the orange it preceded it is also safe for small
           text. The token keeps its `revision` name — it is the revision-stamp
           role, not the hue, that the system is built around. */
        revision: {
          DEFAULT: "#6D28D9",
          hover: "#5B21B6",
          press: "#4C1D95",
          /* Violet for small text on the ink ground — 7.2:1. The DEFAULT is
             only 2.8:1 there, so anything on ink uses this. */
          onInk: "#A78BFA",
          /* Text-safe violet on the grey ground — 7.1:1. The DEFAULT already
             clears AA here, so this is now a slightly darker option rather
             than a necessity; it is kept so component code needn't change. */
          text: "#5B21B6",
          /* Tinted paper for highlighted bands */
          soft: "#EDE4FB",
          border: "#C9B2F0",
        },

        /* ---- Drawing layers -------------------------------------------
           A drawing has layers, and every layer has its own pen colour. The
           product has exactly four disciplines, so they ARE the layers: L1
           websites, L2 custom software, L3 marketing, L4 SEO. Colour-coding
           them is functional rather than decorative — the same discipline
           reads the same colour on the homepage legend, the service cards,
           the services page and the register strip.

           Every value clears AA on the grey ground (4.8:1 at worst) AND
           carries white as a fill (6.0:1 at worst), so a layer colour is safe
           as both a small drawing number and an icon plate. The `-ink`
           variants are for the dark ground, where the base values sit between
           2.3:1 and 4.0:1 and must never be used.

           These never carry an action. Violet alone means "act on this", so a
           filled layer plate is never mistaken for a button. */
        layer: {
          web: "#1E40AF",
          "web-ink": "#7FA5F5",
          software: "#115E59",
          "software-ink": "#5ED3C4",
          marketing: "#BE185D",
          "marketing-ink": "#F58BB8",
          seo: "#854D0E",
          "seo-ink": "#E3B341",
        },

        /* ---- Linework -------------------------------------------------- */
        /* Everything a border used to do. Weight, not colour, carries rank. */
        line: {
          DEFAULT: "#A9ACB8",
          strong: "#0B0B10",
          subtle: "#C8CBD4",
        },

        /* ---- Status — never the only signal; always paired with text --- */
        success: { DEFAULT: "#0F6B45", soft: "#DDEEE5" },
        warning: { DEFAULT: "#8A5600", soft: "#F6E8CE" },
        danger: { DEFAULT: "#A32617", soft: "#F5DFDC" },
        info: { DEFAULT: "#1E40AF", soft: "#DDE5F7" },

        /* ================================================================
           COMPATIBILITY ALIASES
           ================================================================
           The previous palette (cream / cobalt / slate / space / …) is used
           in roughly 800 places across the marketing pages, the client
           portal and the admin. Tailwind silently drops classes whose token
           no longer exists, so renaming without these would not raise a
           build error — it would quietly strip colour from every surface
           this redesign did not touch by hand.

           Mapping the old names onto the new world instead means those
           surfaces inherit the drawing set automatically and stay coherent,
           which is what "homepage plus design system" has to mean. New work
           uses the semantic names above; these exist to be deleted as the
           remaining pages are rebuilt.
        */
        cream: "#E4E5E8", // -> sheet
        paper: "#F3F3F6", // -> chalk
        mist: "#D8DAE0", // -> sheet-sunk
        haze: "#C7CAD2", // -> sheet-deep
        tint: "#EDE4FB", // -> revision.soft
        slate: "#383A4D", // -> pencil
        charcoal: "#0B0B10", // -> graphite
        muted: "#5E6173", // -> faint

        /* The old accent, now the violet. Most of these ~229 usages are small
           links and labels, so this maps to the darker text-safe value: 7.1:1
           on the grey ground and 9.0:1 carrying white as a fill. */
        cobalt: {
          DEFAULT: "#5B21B6",
          hover: "#4C1D95",
          press: "#3B1780",
          soft: "#EDE4FB",
          border: "#C9B2F0",
        },

        /* The metadata blue — Prussian, the cyanotype end of the palette.
           6.9:1 on the grey ground. Deliberately NOT a second action colour:
           violet means "act on this", blue means "this is a reference". */
        violet: {
          DEFAULT: "#1E40AF",
          hover: "#1B3894",
          soft: "#DDE5F7",
          border: "#AFC2ED",
        },

        /* The old dark surface family -> the ink ground */
        space: {
          DEFAULT: "#0B0B10",
          raised: "#15151E",
          card: "#101017",
          line: "#2B2B39",
          text: "#8D8FA1",
        },
      },

      fontFamily: {
        /* Big Shoulders Display — condensed industrial, drawn for civic
           signage. Set uppercase, oversized and tight. */
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        /* Martian Mono — drawing numbers, revisions, spec figures, tally rows */
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      /* Type scale. The display steps run far larger than a normal site's
         because the form demands it: a drawing sheet's title is the largest
         thing on the sheet. Condensed faces carry these sizes without
         wrapping into unreadable measures. */
      fontSize: {
        "2xs": ["0.75rem", { lineHeight: "1.1rem", letterSpacing: "0.08em" }],
        xs: ["0.8125rem", { lineHeight: "1.25rem" }],
        sm: ["0.9375rem", { lineHeight: "1.5rem" }],
        base: ["1rem", { lineHeight: "1.65rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.8rem" }],
        /* Small caps labels — the mono tally layer */
        tally: ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.14em" }],

        "display-xs": ["clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)", { lineHeight: "1.05", letterSpacing: "0" }],
        "display-sm": ["clamp(1.5rem, 1.3rem + 1vw, 2rem)", { lineHeight: "1", letterSpacing: "-0.005em" }],
        "display-md": ["clamp(1.875rem, 1.4rem + 2.2vw, 2.75rem)", { lineHeight: "0.95", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.25rem, 1.5rem + 3.6vw, 4rem)", { lineHeight: "0.9", letterSpacing: "-0.015em" }],
        "display-xl": ["clamp(2.75rem, 1.6rem + 6vw, 6rem)", { lineHeight: "0.86", letterSpacing: "-0.02em" }],
        /* The hero line only */
        "display-2xl": ["clamp(3.25rem, 1.8rem + 8.5vw, 8.5rem)", { lineHeight: "0.84", letterSpacing: "-0.025em" }],
      },

      maxWidth: {
        container: "1360px",
        "container-narrow": "980px",
        prose: "64ch",
      },

      spacing: {
        4.5: "1.125rem",
        /* Generous section rhythm — the brief asks for strong spacing, and a
           sheet needs margin around its drawing field. */
        "section-sm": "4rem",
        section: "6rem",
        "section-lg": "8.5rem",
        /* The sheet border inset */
        gutter: "1.25rem",
      },

      /* Square. A drawing has no rounded corners; containers are clipped
         instead.

         `full` is listed explicitly and set to 0 for a reason worth keeping:
         these live under `theme.extend`, so Tailwind MERGES them with its
         defaults rather than replacing them. Omitting `full` left
         `rounded-full` at its default 9999px, which quietly kept every pill
         badge, circular icon button and avatar round while every other corner
         went square — the kind of inconsistency that reads as sloppiness
         rather than as a decision. */
      borderRadius: {
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
      },

      borderWidth: {
        DEFAULT: "1px",
        hair: "1px",
        rule: "2px",
        heavy: "3px",
        bar: "6px",
      },

      /* Elevation is drawn, not blurred. These are hard offset plates — the
         look of a second sheet slipped under the first — plus one soft shadow
         retained for the mobile navigation overlay only. */
      boxShadow: {
        none: "none",
        plate: "6px 6px 0 0 #0B0B10",
        "plate-revision": "6px 6px 0 0 #6D28D9",
        "plate-sm": "4px 4px 0 0 #0B0B10",
        "plate-lift": "10px 10px 0 0 #0B0B10",
        overlay: "0 24px 60px -12px rgb(13 21 32 / 0.45)",
      },

      transitionTimingFunction: {
        /* One curve for the whole system: a drafting arm settling. */
        draft: "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      transitionDuration: { DEFAULT: "180ms" },

      keyframes: {
        "sheet-in": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "rule-draw": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        "arrow-travel": {
          "0%": { transform: "translateX(0)" },
          "55%": { transform: "translateX(0.375rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "stamp-in": {
          from: { opacity: "0", transform: "rotate(-8deg) scale(1.35)" },
          to: { opacity: "1", transform: "rotate(-4deg) scale(1)" },
        },
        /* The register strip. Translating exactly -50% of a track holding the
           item list twice is what makes the loop seamless — any other value
           shows a seam once per cycle. */
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        /* Compatibility: still referenced by pages this redesign has not
           rewritten. `sheet-in` is the drawing set's version of the same
           idea and is what new work uses. */
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "fade-up": "fade-up 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 300ms ease-out both",
        "sheet-in": "sheet-in 620ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "rule-draw": "rule-draw 720ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "arrow-travel": "arrow-travel 1.6s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        "stamp-in": "stamp-in 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
        /* Duration is set per-instance; linear is non-negotiable, since an
           eased marquee visibly stutters at the loop point. */
        marquee: "marquee 42s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
