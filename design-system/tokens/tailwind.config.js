/** ─────────────────────────────────────────────────────────────────────────
 *  Ship Lab Design System v0.1 — Tailwind Config
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
 * ───────────────────────────────────────────────────────────────────────── */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Use data-mode attribute instead of class for dark mode
  // This allows dark/light switching independently from system preference
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
        "done":   "var(--ds-done)",
        "due":    "var(--ds-due)",

        // Active badge
        "active-bg":     "var(--ds-active-bg)",
        "active-fg":     "var(--ds-active-fg)",
        "active-border": "var(--ds-active-border)",

        // Total stat tile
        "total":        "var(--ds-total-color)",
        "total-bg":     "var(--ds-total-bg)",
        "total-border": "var(--ds-total-border)",

        // Secondary button
        "secondary-bg":     "var(--ds-secondary-bg)",
        "secondary-fg":     "var(--ds-secondary-fg)",
        "secondary-border": "var(--ds-secondary-border)",

        // Destructive
        "destructive": "var(--ds-destructive)",
      },

      // ── Background images — gradients ───────────────────────────────────
      backgroundImage: {
        "primary-gradient": "var(--ds-primary-gradient)",
        "lg-gradient":      "var(--ds-lg-bg)",
      },

      // ── Box shadows ─────────────────────────────────────────────────────
      boxShadow: {
        "glow":        "var(--ds-glow-dark)",
        "glow-light":  "var(--ds-glow-light)",
        "card":        "var(--ds-shadow-card)",
        "lg-drop":     "var(--ds-lg-drop)",

        // Liquid Glass specular inner highlight — always pair with box-shadow
        "lg-inner":    "inset 0 1px 0 var(--ds-lg-inner)",
        "lg":          "inset 0 1px 0 var(--ds-lg-inner), var(--ds-lg-drop)",
      },

      // ── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        sm:      "var(--ds-radius-sm)",     // 10px
        DEFAULT: "var(--ds-radius)",        // 14px
        full:    "var(--ds-radius-full)",   // 9999px
        "tab-bar": "var(--ds-radius-tab-bar)", // 22px — iOS 26 floating capsule
      },

      // ── Font family ──────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },

      // ── Font sizes ───────────────────────────────────────────────────────
      fontSize: {
        "ds-xs":   ["10px", { lineHeight: "1" }],
        "ds-sm":   ["12px", { lineHeight: "1.5" }],
        "ds-base": ["15px", { lineHeight: "1.5" }],
        "ds-md":   ["16px", { lineHeight: "1.4" }],
        "ds-lg":   ["20px", { lineHeight: "1.3" }],
        "ds-xl":   ["28px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },

      // ── Spacing ──────────────────────────────────────────────────────────
      spacing: {
        "ds-xs":  "4px",
        "ds-sm":  "8px",
        "ds-md":  "14px",
        "ds-lg":  "20px",
        "ds-xl":  "24px",
        "ds-2xl": "40px",
        // iOS safe areas
        "home-indicator": "34px",
        "dynamic-island": "62px",
      },

      // ── Sizing ───────────────────────────────────────────────────────────
      width:  { "touch": "44px", "fab": "52px" },
      height: { "touch": "44px", "fab": "52px" },
      minWidth:  { "touch": "44px" },
      minHeight: { "touch": "44px" },

      // ── Backdrop blur ────────────────────────────────────────────────────
      backdropBlur: {
        "lg-glass": "40px",  // iOS 26 Liquid Glass
        "card":     "28px",  // Standard glass card
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
     <button className="bg-primary-gradient text-white rounded-full h-touch px-6 font-semibold shadow-glow">
       Get started
     </button>

   Glass card:
     <div className="bg-glass backdrop-blur-card backdrop-saturate-card border border-border-default rounded-DEFAULT shadow-card">
       Card content
     </div>

   iOS 26 Liquid Glass surface:
     <div className="bg-lg-gradient backdrop-blur-lg-glass backdrop-saturate-lg-glass
                     border border-[var(--ds-lg-border)] border-t-[var(--ds-lg-specular)]
                     shadow-lg rounded-tab-bar">
       Floating tab bar
     </div>

   FAB:
     <button className="bg-primary-gradient w-fab h-fab rounded-full shadow-glow
                        border border-white/20 border-t-white/55">
       <PlusIcon />
     </button>

   Theme switch (JavaScript):
     document.documentElement.setAttribute('data-theme', 'teal');
     document.documentElement.setAttribute('data-mode', 'light');
───────────────────────────────────────────────────────────────────────────── */
