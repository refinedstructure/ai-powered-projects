# Ship Lab Design System

**Version:** v0.2.0
**Status:** Production-ready. WCAG 2.1 AA compliant across all themes and modes.

A cross-platform design system built for utility and consumer apps. Dark-first, iOS HIG compliant, compatible with Apple Liquid Glass (iOS 26), WCAG 2.1 AA.

---

## Themes

| Key | Primary | End | Accent | Preview | v0.2 |
|-----|---------|-----|--------|---------|------|
| `violet` | `#7C3AED` | `#6366F1` | `#22D3EE` | Purple → Indigo | unchanged |
| `electric` | `#1D4ED8` | `#4338CA` | `#A3E635` | Blue → Indigo | unchanged |
| `teal` | `#0F766E` | `#0369A1` | `#FB923C` | Teal → Ocean | primary darkened (WCAG AA) |
| `rose` | `#BE185D` | `#9333EA` | `#FB923C` | Rose → Purple | unchanged |
| `sunrise` | `#B45309` | `#DC2626` | `#A78BFA` | Amber → Red | primary darkened (WCAG AA) |

All themes support **dark** (default) and **light** modes.

---

## Files

```
design-system/
├── style-explorer.jsx       ← v0.1 frozen React explorer (reference only — not updated)
├── style-explorer-v2.html   ← v0.2 interactive HTML explorer — open in any browser
├── CHANGELOG.md             ← Version history + design decisions
├── PROGRESS.md              ← Session log + token decisions
├── README.md                ← This file
├── CRITIQUE.md              ← v0.1 post-freeze audit (input for v0.2)
├── IMPROVEMENTS-v0.2.md     ← Structured v0.2 improvement spec
├── figma-plugin/            ← Native Figma plugin — generates styles + components
│   ├── manifest.json
│   ├── code.js              ← v0.2: updated primaries, text scale, semantic colors
│   ├── ui.html
│   └── README.md
└── tokens/
    ├── globals.css          ← v0.2 CSS custom properties (Lovable / any web project)
    ├── tailwind.config.js   ← v0.2 Tailwind config (Lovable)
    └── README.md            ← Integration guides per platform
```

---

## Quick start

### Figma
1. In Figma: **Plugins → Development → Import plugin from manifest**
2. Point to `figma-plugin/manifest.json`
3. Run → tick what you need → **Generate Design System**
   - Creates all color + text styles, button components, glass card, mobile preview

### Lovable
```html
<!-- index.html or layout root -->
<html data-theme="violet" data-mode="dark">
```
Copy `tokens/globals.css` and `tokens/tailwind.config.js` into project.
Full guide: `tokens/README.md`.

### New AI chat context
Paste this line at the start of a new session:
> "We're continuing the Ship Lab design system at v0.2.0. Load `Ship Lab/design-system/PROGRESS.md` for full context."

---

## Core concepts

**Token factory:** `makeTokens(theme, isDark)` in `style-explorer.jsx` derives the full semantic token set from 5 base values. All 5 themes use the same factory.

**Liquid Glass:** 3-layer recipe — backdrop blur + specular gradient + `border-top` at 2× opacity. The `lgStyle` object in the explorer is the CSS implementation.

**Background architecture:** Two `position:fixed` divs — solid base (z:-2) + gradient overlay (z:-1). Content is transparent. Glass cards blur the fixed layer = genuine Liquid Glass.

---

## Platform targets

| Platform | Status | Integration |
|----------|--------|-------------|
| Web (CSS vars) | ✅ v0.2 | `globals.css` |
| Lovable (Tailwind) | ✅ v0.2 | `tailwind.config.js` + `globals.css` |
| Figma | ✅ v0.2 | Native plugin (`figma-plugin/`) — re-run after update |
| SwiftUI (iOS 26) | 📐 Mapped | See `tokens/README.md` SwiftUI table |
| React Native | 🔜 v0.3 | — |
