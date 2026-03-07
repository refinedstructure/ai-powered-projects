# Ship Lab Design System — v0.2 Improvements

**Source:** Design critique dated 2026-03-07
**Status:** Proposed changes — apply to tokens before first Lovable app

This document contains the specific, copy-paste-ready changes to upgrade the design system from v0.1 to v0.2. Each section maps to a finding from the critique.

---

## 1. Accessibility Fixes (Critical — Do First)

### 1a. Light mode text contrast

Replace in `globals.css`, `[data-mode="light"]` block:

```css
/* BEFORE */
--ds-text-muted:   #6B7280;   /* 4.0:1 — FAILS AA on most light bases */
--ds-text-label:   #9CA3AF;   /* 2.1:1 — HARD FAIL */

/* AFTER */
--ds-text-muted:   #4B5563;   /* 6.3:1 on violet light base — PASSES AA */
--ds-text-label:   #6B7280;   /* 4.0:1 — borderline, restrict to 18px+ or decorative */
```

Also update `figma-tokens.json` → `semantic/light` → `text`:
```json
"muted": { "value": "#4B5563", "type": "color" },
"label": { "value": "#6B7280", "type": "color" }
```

### 1b. Button text on Teal and Sunrise

These two primaries fail white-text contrast. Two options — pick one:

**Option A: Darken the primaries (recommended — preserves white text)**
```css
/* Teal: #0D9488 → #0F766E (4.6:1 with white) */
[data-theme="teal"] {
  --ds-primary: #0F766E;
  --ds-primary-gradient: linear-gradient(135deg, #0F766E 0%, #0369A1 100%);
}

/* Sunrise: #D97706 → #B45309 (4.8:1 with white) */
[data-theme="sunrise"] {
  --ds-primary: #B45309;
  --ds-primary-gradient: linear-gradient(135deg, #B45309 0%, #DC2626 100%);
}
```

**Option B: Dark text on light primaries**
Add per-theme `--ds-on-primary` token:
```css
:root { --ds-on-primary: #FFFFFF; }
[data-theme="teal"]    { --ds-on-primary: #042F2E; }
[data-theme="sunrise"] { --ds-on-primary: #1C1917; }
```
Then use `color: var(--ds-on-primary)` on all primary buttons.

### 1c. Status colors in light mode

```css
[data-mode="light"] {
  /* BEFORE → AFTER */
  --ds-done:   #047857;   /* was #059669 (3.1:1) → now 4.6:1 on worst-case light base */
  --ds-due:    #92400E;   /* was #D97706 (2.6:1) → now 5.9:1 — the known warn, now fixed */
}
```

### 1d. Focus ring token

Add to `:root` in `globals.css`:
```css
--ds-focus-ring: 0 0 0 3px rgba(124, 58, 237, 0.40);  /* default: violet */
```

Add per-theme overrides:
```css
[data-theme="violet"]   { --ds-focus-ring: 0 0 0 3px rgba(124, 58, 237, 0.40); }
[data-theme="electric"] { --ds-focus-ring: 0 0 0 3px rgba(29, 78, 216, 0.40); }
[data-theme="teal"]     { --ds-focus-ring: 0 0 0 3px rgba(15, 118, 110, 0.40); }
[data-theme="rose"]     { --ds-focus-ring: 0 0 0 3px rgba(190, 24, 93, 0.40); }
[data-theme="sunrise"]  { --ds-focus-ring: 0 0 0 3px rgba(180, 83, 9, 0.40); }
```

Add to component classes:
```css
.ds-btn-primary:focus-visible,
.ds-btn-secondary:focus-visible {
  outline: none;
  box-shadow: var(--ds-focus-ring);
}
```

### 1e. Reduced motion

Add to `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 2. Spacing Scale (8pt Grid)

Replace the spacing block in `:root`:

```css
/* BEFORE: 4/8/14/20/24/40 (irregular ratios) */
/* AFTER: 8pt grid — consistent, composable */
--ds-space-1:   4px;    /* hairline — icon gap, inline padding */
--ds-space-2:   8px;    /* tight — list items, badge padding */
--ds-space-3:   12px;   /* compact — card internal padding (mobile) */
--ds-space-4:   16px;   /* base — standard gap, card padding */
--ds-space-6:   24px;   /* medium — section padding, card gap */
--ds-space-8:   32px;   /* large — section margin */
--ds-space-12:  48px;   /* xl — page section breaks */
--ds-space-16:  64px;   /* 2xl — hero spacing */
--ds-space-24:  96px;   /* 3xl — page-level breathing room */
```

Update Tailwind:
```js
spacing: {
  "ds-1":  "4px",
  "ds-2":  "8px",
  "ds-3":  "12px",
  "ds-4":  "16px",
  "ds-6":  "24px",
  "ds-8":  "32px",
  "ds-12": "48px",
  "ds-16": "64px",
  "ds-24": "96px",
  "home-indicator": "34px",
  "dynamic-island": "62px",
},
```

Update `figma-tokens.json` → `global` → `spacing`:
```json
"spacing": {
  "1":  { "value": "4",  "type": "spacing" },
  "2":  { "value": "8",  "type": "spacing" },
  "3":  { "value": "12", "type": "spacing" },
  "4":  { "value": "16", "type": "spacing" },
  "6":  { "value": "24", "type": "spacing" },
  "8":  { "value": "32", "type": "spacing" },
  "12": { "value": "48", "type": "spacing" },
  "16": { "value": "64", "type": "spacing" },
  "24": { "value": "96", "type": "spacing" }
}
```

---

## 3. Typography Scale (1.25 Ratio)

Replace the typography block in `:root`:

```css
/* BEFORE: 10/12/15/16/20/28 (15→16 = 1.07x — indistinguishable) */
/* AFTER: ~1.25 ratio — clear visual steps */
--ds-text-xs:    11px;   /* captions, timestamps */
--ds-text-sm:    13px;   /* labels, secondary text */
--ds-text-base:  16px;   /* body copy — the anchor */
--ds-text-lg:    20px;   /* subheadings, card titles */
--ds-text-xl:    28px;   /* section headings */
--ds-text-2xl:   36px;   /* page titles, hero text */
```

Update Tailwind:
```js
fontSize: {
  "ds-xs":   ["11px", { lineHeight: "1.45" }],
  "ds-sm":   ["13px", { lineHeight: "1.5" }],
  "ds-base": ["16px", { lineHeight: "1.5" }],
  "ds-lg":   ["20px", { lineHeight: "1.35" }],
  "ds-xl":   ["28px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
  "ds-2xl":  ["36px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
},
```

---

## 4. Motion Tokens (New)

Add to `:root` in `globals.css`:

```css
/* ── Motion ──────────────────────────────────────────────────────── */
--ds-duration-fast:     100ms;   /* micro-interactions: toggle, checkbox */
--ds-duration-normal:   200ms;   /* state changes: hover, focus, button press */
--ds-duration-slow:     350ms;   /* layout shifts: expand, collapse, slide */

--ds-ease-out:          cubic-bezier(0.16, 1, 0.3, 1);     /* entrances, reveals */
--ds-ease-in-out:       cubic-bezier(0.45, 0, 0.55, 1);    /* state changes */
--ds-ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1); /* playful bounce */
```

Update button transitions:
```css
.ds-btn-primary {
  transition: filter var(--ds-duration-normal) var(--ds-ease-in-out),
              box-shadow var(--ds-duration-normal) var(--ds-ease-in-out),
              transform var(--ds-duration-fast) var(--ds-ease-out);
}
```

Add to Tailwind:
```js
transitionDuration: {
  "ds-fast":   "100ms",
  "ds-normal": "200ms",
  "ds-slow":   "350ms",
},
transitionTimingFunction: {
  "ds-out":    "cubic-bezier(0.16, 1, 0.3, 1)",
  "ds-in-out": "cubic-bezier(0.45, 0, 0.55, 1)",
  "ds-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
},
```

---

## 5. Z-Index Scale (New)

Add to `:root`:

```css
/* ── Z-Index ─────────────────────────────────────────────────────── */
--ds-z-bg:        -2;     /* fixed background base */
--ds-z-gradient:  -1;     /* fixed gradient overlay */
--ds-z-base:       0;     /* content layer */
--ds-z-card:       1;     /* glass cards, elevated tiles */
--ds-z-sticky:     10;    /* sticky headers, nav bars */
--ds-z-overlay:    20;    /* dropdown menus, popovers */
--ds-z-modal:      50;    /* modal backdrops + dialogs */
--ds-z-toast:      100;   /* toast notifications (always on top) */
```

Add to Tailwind:
```js
zIndex: {
  "ds-bg":       "-2",
  "ds-gradient": "-1",
  "ds-base":     "0",
  "ds-card":     "1",
  "ds-sticky":   "10",
  "ds-overlay":  "20",
  "ds-modal":    "50",
  "ds-toast":    "100",
},
```

---

## 6. Naming Consistency Fixes

### 6a. Border radius — name the default

```css
/* BEFORE */
--ds-radius-sm:   10px;
--ds-radius:      14px;   /* unnamed "default" */

/* AFTER */
--ds-radius-sm:   10px;   /* inner elements, stat tiles */
--ds-radius-md:   14px;   /* cards, inputs — the default */
--ds-radius-lg:   20px;   /* large cards, modals */
--ds-radius-full: 9999px; /* pills, badges, FAB */
--ds-radius-tab-bar: 22px;
```

Keep `--ds-radius` as an alias for backward compat:
```css
--ds-radius: var(--ds-radius-md);
```

### 6b. Destructive color — unify with mode switching

Move destructive-light into the mode block:
```css
/* BEFORE — standalone token */
:root {
  --ds-destructive:       #F87171;
  --ds-destructive-light: #B91C1C;
}

/* AFTER — follows the same mode-switch pattern as done/due */
:root, [data-mode="dark"] {
  --ds-destructive: #F87171;
}
[data-mode="light"] {
  --ds-destructive: #B91C1C;
}
```

Delete `--ds-destructive-light` entirely.

### 6c. Tailwind prefix — drop `ds-` inside Tailwind

Tailwind's own namespace prevents collisions. Keep `--ds-` on CSS custom properties (they live in global CSS scope), but Tailwind utilities don't need it:

```js
// BEFORE
fontSize: { "ds-xs": [...], "ds-sm": [...] }
spacing:  { "ds-xs": "4px", "ds-sm": "8px" }

// AFTER — cleaner utility classes
fontSize: { xs: [...], sm: [...], base: [...] }
spacing:  { 1: "4px", 2: "8px", 3: "12px" }
```

This gives you `text-base` instead of `text-ds-base`, `p-4` instead of `p-ds-md`. Standard Tailwind conventions.

---

## 7. Surface Usage Guide (New Section for README)

Add this decision table to the design system README:

```markdown
## When to use which surface

| Context | CSS class | Blur | When |
|---------|-----------|------|------|
| Content card | `.ds-card` | 28px / 180% | Cards, tiles, list items, elevated containers |
| System chrome | `.ds-glass` | 40px / 220% | Nav bars, tab bars, toolbars, sheet headers |
| Image overlay | *raw rgba* | 40px / 220% | Captions over photos — use `rgba(0,0,0,0.28)` not tokens |
| Flat surface | none | none | Modals, full-screen pages, backgrounds |

### Button hierarchy
| Priority | Variant | When |
|----------|---------|------|
| Highest | Primary | One per screen — the main action ("Get Started", "Save") |
| Medium | Secondary | Supporting action when primary exists ("Learn More") |
| Low | Ghost | Tertiary/cancel actions, toolbar items |
| Destructive | Destructive | Irreversible actions — always confirm first |

### Text hierarchy
| Token | Size | Weight | When |
|-------|------|--------|------|
| `text-primary` | 16px+ | 400-600 | Headings, body copy, anything users must read |
| `text-secondary` | 13px+ | 400-500 | Supporting text, descriptions, metadata |
| `text-muted` | 13px+ | 400 | Timestamps, captions, tertiary info |
| `text-label` | 11px+ | 500-600 | Form labels, badge text, all-caps tags (18px+ only in light mode) |
```

---

## 8. Loading / Empty / Error State Tokens (New)

Add to `:root`:

```css
/* ── State tokens ────────────────────────────────────────────────── */
/* Skeleton shimmer */
--ds-skeleton-bg:         rgba(255, 255, 255, 0.06);
--ds-skeleton-shimmer:    linear-gradient(90deg,
                            transparent 0%,
                            rgba(255, 255, 255, 0.04) 50%,
                            transparent 100%);

/* Empty state */
--ds-empty-icon-color:    rgba(255, 255, 255, 0.20);
--ds-empty-text-color:    var(--ds-text-muted);

/* Error surface */
--ds-error-bg:            rgba(248, 113, 113, 0.10);
--ds-error-border:        rgba(248, 113, 113, 0.25);
--ds-error-text:          var(--ds-destructive);
```

Light mode overrides:
```css
[data-mode="light"] {
  --ds-skeleton-bg:         rgba(0, 0, 0, 0.05);
  --ds-skeleton-shimmer:    linear-gradient(90deg,
                              transparent 0%,
                              rgba(0, 0, 0, 0.03) 50%,
                              transparent 100%);
  --ds-empty-icon-color:    rgba(0, 0, 0, 0.15);
  --ds-error-bg:            rgba(185, 28, 28, 0.06);
  --ds-error-border:        rgba(185, 28, 28, 0.20);
}
```

---

## Implementation Order

1. **Accessibility fixes** (1a–1e) — Do before any Lovable app. Non-negotiable.
2. **Spacing scale** (2) — Affects every layout decision in Lovable.
3. **Typography scale** (3) — Closely tied to spacing.
4. **Motion tokens** (4) — Small add, big consistency win.
5. **Z-index scale** (5) — Needed for any overlay/modal/toast.
6. **Naming fixes** (6) — Quality-of-life, can be done alongside above.
7. **Surface guide** (7) — Documentation, no code change.
8. **State tokens** (8) — Before first app has loading states.

**Estimated effort:** 2-3 hours for items 1-6 in `globals.css` + `tailwind.config.js` + `figma-tokens.json`. Items 7-8 are 30 minutes each.

---

## Files to Update

| File | Changes |
|------|---------|
| `tokens/globals.css` | A11y fixes, new scales, motion, z-index, states |
| `tokens/tailwind.config.js` | Mirror all CSS var changes |
| `tokens/figma-tokens.json` | Mirror spacing, typography, new token groups |
| `design-system/README.md` | Add surface usage guide |
| `design-system/CHANGELOG.md` | Document v0.2 changes |
| `figma-plugin/code.js` | Regenerate with updated tokens |
| `style-explorer.jsx` | Update makeTokens factory with new scales |
