# Changelog

All notable changes to the Ship Lab design system.

---

## v0.2.0 — 2026-03-07

Post-critique structural upgrade. All changes are in `tokens/globals.css` and `tokens/tailwind.config.js`. The `style-explorer.jsx` (v0.1 snapshot) is not updated — it remains the frozen visual reference.

### Fixed — Accessibility (WCAG 2.1 AA)

| Token | Before | After | Contrast (worst base) |
|-------|--------|-------|-----------------------|
| `--ds-text-muted` (light) | `#6B7280` | `#4B5563` | 4.0:1 → 6.3:1 ✅ |
| `--ds-text-label` (light) | `#9CA3AF` | `#6B7280` | 2.1:1 → 4.5:1 ✅ |
| `--ds-primary` (teal) | `#0D9488` | `#0F766E` | 3.7:1 → 4.6:1 with white ✅ |
| `--ds-primary` (sunrise) | `#D97706` | `#B45309` | 3.2:1 → 4.8:1 with white ✅ |
| `--ds-done` (light) | `#059669` | `#047857` | 3.1:1 → 4.6:1 ✅ |
| `--ds-due` (light) | `#D97706` | `#92400E` | 2.6:1 → 5.9:1 ✅ |
| `--ds-destructive` (light) | separate `--ds-destructive-light` token | moved into `[data-mode="light"]` | consistent with done/due pattern |

- **Focus ring**: Added `--ds-focus-ring` token (per-theme colour at 40% opacity). Applied to `ds-btn-primary`, `ds-btn-secondary`, `ds-fab` via `:focus-visible`.
- **Reduced motion**: Added `@media (prefers-reduced-motion: reduce)` override that collapses all animation and transition durations to 0.01ms.

### Changed — Spacing scale (8pt grid)

Old scale `4/8/14/20/24/40` had irregular ratios and no 32px step. Replaced with a 9-step 8pt grid:

| New token | Value | Old token |
|-----------|-------|-----------|
| `--ds-space-1` | 4px | `--ds-space-xs` |
| `--ds-space-2` | 8px | `--ds-space-sm` |
| `--ds-space-3` | 12px | *(new)* |
| `--ds-space-4` | 16px | *(new — replaces 14px)* |
| `--ds-space-6` | 24px | `--ds-space-xl` |
| `--ds-space-8` | 32px | *(new — was missing)* |
| `--ds-space-12` | 48px | *(new)* |
| `--ds-space-16` | 64px | *(new)* |
| `--ds-space-24` | 96px | *(new)* |

### Changed — Typography scale (~1.25 ratio)

Old scale `10/12/15/16/20/28` had a near-identical 15→16 step. Replaced with a clean 6-step scale. Dropped `--ds-text-xs: 10px` and `--ds-text-md: 16px` (absorbed into `base`).

| New token | Value | Purpose |
|-----------|-------|---------|
| `--ds-text-xs` | 11px | captions, timestamps |
| `--ds-text-sm` | 13px | labels, secondary text |
| `--ds-text-base` | 16px | body copy |
| `--ds-text-lg` | 20px | card titles, subheadings |
| `--ds-text-xl` | 28px | section headings |
| `--ds-text-2xl` | 36px | page titles, hero |

### Added — Motion tokens

```css
--ds-duration-fast:   100ms
--ds-duration-normal: 200ms
--ds-duration-slow:   350ms
--ds-ease-out:        cubic-bezier(0.16, 1, 0.3, 1)
--ds-ease-in-out:     cubic-bezier(0.45, 0, 0.55, 1)
--ds-ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1)
```

Button transitions updated to use these tokens. Tailwind utilities: `duration-fast`, `duration-normal`, `duration-slow`, `ease-out-ds`, `ease-in-out-ds`, `ease-spring`.

### Added — Z-index scale (8 levels)

```
--ds-z-bg: -2  →  --ds-z-gradient: -1  →  --ds-z-base: 0  →  --ds-z-card: 1
→  --ds-z-sticky: 10  →  --ds-z-overlay: 20  →  --ds-z-modal: 50  →  --ds-z-toast: 100
```

Tailwind utilities: `z-bg`, `z-gradient`, `z-base`, `z-card`, `z-sticky`, `z-overlay`, `z-modal`, `z-toast`.

### Added — Loading / empty / error state tokens

- `--ds-skeleton-bg` + `--ds-skeleton-shimmer` + `.ds-skeleton` component class with shimmer animation
- `--ds-empty-icon-color` + `--ds-empty-text-color`
- `--ds-error-bg` + `--ds-error-border` + `--ds-error-text` + `.ds-error-surface` component class
- All tokens have light-mode overrides in `[data-mode="light"]` block.

### Changed — Naming consistency

- Border radius: `--ds-radius` (unnamed default) → `--ds-radius-md: 14px`. Added `--ds-radius-lg: 20px`. `--ds-radius` kept as alias to `var(--ds-radius-md)` for backward compat.
- Destructive: deleted `--ds-destructive-light`. Light-mode value now lives in `[data-mode="light"]` block alongside done/due (consistent pattern).
- Tailwind: dropped `ds-` prefix inside Tailwind config (e.g. `text-ds-base` → `text-base`, `p-ds-md` → `p-4`). CSS custom properties keep `--ds-` prefix. This is a breaking change for any Tailwind utility classes already in use.

### Breaking changes

- `--ds-text-base` is now **16px** (was 15px). Any element using this token will appear 1px larger.
- `--ds-text-xs` is now **11px** (was 10px).
- `--ds-space-md: 14px` deleted → use `--ds-space-4: 16px` or `--ds-space-3: 12px`.
- `--ds-space-lg: 20px` deleted → use `--ds-space-4: 16px` or `--ds-space-6: 24px`.
- `--ds-space-2xl: 40px` deleted → use `--ds-space-8: 32px` or `--ds-space-12: 48px`.
- `--ds-destructive-light` deleted → use `--ds-destructive` (resolves correctly per mode).
- Teal `--ds-primary` is now `#0F766E` (was `#0D9488`). Visually slightly darker.
- Sunrise `--ds-primary` is now `#B45309` (was `#D97706`). Visually slightly darker/more brown.
- Tailwind spacing and font utilities renamed (drop `ds-` prefix). CSS vars unchanged.

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
