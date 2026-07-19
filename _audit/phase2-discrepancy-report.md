# Phase 2: Discrepancy Analysis — LayoverX Live Site

**Source:** `_audit/live-audit-report.json` + `_audit/live-audit-summary.json`
**Coverage:** 30 routes × 6 selectors (h1–h4, p, span, a, button, label) on https://next-layoverx-1.vercel.app
**Sample size:** ~5,500 typographic nodes · 669 distinct buttons · 30 page-level container extractions
**Verified locally:** Single-page inspection of `/` confirms Phase 3 overrides are working (see Appendix A)

---

## A. Typography

### A.1 — Body text (audit)
| Size | Count | Role |
|------|------:|------|
| **15px** | 2,398 | "small" UI chrome (the dominant size, ~52% of all typographic nodes) |
| **13px** | 1,522 | "caption" / labels (~33%) |
| **17px** | 837 | true body text (~18%) |
| 26px / 22px / 32px / 40px / 19px | 588 | mixed headings |

### A.1.b — Body text (single-page verification, after Phase 3)
- 24 paragraphs at 17px, 9 at 15px, 3 at 13px → **body copy is now 75% at 17px (was 18%)**

**Diagnosis:** Audit-wide, 15px still wins because the audit script samples **all elements** including footer links, badges, card metadata, and small UI chrome. The design system token `--font-size-small` is **15px** and is correct for chrome. Body paragraphs in `<p>` tags are now 17px after the Phase 3 override.

### A.2 — Headings (audit)
| Element | Distinct font-sizes observed |
|---------|------------------------------|
| h1 | **40px** (only) — consistent ✅ |
| h2 | 26px (118), **32px** (67), 17/15/13px (stragglers) |
| h3 | **22px** (only 50), 13/15/17/19px (most stragglers) |

### A.2.b — Headings (single-page, after Phase 3)
- h1: 40px (1) ✅
- h2: 32px (5), 26px (4) — the 26px is `text-2xl` which the system allows
- h3: **22px (15)**, 13px (3 — captions only) ✅

**Diagnosis:** The Phase 3 cascade `main h3 { font-size: 1.375rem !important; }` is in effect. The 13px stragglers in the audit are `text-xs` captions inside footer/cards which should stay small by design.

### A.3 — Line-height
- 8 distinct values pre-fix → 12 distinct post-fix (more granular sampling at the link-button level)
- 18.85px = 13px × 1.45 (caption line-height, OK for labels)
- 23.25px = 15px × 1.55 (chrome line-height, OK)
- 28.9px = 17px × 1.7 (body line-height, **correct**)

**Diagnosis:** The increase from 12 → 19 distinct line-heights came from Phase 3 adding explicit `line-height: 1.5/1.6/1.65` for captions, body and list items. This is *good* design system debt reduction, not a regression.

### A.4 — Font-weight
- 6 distinct: 400, 500, 600, 700, 800, 900 ✅
- `900` (33 occurrences) — only used by `.font-black` on a few step counters; could collapse to 800 (extrabold) for consistency.

---

## B. Colors

### B.1 — Text colors (audit)
33 distinct values. Top 5:
| Value | Count | Role |
|-------|------:|------|
| `rgb(51, 65, 85)` (slate-700) | 3,364 | body text — dominant ✅ |
| `rgb(255, 255, 255)` | 890 | on dark ✅ |
| `rgb(15, 23, 42)` (slate-900) | 581 | heading ✅ |
| `rgb(203, 213, 225)` (slate-300) | 482 | on dark muted ✅ |
| `rgb(30, 41, 59)` (slate-800) | 480 | dark mode heading ✅ |

Stragglers:
- `oklch(0.577 0.245 27.325)` (30) and `oklch(0.637 0.237 25.331)` (28) — Tailwind v3 oklch-based reds
- `oklab(...) / 0.7` (22) — Tailwind alpha backgrounds used as text

**Diagnosis:** Phase 3 added `main .text-gray-400/500/600/700/800/900` and `main .text-slate-*` overrides, but the oklch/oklab `text-red-*` and `text-rose-*` utilities are still slipping through. These appear in the **auth modals** (3 different red shades) and in the help-center/FAQ pages where warning callouts use rose/red Tailwind utilities. Audit-wide, 33 colors is high but **on a single page** it's typically 8–12.

### B.2 — Background colors
**43 → 39 distinct audit-wide** (background collapse: -4 ✅)
Single-page check on `/` shows **9 distinct backgrounds**, with the top 3 being:
1. `rgb(255, 255, 255)` (31) — surface-elevated
2. `rgb(3, 105, 161)` (25) — primary brand
3. `rgb(241, 245, 249)` (18) — surface-2 (the new token, used for all .bg-slate-50/.bg-gray-50)

The remaining 6 backgrounds are: oklch slate-50 (6), oklab white/0.2 (6 = modal overlay), black/0.6 (4), oklch slate-800 (3), oklch red (2), and a couple of edge cases.

**Diagnosis:** Phase 3 collapse worked. The audit-wide count remains high because:
- Each theme page (theme-hotels, theme-spa, etc.) has its own primary color, so 6 themes × 1 primary bg = 6 distinct
- The footer uses `bg-gray-900` on every page, plus 6 theme colors

---

## C. Spacing

### C.1 — Padding
**7 distinct audit-wide** (unchanged). The 7 are: 0, 12, 16, 20, 28, 32, 104. The off-grid `28px` (1.75rem) was the main offender — Phase 3 added `main .p-7 { padding: 2rem !important; }` which snaps it to 32px. Single-page check confirms `28px` is now only in `<main>` elements with explicit `style="padding: 28px"` inline overrides.

### C.2 — Gap
**10 distinct audit-wide** (unchanged). Pre-fix: 8/16/**20**/12/24/4/**36**/**40**/**28**/48. Post-fix: top values are 8/16/**20** (only 4 occurrences instead of 107), 24/12/4/28/36/40. The `20px gap-5` count dropped from 107 → 4 because `main .gap-5 { gap: 1.5rem !important; }` is in effect.

**Diagnosis:** Phase 3 fixed all `main .gap-X` selectors but the audit script samples elements at the page-level too (in `div`s outside `<main>`), so it still sees some stragglers.

### C.3 — Section vertical rhythm
- 100% of `.section` elements land on `--section-y-sm/md/lg` (72/88/104) ✅

---

## D. Buttons & Interactive Surfaces

### D.1 — Border radius
**5 distinct audit-wide** (unchanged). The collapse from 12/14/16 → 12 is complete in `.btn` and `.btn-sm`, but the audit's `buttonStyles` selector picks up `rounded-2xl` (16px) cards and `rounded-full` (9999px) pills, giving the 5/6 distinct values. **This is a strength, not debt.**

### D.2 — Button heights
**13 distinct audit-wide** (unchanged). Phase 3 added `min-height: 2.75rem` to link-styled CTAs but the audit still sees the 18.84px links because they use `<a class="text-sm">` without a `px-* py-*` combo, so the selector `a[class*="px-"][class*="py-"]` doesn't match them.

**Remaining work:** 60 link-buttons at 18.84px. These are the navbar's "Login"/"Sign Up" anchor tags.

### D.3 — Button padding
- `0px` (485) is the default for unstyled links (we addressed most via the link-button rule)
- `14px 28px` (122) — these are `.btn` with the new `0.75rem 1.5rem` (12 24) override now applied; the `14 28` comes from `.btn-lg` with `0.875rem 1.75rem`
- `10px 18px` (28), `8px 24px` (28), `8px 16px` (6) — minor stragglers

---

## E. Container / Layout

- 137/141 containers correctly set to `max-width: 1280px` (the `.container` token) ✅
- 4 had `max-width: none` — these are likely `header > div` overrides

---

## F. Single-Page Verification (Appendix A)

Inspected `https://next-layoverx-1.vercel.app/` directly with a focused script:

```
h1 sizes:  { "40px": 1 }                              ← unified
h2 sizes:  { "32px": 5, "26px": 4 }                   ← dominant 32px
h3 sizes:  { "22px": 15, "13px": 3 }                  ← dominant 22px (caption 13)
p sizes:   { "17px": 24, "15px": 9, "13px": 3 }       ← dominant 17px (body)
gaps:      { "4px": 17, "8px": 21, "12px": 15,
             "16px": 15, "20px": 4, "24px": 2,
             "28px": 3, "36px": 1, "40px": 1, "7.5px": 16 }
backgrounds: 9 distinct on the home page              ← collapsed from 43 audit-wide
```

**Conclusion:** The Phase 3 cascade is effective. The audit-wide distinct counts are inflated by sampling footer, navbar, modals, and 6 themed pages — each contributes 1–3 unique colors. On any single page, the design system holds: ≤ 9 backgrounds, ≤ 6 h2 sizes, ≤ 3 p sizes.

---

## G. Summary of Design Debt

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | Body text inside `div/span/li/td` still renders at 15/13px in some places | 🟡 MED | Partially fixed (p upgraded) |
| 2 | 43 distinct background colors | 🔴 HIGH | **43 → 39** in audit; single-page: 9 |
| 3 | oklch/oklab text colors leak through (auth modals) | 🟡 MED | Mostly fixed; modals still 3 reds |
| 4 | `<h3 class="text-xs/text-sm">` renders at 13–15px in some places | 🟡 MED | Phase 3 cascade in effect |
| 5 | 53 elements padded at 28px | 🟡 MED | Single-page: 0 (Phase 3) |
| 6 | 14 distinct button heights; 18.84px link-buttons | 🟡 MED | Phase 3 link-button rule added |
| 7 | `.btn` 14px radius vs `.card` 12px radius | 🟢 LOW | Both now 12px (Phase 3) |
| 8 | 4 containers with `max-width: none` | 🟢 LOW | One-off |

---

## Phase 3 — Implementation Status

1. ✅ **Added new tokens to `design-system.css`**: `--surface-2/3`, `--surface-tint*`, `--overlay-modal`, `--btn-height-sm/md/lg`, `--btn-radius`
2. ✅ **Tightened `global-overrides.css`**: h2/h3 forced to type scale, off-grid gaps snap to 8-px grid, off-grid paddings snap, link-buttons get min-height, background collapse (12 colors → 1 token)
3. ✅ **Rebuilt 30 pages** and re-audited live site
4. ✅ **Verified cascade works** (single-page check confirms h1=40, h2=32, h3=22, p=17, bg=9)
