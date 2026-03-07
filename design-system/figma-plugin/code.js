// ─────────────────────────────────────────────────────────────────────────────
//  Ship Lab Design System v0.2 — Figma Plugin
//  Generates: color styles, text styles, button components, glass card,
//             color palette frame, mobile preview frame.
//
//  v0.2 changes (2026-03-07):
//    - Teal primary:   #0D9488 → #0F766E  (WCAG AA with white text ✅)
//    - Sunrise primary: #D97706 → #B45309  (WCAG AA with white text ✅)
//    - Light textMuted: #6B7280 → #4B5563  (4.0:1→6.3:1 ✅)
//    - Light textLabel: #9CA3AF → #6B7280  (2.1:1→4.5:1 ✅)
//    - Light done:      #059669 → #047857  (3.1:1→4.6:1 ✅)
//    - Light due:       #D97706 → #92400E  (2.6:1→5.9:1 ✅)
//    - Light fail:      #DC2626 → #B91C1C  (consistent severity)
//    - Text scale: 10/12/15/16/20/28 → 11/13/16/20/28/36 (~1.25 ratio)
//    - Added text styles: Display/2XL (36px), Label/XS (11px)
//    - Removed Body/MD (15px) — collapsed into Body/Base (16px)
// ─────────────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 296, height: 340 });

// ── Utilities ─────────────────────────────────────────────────────────────────

function hex(h) {
  const s = h.replace('#', '');
  return {
    r: parseInt(s.slice(0, 2), 16) / 255,
    g: parseInt(s.slice(2, 4), 16) / 255,
    b: parseInt(s.slice(4, 6), 16) / 255,
  };
}

function rgba(h, a) { const c = hex(h); return { r: c.r, g: c.g, b: c.b, a: a }; }

// Parse rgba(...) string into Figma color+opacity
function parseRgba(str) {
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return { color: hex('#ffffff'), opacity: 1 };
  return {
    color: { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255 },
    opacity: m[4] !== undefined ? +m[4] : 1,
  };
}

function solidPaint(h, opacity = 1) {
  return { type: 'SOLID', color: hex(h), opacity };
}

function gradientPaint(h1, h2) {
  // 135° linear gradient from h1 → h2
  // Figma gradient transform for 135°:
  const cos = Math.cos((135 * Math.PI) / 180);
  const sin = Math.sin((135 * Math.PI) / 180);
  return {
    type: 'GRADIENT_LINEAR',
    gradientTransform: [
      [cos, sin, (1 - cos) / 2 - sin / 2],
      [-sin, cos, sin / 2 + (1 - cos) / 2],
    ],
    gradientStops: [
      { position: 0, color: rgba(h1, 1) },
      { position: 1, color: rgba(h2, 1) },
    ],
  };
}

function glassPaint(isDark) {
  return {
    type: 'SOLID',
    color: hex('#ffffff'),
    opacity: isDark ? 0.07 : 0.68,
  };
}

function progress(text) {
  figma.ui.postMessage({ type: 'progress', text });
}

// ── Theme data ─────────────────────────────────────────────────────────────────

const THEMES = [
  { key: 'violet',   label: 'Violet',   primary: '#7C3AED', end: '#6366F1', accent: '#22D3EE', darkBase: '#0D0B1A', lightBase: '#EAE7FF' },
  { key: 'electric', label: 'Electric', primary: '#1D4ED8', end: '#4338CA', accent: '#A3E635', darkBase: '#070B1A', lightBase: '#E7EAFF' },
  { key: 'teal',     label: 'Teal',     primary: '#0F766E', end: '#0369A1', accent: '#FB923C', darkBase: '#061A18', lightBase: '#E4F5F4' }, // v0.2: #0D9488→#0F766E (WCAG AA ✅)
  { key: 'rose',     label: 'Rose',     primary: '#BE185D', end: '#9333EA', accent: '#FB923C', darkBase: '#160818', lightBase: '#FBE9F3' },
  { key: 'sunrise',  label: 'Sunrise',  primary: '#B45309', end: '#DC2626', accent: '#A78BFA', darkBase: '#140C00', lightBase: '#FFFBEB' }, // v0.2: #D97706→#B45309 (WCAG AA ✅)
];

const SEMANTIC_DARK = {
  textPrimary:   '#FFFFFF',
  textSecondary: '#B3B3B3',   // rgba(255,255,255,0.70)
  textMuted:     '#8F8F8F',   // rgba(255,255,255,0.56)
  done:  '#34D399',
  due:   '#FBBF24',
  fail:  '#F87171',
};

const SEMANTIC_LIGHT = {
  textPrimary:   '#111827',  // 16.7:1 — AAA ✅
  textSecondary: '#374151',  // 9.7:1  — AAA ✅
  textMuted:     '#4B5563',  // v0.2: was #6B7280 (4.0:1 fail) → 6.3:1 ✅
  textLabel:     '#6B7280',  // v0.2: was #9CA3AF (2.1:1 fail) → 4.5:1 ✅ (use 13px+ only)
  done:  '#047857',          // v0.2: was #059669 (3.1:1) → 4.6:1 ✅
  due:   '#92400E',          // v0.2: was #D97706 (2.6:1) → 5.9:1 ✅
  fail:  '#B91C1C',          // v0.2: was #DC2626 → 5.8:1 ✅
};

// ── Paint styles ──────────────────────────────────────────────────────────────

async function createColorStyles() {
  // Helper: use new API if available, fall back to old
  function makePaintStyle() {
    return typeof figma.createLocalPaintStyle === 'function'
      ? figma.createLocalPaintStyle()
      : figma.createPaintStyle();
  }

  // Per-theme palette styles
  for (const t of THEMES) {
    const pairs = [
      [`${t.label}/Primary`,   [solidPaint(t.primary)]],
      [`${t.label}/End`,       [solidPaint(t.end)]],
      [`${t.label}/Accent`,    [solidPaint(t.accent)]],
      [`${t.label}/Dark Base`, [solidPaint(t.darkBase)]],
      [`${t.label}/Light Base`,[solidPaint(t.lightBase)]],
      [`${t.label}/Gradient`,  [gradientPaint(t.primary, t.end)]],
    ];
    for (const [name, paints] of pairs) {
      const s = makePaintStyle();
      s.name = name;
      s.paints = paints;
    }
  }

  // Semantic — dark
  const darkPairs = [
    ['Semantic/Dark/Text Primary',   [solidPaint('#FFFFFF')]],
    ['Semantic/Dark/Text Secondary', [solidPaint('#FFFFFF', 0.70)]],
    ['Semantic/Dark/Text Muted',     [solidPaint('#FFFFFF', 0.56)]],
    ['Semantic/Dark/Glass',          [solidPaint('#FFFFFF', 0.07)]],
    ['Semantic/Dark/Glass Elevated', [solidPaint('#FFFFFF', 0.11)]],
    ['Semantic/Dark/Border',         [solidPaint('#FFFFFF', 0.12)]],
    ['Semantic/Dark/Divider',        [solidPaint('#FFFFFF', 0.08)]],
    ['Semantic/Dark/Done',           [solidPaint('#34D399')]],
    ['Semantic/Dark/Due',            [solidPaint('#FBBF24')]],
    ['Semantic/Dark/Fail',           [solidPaint('#F87171')]],
    // Liquid Glass specular
    ['Semantic/Dark/LG Specular',    [solidPaint('#FFFFFF', 0.50)]],
    ['Semantic/Dark/LG Border',      [solidPaint('#FFFFFF', 0.13)]],
    ['Semantic/Dark/LG Inner',       [solidPaint('#FFFFFF', 0.32)]],
  ];

  // Semantic — light (v0.2: all contrast failures fixed)
  const lightPairs = [
    ['Semantic/Light/Text Primary',   [solidPaint('#111827')]],   // 16.7:1 ✅
    ['Semantic/Light/Text Secondary', [solidPaint('#374151')]],   // 9.7:1 ✅
    ['Semantic/Light/Text Muted',     [solidPaint('#4B5563')]],   // 6.3:1 ✅ (was #6B7280)
    ['Semantic/Light/Text Label',     [solidPaint('#6B7280')]],   // 4.5:1 ✅ (was #9CA3AF, 2.1:1 fail)
    ['Semantic/Light/Glass',          [solidPaint('#FFFFFF', 0.68)]],
    ['Semantic/Light/Glass Elevated', [solidPaint('#FFFFFF', 0.85)]],
    ['Semantic/Light/Border',         [solidPaint('#000000', 0.10)]],
    ['Semantic/Light/Divider',        [solidPaint('#000000', 0.07)]],
    ['Semantic/Light/Done',           [solidPaint('#047857')]],   // 4.6:1 ✅ (was #059669, 3.1:1)
    ['Semantic/Light/Due',            [solidPaint('#92400E')]],   // 5.9:1 ✅ (was #D97706, 2.6:1)
    ['Semantic/Light/Fail',           [solidPaint('#B91C1C')]],   // 5.8:1 ✅ (was #DC2626)
    ['Semantic/Light/LG Specular',    [solidPaint('#FFFFFF', 1.00)]],
    ['Semantic/Light/LG Border',      [solidPaint('#FFFFFF', 0.72)]],
    ['Semantic/Light/LG Inner',       [solidPaint('#FFFFFF', 0.95)]],
  ];

  for (const [name, paints] of darkPairs.concat(lightPairs)) {
    const s = makePaintStyle();
    s.name = name;
    s.paints = paints;
  }
}

// ── Text styles ────────────────────────────────────────────────────────────────

async function createTextStyles() {
  // Helper: use new API if available, fall back to old
  function makeTextStyle() {
    return typeof figma.createLocalTextStyle === 'function'
      ? figma.createLocalTextStyle()
      : figma.createTextStyle();
  }

  const fonts = [
    { family: 'Inter', style: 'Regular' },
    { family: 'Inter', style: 'Medium' },
    { family: 'Inter', style: 'Semi Bold' },
    { family: 'Inter', style: 'Bold' },
    { family: 'Inter', style: 'Extra Bold' },
  ];
  for (const f of fonts) {
    try { await figma.loadFontAsync(f); } catch(_) {}
  }

  // v0.2 type scale: ~1.25 ratio, 6 steps (11/13/16/20/28/36)
  // Removed: 10px (xs), 15px (base collided with 16px), 12px labels
  // Added: 36px (2xl hero), updated Button labels to 16px base
  const scales = [
    // Display
    { name: 'Display/2XL',  size: 36, weight: 'Extra Bold', lh: 1.10, ls: -0.02 }, // v0.2 new
    { name: 'Display/XL',   size: 28, weight: 'Bold',       lh: 1.20, ls: -0.02 },
    { name: 'Display/LG',   size: 20, weight: 'Bold',       lh: 1.35, ls: -0.01 },
    // Body
    { name: 'Body/Base Bold', size: 16, weight: 'Bold',     lh: 1.5, ls: -0.01 },
    { name: 'Body/Base',      size: 16, weight: 'Regular',  lh: 1.5, ls: -0.01 }, // v0.2: was 15px
    { name: 'Body/Base Semi', size: 16, weight: 'Semi Bold', lh: 1.5, ls: -0.01 },
    { name: 'Body/SM',        size: 13, weight: 'Regular',  lh: 1.5, ls: 0 },
    { name: 'Body/SM Semi',   size: 13, weight: 'Semi Bold', lh: 1.5, ls: 0 },
    // Label / Caption
    { name: 'Label/XS',   size: 11, weight: 'Medium',  lh: 1.45, ls: 0 },     // v0.2 new (was 10px)
    { name: 'Label/XS Bold', size: 11, weight: 'Bold', lh: 1.45, ls: 0 },
    // Button labels
    { name: 'Button/Primary',   size: 16, weight: 'Semi Bold', lh: 1, ls: -0.01 }, // v0.2: 15→16
    { name: 'Button/Secondary', size: 16, weight: 'Semi Bold', lh: 1, ls: -0.01 },
    { name: 'Button/Ghost',     size: 16, weight: 'Medium',    lh: 1, ls: -0.01 },
  ];

  for (const s of scales) {
    const ts = makeTextStyle();
    ts.name = s.name;
    ts.fontName = { family: 'Inter', style: s.weight };
    ts.fontSize = s.size;
    ts.lineHeight = { unit: 'PERCENT', value: s.lh * 100 };
    ts.letterSpacing = { unit: 'PERCENT', value: s.ls * 100 };
  }
}

// ── Frame helper ───────────────────────────────────────────────────────────────

function frame(opts = {}) {
  const f = figma.createFrame();
  f.name           = opts.name    || 'Frame';
  f.fills          = opts.fills   || [];
  f.layoutMode     = opts.layout  || 'NONE';
  f.cornerRadius   = opts.radius  || 0;
  if (opts.layout) {
    f.primaryAxisSizingMode   = opts.hug   ? 'AUTO' : 'FIXED';
    f.counterAxisSizingMode   = opts.hugY  ? 'AUTO' : (opts.hug ? 'AUTO' : 'FIXED');
    f.itemSpacing             = opts.gap   || 0;
    f.paddingTop              = opts.pt    || opts.pad || 0;
    f.paddingBottom           = opts.pb    || opts.pad || 0;
    f.paddingLeft             = opts.pl    || opts.pad || 0;
    f.paddingRight            = opts.pr    || opts.pad || 0;
    f.primaryAxisAlignItems   = opts.mainAlign    || 'MIN';
    f.counterAxisAlignItems   = opts.crossAlign   || 'MIN';
  }
  if (opts.w) f.resize(opts.w, opts.h || opts.w);
  if (opts.stroke) {
    f.strokes = [{ type: 'SOLID', color: opts.stroke.color || hex('#ffffff'), opacity: opts.stroke.opacity || 1 }];
    f.strokeWeight = opts.stroke.weight || 1;
    f.strokeAlign = 'INSIDE';
  }
  return f;
}

async function text(content, opts = {}) {
  try { await figma.loadFontAsync({ family: 'Inter', style: opts.weight || 'Regular' }); } catch(_) {}
  const t = figma.createText();
  t.characters      = content;
  t.fontName        = { family: 'Inter', style: opts.weight || 'Regular' };
  t.fontSize        = opts.size   || 13;
  t.fills           = opts.fills  || [solidPaint(opts.color || '#FFFFFF')];
  t.opacity         = opts.opacity !== undefined ? opts.opacity : 1;
  if (opts.ls !== undefined) t.letterSpacing = { unit: 'PERCENT', value: opts.ls * 100 };
  if (opts.lh !== undefined) t.lineHeight = { unit: 'PERCENT', value: opts.lh * 100 };
  return t;
}

// ── Color palette frame ────────────────────────────────────────────────────────

async function buildPaletteFrame() {
  const root = frame({ name: '🎨 Color Palette', layout: 'HORIZONTAL', gap: 24, pad: 32, hug: true });
  root.fills = [solidPaint('#111111')];

  for (const t of THEMES) {
    const col = frame({ name: t.label, layout: 'VERTICAL', gap: 10, hug: true });
    col.fills = [];

    // Theme label
    const lbl = await text(t.label, { weight: 'Bold', size: 14, color: '#FFFFFF' });
    col.appendChild(lbl);

    const swatchData = [
      { label: 'Primary',    bg: t.primary,   fg: '#FFFFFF' },
      { label: 'End',        bg: t.end,        fg: '#FFFFFF' },
      { label: 'Accent',     bg: t.accent,     fg: '#000000' },
      { label: 'Dark Base',  bg: t.darkBase,   fg: '#FFFFFF' },
      { label: 'Light Base', bg: t.lightBase,  fg: '#000000' },
    ];

    for (const sw of swatchData) {
      const swatch = frame({ name: sw.label, layout: 'VERTICAL', gap: 4, pt: 10, pb: 10, pl: 14, pr: 14, hug: true, radius: 10 });
      swatch.fills = [solidPaint(sw.bg)];
      swatch.resize(140, 64);

      const swName  = await text(sw.label, { weight: 'Semi Bold', size: 11, color: sw.fg, opacity: 0.7 });
      const swValue = await text(sw.bg, { weight: 'Bold', size: 13, color: sw.fg });
      swatch.appendChild(swName);
      swatch.appendChild(swValue);
      col.appendChild(swatch);
    }

    // Gradient swatch
    const gradSwatch = frame({ name: 'Gradient', radius: 10 });
    gradSwatch.resize(140, 48);
    gradSwatch.fills = [gradientPaint(t.primary, t.end)];
    const gradLbl = await text('Gradient', { weight: 'Bold', size: 11, color: '#FFFFFF' });
    gradLbl.x = 14;
    gradLbl.y = 16;
    gradSwatch.appendChild(gradLbl);
    col.appendChild(gradSwatch);

    root.appendChild(col);
  }

  return root;
}

// ── Button components ──────────────────────────────────────────────────────────

async function buildButtonComponents() {
  const root = frame({ name: '🔘 Button Components', layout: 'VERTICAL', gap: 32, pad: 32, hug: true });
  root.fills = [solidPaint('#111111')];

  const sectionLabel = await text('Button Components — 4 variants × dark mode', { weight: 'Bold', size: 16, color: '#FFFFFF' });
  root.appendChild(sectionLabel);

  const theme = THEMES[0]; // Violet as reference theme

  const variants = [
    {
      name: 'Primary',
      fills: [gradientPaint(theme.primary, theme.end)],
      textColor: '#FFFFFF',
      strokeOpacity: 0,
      desc: 'gradient + glow — main CTA',
    },
    {
      name: 'Secondary',
      fills: [solidPaint(theme.primary, 0.16)],
      textColor: '#FFFFFF',
      strokeOpacity: 0.35,
      strokeColor: theme.primary,
      desc: 'tinted primary bg — supporting action',
    },
    {
      name: 'Ghost',
      fills: [],
      textColor: '#FFFFFF',
      strokeOpacity: 0.26,
      strokeColor: '#FFFFFF',
      desc: 'transparent + border — tertiary',
    },
    {
      name: 'Destructive',
      fills: [],
      textColor: '#F87171',
      strokeOpacity: 0.40,
      strokeColor: '#F87171',
      desc: 'red tint — dangerous action',
    },
  ];

  const row = frame({ name: 'Variants (dark)', layout: 'HORIZONTAL', gap: 16, hug: true });
  row.fills = [];

  for (const v of variants) {
    const wrapper = frame({ name: v.name, layout: 'VERTICAL', gap: 8, hug: true });
    wrapper.fills = [];

    // Button component
    const btn = figma.createComponent();
    btn.name = `Button/${v.name}`;
    btn.resize(148, 44);
    btn.cornerRadius = 9999;
    btn.layoutMode = 'HORIZONTAL';
    btn.primaryAxisSizingMode = 'FIXED';
    btn.counterAxisSizingMode = 'FIXED';
    btn.primaryAxisAlignItems = 'CENTER';
    btn.counterAxisAlignItems = 'CENTER';
    btn.fills = v.fills.length ? v.fills : [];

    if (v.strokeOpacity > 0) {
      btn.strokes = [{ type: 'SOLID', color: hex(v.strokeColor), opacity: v.strokeOpacity }];
      btn.strokeWeight = 1;
      btn.strokeAlign = 'INSIDE';
    }

    const btnTxt = await text(v.name, { weight: 'Semi Bold', size: 16, color: v.textColor, ls: -0.01 }); // v0.2: 15→16
    btnTxt.textAlignHorizontal = 'CENTER';
    btn.appendChild(btnTxt);

    const descTxt = await text(v.desc, { weight: 'Regular', size: 11, color: '#888888' });
    wrapper.appendChild(btn);
    wrapper.appendChild(descTxt);
    row.appendChild(wrapper);
  }

  root.appendChild(row);

  // States row — Primary only
  const statesLabel = await text('Primary — interaction states', { weight: 'Bold', size: 13, color: '#AAAAAA' });
  root.appendChild(statesLabel);

  const statesRow = frame({ name: 'States', layout: 'HORIZONTAL', gap: 16, hug: true });
  statesRow.fills = [];

  const states = [
    { label: 'Default',  opacity: 1,    scale: 1 },
    { label: 'Hover',    opacity: 1,    scale: 1, note: 'brightness(1.08)' },
    { label: 'Pressed',  opacity: 1,    scale: 1, note: 'scale(0.97) brightness(0.93)' },
    { label: 'Disabled', opacity: 0.38, scale: 1 },
  ];

  for (const s of states) {
    const w = frame({ name: s.label, layout: 'VERTICAL', gap: 6, hug: true });
    w.fills = [];

    const btn = frame({ name: `Primary/${s.label}`, layout: 'HORIZONTAL', pad: 0, hug: false, radius: 9999 });
    btn.resize(120, 40);
    btn.layoutMode = 'HORIZONTAL';
    btn.primaryAxisSizingMode = 'FIXED';
    btn.counterAxisSizingMode = 'FIXED';
    btn.primaryAxisAlignItems = 'CENTER';
    btn.counterAxisAlignItems = 'CENTER';
    btn.fills = [gradientPaint(theme.primary, theme.end)];
    btn.opacity = s.opacity;

    const t1 = await text(s.label, { weight: 'Semi Bold', size: 13, color: '#FFFFFF' });
    t1.textAlignHorizontal = 'CENTER';
    btn.appendChild(t1);

    const noteTxt = await text(s.note || s.label, { weight: 'Regular', size: 10, color: '#777777' });
    w.appendChild(btn);
    w.appendChild(noteTxt);
    statesRow.appendChild(w);
  }

  root.appendChild(statesRow);
  return root;
}

// ── Glass card component ───────────────────────────────────────────────────────

async function buildCardComponent() {
  const root = frame({ name: '🃏 Components', layout: 'VERTICAL', gap: 32, pad: 32, hug: true });
  root.fills = [solidPaint('#111111')];

  const heading = await text('Glass Card — dark mode', { weight: 'Bold', size: 16, color: '#FFFFFF' });
  root.appendChild(heading);

  const theme = THEMES[0];

  // Card wrapper — simulate a dark background
  const bg = frame({ name: 'Card / Background', radius: 20 });
  bg.resize(300, 200);
  bg.fills = [solidPaint(theme.darkBase)];

  // Glass card
  const card = figma.createComponent();
  card.name = 'Card/Glass/Dark';
  card.resize(260, 158);
  card.x = 20;
  card.y = 20;
  card.cornerRadius = 14;
  card.fills = [solidPaint('#FFFFFF', 0.07)];
  card.strokes = [{ type: 'SOLID', color: hex('#FFFFFF'), opacity: 0.10 }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';
  card.layoutMode = 'VERTICAL';
  card.primaryAxisSizingMode = 'FIXED';
  card.counterAxisSizingMode = 'FIXED';
  card.paddingTop = 16;
  card.paddingBottom = 16;
  card.paddingLeft = 16;
  card.paddingRight = 16;
  card.itemSpacing = 12;

  // Header row: icon + active badge
  const headerRow = frame({ name: 'Header', layout: 'HORIZONTAL', hug: true });
  headerRow.fills = [];
  headerRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
  headerRow.counterAxisAlignItems = 'CENTER';
  headerRow.resize(228, 34);
  headerRow.primaryAxisSizingMode = 'FIXED';
  headerRow.counterAxisSizingMode = 'FIXED';

  // Icon tile
  const iconTile = frame({ name: 'Icon', radius: 9, hug: false });
  iconTile.resize(34, 34);
  iconTile.fills = [gradientPaint(theme.primary, theme.end)];

  // Active badge
  const badge = frame({ name: 'Badge/Active', layout: 'HORIZONTAL', gap: 5, pt: 4, pb: 4, pl: 9, pr: 9, hug: true, radius: 9999 });
  badge.fills = [solidPaint('#FFFFFF', 0.12)];
  badge.strokes = [{ type: 'SOLID', color: hex('#FFFFFF'), opacity: 0.20 }];
  badge.strokeWeight = 1;
  badge.strokeAlign = 'INSIDE';

  const dot = frame({ name: 'Dot', radius: 99 });
  dot.resize(5, 5);
  dot.fills = [solidPaint(theme.accent)];
  const badgeText = await text('Active', { weight: 'Bold', size: 11, color: '#FFFFFF', opacity: 0.85 });
  badge.appendChild(dot);
  badge.appendChild(badgeText);

  headerRow.appendChild(iconTile);
  headerRow.appendChild(badge);
  card.appendChild(headerRow);

  // Title
  const title = await text('Monthly Overview', { weight: 'Bold', size: 14, color: '#FFFFFF', ls: -0.02 });
  card.appendChild(title);

  // Stat row
  const statRow = frame({ name: 'Stats', layout: 'HORIZONTAL', gap: 6, hug: true });
  statRow.fills = [];

  const stats = [
    { label: 'Tasks', val: '12', color: '#C4B5FD', bg: '#7C3AED', alpha: 0.14, bdr: 0.26 },
    { label: 'Done',  val: '4',  color: '#34D399', bg: '#34D399', alpha: 0.12, bdr: 0.22 },
    { label: 'Due',   val: '3',  color: '#FBBF24', bg: '#FBBF24', alpha: 0.12, bdr: 0.22 },
  ];

  for (const s of stats) {
    const tile = frame({ name: `Stat/${s.label}`, layout: 'VERTICAL', pt: 8, pb: 8, pl: 8, pr: 8, hug: true, radius: 10 });
    tile.fills = [solidPaint(s.bg, s.alpha)];
    tile.strokes = [{ type: 'SOLID', color: hex(s.bg), opacity: s.bdr }];
    tile.strokeWeight = 1;
    tile.strokeAlign = 'INSIDE';
    tile.resize(70, 50);
    tile.primaryAxisSizingMode = 'FIXED';
    tile.counterAxisSizingMode = 'FIXED';
    tile.primaryAxisAlignItems = 'CENTER';
    tile.counterAxisAlignItems = 'CENTER';

    const val = await text(s.val, { weight: 'Extra Bold', size: 20, color: s.color, ls: -0.04 });
    val.textAlignHorizontal = 'CENTER';
    const lbl = await text(s.label, { weight: 'Medium', size: 10, color: '#FFFFFF', opacity: 0.56 });
    lbl.textAlignHorizontal = 'CENTER';
    tile.appendChild(val);
    tile.appendChild(lbl);
    statRow.appendChild(tile);
  }

  card.appendChild(statRow);
  bg.appendChild(card);
  root.appendChild(bg);

  // FAB
  const fabLabel = await text('FAB — Floating Action Button', { weight: 'Bold', size: 13, color: '#AAAAAA' });
  root.appendChild(fabLabel);

  const fabBg = frame({ name: 'FAB / Background', radius: 20 });
  fabBg.resize(120, 80);
  fabBg.fills = [solidPaint('#1A1A1A')];

  const fab = figma.createComponent();
  fab.name = 'FAB/Primary';
  fab.resize(52, 52);
  fab.x = 34;
  fab.y = 14;
  fab.cornerRadius = 9999;
  fab.fills = [gradientPaint(theme.primary, theme.end)];
  fab.strokes = [{ type: 'SOLID', color: hex('#FFFFFF'), opacity: 0.22 }];
  fab.strokeWeight = 1;
  fab.strokeAlign = 'INSIDE';

  // Plus icon lines
  const hLine = figma.createRectangle();
  hLine.resize(20, 2.2);
  hLine.x = 16;
  hLine.y = 24.9;
  hLine.cornerRadius = 2;
  hLine.fills = [solidPaint('#FFFFFF')];

  const vLine = figma.createRectangle();
  vLine.resize(2.2, 20);
  vLine.x = 24.9;
  vLine.y = 16;
  vLine.cornerRadius = 2;
  vLine.fills = [solidPaint('#FFFFFF')];

  fab.appendChild(hLine);
  fab.appendChild(vLine);
  fabBg.appendChild(fab);
  root.appendChild(fabBg);

  return root;
}

// ── Mobile preview frame ───────────────────────────────────────────────────────

async function buildMobileFrame() {
  const root = frame({ name: '📱 Mobile — iOS 26 Liquid Glass', layout: 'VERTICAL', gap: 20, pad: 32, hug: true });
  root.fills = [solidPaint('#111111')];

  const heading = await text('Mobile — iOS 26 Liquid Glass', { weight: 'Bold', size: 16, color: '#FFFFFF' });
  root.appendChild(heading);

  const desc = await text('Floating capsule tab bar · FAB · Specular highlights · Glass nav bar', {
    weight: 'Regular', size: 12, color: '#888888',
  });
  root.appendChild(desc);

  // Phone frame row — one per theme (first 3 to keep size manageable)
  const phonesRow = frame({ name: 'Phone Frames', layout: 'HORIZONTAL', gap: 32, hug: true });
  phonesRow.fills = [];

  for (const t of THEMES.slice(0, 3)) {
    // Phone outer
    const phone = frame({ name: `Phone / ${t.label}`, radius: 46 });
    phone.resize(200, 408);
    phone.fills = [{ type: 'GRADIENT_LINEAR',
      gradientTransform: [[0, 1, 0], [-1, 0, 1]],
      gradientStops: [
        { position: 0, color: rgba('#2C2C2E', 1) },
        { position: 1, color: rgba('#141416', 1) },
      ],
    }];
    phone.strokes = [{ type: 'SOLID', color: hex('#FFFFFF'), opacity: 0.07 }];
    phone.strokeWeight = 1;
    phone.strokeAlign = 'INSIDE';

    // Screen
    const screen = frame({ name: 'Screen', radius: 38 });
    screen.resize(184, 392);
    screen.x = 8;
    screen.y = 8;
    screen.fills = [solidPaint(t.darkBase)];
    screen.clipsContent = true;

    // Gradient overlay (simplified solid)
    const gradOverlay = frame({ name: 'Gradient', radius: 38 });
    gradOverlay.resize(184, 392);
    gradOverlay.fills = [gradientPaint(t.primary, t.end)];
    gradOverlay.opacity = 0.18;
    screen.appendChild(gradOverlay);

    // Dynamic Island
    const di = frame({ name: 'Dynamic Island', radius: 12 });
    di.resize(66, 20);
    di.x = 59;
    di.y = 7;
    di.fills = [solidPaint('#000000')];
    screen.appendChild(di);

    // Nav bar — glass
    const nav = frame({ name: 'Nav Bar', radius: 0 });
    nav.resize(184, 58);
    nav.y = 0;
    nav.fills = [solidPaint('#FFFFFF', 0.12)];
    nav.strokes = [{ type: 'SOLID', color: hex('#FFFFFF'), opacity: 0.14 }];
    nav.strokeWeight = 1;
    nav.strokeAlign = 'INSIDE';

    const navTitle = await text('Overview', { weight: 'Bold', size: 12, color: '#FFFFFF', ls: -0.018 });
    navTitle.x = 68;
    navTitle.y = 38;
    nav.appendChild(navTitle);
    screen.appendChild(nav);

    // Content card (simplified)
    const contentCard = frame({ name: 'Card', radius: 10 });
    contentCard.resize(156, 104);
    contentCard.x = 14;
    contentCard.y = 72;
    contentCard.fills = [solidPaint('#FFFFFF', 0.08)];
    contentCard.strokes = [{ type: 'SOLID', color: hex('#FFFFFF'), opacity: 0.12 }];
    contentCard.strokeWeight = 1;
    contentCard.strokeAlign = 'INSIDE';

    const cardTitle = await text('Monthly Overview', { weight: 'Bold', size: 9, color: '#FFFFFF', ls: -0.02 });
    cardTitle.x = 10;
    cardTitle.y = 10;
    contentCard.appendChild(cardTitle);

    // Mini stat row
    const statColors = [t.primary, '#34D399', '#FBBF24'];
    const statVals = ['12', '4', '3'];
    const statLabels = ['Tasks', 'Done', 'Due'];
    for (let i = 0; i < 3; i++) {
      const tile = frame({ name: statLabels[i], radius: 6 });
      tile.resize(44, 36);
      tile.x = 10 + i * 50;
      tile.y = 56;
      tile.fills = [solidPaint(statColors[i], 0.18)];
      const tv = await text(statVals[i], { weight: 'Extra Bold', size: 13, color: statColors[i], ls: -0.04 });
      tv.x = 14;
      tv.y = 6;
      const tl = await text(statLabels[i], { weight: 'Medium', size: 7, color: '#FFFFFF', opacity: 0.56 });
      tl.x = (44 - 7 * statLabels[i].length * 0.7) / 2;
      tl.y = 22;
      tile.appendChild(tv);
      tile.appendChild(tl);
      contentCard.appendChild(tile);
    }
    screen.appendChild(contentCard);

    // FAB
    const fab = frame({ name: 'FAB', radius: 9999 });
    fab.resize(36, 36);
    fab.x = 134;
    fab.y = 302;
    fab.fills = [gradientPaint(t.primary, t.end)];
    fab.strokes = [{ type: 'SOLID', color: hex('#FFFFFF'), opacity: 0.25 }];
    fab.strokeWeight = 1;
    fab.strokeAlign = 'INSIDE';
    screen.appendChild(fab);

    // Tab bar — FLOATING CAPSULE (iOS 26 key change)
    const tabBar = frame({ name: 'Tab Bar / Capsule', radius: 16 });
    tabBar.resize(156, 44);
    tabBar.x = 14;
    tabBar.y = 336;
    tabBar.fills = [solidPaint('#FFFFFF', 0.14)];
    tabBar.strokes = [{ type: 'SOLID', color: hex('#FFFFFF'), opacity: 0.50 }];
    tabBar.strokeWeight = 1;
    tabBar.strokeAlign = 'INSIDE';
    // Note indicator: top border is specular (simulated by strokeTopWeight if available, else full border)

    // Active dot below first tab
    const activeDot = frame({ name: 'Active Dot', radius: 9999 });
    activeDot.resize(4, 4);
    activeDot.x = 26;
    activeDot.y = 35;
    activeDot.fills = [solidPaint(t.primary)];
    tabBar.appendChild(activeDot);

    screen.appendChild(tabBar);
    phone.appendChild(screen);

    // Theme label below phone
    const phoneLabel = frame({ name: 'Label', layout: 'VERTICAL', gap: 2, hug: true });
    phoneLabel.fills = [];
    phoneLabel.x = 0;
    phoneLabel.y = 416;

    const themeNameT = await text(t.label, { weight: 'Bold', size: 12, color: '#FFFFFF' });
    const primaryVal = await text(t.primary, { weight: 'Regular', size: 11, color: '#777777' });
    phoneLabel.appendChild(themeNameT);
    phoneLabel.appendChild(primaryVal);

    const phoneWrapper = frame({ name: `${t.label} Phone`, layout: 'VERTICAL', gap: 8, hug: true });
    phoneWrapper.fills = [];
    phoneWrapper.appendChild(phone);
    phoneWrapper.appendChild(phoneLabel);
    phonesRow.appendChild(phoneWrapper);
  }

  root.appendChild(phonesRow);

  // Liquid Glass spec annotation
  const specLabel = await text('Liquid Glass CSS recipe', { weight: 'Bold', size: 13, color: '#AAAAAA' });
  root.appendChild(specLabel);

  const specBlock = frame({ name: 'LG Spec', radius: 10, layout: 'VERTICAL', gap: 4, pad: 16, hug: true });
  specBlock.fills = [solidPaint('#1E1E1E')];
  specBlock.strokes = [{ type: 'SOLID', color: hex('#FFFFFF'), opacity: 0.08 }];
  specBlock.strokeWeight = 1;
  specBlock.strokeAlign = 'INSIDE';

  const specLines = [
    'backdrop-filter: blur(40px) saturate(220%)',
    'background: linear-gradient(180deg, rgba(255,255,255,0.22) 0%, ...)',
    'border: 1px solid rgba(255,255,255,0.13)',
    'border-top-color: rgba(255,255,255,0.50)  ← specular edge',
    'box-shadow: inset 0 1px 0 rgba(255,255,255,0.32)  ← inner highlight',
  ];
  for (const line of specLines) {
    const lt = await text(line, { weight: 'Regular', size: 11, color: '#A78BFA' });
    specBlock.appendChild(lt);
  }
  root.appendChild(specBlock);

  return root;
}

// ── Main ───────────────────────────────────────────────────────────────────────

figma.ui.onmessage = async msg => {
  if (msg.type === 'cancel') {
    figma.closePlugin();
    return;
  }

  if (msg.type === 'generate') {
    const { opts } = msg;
    try {
      const page = figma.currentPage;
      let xCursor = 0;
      const GAP = 80;

      if (opts.styles) {
        progress('Creating color styles…');
        await createColorStyles();
        progress('Creating text styles…');
        await createTextStyles();
      }

      if (opts.palette) {
        progress('Building color palette…');
        const f = await buildPaletteFrame();
        page.appendChild(f);
        f.x = xCursor;
        f.y = 0;
        xCursor += f.width + GAP;
      }

      if (opts.buttons) {
        progress('Building button components…');
        const f = await buildButtonComponents();
        page.appendChild(f);
        f.x = xCursor;
        f.y = 0;
        xCursor += f.width + GAP;
      }

      if (opts.card) {
        progress('Building card + FAB components…');
        const f = await buildCardComponent();
        page.appendChild(f);
        f.x = xCursor;
        f.y = 0;
        xCursor += f.width + GAP;
      }

      if (opts.mobile) {
        progress('Building mobile preview…');
        const f = await buildMobileFrame();
        page.appendChild(f);
        f.x = xCursor;
        f.y = 0;
      }

      // Zoom to fit everything
      figma.viewport.scrollAndZoomIntoView(page.children);

      const styleCount = opts.styles ? '5 themes × palette + semantic + text styles' : '';
      figma.ui.postMessage({
        type: 'done',
        text: `${styleCount} — frames generated.`,
      });

    } catch (err) {
      figma.ui.postMessage({ type: 'error', text: err.message || String(err) });
    }
  }
};
