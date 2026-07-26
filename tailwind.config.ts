import type { Config } from "tailwindcss";

/**
 * OAX Tech design tokens.
 *
 * Every colour, radius, shadow, container width and type step used across the
 * site is declared here. Components must consume these tokens rather than
 * hard-coding values, so a brand change is a single-file edit.
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
        /* Surfaces — warm white through to very light grey */
        paper: "#FFFFFF",
        mist: "#F8F9FB",
        haze: "#F1F3F7",
        /* Restrained cobalt tint used for highlighted bands */
        tint: "#EDF2FF",

        /* Typography — charcoal through to near-black */
        ink: "#0A0C11",
        charcoal: "#2B313B",
        slate: "#525C6B",
        muted: "#7A8494",

        /* Restrained cobalt-blue accent */
        cobalt: {
          DEFAULT: "#1A5CFF",
          hover: "#124BDB",
          press: "#0F3FB8",
          soft: "#E8EFFF",
          border: "#C3D5FF",
        },

        /* Thin light-grey borders */
        line: {
          DEFAULT: "#E4E8EF",
          strong: "#D3D9E3",
          subtle: "#EFF2F6",
        },

        /* Dark, space-inspired CTA sections and footers */
        space: {
          DEFAULT: "#05060A",
          raised: "#0B0E15",
          line: "#1B202B",
          text: "#A8B0BF",
        },

        /* Status — never the only signal; always paired with text/icon */
        success: { DEFAULT: "#0F7A4A", soft: "#E4F5EC" },
        warning: { DEFAULT: "#9A6100", soft: "#FDF1DC" },
        danger: { DEFAULT: "#B3261E", soft: "#FCEBEA" },
        info: { DEFAULT: "#1A5CFF", soft: "#E8EFFF" },
      },

      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },

      /* Fluid type scale — never drops below 14px on mobile */
      fontSize: {
        "2xs": ["0.75rem", { lineHeight: "1.1rem", letterSpacing: "0.01em" }],
        xs: ["0.8125rem", { lineHeight: "1.2rem" }],
        sm: ["0.875rem", { lineHeight: "1.375rem" }],
        base: ["0.9375rem", { lineHeight: "1.6rem" }],
        lg: ["1.0625rem", { lineHeight: "1.75rem" }],
        xl: ["1.1875rem", { lineHeight: "1.75rem" }],
        "display-xs": ["clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem)", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.5rem, 1.3rem + 1vw, 1.875rem)", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 1.4rem + 1.6vw, 2.375rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 1.5rem + 2.4vw, 3rem)", { lineHeight: "1.14", letterSpacing: "-0.025em" }],
        "display-xl": ["clamp(2.25rem, 1.6rem + 3.2vw, 3.75rem)", { lineHeight: "1.06", letterSpacing: "-0.03em" }],
      },

      /* Container widths */
      maxWidth: {
        container: "1200px",
        "container-narrow": "960px",
        prose: "68ch",
      },

      /* Spacing rhythm for section padding */
      spacing: {
        "section-sm": "3rem",
        section: "4.5rem",
        "section-lg": "6rem",
      },

      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.875rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },

      boxShadow: {
        /* Deliberately subtle — the mockups rely on borders, not drop shadows */
        xs: "0 1px 2px 0 rgb(10 12 17 / 0.04)",
        card: "0 1px 3px 0 rgb(10 12 17 / 0.04), 0 1px 2px -1px rgb(10 12 17 / 0.03)",
        "card-hover": "0 8px 24px -6px rgb(10 12 17 / 0.10), 0 2px 6px -2px rgb(10 12 17 / 0.05)",
        float: "0 16px 40px -12px rgb(10 12 17 / 0.16)",
        ring: "0 0 0 1px rgb(228 232 239 / 1)",
      },

      transitionDuration: { DEFAULT: "160ms" },

      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "fade-up": "fade-up 260ms ease-out both",
        "fade-in": "fade-in 200ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
