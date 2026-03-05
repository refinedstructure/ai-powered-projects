# Design System Tokens — v0.1

Integration guides for every platform this system targets.

---

## Figma — Tokens Studio plugin

1. Install **Tokens Studio** from the Figma Community
2. In the plugin: **Sync > Local file** → point to `figma-tokens.json`
3. Token sets are layered — compose them per variant:

| Use case | Active sets |
|---|---|
| Violet dark | `global` + `violet` + `semantic/dark` |
| Violet light | `global` + `violet` + `semantic/light` |
| Teal dark | `global` + `teal` + `semantic/dark` |

4. Apply tokens to frames using the plugin's token inspector
5. Changes in Figma can be synced back to JSON → PR to repo → tokens auto-update in code

**What's in the JSON:**
- `global` — typography, spacing, radius, sizing (theme-agnostic)
- `violet / electric / teal / rose / sunrise` — raw brand colors per theme
- `semantic/dark` — glass surfaces, text hierarchy, status colors, Liquid Glass tokens
- `semantic/light` — same but light mode variants

---

## Lovable

Lovable uses Tailwind CSS + shadcn/ui. Two files to copy:

### 1. `globals.css`
Copy into your project's `src/app/globals.css` (or `src/index.css`).

```html
<!-- Set theme and mode on html element -->
<html data-theme="violet" data-mode="dark">
```

Switch themes at runtime:
```js
document.documentElement.setAttribute('data-theme', 'teal');
document.documentElement.setAttribute('data-mode', 'light');
```

### 2. `tailwind.config.js`
Merge with your existing Tailwind config, or replace it entirely.

```jsx
// Example usage in Lovable components
<div className="bg-glass backdrop-blur-card border border-border-default rounded-DEFAULT shadow-card">
  Card
</div>

<button className="bg-primary-gradient text-white rounded-full h-touch px-6 font-semibold shadow-glow">
  Primary action
</button>
```

---

## iOS / SwiftUI mapping

| CSS token | SwiftUI equivalent |
|---|---|
| `backdrop-filter: blur(40px) saturate(220%)` | `.ultraThinMaterial` |
| `--ds-lg-specular` (border-top) | Specular reflection in `.glassEffect()` |
| Floating capsule tab bar | `.tabViewStyle(.sidebarAdaptable)` |
| FAB | `Button { Image(systemName: "plus") }.glassEffect(.regular, in: .circle)` |
| `--ds-primary-gradient` | `LinearGradient` with brand colors |
| `--ds-radius` (14px) | `.cornerRadius(14)` |
| `--ds-touch-target` (44px) | `.frame(minWidth: 44, minHeight: 44)` |

---

## Web (vanilla CSS / React)

Import `globals.css`, then use CSS variables directly:

```css
.my-card {
  background: var(--ds-glass-bg);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius);
  box-shadow: var(--ds-shadow-card);
  backdrop-filter: blur(28px) saturate(180%);
}
```

Liquid Glass surface:
```css
.liquid-glass {
  backdrop-filter: blur(40px) saturate(220%);
  background: var(--ds-lg-bg);
  border: 1px solid var(--ds-lg-border);
  border-top-color: var(--ds-lg-specular);   /* ← specular edge */
  box-shadow: inset 0 1px 0 var(--ds-lg-inner), var(--ds-lg-drop);
}
```

---

## Token naming convention

```
--ds-{category}-{variant}

--ds-primary          Brand primary color
--ds-primary-gradient Full gradient (use as background)
--ds-glow-dark        Box-shadow glow for dark mode
--ds-text-primary     Main body text
--ds-text-muted       De-emphasised text
--ds-glass-bg         Standard frosted glass surface
--ds-lg-bg            iOS 26 Liquid Glass gradient body
--ds-lg-specular      Specular edge (border-top-color)
--ds-lg-inner         Inner highlight (inset 0 1px 0)
--ds-radius           Default border radius
--ds-touch-target     iOS HIG min tap target (44px)
```
