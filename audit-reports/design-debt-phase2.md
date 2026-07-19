# Phase 2 — Design Discrepancy Analysis

**Source:** Live Playwright audit of `https://next-layoverx-1.vercel.app` (30/30 routes OK, viewport 1440×900)  
**Artifacts:** `audit-reports/ui-style-audit.json`, `audit-reports/ui-style-audit-summary.json`  
**Date:** 2026-07-19

---

## Executive verdict

The site already has a partial design system in [`frontend/css/design-system.css`](frontend/css/design-system.css) (CSS variables for colors, type, spacing), but **most UI is styled via ad-hoc Tailwind utility classes** that bypass those tokens. Live computed styles show:

| Area | Unique live values | Severity |
|------|-------------------|----------|
| Text colors | **55** | High |
| Background colors | **39** | High |
| `h2` font sizes | **7** | High |
| `h3` font sizes | **6** | High |
| `span` font sizes | **10** | High |
| Paragraph (`p`) sizes | **5** | Medium |
| Button font sizes | **6** | Medium |
| Button paddings | **5** (excl. zeroed) | Medium |
| Flex/grid gaps | **11** | Medium |
| Font families | **2** | Low |

---

## 1. Typography debt

### 1.1 Declared tokens vs live reality

| Token (design-system) | Declared | Live computed (dominant) | Gap |
|----------------------|----------|--------------------------|-----|
| `--font-size-h1` | `clamp(2.25rem…3.5rem)` (~36–56px) | Mostly **30px**; homepage **36px**; plan page **24px** | Tokens unused; utilities win |
| `--font-size-h2` | `clamp(1.75rem…2.5rem)` (~28–40px) | **18px** and **30px** nearly tied; also 13/14/16/20/24 | Semantic `h2` misused as card titles |
| `--font-size-h3` | `clamp(1.25rem…1.5rem)` (~20–24px) | Dominant **14px** (121×); also 13/16/18/20/24 | Card titles undersized vs token |
| `--font-size-body` | `1rem` (16px) | Dominant **14px**; then 13/12/16 | Body rarely at 16px |
| `--font-size-small` | `0.875rem` (14px) | Overlaps with body | No clear body/small split |
| `--font-size-xs` | `0.75rem` (12px) | Present + many `text-[10px]` / `text-[11px]` | Off-scale arbitrary sizes |

### 1.2 Heading size matrix (by page)

| Pattern | Pages | Problem |
|---------|-------|---------|
| Hero h1 = 36px | `/`, `/index.html`, `/hotels.html` | Inconsistent with 30px majority |
| Hero h1 = 30px | Most service/legal/account pages | De facto standard |
| Hero h1 = 24px | `/plan-my-layover.html` | Outlier — page feels “smaller” |
| Section h2 = 30px | Home, some hotels/how-it-works | Matches intent |
| Section h2 = 16px | Category listing heroes (spa, gaming, etc.) | Looks like label, not section title |
| h2 = 13–18px | help-center, profile, privacy, checkout | Semantic heading used for UI chrome |
| h3 mostly 14px | Almost all listing cards | 6 size variants for same role |

### 1.3 Body / UI chrome

- **Paragraphs:** 14px (143), 13px (66), 12px (37), 16px (27), 18px (1) — five sizes for “body copy.”
- **Spans:** 10 distinct sizes including non-grid **15.2px** (`.btn` uses `font-size: .95rem`).
- **Weights:** spans use 400/500/600/700/800/**900**; buttons mix 400–800; no enforced scale (medium/semibold/bold only).
- **Line-heights:** fractional px values (`18.85px`, `18.9px`, `21.7143px`, `24.32px`) from rem×ratio — not a deliberate type rhythm.

### 1.4 Font family

- Primary: Inter stack (good).
- Secondary leak: `ui-sans-serif, system-ui…` (11 samples) — Tailwind preflight / unscoped utilities not inheriting body font.

---

## 2. Color debt

### 2.1 Dual color systems fighting

1. **CSS variables** in `design-system.css`: `--primary #0ea5e9`, `--text #111827`, `--body-color #1f2937`, theme accents (gold/orange/violet/fuchsia/rose/slate).
2. **Tailwind v4 oklch palette** at runtime: many `oklch(...)` text/bg/border values that never appear in `:root` tokens.
3. **Raw `rgb()` leftovers:** `rgb(17,24,39)`, `rgb(30,41,59)`, `rgb(2,132,199)`, accent RGBs for themes.

Result: **55 text colors** and **39 backgrounds** — near-duplicates of the same gray/sky at different spaces (rgb vs oklch vs oklab).

### 2.2 Near-duplicate neutrals (should be 3–4 tokens)

| Role | Live examples (should collapse) |
|------|----------------------------------|
| Heading / ink | `rgb(17,24,39)`, `rgb(30,41,59)`, several dark oklch slate |
| Muted body | `oklch(0.707…)`, `oklch(0.446…)`, `rgb(71,85,105)`, `rgb(100,116,139)` |
| Soft muted | multiple oklch ~0.55–0.7 slate |
| On-dark white | `#fff`, `rgba(255,255,255,0.95)`, oklab white @ 0.7/0.8/0.9 |

### 2.3 Accent sprawl (partially intentional)

Category themes intentionally introduce gold / orange / violet / fuchsia / rose / slate. Audit confirms those as distinct text+bg. Debt is **not** killing themes — it is:

- Mixing theme CSS vars with Tailwind `sky-*` / `indigo-*` / `emerald-*` on the same page.
- Soft fills (`oklch` emerald/sky tints) not mapped to `--primary-light` / success tokens.
- Borders: 50+ border colors including translucent whites and near-identical slate lines.

### 2.4 Declared tokens unused or shadowed

`--text-muted (#374151)` vs live muted mostly Tailwind slate oklch.  
`--surface (#f8fafc)` vs multiple near-white oklch backgrounds (`0.985`, `0.984`, `0.967`…).

---

## 3. Spacing debt

### 3.1 Declared scale vs live gaps

Declared 4px-based scale: `--space-1…9` (4 → 64px).

**Live flex/grid gaps (11 values):**

| Gap | Count | On 4/8 grid? |
|-----|-------|--------------|
| 4px | 46 | Yes |
| 6px | 83 | **No** (`gap-1.5`) |
| 8px | 173 | Yes |
| 10px | 103 | **No** (`gap-2.5`) |
| 12px | 41 | Yes |
| 16px | 162 | Yes |
| 24px | 62 | Yes |
| 32px | 21 | Yes |
| 40px | 31 | Yes |
| 48px | 10 | Yes |

Off-grid **6px** and **10px** are high-frequency noise.

### 3.2 Section padding

| Value | Count | Notes |
|-------|-------|-------|
| `86.4px 0` | 49 | = `5.4rem` — **not** the declared `.section` 4/5/6rem scale |
| `0` | 35 | Sections without vertical rhythm |
| `32px 0 86.4px 0` | 1 | One-off hybrid |

Design system says `.section` → 4rem / 5rem / 6rem (64 / 80 / 96px). Live **86.4px** means pages use Tailwind `py-*` / custom classes instead of `.section`.

### 3.3 Containers

- Horizontal pad: `0 32px` (149) — aligns with `lg` container 2rem.
- Margin auto centering shows `0 120px` (149) — viewport-dependent; OK for max-width centering, not a token issue.

### 3.4 Buttons

| Padding | Count | Maps to |
|---------|-------|---------|
| `0` | 324 | Icon/link-styled buttons, reset |
| `10×20` | 30 | Off 8px grid (10px) |
| `8×16` | 24 | Good (space-2 / space-4) |
| `12×24` | 9 | Matches `.btn` intent |
| `12×32` | 4 | CTA variant |

Font sizes on buttons: **16 / 13 / 14 / 12 / 15 / 15.2** — six sizes; `.btn`’s `.95rem` (15.2px) is a one-off.

---

## 4. Semantic / structural debt

1. **Wrong heading levels for chrome** — `h2`/`h3` used for card titles, form section labels, help-center meta (13–18px), so the type scale cannot be enforced via element selectors alone.
2. **Arbitrary Tailwind** — widespread `text-[10px]`, `text-[11px]`, occasional `text-[15px]` / rem fractions; breaks any 4px type grid.
3. **Design tokens exist but are not the source of truth** — components prefer `text-sm`, `text-slate-*`, `bg-sky-700`, theme class overrides, and inline utilities.
4. **Two button systems** — `.btn` / `.btn-primary` in CSS vs Tailwind `px-4 py-2 bg-sky-700 rounded-xl` in header and pages.

---

## 5. Priority debt list (for Phase 3)

Ordered by visual impact × fix leverage:

1. **P0 — Typography roles**  
   Define and enforce: Display / H1 / H2 / H3 / Body / Small / Caption. Map every `h1–h3`, `p`, and UI label to one role. Kill `15.2px` and `text-[10px]` (use `text-xs` = 12px or caption token).

2. **P0 — Color tokens as source of truth**  
   Collapse neutrals to ~4 text + ~3 surface tokens. Keep category theme accents, but route all accents through `--primary*` / semantic success/warning/danger. Prefer CSS vars over raw Tailwind palette on branded chrome.

3. **P1 — Spacing on 8px grid**  
   Allow gaps: 4, 8, 12, 16, 24, 32, 40, 48. Ban `gap-1.5` / `gap-2.5` / `py` that yield 6/10px. Normalize section vertical padding to token (e.g. `--section-y: 5rem` desktop).

4. **P1 — Button component**  
   One primary / secondary / ghost / size (sm/md/lg) API. Standardize padding to 8×16 (sm), 12×24 (md), 12×32 (lg) and font to 14 or 16 only.

5. **P2 — Semantic HTML hygiene**  
   Card titles → `h3` with shared `.card-title` class; stop using `h2` for 14–16px labels.

6. **P2 — Font inheritance**  
   Ensure all utilities inherit `--font-primary`; eliminate `ui-sans-serif` leaks.

---

## 6. Proposed target scales (Phase 3 input)

### Typography (rem @ 16px root)

| Role | Size | Weight | Line-height |
|------|------|--------|-------------|
| Display / H1 | 2.25rem (36px) | 800 | 1.15 |
| H2 | 1.875rem (30px) | 800 | 1.25 |
| H3 | 1.25rem (20px) | 700 | 1.35 |
| Body | 1rem (16px) | 400 | 1.6 |
| Small | 0.875rem (14px) | 400/500 | 1.5 |
| Caption | 0.75rem (12px) | 500/700 | 1.4 |

### Spacing (8px grid)

`4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96`  
Section Y: mobile 64 · tablet 80 · desktop 96 (match existing `.section` media queries).

### Color (minimal core)

- `--text` / `--text-muted` / `--text-on-dark`
- `--surface` / `--surface-elevated` / `--border`
- `--primary` (+ dark/light) + per-theme overrides already in place
- `--success` / `--warning` / `--danger`

---

## 7. Evidence references

- Aggregated frequencies: `audit-reports/ui-style-audit-summary.json` → `summary.*`
- Per-route heading matrix: derived from `audit-reports/ui-style-audit.json` `pages[].styles.typography`
- Token declarations: `frontend/css/design-system.css` `:root` and `.section` / `.btn`
- Arbitrary size usage: `text-[10px]` / `text-[11px]` across built HTML pages

---

## Ready for Phase 3

Phase 3 should: extend tokens in `design-system.css` (and Tailwind theme map if present), replace arbitrary utilities with role classes / standard scale classes, unify `.btn` + Tailwind CTAs, then re-run `npm run audit:ui` and diff unique counts downward.
