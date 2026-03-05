# Ship Lab Design System

**Version:** v0.1.0
**Status:** Frozen — production-ready token exports available

A cross-platform design system built for utility and consumer apps. Dark-first, iOS HIG compliant, compatible with Apple Liquid Glass (iOS 26), WCAG 2.1 AA.

---

## Themes

| Key | Primary | End | Accent | Preview |
|-----|---------|-----|--------|---------|
| `violet` | `#7C3AED` | `#6366F1` | `#22D3EE` | Purple → Indigo |
| `electric` | `#1D4ED8` | `#4338CA` | `#A3E635` | Blue → Indigo |
| `teal` | `#0D9488` | `#0369A1` | `#FB923C` | Teal → Ocean |
| `rose` | `#BE185D` | `#9333EA` | `#FB923C` | Rose → Purple |
| `sunrise` | `#D97706` | `#DC2626` | `#A78BFA` | Amber → Red |

All themes support **dark** (default) and **light** modes.

---

## Files

```
design-system/
├── style-explorer.jsx     ← Interactive React explorer — run in claude.ai artifacts
├── CHANGELOG.md           ← Version history + design decisions
├── PROGRESS.md            ← Session log + token decisions
├── README.md              ← This file
├── figma-plugin/          ← Native Figma plugin — generates styles + components directly
│   ├── manifest.json
│   ├── code.js
│   ├── ui.html
│   └── README.md
└── tokens/
    ├── figma-tokens.json  ← Figma Tokens Studio (composable sets)
    ├── globals.css        ← CSS custom properties (Lovable / any web project)
    ├── tailwind.config.js ← Tailwind v3+ config (Lovable)
    └── README.md          ← Integration guides per platform
```

---

## Quick start

### Figma (native plugin — recommended)
1. In Figma: **Plugins → Development → Import plugin from manifest**
2. Point to `figma-plugin/manifest.json`
3. Run → tick what you need → **Generate Design System**
   - Creates all color + text styles, button components, glass card, mobile preview

### Figma (Tokens Studio — alternative)
1. Install [Tokens Studio](https://tokens.studio) plugin
2. Sync → Local file → `tokens/figma-tokens.json`
3. Activate sets: `global` + `[theme]` + `semantic/dark` or `semantic/light`

### Lovable
```html
<!-- index.html or layout root -->
<html data-theme="violet" data-mode="dark">
```
Copy `tokens/globals.css` and `tokens/tailwind.config.js` into project.
Full guide: `tokens/README.md`.

### New AI chat context
Paste this line at the start of a new session:
> "We're continuing the Ship Lab design system at v0.1.0. Load `Ship Lab/design-system/PROGRESS.md` for full context."

---

## Core concepts

**Token factory:** `makeTokens(theme, isDark)` in `style-explorer.jsx` derives the full semantic token set from 5 base values. All 5 themes use the same factory.

**Liquid Glass:** 3-layer recipe — backdrop blur + specular gradient + `border-top` at 2× opacity. The `lgStyle` object in the explorer is the CSS implementation.

**Background architecture:** Two `position:fixed` divs — solid base (z:-2) + gradient overlay (z:-1). Content is transparent. Glass cards blur the fixed layer = genuine Liquid Glass.

---

## Platform targets

| Platform | Status | Integration |
|----------|--------|-------------|
| Web (CSS vars) | ✅ v0.1 | `globals.css` |
| Lovable (Tailwind) | ✅ v0.1 | `tailwind.config.js` + `globals.css` |
| Figma | ✅ v0.1 | Native plugin (`figma-plugin/`) or `figma-tokens.json` via Tokens Studio |
| SwiftUI (iOS 26) | 📐 Mapped | See `tokens/README.md` SwiftUI table |
| React Native | 🔜 v0.2 | — |
