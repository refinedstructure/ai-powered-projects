# Ship Lab DS — Figma Plugin

Generates the full design system inside any Figma file in one click.

## What it creates

| Section | Contents |
|---|---|
| **Color styles** | 5 themes × Primary / End / Accent / Dark Base / Light Base / Gradient |
| **Semantic styles** | Dark + light: Text Primary/Secondary/Muted, Glass, Border, Done, Due, Fail, LG Specular/Border/Inner |
| **Text styles** | Display XL/LG, Body MD/SM (Regular + SemiBold), Label, Caption, Button variants |
| **Color palette frame** | Visual swatches for all 5 themes side by side |
| **Button components** | 4 variants (Primary / Secondary / Ghost / Destructive) + interaction states |
| **Glass card component** | Stat tile card + FAB component (both as Figma components) |
| **Mobile preview frame** | 3 phone mockups (Violet / Electric / Teal) with iOS 26 Liquid Glass annotation |

---

## Installation (one-time)

1. Open Figma desktop app (plugin API requires the desktop app)
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Select the `manifest.json` file from this folder
4. Plugin appears under **Plugins → Development → Ship Lab Design System v0.1**

---

## Running

1. Open (or create) a Figma file — use a **blank page**
2. Run: **Plugins → Development → Ship Lab Design System v0.1**
3. Choose which sections to generate (all checked by default)
4. Click **Generate Design System**
5. All frames and styles appear on the page, viewport zooms to fit

---

## After generation

### Link styles to your designs
All color and text styles appear in the **Styles** panel on the right sidebar.
Apply them to any element via the fill/stroke/text pickers.

### Use components
Buttons and card are registered as **Figma Components** — find them in the **Assets** panel (⌥2).
Drag onto any frame to place an instance.

### Multi-theme workflow
1. Switch themes: select elements and swap fill style from `Violet/Primary` → `Teal/Primary`
2. Or use **Tokens Studio** plugin with `tokens/figma-tokens.json` to switch entire theme in one click

### Editing
- **Colors:** Edit paint styles in **Design > Local styles**
- **Components:** Double-click any button to edit the master component
- **iOS 26 Liquid Glass:** The tab bar frames use a top stroke at `rgba(255,255,255,0.5)` to simulate the specular edge

---

## Re-running
Running the plugin again will **add** new frames and styles — it does not overwrite existing ones.
If you want a fresh start, delete the page content first.

---

## Troubleshooting

**"Font not found" error**
Inter must be available. Either install Inter locally or use a Figma file that has Inter loaded.

**Styles not appearing**
Check the **Local styles** panel (Design tab → Local styles). Styles are created globally on the file.

**Components not in Assets**
Make sure you're looking in the same file — components created by the plugin are file-local.
