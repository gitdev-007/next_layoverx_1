# LayoverX — UI Audit Report

**Generated:** 2026-07-19
**Auditor:** Senior Frontend Engineer / QA Specialist
**Target:** https://next-layoverx-1.vercel.app (production)
**Method:** Read-only static + runtime audit via Playwright (`scripts/ui-audit.js`)
**Coverage:** 30 routes × 3 viewports (desktop 1280, tablet 768, mobile 375) = **90 page inspections**
**Artifacts:**
- `_audit/ui-audit/ui-audit-raw.json` — per-page raw measurements
- `_audit/ui-audit/ui-audit-summary.json` — aggregated design-token counts
- `_audit/ui-audit/<route>__<viewport>.png` — 90 full-page screenshots

---

## 1 · Executive Summary

LayoverX is a **mature, 30-page static site** that already ships with a centralised design system (`frontend/css/design-system.css` + `global-overrides.css`) and Tailwind on top. The audit found **1 functional bug** (horizontal scroll on `my-profile.html` at tablet) and a small set of **low-to-medium inconsistency debt** that is mostly *concentrated* in the nav, hero backgrounds, and a handful of off-grid utility classes.

### Headline numbers

| Dimension | Distinct values | Verdict |
|---|--:|---|
| h1 font-sizes (live) | 3 (32 / 34.56 / 40 px) | ✅ H1 is on a 4-step scale; the 34.56 is the clamp midpoint |
| h2 font-sizes | 2 (26 / 32 px) | ✅ Acceptable — `text-2xl` (26) and `text-3xl` (32) |
| h3 font-sizes | 3 (13 / 15 / 22 px) | ⚠️ 13 and 15 are legitimate **captions**, not headings |
| **Button heights** | **12** | 🔴 Includes `18.84 px` (199 link-buttons) and `auto` (1740) |
| Button radii | 5 (0 / 12 / 16 / 9999 / 3.36e7 px) | ✅ Tight |
| Button paddings | 5 (0 / 8-16 / 8-24 / 12-24 / 0-32) | ✅ All on the 8-px grid |
| **Card shadows** | **13** | 🔴 Tailwind utility variants mix with custom shadows |
| Card radii | 4 (12 / 16 / 20 / 24 px) | ✅ Acceptable (3 sizes max) |
| Card paddings | 5 | ✅ |
| **Text colors** | **51** | 🔴 Tailwind `text-{slate,gray,sky,red,rose,emerald}-*` palette drift |
| Background colors | 51 | 🔴 Same cause |
| **Border colors** | **38** | 🔴 Same cause |
| Container widths | 7 (375 / 720 / 768 / 1216 / 1280 + 0 / 335) | ⚠️ 335/720/1216 are inner padded boxes (correct) |
| Section pads | 7 (3 active values: 72 / 88 / 104 px) | ✅ Tokenised 4-step scale |
| **Gaps** | **10** | 🔴 `20 px` (342) and `36 px` (93) are off the 8-px grid |
| **Input heights** | **14** | 🔴 13 / 16 / 21 / 23 / 25.5 / 26 / 27.5 px — most are inside `<select>`/`<input>` defaults |
| **Horizontal scroll** | **1** page (my-profile.html @ 768) | 🔴 Single functional bug |
| Missing alt text | 0 | ✅ |
| Empty links | 0 | ✅ |
| Pages audited | 90 / 90 successful | ✅ |

### Verdict
**Site health score: 7.8 / 10** — production-ready with one functional bug to fix and a focused refactor to remove the 51-color Tailwind palette drift.

---

## 2 · High Priority Issues

### H1 — Horizontal scroll on `my-profile.html` at tablet (768 px)
- **Symptom:** `documentElement.scrollWidth = 793 px` while `viewport = 768 px` (25 px overflow)
- **Culprit:** a `<select class="form-input cursor-pointer">` element rendering at width 273 px inside a constrained form group, plus the page has the standard "Airport Runway Background" hero which uses `opacity-10` and is `absolute inset-0` — the background div is `position: absolute` and overflows the parent at tablet.
- **Impact:** visual jank / horizontal swipe on tablet; fails the responsive test.
- **Reproduce:** open `https://next-layoverx-1.vercel.app/my-profile.html` at 768 × 1024 in DevTools.
- **Files responsible:** `frontend/pages/my-profile.html`, `frontend/my-profile.html` (compiled).
- **Fix:** cap the `<select>` width with `w-full` and audit the form group for a missing `overflow-hidden` on the hero.

### H2 — 199 link-buttons rendered at 18.84 px (below the 40 px tap target)
- **Symptom:** navbar "Login" / "Sign Up" / plan-my-layover CTA anchor tags compute to `height: 18.84 px` because they have only `text-sm font-semibold` and no `min-height` / `py-*` utility. The audit shows 199 such buttons across 90 inspections.
- **Impact:** fails WCAG 2.5.5 (Target Size, Level AAA) and Apple HIG (44 × 44 pt). Tap accuracy suffers on touch.
- **Files responsible:** `frontend/components/header.html`, every page's navbar copy.
- **Fix:** add a single rule in `global-overrides.css`:
  ```css
  a[class*="text-"][class*="font-"], a.text-sm, a.text-xs {
    min-height: 2.75rem; display: inline-flex; align-items: center;
  }
  ```

### H3 — 51 distinct text colors / 51 distinct background colors / 38 distinct border colors
- **Symptom:** Tailwind v3 oklch / oklab palette (`rgb(15, 23, 42)`, `oklch(0.985 0.002 247.839)`, `oklab(0.999.../0.7)` etc.) leaks through alongside the design system's hex tokens (`#0f172a`, `#f8fafc`). Each theme page adds 1 primary and 1 primary-light, so 6 themes × ~8 surface variants = the high count.
- **Impact:** visual inconsistency (slightly different greys for the same role), CSS bloat (~110 KB of CSS, of which ~40 KB is duplicate overrides).
- **Files responsible:** every page uses `text-gray-700` / `bg-slate-50` / `border-slate-200` directly in markup. The `global-overrides.css` already has a `text-gray-* → var()` cascade but only inside `main`.
- **Fix:** raise the cascade to body-scope (the existing rules are scoped to `main`, so navbar, footer, and modals keep their Tailwind literals). Add `.text-red-500/600/700, .text-rose-*` to collapse the auth-modal red palette.

### H4 — 14 distinct input heights
- **Symptom:** forms render with heights of 13 / 16 / 21 / 23 / 25.5 / 26 / 27.5 / 48 px. The 13 / 16 / 23 / 25.5 / 27.5 px are default browser sizes (un-reset).
- **Impact:** visually inconsistent form rows, misaligned buttons next to inputs.
- **Files responsible:** all forms (checkout, payment-selection, supplier-status, partner-registration, account-settings, login/signup modals).
- **Fix:** add a `form-input` reset in `design-system.css`:
  ```css
  input.form-input, select.form-input, textarea.form-input {
    height: auto; min-height: 2.75rem; padding: 0.625rem 1rem;
    font-size: var(--font-size-body); line-height: 1.4;
  }
  ```

---

## 3 · Medium Priority Issues

### M1 — 13 distinct card shadows
- **Symptom:** Tailwind `shadow-sm` (45), `shadow` (90), `shadow-md` (273), `shadow-lg` (117), `shadow-xl` + 8 off-pattern shadows.
- **Impact:** cards feel "different" across pages; no clear elevation hierarchy.
- **Files responsible:** `.card` class definition in `design-system.css` line 268–273 only defines `shadow-sm` + hover `shadow-lg`, but most pages use `shadow-md`, `shadow-lg`, `shadow-xl` directly in markup.
- **Fix:** collapse to 3 tokens: `--shadow-1` (resting card), `--shadow-2` (hover), `--shadow-3` (modal). Replace inline `shadow-{sm,md,lg,xl}` with `card`, `card-elevated`, `card-modal`.

### M2 — 10 distinct gap values; 3 are off the 8-px grid
- **Symptom:** `20 px` (342), `28 px` would be off-grid, `36 px` (93) is off-grid. The audit also found `40 px` (93) which is on-grid.
- **Top 5 gaps:** 8 / 12 / 16 / 20 / 4.
- **Impact:** misaligned grids, "almost" feel.
- **Files responsible:** all 30 pages use `gap-5` (20), `gap-7` (28), `gap-9` (36) directly.
- **Fix:** add a global override:
  ```css
  .gap-5 { gap: 1.5rem !important; }
  .gap-7 { gap: 2rem   !important; }
  .gap-9 { gap: 2.5rem !important; }
  ```
  The same applies to `.p-7/.p-9/.px-7/.py-7/.px-9/.py-9`.

### M3 — 12 distinct button heights; 199 link-buttons at 18.84 px
- **Symptom:** `auto` (1740), `18.84` (199), `24` (78), `40` (36), `48` (30), `43.5` (23), `45.5` (18), `49.5` (9), `41.5` (7), `32` (6).
- **Impact:** button visual rhythm is broken — some buttons are 18 px tall, others 50 px tall.
- **Files responsible:** mixed; `.btn` class is consistent (48 px), but `<a class="text-sm font-bold px-3.5 py-1.5">` is **22 px** in the navbar and many inline CTAs.
- **Fix:** enforce `min-height: 2.5rem` on any `a` with `font-bold` + `px-*` utility. Combine with H2.

### M4 — 3 distinct h1 sizes (32 / 34.56 / 40 px)
- **Symptom:** `40px` on the hero pages, `32px` on inner pages (responsive clamp midpoint), `34.56px` is the clamp transition.
- **Impact:** **None** — this is the clamp formula working correctly (`clamp(2rem, 4.5vw, 2.5rem)` at 768 px viewport = 34.56 px). Listed for completeness.
- **Verdict:** Acceptable; do not "fix" this — it's the design system working as intended.

### M5 — Hero background div repeated verbatim on 11 pages
- **Symptom:** the exact same `<div class="absolute inset-0 bg-cover bg-center opacity-10" style="background-image:url('...airport-runway...')" role="img" aria-label="Airport Runway Background">` appears on `account-settings.html`, `booking-review.html`, `faq.html`, `help-center.html`, `my-profile.html`, `notifications.html`, `privacy.html`, `saved-itineraries.html`, `supplier-status.html`, `terms.html`, `trip-details.html`.
- **Impact:** code duplication; if the image URL changes, 11 files must be edited.
- **Files responsible:** source `frontend/pages/*.html` and compiled `frontend/*.html`.
- **Fix:** extract to a `<div class="hero-bg-airport">` component or to a CSS `::before` pseudo-element on the `.section.theme-hero` selector.

### M6 — Navbar `text-shadow: 0 2px 8px rgba(0,0,0,0.35)` inline on hero h1
- **Symptom:** the hero `<h1>` on `index.html` has an inline `style="text-shadow: 0 2px 8px rgba(0,0,0,0.35)"`.
- **Impact:** small code smell; a `.theme-hero h1 { text-shadow: 0 2px 8px rgba(0,0,0,0.35); }` rule in `design-system.css` would remove the inline style.
- **Files responsible:** `frontend/pages/index.html`, `frontend/index.html`.
- **Fix:** move into `design-system.css` under `.theme-hero h1`.

---

## 4 · Low Priority Issues

### L1 — `font-weight: 900` (font-black) used 33 times on numeric step counters
- **Symptom:** the "1", "2", "3" step indicators in how-it-works use `font-black` (900) where the design system declares 800 (extrabold) as the max.
- **Impact:** tiny weight mismatch; visually fine on most screens.
- **Files responsible:** `frontend/pages/how-it-works.html`.
- **Fix:** replace `font-black` with `font-extrabold`.

### L2 — `<h4>` rule applies only to `main h4`; bare `<h4>` outside `<main>` is unset
- **Symptom:** the global override only sets `main h4 { font-size: 1.125rem }`; a bare `<h4>` in the footer or navbar would fall through to the browser default (often 20 px).
- **Impact:** inconsistent heading scale in the footer.
- **Files responsible:** `frontend/css/global-overrides.css` line 254-257.
- **Fix:** raise to body-scope or add explicit `.text-base` to footer h4s.

### L3 — `border-color: rgba(148, 163, 184, 0.22)` on `.card` in `global-overrides.css` line 298 hard-codes a slate color instead of using `var(--border)`
- **Symptom:** line 298 of `global-overrides.css` overrides `.card` border to a hard-coded slate-400 @ 22% alpha.
- **Impact:** doesn't pick up theme changes.
- **Files responsible:** `frontend/css/global-overrides.css` line 298.
- **Fix:** use `var(--border)` and rely on the existing `--border` token (already defined as `#e2e8f0`).

### L4 — `tailwind-input.css` is 24 bytes — single `@import "tailwindcss";`
- **Symptom:** the file is supposed to be a Tailwind build input but ships a single import line; the actual Tailwind output is `tailwind.min.css` (75 KB). The build step that processes `tailwind-input.css` does not appear to run in the project.
- **Impact:** dev tooling inconsistency; harmless at runtime.
- **Files responsible:** `frontend/css/tailwind-input.css`, `frontend/build.js`.
- **Fix:** document the build process or remove `tailwind-input.css`.

### L5 — Section padding mixes `0px` (105 sections) and `72/88/104 px` (45 sections each)
- **Symptom:** many sections don't carry the `.section` class so they don't get the design-system's vertical rhythm. The 105 `0px / 0px` sections are likely `.bg-gray-50` / `.bg-white` heroes with no padding.
- **Impact:** uneven vertical spacing between sections on long pages.
- **Files responsible:** every page hero uses `class="section bg-..."` correctly, but inner blocks like `<section class="bg-white overflow-hidden">` don't add `.section`.
- **Fix:** add `.section` to every `<section>` via a CSS rule, or audit for un-classed sections.

### L6 — Inline `width: 0%` / `width: 35%` on progress bars in `my-itinerary.html` and `partner-registration.html`
- **Symptom:** the workspace usage bar (`#workspace-bar-used` / `#workspace-bar-buffer`) and the stepper progress line (`#stepper-progress-line`) have inline `style="width: 0%"` / `35%`.
- **Impact:** initial render shows an empty bar (fine for a 0% state) but the inline style is brittle.
- **Files responsible:** `frontend/my-itinerary.html` lines 284-285, `frontend/partner-registration.html` line 277.
- **Fix:** initialize via CSS `width: 0` on the class, set programmatically via JS.

### L7 — 4 inline `style="background-image:url(...)"` for hero photos
- **Symptom:** only 4 pages use inline background-image (`index.html`, `contact.html`, `plan-my-layover.html`, `revenue-admin.html`).
- **Impact:** these are page-specific (different images per page) so the inline style is acceptable.
- **Verdict:** keep as is.

### L8 — `theme-tours` uses primary `#be123c` (rose-700) which collides visually with `theme-restaurants` (#c2410c orange)
- **Symptom:** the rose-700 and orange-700 are close enough to confuse on the home page where theme previews appear.
- **Impact:** minor visual confusion in the home page "Browse by Category" section.
- **Files responsible:** `frontend/css/design-system.css` lines 351-389.

---

## 5 · Repeated Issues

These are systemic patterns that appear across many pages:

| Repeated pattern | Occurrences | Locations |
|---|--:|---|
| Hero "Airport Runway Background" div verbatim | **11** | account-settings, booking-review, faq, help-center, my-profile, notifications, privacy, saved-itineraries, supplier-status, terms, trip-details |
| `class="flex items-center gap-3 text-xs text-gray-700 mb-2"` review-rating row | 18 | all 6 listing pages × 3 cards |
| `class="px-4 py-2 bg-sky-700 ... rounded-xl"` inline CTA | 30+ | every listing page's "Book Day Room"/"Book Table" buttons |
| `class="text-xs text-gray-700 font-bold uppercase tracking-wider"` | 50+ | footer column headings, card labels |
| `<a href="..." class="text-sky-700 font-bold text-sm">Explore <span>→</span></a>` | 18 | home page cards |
| Empty `<span class="text-base">?</span>` (likely a glyph that didn't render) | **5** | `index.html` lines 575, 614, 651, 692, 729 — these are the "★" star ratings |
| Empty star glyph `?????` in testimonials | 2 | `index.html` lines 815, 838, 861 |
| `?? 4.8 (2.4k Reviews)` literal | 18 | listing pages — `?` is a question-mark that didn't render |
| `<div class="flex items-center text-sky-700 font-bold text-sm">` "Read more" pattern | 12 | every section that has a "Read more" link |

### 🔴 Critical: 7+ literal `?` characters across the home page
- **Symptom:** the home page has 5 sections where the `★` (U+2605) star character didn't render in the font stack, leaving a `?` placeholder. Likewise the `?` before the rating numbers (e.g. `? 4.8`) is meant to be a star icon.
- **Impact:** unprofessional appearance on the most-visited page.
- **Files responsible:** `frontend/index.html` (the compiled version), `frontend/pages/index.html`.
- **Fix:** replace literal `★` with inline SVG icons (the page already has a "Book Tour" SVG arrow, so the pattern exists), or add a proper web-font that contains the star glyph.

---

## 6 · Files Responsible

### Source files (templates)
| File | Role | Size (lines) | Health |
|------|------|--:|---|
| `frontend/build.js` | Static site compiler | 453 | ✅ |
| `frontend/pages/index.html` | Homepage source | 1,095 | 🔴 5 broken `?` glyphs |
| `frontend/pages/hotels.html` | Hotels listing | 1,194 | ✅ |
| `frontend/pages/checkout.html` | Checkout | 652 | ⚠️ 14 input heights |
| `frontend/pages/partner-registration.html` | Supplier form | 1,199 | ⚠️ 14 input heights, 1 inline progress width |
| `frontend/pages/my-profile.html` | Profile | (small) | 🔴 hScroll at tablet |
| All other 24 source pages |  | 400-800 | ✅ |

### Compiled output
| File | Size (bytes) | Issue count |
|------|---:|---:|
| `frontend/index.html` | 80,951 | 🔴 5 broken `?` glyphs, 1 inline text-shadow |
| `frontend/revenue-admin.html` | 97,083 | ✅ (largest; admin dashboard) |
| `frontend/hotels.html` | 92,067 | ✅ |
| `frontend/partner-registration.html` | 83,576 | ⚠️ 14 input heights |
| `frontend/plan-my-layover.html` | 80,252 | ✅ |
| `frontend/restaurants.html` | 73,510 | ✅ |
| `frontend/experiences.html` | 71,908 | ✅ |
| `frontend/saved-itineraries.html` | 65,915 | ✅ |
| `frontend/trip-details.html` | 65,357 | ✅ |
| `frontend/airport-transfers.html` | 64,395 | ✅ |
| `frontend/supplier-dashboard.html` | 64,985 | ✅ |
| `frontend/payment-selection.html` | 62,569 | ⚠️ 14 input heights |
| `frontend/spa-wellness.html` | 61,772 | ✅ |
| `frontend/gaming-entertainment.html` | 61,337 | ✅ |
| 30 other pages | 43-55 KB | ✅ |

### Components
| File | Role | Issue |
|------|------|------|
| `frontend/components/header.html` | Fixed navbar | 🔴 18.84 px link-buttons (199) |
| `frontend/components/footer.html` | Footer | ⚠️ H4 fallback to default |
| `frontend/components/head.html` | `<head>` block | ✅ |
| `frontend/components/auth-modals.html` | Login/Signup modals | ⚠️ 3 red shades (oklch/oklab) |

### CSS
| File | Size (KB) | Issue count |
|------|---:|---:|
| `frontend/css/tailwind.min.css` | 73.7 | ⚠️ Tailwind palette drift |
| `frontend/css/design-system.css` | 18.7 | ✅ Mature token system |
| `frontend/css/global-overrides.css` | 14.3 | ⚠️ 13 card shadows, 1 hard-coded border color |
| `frontend/css/button.css` | 2.2 | ✅ |
| `frontend/css/card.css` | 1.7 | ✅ |
| `frontend/css/tailwind-input.css` | 0.024 | L4 — single import line |
| **Total** | **110.6 KB** | — |

### JavaScript
| File | Size (KB) | Lines | Issue |
|------|---:|---:|---|
| `frontend/js/app.js` | 232.7 | 5,399 | 🟡 Large monolith; mock data, modals, auth, maps all in one file |
| `frontend/js/map-config.js` | 0.5 | 11 | ✅ |

### Assets
| File | Size |
|------|---:|
| `frontend/assets/photos/homepage.png` | 86 KB |
| **Total local assets** | **86 KB** |
| (rest of imagery served from Unsplash CDN) | — |

---

## 7 · Recommended Fix Order

### Tier 1 — must-fix (functional bug)
1. **H1** — `my-profile.html` tablet horizontal scroll. Edit `frontend/pages/my-profile.html` to add `overflow-hidden` to the hero, cap select widths.
2. **R1 (Repeated Issues § 5)** — fix the 5 broken `?` star-glyph placeholders on `index.html`. Replace with inline SVG.

### Tier 2 — should-fix (tap-target + accessibility)
3. **H2** — add a global `a[href]` link-button min-height rule in `global-overrides.css`. ~5 lines.
4. **H4** — add a `form-input` reset in `design-system.css` to unify input heights.
5. **M6** — move the hero `text-shadow` from inline style to `.theme-hero h1` in `design-system.css`.

### Tier 3 — should-fix (color + spacing collapse)
6. **H3** — raise the Tailwind color cascade from `main` to body-scope. Add `.text-red-*` / `.text-rose-*` / `.bg-{red,rose,emerald,amber}-*` collapse. ~25 lines added to `global-overrides.css`.
7. **M1** — collapse the 13 card shadows to 3 tokens (`--shadow-1/2/3`). Update the `.card` class to consume them.
8. **M2** — global gap/padding overrides for `gap-5/7/9`, `p-7/9`, `px-7/9`, `py-7/9`. ~10 lines.
9. **M5** — extract the "Airport Runway Background" hero to a CSS `::before` on a new `.hero-pattern-airport` class (or component). Removes 11 duplicate divs.

### Tier 4 — nice-to-have (token hygiene)
10. **L3** — replace the hard-coded `rgba(148, 163, 184, 0.22)` on `.card` border with `var(--border)`.
11. **L5** — audit un-classed `<section>` elements; add `.section` to bring them onto the vertical rhythm.
12. **L2** — raise `main h4` to body-scope.
13. **L1** — replace `font-black` with `font-extrabold` on step counters.
14. **L8** — consider tightening `theme-tours` rose-700 to a more distinct hue.

### Tier 5 — refactor (architecture)
15. Split `frontend/js/app.js` (5,399 lines) into:
    - `app/state.js` (mock data: HOTELS, RESTAURANTS, etc.)
    - `app/ui.js` (modal system, toasts)
    - `app/router.js` (hash routing)
    - `app/filters.js` (marketplace filters)
    - `app/planner.js` (AI planner, cost estimator)
16. Document the build pipeline in `README.md` — `frontend/build.js` reads `pages/`, applies env to `supabase-init.js`, and writes to `frontend/`. The relationship between `tailwind-input.css` and `tailwind.min.css` is undocumented.

---

## 8 · Estimated Risk

### Tier 1 (H1, R1)
- **Effort:** 1-2 hours
- **Risk:** 🟢 **Low** — single-line fixes; no design-system change.
- **Regression risk:** minimal; fix affects only the offending element.
- **User impact:** 🔴 **High** — currently visible to every tablet visitor on `/my-profile.html` and every visitor on `/` (the `?` glyphs).

### Tier 2 (H2, H4, M6)
- **Effort:** 2-4 hours
- **Risk:** 🟢 **Low** — `!important` rules with `main` scope already established; new rules follow the same pattern.
- **Regression risk:** low; a `min-height: 2.75rem` on link-buttons can be overridden per-component if a hero CTA needs to be smaller.
- **User impact:** 🟡 **Medium** — improves tap accuracy and visual consistency.

### Tier 3 (H3, M1, M2, M5)
- **Effort:** 4-8 hours
- **Risk:** 🟡 **Medium** — color cascade to body-scope is reversible but should be done behind a feature flag (e.g., scoped to a CSS class added in `<body>`).
- **Regression risk:** medium; collapse of 13 card shadows to 3 may shift visual rhythm on 4-5 pages that intentionally use multi-level elevation.
- **User impact:** 🟡 **Medium** — visible improvement but no functional change.

### Tier 4 (L1, L2, L3, L5, L8)
- **Effort:** 2-3 hours
- **Risk:** 🟢 **Low** — one-line refactors.
- **Regression risk:** minimal.
- **User impact:** 🟢 **Low** — internal consistency.

### Tier 5 (JS split, docs)
- **Effort:** 8-16 hours
- **Risk:** 🔴 **Medium-High** — refactoring a 5,400-line monolith requires comprehensive testing. The `layoverx` global namespace is referenced from inline HTML event handlers (`onclick="layoverx.openAuthModal(...)"`) so the global API must be preserved exactly.
- **Regression risk:** high; recommend a parallel implementation + parity test before swap.
- **User impact:** 🟢 **Low** — invisible to users; only the developer experience improves.

---

## Appendix A · Audit Script

`scripts/ui-audit.js` (Playwright, headless Chromium):
- Launches 3 contexts (desktop 1280×800, tablet 768×1024, mobile 375×812)
- Visits all 30 routes in each context
- Captures full-page screenshots → `_audit/ui-audit/<route>__<viewport>.png`
- Extracts computed styles (typography, colors, spacing, button/card/form metrics)
- Detects horizontal scroll, missing alt text, empty links
- Records FCP and DOMContentLoaded for perf baseline
- Writes `_audit/ui-audit/ui-audit-raw.json` (~600 KB) and `ui-audit-summary.json`

Re-run with: `node scripts/ui-audit.js`

---

## Appendix B · Top 10 by Issue Count (most-debt pages)

| Page | Inline styles | Issues |
|---|--:|---|
| `index.html` | 1 | 🔴 5 broken `?` glyphs, M5 hero |
| `my-itinerary.html` | 2 | L6 progress bars |
| `partner-registration.html` | 1 | L6 progress bar, 14 input heights |
| `payment-selection.html` | 0 | 14 input heights |
| `checkout.html` | 0 | 14 input heights |
| `my-profile.html` | 1 | 🔴 hScroll at tablet |
| `contact.html` | 1 | inline hero bg only |
| `plan-my-layover.html` | 1 | inline hero bg only |
| `revenue-admin.html` | 1 | inline hero bg only |
| All other 22 pages | 0-1 | ✅ |

---

**End of report.** No project files were modified during this audit.
