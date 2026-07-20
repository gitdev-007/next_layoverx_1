# LayoverX Files Changed

## Design System (Core Changes)

| File | Change |
|------|--------|
| `frontend/css/design-system.css` | Updated typography tokens, spacing tokens, color tokens, button system, card system, section system, and container widths to the new unified design language. |
| `frontend/css/global-overrides.css` | Added enforcement rules with `!important` to override Tailwind and page-level inconsistencies. Includes typography, spacing, color collapse, button standardization, card unification, and heading repair utilities. |

## HTML Pages (Button Types + Heading Hierarchy + Labels)

All pages received `type="button"` attributes where missing. Some pages also received heading hierarchy fixes and form label associations.

### Root HTML files
- `frontend/index.html`
- `frontend/hotels.html`
- `frontend/restaurants.html`
- `frontend/spa-wellness.html`
- `frontend/gaming-entertainment.html`
- `frontend/experiences.html`
- `frontend/airport-transfers.html`
- `frontend/how-it-works.html`
- `frontend/contact.html`
- `frontend/plan-my-layover.html`
- `frontend/checkout.html`
- `frontend/my-itinerary.html`
- `frontend/my-profile.html`
- `frontend/my-trips.html`
- `frontend/saved-itineraries.html`
- `frontend/notifications.html`
- `frontend/partner-registration.html`
- `frontend/payment-selection.html`
- `frontend/booking-review.html`
- `frontend/booking-confirmation.html`
- `frontend/service-details.html`
- `frontend/supplier-dashboard.html`
- `frontend/supplier-status.html`
- `frontend/revenue-admin.html`
- `frontend/trip-details.html`
- `frontend/faq.html`
- `frontend/help-center.html`
- `frontend/account-settings.html`
- `frontend/privacy.html`
- `frontend/terms.html`

### Duplicate / Template Pages
- `frontend/pages/index.html`
- `frontend/pages/hotels.html`
- `frontend/pages/restaurants.html`
- `frontend/pages/spa-wellness.html`
- `frontend/pages/gaming-entertainment.html`
- `frontend/pages/experiences.html`
- `frontend/pages/plan-my-layover.html`
- `frontend/pages/my-itinerary.html`
- `frontend/pages/my-trips.html`
- `frontend/pages/saved-itineraries.html`
- `frontend/pages/notifications.html`
- `frontend/pages/partner-registration.html`
- `frontend/pages/revenue-admin.html`
- `frontend/pages/supplier-dashboard.html`
- `frontend/pages/trip-details.html`
- `frontend/pages/booking-confirmation.html`
- `frontend/pages/faq.html`

### Components
- `frontend/components/header.html`
- `frontend/components/auth-modals.html`

### JavaScript
- `frontend/js/app.js` — Updated dynamically generated "No Upcoming Bookings" heading from `<h3>` to `<h2 class="h3-style">` for semantic hierarchy.

## Automation Scripts (New)

| File | Purpose |
|------|---------|
| `scripts/capture-screenshots.mjs` | Captures full-page screenshots at 4 breakpoints for 14 key pages. |
| `scripts/audit-pages.mjs` | Audits 29 pages for heading hierarchy, missing alt text, missing button types, missing labels, contrast, and overflow. |
| `scripts/fix-button-types.mjs` | Adds `type="button"` to all `<button>` elements without a type attribute. |
| `scripts/fix-headings.mjs` | Repairs heading hierarchy skips on specific pages. |
| `scripts/fix-partner-headings.mjs` | Converts small review labels from `<h4>` to `<p>` in partner-registration.html. |

## Reports Generated (New)

- `DESIGN_SYSTEM_REPORT.md`
- `VISUAL_QA_REPORT.md`
- `RESPONSIVE_REPORT.md`
- `FILES_CHANGED.md` (this file)
- `audit-reports/AUDIT_REPORT.md`

## Screenshots Generated (New)

- `_screens/*.png` — 56 screenshots total (14 pages × 4 breakpoints).

## Not Changed

- Layout structures
- Section ordering
- JavaScript functionality (except one heading tag)
- Content/copy
- SEO meta tags
- Images and assets
- Build scripts (other than new helper scripts)

## Total

- 2 CSS files modified
- 47 HTML files modified
- 1 JS file modified
- 5 new helper scripts
- 5 new reports
- 56 new screenshots
