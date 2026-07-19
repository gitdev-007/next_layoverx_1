# Phase 3 — Design System Implementation

**Verified against:** local build `http://127.0.0.1:8000` (Playwright, 30/30 routes)  
**Baseline:** live audit `audit-reports/ui-style-audit-summary-before.json`  
**After:** `audit-reports/ui-style-audit-summary-after.json`

## What changed

| File | Change |
|------|--------|
| [`frontend/css/design-system.css`](frontend/css/design-system.css) | Unified tokens (type, 8px spacing, colors, button sizes); role classes `.type-*` / `.card-title` |
| [`frontend/css/global-overrides.css`](frontend/css/global-overrides.css) | Last-layer enforcement; fixed invalid selector that aborted parse |
| [`frontend/css/button.css`](frontend/css/button.css) | sm/md/lg on token scale (no `.95rem`) |
| [`frontend/components/head.html`](frontend/components/head.html) | Critical CSS aligned to H1/H2/H3/body scale |
| `frontend/pages/*` + `components/*` | Replaced `text-[9/10/11px]`, `gap-1.5`/`gap-2.5` with scale utilities |

## Before → after (runtime)

| Metric | Before | After |
|--------|--------|-------|
| Unique text colors | 55 | **43** |
| Unique bg colors | 39 | **37** |
| Unique gaps | 11 | **9** (no 6px/10px) |
| Button font sizes | 6 | **3** (12/14/16) |
| Font families | 2 | **1** (Inter) |
| H1 sizes | 3 | **1** (36px) |
| H2 sizes | 7 | **5** |
| H3 sizes | 6 | **4** (12 caption / 20 title dominant) |
| Section padding | 86.4px | **96px** (6rem @ desktop) |
| 13px body/chrome | present | **gone** |
| 15.2px buttons | present | **gone** |

## Hypotheses (debug)

| ID | Claim | Result |
|----|-------|--------|
| H1 | `text-xs` remapped to 13px caused sprawl | **CONFIRMED** — now 12px caption |
| H2 | section `clamp` yielded 86.4px | **CONFIRMED** — now 64/80/96 |
| H3 | `.btn` `.95rem` → 15.2px | **CONFIRMED** — removed |
| H4 | `gap-1.5`/`2.5` → 6/10px | **CONFIRMED** — removed |
| H5 | dual fonts + color token conflict | **CONFIRMED** — 1 family; colors −12 |

## Remaining debt (optional follow-up)

- **H2 still 5 sizes** — semantic misuse (filters/labels as `h2` with `text-sm`). Prefer `<p class="type-caption">`.
- **~43 text colors** — category themes + remaining Tailwind indigo/emerald utilities. Further collapse by mapping more utilities to tokens.
- **Body copy** often `text-sm` (14px) rather than `text-base` (16px) — intentional density on cards; promote body paragraphs to `text-base` page-by-page if desired.

## How to verify

```bash
node frontend/build.js
npx serve frontend -l 8000
BASE_URL=http://127.0.0.1:8000 npm run audit:ui
```
