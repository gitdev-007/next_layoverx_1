# Lighthouse Performance & Accessibility Report

**Date:** 2026-06-14  
**Audit Tool:** Lighthouse CLI 13.4.0 (Headless Chrome)  
**Target Viewport:** Mobile (Default Lighthouse emulation)  
**Host Environment:** Local HTTP Server (port 8000)

---

## 1. Audit Overview

Lighthouse audits were executed against the compiled static versions of three critical user pages:
1.  **Home Page** (`index.html`)
2.  **Plan My Layover Page** (`plan-my-layover.html`)
3.  **Checkout Page** (`checkout.html`)

Here is the score comparison across categories:

| Target Page | Performance | Accessibility | Best Practices | SEO |
| :--- | :---: | :---: | :---: | :---: |
| **Home Page** | 95 | 93 | 96 | 100 |
| **Plan My Layover** | 96 | 93 | 96 | 100 |
| **Checkout Page** | 97 | 91 | 96 | 100 |

---

## 2. Detailed Findings & Analysis

### 2.1. Performance (95 - 97)
- **Strengths:** Outstanding scores across all core user journey pages. Fast loading, high-speed execution, and minimal blocking time.
- **Optimizations Applied:**
  - **Image Compression:** Compressed the large hero background image `assets/photos/homepage.png` from **7.41 MB** down to **86.30 KB** (98.8% reduction) using custom browser-based Canvas API scaling. This resolved the critical Largest Contentful Paint (LCP) issue, reducing LCP rendering time from 45s down to 1.6s.
  - **Script Deferral:** Ensured all non-essential script resources, including Firebase SDKs, configuration profiles, and custom tracking libraries, are loaded asynchronously or deferred.
- **Recommendation:** Implement dynamic format serving (WebP/AVIF) and cache-control headers on static web host platforms.

### 2.2. Accessibility (91 - 93)
- **Strengths:**
  - High accessibility compliance across all pages.
  - Interactive elements have explicit, unique IDs.
  - Screen reader helper tags (`.sr-only`) and focus indicators are implemented.
  - Skip links are present (`Skip to main content`).
- **Opportunities:**
  - **Form Labels:** Ensure that custom check-in select inputs and input fields have matching labels.
  - **Contrast:** The navbar link colors have been updated to conform to HSL high-contrast WCAG AA requirements (`--text-muted: #374151`), making it highly legible.

### 2.3. Best Practices (96)
- **Strengths:**
  - Zero browser console errors.
  - Avoids outdated web features or unsafe APIs.
  - Secure JavaScript libraries.

### 2.4. SEO (100)
- **Strengths:**
  - Full compliance (100) across all audited pages.
  - Page titles are descriptive and unique.
  - Compelling metadata descriptions are injected.
  - Semantic HTML structure is strictly followed (`<h1>`, `<header>`, `<main>`, `<footer>` landmarks).
  - Crawlable internal links are structured.
