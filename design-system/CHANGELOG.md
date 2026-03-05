# Changelog

All notable changes to the Ship Lab design system.

---

## v0.1.1 — 2026-03-06

### Fixed
- **Figma plugin — object spread syntax** (`{ ...hex(h), a }`) — Figma's plugin sandbox does not support ES object spread. Replaced all 4 instances with explicit property assignment; replaced `[...arr1, ...arr2]` with `.concat()`.
- **Figma plugin — font style names** — Figma's Inter font uses spaced style names (`"Semi Bold"`, `"Extra Bold"`) not camelCase. Fixed all 11 occurrences across font loading, text style creation, and `text()` helper calls.
- **Figma plugin — API compatibility** — Added fallback pattern for `createLocalPaintStyle` / `createLocalTextStyle` (new API) with `createPaintStyle` / `createTextStyle` (old API). Added `"documentAccess": "dynamic-page"` to manifest.

### Result
Plugin now successfully generates the full design system in Figma: 43 color styles, 14 text styles, button component set (4 variants × states), glass card + FAB, mobile iOS 26 preview (3 themes).

---

## v0.1.0 — 2026-03-05

Initial freeze. Production-ready token system for cross-platform UI.

### Added

**Core system**
- 5 color themes: Violet, Electric, Teal, Rose, Sunrise
- Full dark + light mode for every theme
- `makeTokens()` factory — derives full semantic token set from 5 base values (primary, end, accent, darkBase, lightBase)
- `lightenHex()` utility — theme-agnostic tint for stat tile numbers
- `hex2rgba()` utility — alpha overlay generation

**Gradient system**
- 3-layer ambient gradient (left edge, right edge, ceiling)
- Centre vignette layer — reclaims base colour so glows are edge-ambient, not colour wash
- `makeScreenGradient()` — contained variant for phone frame contexts (no `position:fixed`)

**iOS 26 Liquid Glass**
- Full `lgStyle` recipe: `backdrop-filter: blur(40px) saturate(220%)` + specular gradient + `border-top` at 2× opacity + `inset 0 1px 0` inner highlight
- Floating capsule tab bar (iOS 26 HIG — NOT full-width rectangle)
- FAB: circle, trailing side, primary gradient fill + specular treatment
- `MobilePreview` component: phone frame mockup with Dynamic Island, glass nav bar, scrollable content, FAB, tab bar

**Components**
- 4 button variants: primary, secondary, ghost, destructive
- Hover / pressed / disabled states via `getStateStyle()` + `Btn` component
- Glass card with stat grid (Tasks / Done / Due) + Active badge
- Image patterns: Hero (full-bleed), 3-up grid, Feed card with glass caption
- Input with focus ring

**Token exports**
- `tokens/figma-tokens.json` — Tokens Studio plugin format. Composable sets: global + [theme] + semantic/dark|light
- `tokens/globals.css` — CSS custom properties. Multi-theme via `data-theme` + `data-mode` attributes
- `tokens/tailwind.config.js` — Tailwind v3+ config. CSS var references for dynamic theming
- `tokens/README.md` — Integration guides for Figma, Lovable, SwiftUI, vanilla CSS

**Quality**
- WCAG 2.1 AA audit panel built into explorer
- Design critique panel built in
- DS coverage panel built in

### Design decisions

| Decision | Rationale |
|---|---|
| Centre vignette gradient | Prevents glow pools behind text — glows become ambient edge lighting |
| `border-top` at 2× opacity | The defining iOS 26 specular edge — what separates Liquid Glass from plain acrylic |
| 4 tabs (not 5) with FAB | iOS 26 HIG: FAB + 4 tabs is the natural layout. 5 tabs leaves no room |
| Neutral gray text axis | `#374151` / `#6B7280` — no violet tint. Prevents clash on warm bases (Sunrise, Rose) |
| `lightenHex(primary, 0.55)` for stat total | Theme-agnostic readable tint vs hardcoded purple that clashed on warm themes |
| `makeScreenGradient` | `position:fixed` attaches to viewport, not divs. Contained version uses solid base colour as final CSS layer |

### Known limitations

- Lensing effect (iOS 26 content magnification through glass) — not replicable in CSS; specular highlights approximate the visual weight
- `backdrop-filter` requires a stacking context parent — ensure `position: relative` on container
- Gradient backgrounds require the fixed-position layering architecture (see `style-explorer.jsx` comments)
