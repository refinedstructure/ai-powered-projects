/** ─────────────────────────────────────────────────────────────────────────
 *  Ship Lab Design System v0.2 — Tailwind Config
 *  Compatible with: Lovable, Next.js, Vite + Tailwind CSS v3+
 *
 *  Setup:
 *    1. Import globals.css in your app root
 *    2. Merge or replace your tailwind.config with this file
 *    3. Set data-theme="violet|electric|teal|rose|sunrise" on <html>
 *    4. Set data-mode="light" for light mode
 *
 *  All color utilities reference CSS custom properties, so swapping
 *  data-theme at runtime changes the entire theme with zero JS.
 *
 *  v0.2 naming convention change:
 *    CSS custom properties keep the --ds- prefix (global CSS scope).
 *    Tailwind utilities drop the ds- prefix (Tailwind's own namespace
 *    prevents collisions). Use `text-base`, `p-4`, `z-sticky` etc.
 * ───────────────────────────────────────────────────────────────────────── */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // data-mode attribute controls dark/light (independent of system preference)
  darkMode: ["selector", '[data-mode="dark"]'],

  theme: {
    extend: {

      // ── Colors — reference CSS vars set by globals.css ─────────────────
      colors: {
        // Brand — changes per theme
        primary:  "var(--ds-primary)",
        end:      "var(--ds-end)",
        accent:   "var(--ds-accent)",

        // Text
        "text-primary":   "var(--ds-text-primary)",
        "text-secondary": "var(--ds-text-secondary)",
        "text-muted":     "var(--ds-text-muted)",
        "text-label":     "var(--ds-text-label)",

        // Surfaces
        "glass":       "var(--ds-glass-bg)",
        "glass-el":    "var(--ds-glass-el-bg)",
        "panel":       "var(--ds-panel-bg)",

        // Borders
        "border-default": "var(--ds-border)",
        "border-ghost":   "var(--ds-border-ghost)",

        // Status
        "done":          "var(--ds-done)",
        "due":           "var(--ds-due)",
        "destructive":   "var(--ds-destructive)",

        // Active badge
        "active-bg":     "var(--ds-active-bg)",
        "active-fg":     "var(--ds-active-fg)",
        "active-border": "var(--ds-active-border)",

        // Total stat tile
        "total":         "var(--ds-total-color)",
        "total-bg":      "var(--ds-total-bg)",
        "total-border":  "var(--ds-total-border)",

        // Secondary button
        "secondary-bg":     "var(--ds-secondary-bg)",
        "secondary-fg":     "var(--ds-secondary-fg)",
        "secondary-border": "var(--ds-secondary-border)",

        // Error surface
        "error-bg":     "var(--ds-error-bg)",
        "error-border": "var(--ds-error-border)",
        "error-text":   "var(--ds-error-text)",
      },

      // ── Background images — gradients ───────────────────────────────────
      backgroundImage: {
        "primary-gradient": "var(--ds-primary-gradient)",
        "lg-gradient":      "var(--ds-lg-bg)",
        "skeleton-shimmer": "var(--ds-skeleton-shimmer)",
      },

      // ── Box shadows ─────────────────────────────────────────────────────
      boxShadow: {
        "glow":       "var(--ds-glow-dark)",
        "glow-light": "var(--ds-glow-light)",
        "card":       "var(--ds-shadow-card)",
        "lg-drop":    "var(--ds-lg-drop)",
        "lg-inner":   "inset 0 1px 0 var(--ds-lg-inner)",
        "lg":         "inset 0 1px 0 var(--ds-lg-inner), var(--ds-lg-drop)",
        "focus-ring": "var(--ds-focus-ring)",
      },

      // ── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        sm:        "var(--ds-radius-sm)",      // 10px — inner elements
        md:        "var(--ds-radius-md)",      // 14px — cards, inputs (default)
        lg:        "var(--ds-radius-lg)",      // 20px — large cards, modals
        full:      "var(--ds-radius-full)",    // 9999px — pills, badges
        "tab-bar": "var(--ds-radius-tab-bar)", // 22px — iOS 26 capsule
        DEFAULT:   "var(--ds-radius-md)",      // backward-compat alias
      },

      // ── Font family ──────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },

      // ── Font sizes — ~1.25 ratio, 6 steps ───────────────────────────────
      // Utility classes: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl
      fontSize: {
        xs:   ["11px", { lineHeight: "1.45" }],           // captions, timestamps
        sm:   ["13px", { lineHeight: "1.5" }],            // labels, secondary text
        base: ["16px", { lineHeight: "1.5" }],            // body copy
        lg:   ["20px", { lineHeight: "1.35" }],           // card titles, subheadings
        xl:   ["28px", { lineHeight: "1.2",  letterSpacing: "-0.02em" }], // section headings
        "2xl":["36px", { lineHeight: "1.1",  letterSpacing: "-0.02em" }], // page titles, hero
      },

      // ── Spacing — 8pt grid ───────────────────────────────────────────────
      // Utility classes: p-1, p-2, p-3, p-4, p-6, p-8, p-12, p-16, p-24
      spacing: {
        1:  "4px",   // hairline
        2:  "8px",   // tight
        3:  "12px",  // compact
        4:  "16px",  // base
        6:  "24px",  // medium
        8:  "32px",  // large
        12: "48px",  // xl
        16: "64px",  // 2xl
        24: "96px",  // 3xl
        // iOS safe areas (not on the grid — hardware-defined)
        "home-indicator": "34px",
        "dynamic-island": "62px",
      },

      // ── Sizing ───────────────────────────────────────────────────────────
      width:     { touch: "44px", fab: "52px" },
      height:    { touch: "44px", fab: "52px" },
      minWidth:  { touch: "44px" },
      minHeight: { touch: "44px" },

      // ── Backdrop blur ────────────────────────────────────────────────────
      backdropBlur: {
        "lg-glass": "40px",  // iOS 26 Liquid Glass — nav/tab bars
        "card":     "28px",  // Standard glass card — content surfaces
      },
      backdropSaturate: {
        "lg-glass": "220%",
        "card":     "180%",
      },

      // ── Letter spacing ────────────────────────────────────────────────────
      letterSpacing: {
        "tight-ds":  "-0.02em",
        "normal-ds": "-0.01em",
      },

      // ── Transition durations ─────────────────────────────────────────────
      // Utility classes: duration-fast, duration-normal, duration-slow
      transitionDuration: {
        fast:   "100ms",   // micro-interactions: toggle, checkbox
        normal: "200ms",   // state changes: hover, focus, press
        slow:   "350ms",   // layout shifts: expand, collapse, slide
      },

      // ── Transition timing functions ──────────────────────────────────────
      // Utility classes: ease-out-ds, ease-in-out-ds, ease-spring
      transitionTimingFunction: {
        "out-ds":    "cubic-bezier(0.16, 1, 0.3, 1)",      // entrances, reveals
        "in-out-ds": "cubic-bezier(0.45, 0, 0.55, 1)",     // state changes
        "spring":    "cubic-bezier(0.34, 1.56, 0.64, 1)",  // playful bounce
      },

      // ── Z-Index ──────────────────────────────────────────────────────────
      // Utility classes: z-bg, z-gradient, z-base, z-card, z-sticky, z-overlay, z-modal, z-toast
      zIndex: {
        bg:       "-2",
        gradient: "-1",
        base:     "0",
        card:     "1",
        sticky:   "10",
        overlay:  "20",
        modal:    "50",
        toast:    "100",
      },

    },
  },

  plugins: [
    // Uncomment if using shadcn/ui:
    // require("tailwindcss-animate"),
  ],
};

/* ─────────────────────────────────────────────────────────────────────────────
   USAGE EXAMPLES (Lovable / JSX)

   Primary button:
     <button className="bg-primary-gradient text-white rounded-full h-touch px-6
                        font-semibold shadow-glow text-base
                        focus-visible:outline-none focus-visible:shadow-focus-ring
                        transition-all duration-normal ease-in-out-ds">
       Get started
     </button>

   Glass card:
     <div className="bg-glass backdrop-blur-card backdrop-saturate-card
                     border border-border-default rounded-md shadow-card">
       Card content
     </div>

   iOS 26 Liquid Glass tab bar:
     <nav className="bg-lg-gradient backdrop-blur-lg-glass backdrop-saturate-lg-glass
                     border border-[var(--ds-lg-border)] border-t-[var(--ds-lg-specular)]
                     shadow-lg rounded-tab-bar">
       Tab items
     </nav>

   FAB:
     <button className="bg-primary-gradient w-fab h-fab rounded-full shadow-glow
                        border border-white/20 border-t-white/55
                        focus-visible:outline-none focus-visible:shadow-focus-ring">
       <PlusIcon />
     </button>

   Spacing (8pt grid):
     <div className="p-4 gap-6 mt-8">   →   16px / 24px / 32px

   Typography:
     <h1 className="text-2xl font-bold">     →   36px / -0.02em tracking
     <p  className="text-base text-text-primary">  →   16px body
     <span className="text-sm text-text-muted">    →   13px secondary

   Z-index:
     <div className="z-modal">       →   50
     <div className="z-toast">       →   100

   Error surface:
     <div className="bg-error-bg border border-error-border text-error-text
                     rounded-sm p-3 text-sm">
       Something went wrong.
     </div>

   Theme + mode switch (JavaScript):
     document.documentElement.setAttribute('data-theme', 'teal');
     document.documentElement.setAttribute('data-mode', 'light');
───────────────────────────────────────────────────────────────────────────── */
