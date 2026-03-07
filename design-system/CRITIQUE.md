# Design Critique: Ship Lab Design System v0.1

**Date:** 2026-03-07
**Stage:** Post-freeze, pre-integration (v0.1 → v0.2 planning)
**Scope:** Full system — tokens, components, tooling, documentation

---

## Overall Impression

Strong foundation. The token factory approach (5 base values → full semantic set) is genuinely clever and will scale well across themes and platforms. The iOS 26 Liquid Glass implementation is thorough — specular edge, vignette gradient, capsule tab bar — this isn't cargo-cult glassmorphism, it's properly researched.

The biggest opportunity: the system is **visually rich but structurally incomplete**. It has 5 themes and Liquid Glass but is missing the boring-but-essential scaffolding — a proper spacing scale, motion tokens, elevation hierarchy, and error/empty/loading states — that will matter the moment you start building real apps in Lovable.

---

## Usability

| Finding | Severity | Recommendation |
|---------|----------|----------------|
| No formal spacing scale — current 6-step scale (4/8/14/20/24/40) has irregular ratios (2.0→1.75→1.43→1.2→1.67) making layout decisions unpredictable | 🔴 Critical | Adopt an 8pt base grid: 4/8/12/16/24/32/48/64/96. Consistent 1.5-2x jumps. The 14px and 20px steps don't land on any grid and will cause micro-misalignments in production. |
| Typography scale has a 15px→16px step (1.07x ratio) — these are visually indistinguishable | 🟡 Moderate | Collapse to one size. Use 14px (body) or 16px (body), not both. Suggested scale: 11/13/16/20/28/36 (≈1.25 ratio). |
| No motion/transition tokens beyond the hardcoded `120ms ease` on buttons | 🟡 Moderate | Define 3 duration tiers (fast: 100ms, normal: 200ms, slow: 350ms) + 2 easings (ease-out for entrances, ease-in-out for state changes). Without these, every Lovable component will invent its own timings. |
| No z-index scale — Liquid Glass layering (z:-2, z:-1, content, glass) is documented in code comments only | 🟡 Moderate | Formalize as tokens: `--ds-z-bg: -2`, `--ds-z-gradient: -1`, `--ds-z-content: 0`, `--ds-z-card: 1`, `--ds-z-nav: 10`, `--ds-z-modal: 50`, `--ds-z-toast: 100`. |
| No component size variants — buttons are one-size-fits-all (44px touch target) | 🟢 Minor (v0.2) | Add sm (32px, 13px text), md (44px, 15px text), lg (52px, 16px text). The 44px is correct as default but you'll need smaller for dense UIs and larger for hero CTAs. |
| Missing skeleton/loading/empty states | 🟢 Minor (v0.2) | Define shimmer gradient token + empty state text color. These are the first things you'll need in Lovable. |

---

## Visual Hierarchy

**What draws the eye first:** The primary gradient button with glow — correct, this is the intended CTA.

**Reading flow:** Card → stat tiles → action buttons follows a logical top-down pattern. The glass surfaces create clear content boundaries. Good.

**Emphasis concerns:**
- The accent color is defined as "decorative only" but has no usage guidelines. When should a designer use accent vs primary? This ambiguity will lead to inconsistent usage across apps.
- The `totalColor` token (lightened primary) is a strong visual element in stat tiles but there's no guidance on when to use it outside the card context.

**Whitespace:** The spacing scale gaps (jumping from 24px to 40px — no 32px) will force awkward choices in section-level layouts. Typical section padding wants 32px or 48px, not 40px.

---

## Consistency

| Element | Issue | Recommendation |
|---------|-------|----------------|
| Naming: `--ds-text-base` (15px) vs `--ds-text-md` (16px) | Confusing — "base" and "md" imply similar things | Rename to a pure size scale: `--ds-text-sm: 13px`, `--ds-text-base: 16px`, `--ds-text-lg: 20px`, etc. Drop one of the two near-identical sizes. |
| Naming: `--ds-radius-sm` (10px) vs `--ds-radius` (14px) | "Default" is unnamed — inconsistent with spacing where every step has a name | Use `--ds-radius-md: 14px` for the default and add `--ds-radius-lg: 20px` for larger cards. |
| Glass vs Liquid Glass: two separate surface systems (`--ds-glass-*` and `--ds-lg-*`) with different blur/saturate values | Correct separation, but no guidance on when to use which | Add a decision table: Glass (28px blur) = content cards, elevated tiles. Liquid Glass (40px blur) = nav bars, tab bars, system chrome. |
| Destructive color: `--ds-destructive: #F87171` (dark) / `--ds-destructive-light: #B91C1C` (light) | The `-light` suffix naming convention is unique to this one token — every other mode switch happens via `[data-mode]` selectors | Move light-mode destructive into the `[data-mode="light"]` block alongside done/due overrides. |
| Secondary button `--ds-secondary-fg: #ffffff` in dark, `--ds-secondary-fg: [primary]` in light | Correct behavior but the naming doesn't distinguish — same var, different values via specificity | This is actually the right pattern for theming. Just document it clearly. |
| Tailwind config: `ds-` prefixed font sizes (`ds-xs`, `ds-sm`) but no prefix on border-radius keys (`sm`, `DEFAULT`) | Inconsistent prefixing strategy | Either prefix everything with `ds-` or nothing. Recommendation: drop `ds-` prefix in Tailwind (Tailwind's own namespace prevents collisions). Keep `--ds-` prefix only on CSS custom properties. |

---

## Accessibility

**Color contrast (programmatically verified):**

| Check | Result | Action |
|-------|--------|--------|
| White text on all 5 dark bases | ✅ All 18.0:1+ | Excellent |
| `textPrimary` (#111827) on light bases | ✅ All 14.7:1+ | Excellent |
| `textSecondary` (#374151) on light bases | ✅ All 8.5:1+ | Good |
| `textMuted` (#6B7280) on light bases | ⚠️ 4.0-4.7:1 (4 of 5 themes below 4.5) | **Fails AA for normal text.** Darken to `#4B5563` (Tailwind gray-600) or restrict to large text (18px+) only. |
| `textLabel` (#9CA3AF) on light bases | 🔴 2.1-2.4:1 (all fail) | **Hard fail.** This color cannot be used for any meaningful text. Darken to `#6B7280` minimum, or restrict to decorative/non-essential use with explicit documentation. |
| White on Teal primary (#0D9488) | ⚠️ 3.7:1 | **Fails AA for button text.** Either darken teal primary to `#0F766E` (4.6:1) or use dark text on teal buttons. |
| White on Sunrise primary (#D97706) | 🔴 3.2:1 | **Fails AA for button text.** Darken to `#B45309` (4.8:1) or use `#111827` text on sunrise buttons. |
| `--ds-due` light mode (#D97706) on light bases | 🔴 2.6-3.1:1 | **Fails AA.** This is the known warn. Darken to `#92400E` (amber-800) for text usage, keep current for backgrounds/borders only. |
| `--ds-done` light mode (#059669) on light bases | ⚠️ 3.1-3.6:1 | **Below AA.** Darken to `#047857` for text, or pair with a dark background chip. |

**Touch targets:** All 44px — HIG compliant. Good.

**Focus indicators:** `:focus-visible` on buttons, `box-shadow` on inputs. Adequate, but no focus token defined — each component invents its own. Add `--ds-focus-ring: 0 0 0 3px [primary at 0.4]`.

**Reduced motion:** No `prefers-reduced-motion` consideration anywhere. At minimum, wrap the `120ms` transitions in a media query fallback.

---

## What Works Well

- **Token factory architecture** — `makeTokens(theme, isDark)` deriving everything from 5 values is the right abstraction. Swapping themes at runtime with one attribute change is excellent DX.
- **Liquid Glass implementation** — Specular edge, vignette gradient, capsule tab bar. This follows actual iOS 26 HIG, not the usual "slap on a blur and call it glass" approach.
- **Background architecture** — The fixed-position 2-layer background with centre vignette is a genuinely good solution to the "glow pools behind content" problem.
- **Cross-platform token exports** — CSS vars + Tailwind + Figma plugin + SwiftUI mapping table from one source of truth. That's production-grade tooling for a v0.1.
- **Decision log** — Every visual choice has a documented "why." This is rare and extremely valuable for future-you.
- **Figma plugin** — Native generation vs manual Tokens Studio import is the right call for a solo operator. One-click system generation.

---

## Priority Recommendations

### 1. Fix the accessibility failures before shipping any app

The `textMuted`, `textLabel`, teal button, and sunrise button contrast failures are not hypothetical — they'll hit every light-mode screen. This is the #1 blocker.

**Specific fixes:**
- `--ds-text-muted` light: `#6B7280` → `#4B5563`
- `--ds-text-label` light: `#9CA3AF` → `#6B7280` (and document as "minimum text" — nothing lighter)
- Teal primary: `#0D9488` → `#0F766E`
- Sunrise primary: `#D97706` → `#B45309`
- Add `--ds-focus-ring` token
- Add `prefers-reduced-motion` handling

### 2. Rebuild the spacing and typography scales on a consistent mathematical base

The current scales were assembled organically across 7 sessions. They work visually in the explorer but won't compose well in production layouts.

**Spacing:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 (8pt grid)
**Typography:** 11 / 13 / 16 / 20 / 28 / 36 (≈1.25 ratio, drop 10px and 15px)

### 3. Add the structural tokens the explorer doesn't need but apps will

Motion (3 durations + 2 easings), z-index scale (7 levels), focus ring, elevation hierarchy (flat/raised/floating/overlay), and a semantic "surface" scale that maps glass/LG to usage contexts with clear rules.

### 4. Document usage patterns, not just token values

The system defines what the tokens are but not when to use them. Add a decision matrix: "Building a content card? → Use `ds-card` class. Building a nav bar? → Use `ds-glass` class with LG tokens. Primary action? → `ds-btn-primary`. Secondary? → When there's already a primary on screen."

### 5. Add error, empty, and loading state tokens

These are the first three states you'll encounter building any real app. Skeleton shimmer gradient, empty state illustration placeholder size, error message color + background — define once, use everywhere.

---

## Summary Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Visual quality | 9/10 | Liquid Glass + 5 themes + vignette gradient = polished |
| Token architecture | 8/10 | Factory pattern excellent; spacing/type scales need rebuild |
| Accessibility | 5/10 | Dark mode solid; light mode has 4 contrast failures |
| Completeness | 6/10 | Missing motion, z-index, focus, reduced-motion, loading states |
| Documentation | 7/10 | Good decision log + integration guides; missing usage patterns |
| Tooling | 9/10 | CSS + Tailwind + Figma plugin + SwiftUI mapping = strong |
| **Overall** | **7/10** | **Ship-ready dark mode; light mode needs a11y pass; structural gaps before v0.2** |
