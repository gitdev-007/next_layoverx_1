# Automated QA & Regression Test Report

**Date:** 2026-06-14  
**Test Harness:** Playwright E2E Automation  
**Target Platform:** LayoverX (Local HTTP Server port 8000)

---

## 1. Test Suite Summary

The automated E2E QA test suites were executed against the updated codebase. All tests passed successfully.

| Test Script | Status | Features Audited | Screenshots Captured |
| :--- | :--- | :--- | :--- |
| `qa_verification.js` | **PASSED** ✅ | Search persistence, interactive timelines, safety warnings, modals close, list hero grids, revenue admin yield control | `homepage_inputs.png`, `planner_timeline_and_warning.png`, `experiences_page.png`, `transfers_page.png`, `experiences_tablet.png`, `experiences_mobile.png` |
| `marketplace_regression.js` | **PASSED** ✅ | Full user checkout funnel: timeline limits, cart badges, service details addition, traveler check details, card checkout payment, receipt modal | `regression_1_homepage_inputs.png`, `regression_2_context_modal.png`, `regression_3_service_details.png`, `regression_4_workspace_overflow.png`, `regression_5_checkout_form.png`, `regression_6_trips_receipt.png` |
| `supplier_onboarding.js` | **PASSED** ✅ | B2B supplier onboarding: KYC document uploads, multipart stepper panels, Firestore applications sync, dashboard lists | `supplier_registration_desktop.png`, `supplier_registration_tablet.png`, `supplier_registration_mobile.png`, `supplier_dashboard_desktop.png`, `supplier_dashboard_tablet.png`, `supplier_dashboard_mobile.png` |
| `contact_screenshot.js` | **PASSED** ✅ | Layout validation of contact options across viewports | `contact_desktop.png`, `contact_tablet.png`, `contact_mobile.png` |

---

## 2. Detailed Test Metrics

### 2.1. `qa_verification.js` Metrics
*   **Search Form Persistence:** Confirmed search parameters set on Homepage (`bandra`, `3 travelers`, `2026-06-10`) prefilled perfectly on the Planner Page and survived a manual page reload.
*   **Timeline Math:** Initial load of Marriott Hotel (3h stay), Peshawri Dinner (1.5h), and Heritage Tour (5h) correctly outputted a total cost of **₹19,595** for 3 guests.
*   **Time Limit Safety Warnings:** Artificially increasing the hotel duration to 12h (total timeline duration = 17.0h) triggered the safety check. The warning banner `#timeline-warning` rendered with:  
    `⚠️ Total activities duration (17.0h) exceeds safe layover exit window (4.5h). Please remove some items or reduce timings.`
*   **Modals Close Events:** Verified the Login modal correctly dismissed on:
    *   Clicking the close cross button (`.modal-close`)
    *   Clicking the background overlay margin
    *   Pressing the `Escape` key
*   **Revenue Dashboard override:** Applied global slider adjustments (+20%) and verified the settings were written to `localStorage.layoverx_pricing_settings`.

### 2.2. `marketplace_regression.js` Metrics
*   **Funnel Check:**
    1.  Homepage search prefilled with `bandra`, `UA-901`, `EK-501`.
    2.  Floating contextual badge `Trip Details` clicked to update travelers from 3 to 4. Verified the header badge updated dynamically.
    3.  Navigated to Hotels, added Niranta Hotel (Cart count = 1).
    4.  Navigated to Dining, viewed Peshawri details, and added it to Itinerary (Cart count = 2).
    5.  Itinerary workspace correctly flagged safety time limits (Used=7.5h vs. Safe window=4.5h) and locked checkout button.
    6.  Adjusted hotel duration to 3h slot (Used=4.5h), warning cleared, checkout button unlocked.
    7.  Completed Checkout Review and filled out Traveler details (Alice Mercer, United States, Passport P-US-987654). Breakout price calculated to **₹6,223.31**.
    8.  Submitted credit card payment, which initialized Razorpay order creation on backend. Local test mock bypass automatically verified signature and validated payment, successfully generating booking code **LX-69736-CSMIA**.
    9.  Redirected to Traveler Dashboard, receipt modal verified open, upcoming trip registered with status Confirmed.
*   **Revenue Logs & Analytics Verification:**
    - Verified `localStorage.layoverx_revenue_transactions` has correct subtotal, convenience/service fees, taxes, and grand totals.
    - Verified `localStorage.layoverx_vendor_payouts` records computed payouts and commissions (15% rate) for vendors.
    - Verified `localStorage.layoverx_analytics_events` captures: `Payment Selection Clicked`, `Checkout Started`, and `Booking Confirmed` conversion events.

### 2.3. `supplier_onboarding.js` Metrics
*   **onboarding validation:**
    1.  Verified Guest user hits authentication barrier when registering.
    2.  Signed up a new supplier (`supplier_[timestamp]@test.com`).
    3.  Filled out Owner/Business/Location/Operational details.
    4.  Uploaded mock files (`mock_logo.png`, `mock_license.pdf`, `mock_id.png`). Storage upload mock returned valid mock download links.
    5.  Onboarded successfully, generating reference ID `APP_WNCJ096YP` in state `pending_review`.
    6.  Verified application correctly lists under the Supplier Hub dashboard.

---

## 3. Verified Code & Performance Fixes

-   **Header Visibility Bug:** Solved the layout bug where the header logo and menu links were invisible on white-background pages (`booking-confirmation.html`, `checkout.html`, `my-profile.html`, etc.) due to transparent background styles loaded at scrollY = 0.
-   **Solution:** In `app.js`, `decorateNavbar()` now checks for `#hero-section` or `.theme-hero` tags. If neither exists, the header defaults to the opaque scrolled state immediately on load, ensuring dark legible text on light page backgrounds.
-   **Firebase Functions SDK Import:** Resolved the front-end checkout error `TypeError: firebase.functions is not a function` by importing the `firebase-functions-compat.js` SDK in `head.html` and recompiling all frontend pages.
-   **LCP Optimization:** Solved the LCP performance bottleneck by compressing `assets/photos/homepage.png` from **7.41 MB** to **86.30 KB** via browser-based canvas rendering in Playwright, improving the homepage Lighthouse performance score to **95**.
-   **Global Toast Binding:** Exposed `showToast` on the global `window` scope in `app.js` to resolve `ReferenceError: showToast is not defined` errors on pages calling `showToast` directly.
