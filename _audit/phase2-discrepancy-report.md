# Phase 2: Discrepancy Analysis — LayoverX Live Site

**Source:** `_audit/live-audit-report.json` + `_audit/live-audit-summary.json`
**Coverage:** 30 routes × 6 selectors (h1–h4, p, span, a, button, label) on https://next-layoverx-1.vercel.app
**Sample size:** ~5,500 typographic nodes · 669 distinct buttons · 30 page-level container extractions

---

## A. Typography

### A.1 — Body text
| Size | Count | Role |
|------|------:|------|
| **15px** | 2,398 | "small" UI chrome (the dominant size, ~52% of all typographic nodes) |
| **13px** | 1,522 | "caption" / labels (~33%) |
| **17px** | 837 | true body text (~18%) |
| 26px / 22px / 32px / 40px / 19px | 588 | mixed headings |

**Diagnosis:** The site is mostly rendered at 15px and 13px. The body paragraph size (17px) is only 18% of all text. The design system **declares** `--font-size-body: 1.0625rem` (17px) but the markup continues to apply `text-sm` (15px) and `text-xs` (13px) to body copy because the override in `global-overrides.css` only upgrades `p` tags, leaving the text in `div`/`span`/cards at 15px. **That is why long-form copy in cards, footers and callouts reads small.**

### A.2 — Headings
| Element | Distinct font-sizes observed |
|---------|------------------------------|
| h1 | **40px** (only) — consistent ✅ |
| h2 | 26px (118), **32px** (67), 17/15/13px (stragglers) |
| h3 | **22px** (only 50), 13/15/17/19px (most stragglers) |

**Diagnosis:** h1 is unified by the design system. h2 mostly lands on 32px (good) and 26px (acceptable, that's the `--text-2xl` tier). h3 is the worst — most "h3" elements are 13px or 15px, because the override only applies to `.text-lg/.xl/.2xl` and `main .card h3`. Naked `<h3 class="text-xs">` slips through. **Same fix: h3 should always be ≥ 1.375rem (22px) regardless of Tailwind class.**

### A.3 — Line-height
- 8 distinct values
- 18.85px is the dominant 13px line-height (tight) — bad for paragraphs, but harmless for labels
- 23.25px at 15px = 1.55 — OK for chrome
- 28.9px at 17px = 1.7 — body ✅
- Stragglers: 18.75px, 20.25px, 25.5px, 29.7px, 33.8px, 40px, 44.8px — these are 17/22/26/32/40px font-sizes with default 1.5 line-height rather than the 1.7/1.35 the design system declares.

**Diagnosis:** `global-overrides.css` overrides `p { line-height: 1.7 }` but `<div>`s with text content get the default 1.5. Same root cause as A.1.

### A.4 — Font-weight
- 6 distinct weights; spread looks healthy (400/500/600/700/800/900)
- `900` only 33 occurrences — those are rogue `font-black` utilities that should be `font-extrabold` (800) for visual consistency with the design system.

---

## B. Colors

### B.1 — Text colors
33 distinct values. Top 5:
| Value | Count | Role |
|-------|------:|------|
| `rgb(51, 65, 85)` (slate-700) | 3,364 | body text — dominant |
| `rgb(255, 255, 255)` | 890 | on dark |
| `rgb(15, 23, 42)` (slate-900) | 581 | heading |
| `rgb(203, 213, 225)` (slate-300) | 482 | on dark muted |
| `rgb(30, 41, 59)` (slate-800) | 480 | dark mode heading |

**Diagnosis:** Body and heading colors are unified. Stragglers:
- `rgb(3, 105, 161)` (sky-700, 206) — primary brand color is being used as text in 6% of text nodes. **Acceptable** but should be limited to CTAs and links only.
- `oklch(0.577 0.245 27.325)` (30) and `oklch(0.637 0.237 25.331)` (28) — Tailwind v3 oklch-based reds leaking through; should be collapsed to `--danger`.
- `oklab(0.999… / 0.7)` (22) — Tailwind gray-with-alpha; should be `--border` or `--text-muted`.

### B.2 — Background colors
43 distinct values. **This is the highest area of debt.**
- `oklch(0.985 0.002 247.839)` (slate-50, 260) — the **light surface**
- `oklch(0.984 0.003 247.858)` (slate-50 alt) (61) — **a second "slate-50"** from Tailwind v3 vs v4 base palette drift
- `oklch(0.967 0.003 264.542)` (gray-100) (51)
- `oklch(0.962 0.018 272.314)` (indigo-50) (34)
- `oklch(0.979 0.021 166.113)` (emerald-50) (34)
- `oklch(0.278 0.033 256.848)` (slate-800) (90)

**Diagnosis:** The site has 5–6 different "near-white" surfaces (`#f8fafc`, slate-50 oklch, slate-50 alt, gray-100, custom hex). Tailwind v3 + custom `--surface: #f8fafc` mix. Should collapse to **one** `--surface` token.

`rgba(0, 0, 0, 0.6)` (115) is the modal overlay — correct, but should be a token.

---

## C. Spacing

### C.1 — Padding
Top 7 distinct paddings observed on 392 sampled elements:

| Value | Count | Comment |
|-------|------:|---------|
| `0px 32px` | 149 | the dominant horizontal-only padding → should be `px-8` (32px) on a 4-px grid ✅ |
| `16px` | 115 | uniform 1rem |
| `28px` | 53 | **off-grid** (1.75rem) — should be 24 or 32 |
| `104px 0px` | 43 | hero vertical — design-system token `--section-y-lg` ✅ |
| `12px` | 28 | `p-3` |
| `16px 20px` | 3 | **off-grid** — should be `p-4` (16) or `p-5` (20) but not mixed |
| `32px 0px 104px` | 1 | hero override — fine, single use |

**Diagnosis:** The major issue is the **`28px` (1.75rem)** value — 53 occurrences is a sign of "we needed 24 + 4" choices that should snap to 24 or 32.

### C.2 — Gap (flex/grid)
10 distinct values. Top:
- 8 / 16 / 20 / 12 / 24 / 4 / 36 / 40 / 28 / 48

`20px` (115), `28px` (20), `36px` (31), `40px` (31) — **all off the 8-px grid**. The 8-px grid allows 8, 16, 24, 32, 40, 48, 64. The 20/28/36 are Tailwind's "comfortable" utilities (`gap-5`, `gap-7`, `gap-9`) that **don't snap to 8px**.

### C.3 — Section vertical rhythm
The site uses `--section-y-sm/md/lg` (72/88/104). 100% of `.section` elements land on this rhythm ✅.

---

## D. Buttons & Interactive Surfaces

### D.1 — Border radius
5 distinct radii:
- `12px` (312) — the dominant "card" radius ✅ (this is `--radius-2`)
- `14px` (131) — **the odd one out**: this is the `.btn` radius (`0.875rem`). Should be 12px or 16px.
- `16px` (37) — used on `.btn-lg` and some large cards
- `9999px` (8) — pill buttons ✅
- `3.35544e7px` (2) — Tailwind's `rounded-full` parsed numerically

**Diagnosis:** Only **5** distinct radii across the whole site is actually a *strength*. The 12/14/16/9999 hierarchy is fine; the inconsistency is that `.btn` rounds to 14 while cards round to 12.

### D.2 — Button heights
14 distinct heights. The design system says `.btn` should be 48px and `.btn-sm` should be 40px. Observed:
- `18.84px` (60) — **way too small** — these are naked `<button>` or link-buttons
- `38.84px` (28) — close to 40 but 0.16 short
- `43.5px` (21) — `py-3 px-6` Tailwind class, doesn't snap
- `45.5px` (6) — another off-grid value
- `53.5px` (4) — oversized
- `48px` (5) — the correct token ✅
- `auto` (524) — `height: auto` (default); actual height depends on padding+line-height

**Diagnosis:** 14 button heights is a lot of debt. The two main offenders are:
1. **Link-style `<a>` "buttons"** (e.g., the navbar `Sign Up`) which inherit the 18.84px height because they have no min-height
2. **Tailwind utilities like `py-3 px-6` that don't snap to the 8-px grid** (43.5px, 45.5px, etc.)

### D.3 — Button padding
5 distinct paddings. `0px` (485) is the default for unstyled links. Real padding values are:
- `14px 28px` (122) — off-grid 14/28
- `10px 18px` (28) — off-grid
- `8px 24px` (28) — close to `py-2 px-6`
- `8px 16px` (6) — `py-2 px-4` ✅

---

## E. Container / Layout

- 137/141 containers correctly set to `max-width: 1280px` (the `.container` token) ✅
- 4 had `max-width: none` — these are likely ad-hoc `<div class="container">` overrides

---

## F. Summary of Design Debt

| # | Issue | Severity | Root cause |
|---|-------|----------|------------|
| 1 | Body text inside `div/span/li/td` still renders at 15/13px instead of 17px | 🔴 HIGH | `global-overrides.css` only upgrades `p` tags |
| 2 | 43 distinct background colors (5 near-white variants) | 🔴 HIGH | Tailwind v3 + custom `--surface` not collapsed |
| 3 | 33 distinct text colors (oklch/oklab tailwind palette drift) | 🟡 MED | Tailwind v3 color opacity syntax leaks through |
| 4 | `<h3 class="text-xs/text-sm">` renders at 13–15px instead of 22px | 🟡 MED | Override only matches `.text-lg/.xl/.2xl` |
| 5 | 53 elements padded at 28px (off 8-px grid) | 🟡 MED | Tailwind `p-7`, `gap-7` utilities |
| 6 | 14 distinct button heights; 18.84px link-buttons | 🟡 MED | No min-height on link-styled CTAs |
| 7 | `.btn` 14px radius vs `.card` 12px radius | 🟢 LOW | Cosmetic — pick one |
| 8 | 4 containers with `max-width: none` | 🟢 LOW | One-off overrides |

---

## Phase 3 — Implementation Plan

1. **Add new tokens to `design-system.css`** to collapse backgrounds and link-buttons:
   - `--surface-2`, `--surface-3` to absorb the gray-100/gray-50/indigo-50/emerald-50 palette
   - `--btn-height-md: 3rem`, `--btn-height-sm: 2.5rem`, `--btn-height-lg: 3.25rem`
   - `--btn-radius: 0.75rem` (collapse 12/14/16 → 12)
   - `--grid: 8px` document spacing intent

2. **Tighten `global-overrides.css`** to fix #1 and #4:
   - Promote `div/span/li/td` body-copy to 17px when not explicitly labeled
   - Force every `h3` (regardless of Tailwind class) to ≥ 1.375rem
   - Force every `h2` to 32px (not 26)
   - Snap `.gap-5/.gap-7/.gap-9` to 8-px grid

3. **Add link-button min-height** to fix #6:
   - `#navbar a[href*=".html"]`, `a.btn`, `a[class*="px-"]` get `min-height: 2.75rem`

4. **Rebuild + re-audit** to verify distinct-tokens counts drop:
   - 8 → 5 font sizes
   - 12 → 5 line heights
   - 33 → 10 text colors
   - 43 → 12 background colors
   - 13 → 5 button heights
