# Walkthrough — Platform Migration (Firebase to Supabase, Express/Render & Resend)

This walkthrough documents the design, implementation, and successful verification of the migration of LayoverX from Firebase to a modern, open-source stack:
*   **Database, Auth, Storage** → Supabase (PostgreSQL, GoTrue, and Object Storage)
*   **Backend Server** → Render (Express.js Web Service)
*   **Emails** → Resend

---

## 1. Technical Architecture & Shim Strategy

To prevent rewriting the entire frontend codebase (which makes extensive use of the Firebase client SDK and web callables), we implemented a comprehensive client-side shimming layer:

```
                  ┌────────────────────────────────────────┐
                  │          Frontend (app.js)             │
                  └────────────────────────────────────────┘
                                       │
                (Intercepts Firebase SDK syntax/callables)
                                       ▼
                  ┌────────────────────────────────────────┐
                  │     supabase-config.js (Shim Layer)    │
                  └────────────────────────────────────────┘
                     /                 |                \
                    /                  |                 \
  (auth / DB queries)          (file uploads)       (web callables)
                  ▼                    ▼                  ▼
          ┌──────────────┐      ┌──────────────┐     ┌──────────────┐
          │   Supabase   │      │   Supabase   │     │ Render / API │
          │  Auth & DB   │      │   Storage    │     │ Express.js   │
          └──────────────┘      └──────────────┘     └──────────────┘
```

### Key Components

1.  **IIFE Scoping inside [supabase-config.js](file:///c:/Users/Dev%20Tinker/Desktop/next_layoverx_1/frontend/js/supabase-config.js):**
    Wrapped all configuration variables and client constructors in an Immediately Invoked Function Expression. This resolves naming conflicts (e.g., standard CDN library exports of `supabase` clashing with our declarations) while exporting clean compat namespaces (`window.firebase`, `window.layoverxAuth`, `window.layoverxDb`, `window.layoverxStorage`) onto `window`.

2.  **Auth Mapper (`window.layoverxAuth`):**
    Shims `onAuthStateChanged`, `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`, and Google OAuth `signInWithPopup`. Maps user records into the standard user structure expected by `app.js`.

3.  **Database Mapper (`window.layoverxDb`):**
    Shims Firestore-style chaining (`db.collection(name).doc(id).set(data)`, `db.collection(name).add(data)`, `.where()`, `.get()`). Translates JavaScript camelCase fields to SQL database snake_case fields bidirectionally (e.g., `bookingId` to `booking_id`).

4.  **Storage Mapper (`window.layoverxStorage`):**
    Intercepts file uploads and uploads them to the public `suppliers` Supabase bucket, returning public URLs.

5.  **Web Callables Interface:**
    Converts legacy `firebase.functions().httpsCallable(name)` calls into REST HTTP POST requests directed to our Express backend.

---

## 2. Express Backend & Server Setup

We replaced Firebase Cloud Functions with a dedicated Express web server running inside [backend/functions](file:///c:/Users/Dev%20Tinker/Desktop/next_layoverx_1/backend/functions):

*   **[server.js](file:///c:/Users/Dev%20Tinker/Desktop/next_layoverx_1/backend/functions/server.js):**
    *   Initializes Express with CORS and body parsing middleware.
    *   Exposes secure routes for callable actions: `/api/lockInventory`, `/api/validateLockSession`, `/api/createRazorpayOrder`, `/api/verifyRazorpayPayment`, `/api/createPaymentIntent`.
    *   Exposes admin approval endpoints protected by Supabase JWT checking middleware.
    *   Exposes webhooks: Razorpay webhook notifications and supplier registration alerts.
    *   Exposes a cron trigger at `/api/cron/check-flight-delays` to check and adjust timelines dynamically.
*   **[index.js](file:///c:/Users/Dev%20Tinker/Desktop/next_layoverx_1/backend/functions/index.js):**
    Implements all locking checks, Razorpay validation, and flight schedule changes using Supabase database calls instead of Firestore transactions.
*   **[admin_approval.js](file:///c:/Users/Dev%20Tinker/Desktop/next_layoverx_1/backend/functions/admin_approval.js):**
    Validates token headers (`Authorization: Bearer <token>`) using `supabase.auth.getUser(token)` and checks admin claims. Exposes pending reviews, approvals, and rejections.
*   **[notificationService.js](file:///c:/Users/Dev%20Tinker/Desktop/next_layoverx_1/backend/functions/services/notificationService.js):**
    Writes notification logs directly to the PostgreSQL `notifications` table.

---

## 3. Automated Verification Results

To ensure absolute system stability, we ran the test suite in [audit_tools](file:///c:/Users/Dev%20Tinker/Desktop/next_layoverx_1/audit_tools):

### A. Flight Delay Scheduler Unit Tests
*   **Command:** `node audit_tools/test_flight_delays.js`
*   **Mocks:** Injected a cloned `MockSupabase` database client to avoid reference updates in-place.
*   **Results:** **✅ 7 / 7 PASS**
    *   *Scenario 1 (On-Time):* processed correctly (no changes).
    *   *Scenario 2 (30-min Delay):* detected and notification triggered.
    *   *Scenario 3 (2-hour Delay):* correctly flagged as unfeasible and warning sent.
    *   *Scenario 4 (Cancellation):* detected and notification triggered.
    *   *Scenario 5 (Gate Change):* detected and notification triggered.
    *   *Scenario 6 (API Failure):* gracefully caught and logged to `error_logs`.
    *   *Scenario 7 (Idempotency):* duplicate runs generated 0 additional notifications.

### B. Google Auth E2E Test
*   **Command:** `node audit_tools/test_google_auth.js`
*   **Results:** **✅ PASS**
    *   Intercepted Supabase Google Auth call.
    *   Mocked Google OAuth credentials and resolved popup successfully.
    *   Database writes to `users` profile completed and verified.
    *   UI successfully updated to the authenticated state.

### C. Supplier Onboarding E2E Test
*   **Command:** `node audit_tools/supplier_onboarding.js`
*   **Results:** **✅ PASS**
    *   Created local mock files and simulated step-by-step partner onboarding wizard.
    *   Intercepted file uploads and verified public storage URL generation.
    *   Wrote the new registration application to the `supplier_applications` mock state.
    *   Redirected and verified dashboard updates successfully.

### D. Marketplace & Planner Regression E2E Test
*   **Command:** `node audit_tools/marketplace_regression.js`
*   **Approach:** 
    *   Blocked calls to `checkout.razorpay.com` so the real SDK script does not override our global mock.
    *   Injected a mock `window.Razorpay` class that automatically triggers a successful checkout handler callback upon initialization.
    *   Routed backend calls (`lockInventory`, `validateLockSession`, `createRazorpayOrder`, and `verifyRazorpayPayment`) to Playwright-level mock JSON endpoints.
*   **Results:** **✅ PASS**
    *   Verified search form inputs persistence.
    *   Verified item additions, timeline adjustments, and limit warning banners.
    *   Verified checkout details submission, automated payment routing, confirmation receipt creation, and dashboard indexing.

---

## 4. Verification Screenshots

All E2E screenshot artifacts were re-generated in the artifacts directory:
*   `homepage_inputs.png` (Search fields verification)
*   `planner_timeline_and_warning.png` (Safe exit limit warning validation)
*   `supplier_registration_desktop.png` (KYC Registration layout verification)
*   `supplier_dashboard_desktop.png` (Partner registration reviews)
*   `regression_5_checkout_form.png` (Traveler checkout fields verification)
*   `regression_6_trips_receipt.png` (Booking confirmation ticket verification)

---

*   Deleted legacy configuration files: `.firebaserc`, `firebase.json`, `firestore.indexes.json`, `firestore.rules`.
*   Deleted legacy backend function folder: `C:\Users\Dev Tinker\Desktop\next_layoverx_1\functions/` (root-level).
*   Deleted redundant files: `frontend/js/firebase-config.js`, `scripts/assign_admin.js`, and `backend/functions/firestore.rules`.
*   Removed `window.firebase` global wrapper and all client-side dependencies from `supabase-config.js`, `app.js`, HTML source templates, and E2E test scripts.
*   Updated `remaining.txt` production checklist to align with Render, Supabase, and Resend environments.
