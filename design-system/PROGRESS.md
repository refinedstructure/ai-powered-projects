# Design System · Progress Log

**Files:** `tokens/globals.css`, `tokens/tailwind.config.js`, `figma-plugin/code.js`
**Version:** v0.2.0 — 2026-03-07
**Status:** ✅ Production-ready. All WCAG AA failures fixed. Structural tokens added. Ready for first Lovable app.
**Next action:** Copy `globals.css` + `tailwind.config.js` into first Lovable app. Re-run Figma plugin to refresh styles.

---

## Current State

### Themes (5)
| Key | Primary | End | Accent | Dark Base | Light Base |
|-----|---------|-----|--------|-----------|------------|
| `violet` | `#7C3AED` | `#6366F1` | `#22D3EE` | `#0D0B1A` | `#EAE7FF` |
| `electric` | `#1D4ED8` | `#4338CA` | `#A3E635` | `#070B1A` | `#E7EAFF` |
| `teal` | `#0D9488` | `#0369A1` | `#FB923C` | `#061A18` | `#E4F5F4` |
| `rose` | `#BE185D` | `#9333EA` | `#FB923C` | `#160818` | `#FBE9F3` |
| `sunrise` | `#D97706` | `#DC2626` | `#A78BFA` | `#140C00` | `#FFFBEB` |

### Token Factory — `makeTokens(th, dark)`
Single function generates full token set for both modes. Maps to SwiftUI `colorScheme`.

**Dark mode key tokens:**
- `textPrimary: "#FFFFFF"` — pure white (was lavender-tinted)
- `textSecondary: "rgba(255,255,255,0.7)"`
- `textMuted: "rgba(255,255,255,0.56)"` — bumped from 0.5 for contrast
- `totalColor: lightenHex(th.primary, 0.55)` — theme-aware, no hardcoded purple
- `totalBorder: hex2rgba(th.primary, 0.26)` — consistent with done/due border treatment
- `activeDot: th.accentHex` — theme-aware (was hardcoded green, clashed on warm themes)

**Light mode key tokens (neutralised in latest session):**
- `textPrimary: "#111827"` — neutral near-black (was purple-tinted `#0F0B2A`)
- `textSecondary: "#374151"` — neutral dark gray (was violet `#3A3660`)
- `textMuted: "#6B7280"` — neutral mid gray (was lavender `#6B6890`)
- `labelColor: "#9CA3AF"` — neutral (was `#8B88A8`)

### Background Architecture
Two `position:fixed` divs — solid base (z:-2) + gradient layer (z:-1).
Glass cards use `backdrop-filter` to blur the fixed layer = real Liquid Glass behaviour.
Content div is `background:transparent`.

**Gradient composition (latest):**
- 3 edge glows: `24% width, opacity 0.44/0.35, 60% falloff`
- 1 centre vignette: `rgba(0,0,0,0.26)` dark / `rgba(255,255,255,0.22)` light
- Vignette is the key fix — reclaims base colour in content zone so glows feel ambient, not distracting

### Components Built

| Component | Status | Notes |
|-----------|--------|-------|
| Buttons (4 variants) | ✅ | Primary/Secondary/Ghost/Destructive. `Btn` component with live hover/press states |
| Card | ✅ | Glass surface, stat tiles (Tasks/Done/Due), gradient icon tile, Active badge |
| Input | ✅ | Focus ring via box-shadow, label linked via htmlFor |
| Image patterns | ✅ | Hero (glass caption), 3-up thumbnail grid, Feed card (image + text + actions) |
| Interactive States Panel | ✅ | Static 4×4 reference grid (all variants × default/hover/pressed/disabled) |

### Button Hierarchy
```
Primary     gradient + glow                   → Get Started
Secondary   tinted primary bg + border        → Learn more
Ghost       transparent + neutral border      → Cancel
Destructive transparent + red border          → Delete
```

### Interaction States
All 4 variants have tokens for: default / hover / pressed / disabled.
State tokens live in `makeTokens` — fully theme-aware.
- Hover: brighter halo (primary) / tint fill (others) / `brightness(1.08)`
- Pressed: compressed shadow / `scale(0.97)` / `brightness(0.93)`
- Disabled: `opacity: 0.38` / `cursor: not-allowed`
- Transition: `120ms ease` on background, box-shadow, border, filter, transform

### Image Patterns
Three patterns tested. Key finding: glass caption panels over images use
`rgba(0,0,0,0.28)` base (not the `glass` token) so they stay legible regardless
of image brightness. The `glass` token is used for card bodies below images.

### Accessibility (v0.2 — all failures resolved)
- WCAG 2.1 AA: all items pass in both modes ✅
- textMuted light: `#6B7280` → `#4B5563` (4.0:1→6.3:1)
- textLabel light: `#9CA3AF` → `#6B7280` (2.1:1→4.5:1) — use 13px+
- Teal primary: `#0D9488` → `#0F766E` (3.7:1→4.6:1 with white)
- Sunrise primary: `#D97706` → `#B45309` (3.2:1→4.8:1 with white)
- done/due/fail light mode: all darkened to AA ratios
- Focus ring: `--ds-focus-ring` token defined per-theme, applied via `:focus-visible`
- Reduced motion: `@media (prefers-reduced-motion: reduce)` added
- Touch targets: all 44px (HIG compliant)

---

## Session Log

### Session 1 (early) — Style foundation
- Set direction: Modern Minimal + Liquid Glass
- Built initial token factory with 4 themes (Violet, Electric, Teal, Rose)
- Fixed background architecture: `position:fixed` divs → viewport-locked glow
- Fixed secondary button: accent fill → tinted primary
- Fixed Active badge hierarchy on Teal (green-on-teal conflict)

### Session 2 — Polish + Sunrise theme
- Added Sunrise theme (amber/red warm palette)
- Darkened Sunrise blobs from saturated orange to `#92400E / #7F1D1D / #4C1D95`
- Fixed `textPrimary` to pure `#FFFFFF` (was lavender-tinted)
- Bumped `textMuted` dark: `0.5 → 0.56` for contrast
- Header subtitle: `textMuted → textSecondary` (it's readable metadata)
- Added `activeDot: th.accentHex` (was hardcoded green)

### Session 3 — Interaction states
- Added `getStateStyle(t, variant, state)` resolver
- Added `Btn` interactive component (hover/press via React state)
- Added `InteractiveStatesPanel` — 4×4 static reference grid
- State tokens added to `makeTokens` for both modes
- Critique panel: hover fail → pass. DS panel: states moved to ✓ IN THIS BUILD

### Session 4 — Card + glow refinement
- `totalColor`: hardcoded `#A78BFA` → `lightenHex(th.primary, 0.55)` (theme-aware)
- Added `totalBorder` token — Tasks tile now has consistent border with Done/Due
- Gradient: narrowed ellipses `32% → 24%`, tightened falloff `70% → 60%`
- Added centre vignette layer — reclaims base colour in content zone
- Glow opacity: `0.78/0.65 → 0.44/0.35`

### Session 5 — Text legibility + images
- Light mode text neutralised: textSecondary `#3A3660` → `#374151`, textMuted `#6B6890` → `#6B7280`
- Body description text: `fontWeight` 400 → 500, `lineHeight` 1.6 → 1.65
- Added `ImageSection` component: Hero, 3-up grid, Feed card patterns
- Validated: glass caption panels over images use raw rgba overlay, not glass token

### Session 7 — 2026-03-06 — Figma plugin debug + successful generation
- Diagnosed and fixed two bugs blocking the native Figma plugin:
  1. **Object spread syntax** (`{ ...hex(h), a }`) — Figma's plugin sandbox doesn't support ES object spread. Replaced all 4 instances with explicit `{ r, g, b, a }` assignment and `.concat()`.
  2. **Font style naming** — Figma's Inter uses spaced names (`"Semi Bold"`, `"Extra Bold"`) not camelCase. Fixed all 11 occurrences.
- Also updated manifest with `"documentAccess": "dynamic-page"` and API method fallbacks (`createLocalPaintStyle` / `createLocalTextStyle`).
- Plugin successfully generated full design system in Figma file `BbmODhMwXMu3ZXSEpE0h65`: color palette, button components, glass card, mobile preview.
- Tick off **"Import figma-tokens.json into Figma"** from next steps — native plugin supersedes this.

### Session 6 — Mobile preview + iOS 26 Liquid Glass + v0.1 freeze
- Added `MobilePreview` component: 296×604px phone frame, Dynamic Island, glass nav bar, scrollable content, FAB, floating capsule tab bar
- **Rewrote Liquid Glass implementation:** specular gradient + `border-top` at 2× opacity + `inset 0 1px 0` inner highlight — proper iOS 26 spec vs plain acrylic (old build)
- Floating capsule tab bar: inset 14px, `border-radius: 22px` — iOS 26 HIG change from full-width rectangle
- Added FAB: 52×52px circle, trailing side, `primaryGrad` fill, `bottom: 86px` above tab bar
- Added `makeScreenGradient()`: contained gradient variant for phone frame context (no `position:fixed`)
- Added `lgStyle` token for consistent Liquid Glass surface across nav bar, cards, badges, tab bar
- **v0.1 frozen:** generated `tokens/figma-tokens.json`, `tokens/globals.css`, `tokens/tailwind.config.js`, `tokens/README.md`, `CHANGELOG.md`
- Git repo initialised at `Ship Lab/design-system/` — tagged `v0.1.0`

---

## v0.2 Completed (2026-03-07)

**Accessibility:**
- [x] textMuted/textLabel light contrast failures fixed
- [x] Teal + Sunrise primary darkened for button AA contrast
- [x] done/due status colors fixed in light mode
- [x] `--ds-focus-ring` token added (per-theme)
- [x] `prefers-reduced-motion` media query added

**Structure:**
- [x] Spacing scale rebuilt on 8pt grid (9 steps: 4→96)
- [x] Typography scale rebuilt on ~1.25 ratio (6 steps: 11→36)
- [x] Motion tokens (3 durations + 3 easings)
- [x] Z-index scale (8 named levels)
- [x] Skeleton/empty/error state tokens + component classes
- [x] Naming: radius-md/lg, destructive moved to mode selector

**Tooling:**
- [x] Figma plugin updated: primaries, text scale, semantic light colors
- [x] style-explorer-v2.html — standalone interactive explorer
- [x] Tailwind: ds- prefix dropped from utilities (CSS vars unchanged)

---

## What's Next (v0.3)

**First Lovable app:**
- [ ] Copy `globals.css` + `tailwind.config.js` into first Lovable project
- [ ] Set `data-theme` and `data-mode` on `<html>` root
- [ ] Re-run Figma plugin to refresh Figma styles with v0.2 colors

**v0.3 token additions:**
- [ ] Component size variants (sm/md/lg for all interactive elements)
- [ ] Toast / notification component tokens
- [ ] Side-by-side theme comparison in explorer
- [ ] figma-tokens.json regenerated from v0.2 values

---

## Key Decisions Log

| Decision | Why |
|----------|-----|
| Dark-first | Better showcase of Liquid Glass; light is a supported variant |
| 5 themes, 1 token factory | Lovable can swap theme in 1 line; factory maps to SwiftUI colorScheme |
| Accent = decorative only | Keeps buttons clean; prevents accent from fighting semantic colours |
| `position:fixed` background | Viewport-locked gradient; content transparent; glass cards blur layer behind them |
| Centre vignette in gradient | Prevents glow from washing content — active reclaim of base colour |
| Neutral grays in light mode | Prevents chromatic clash on warm bases (Sunrise, Rose); pure readability |
| Glass caption on images = raw rgba | `glass` token assumes a tinted surface behind it; images are unpredictable |
| `Btn` component with React state | CSS pseudo-classes can't reach inline styles; state tracking needed for honest hover/press |
