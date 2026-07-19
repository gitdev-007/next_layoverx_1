#!/usr/bin/env node
/**
 * LayoverX Live Site Audit (Phase 1)
 * Crawls major routes of the live deployment and extracts computed styles
 * (typography, colors, spacing) via Playwright. Saves a structured JSON report.
 *
 * Usage:
 *   node scripts/audit-live-site.js
 *
 * Output:
 *   _audit/live-audit-report.json
 *   _audit/live-audit-summary.json (aggregated design-token usage)
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE_URL = 'https://next-layoverx-1.vercel.app';

const ROUTES = [
  { name: 'home',                path: '/' },
  { name: 'hotels',              path: '/hotels.html' },
  { name: 'restaurants',         path: '/restaurants.html' },
  { name: 'spa-wellness',        path: '/spa-wellness.html' },
  { name: 'gaming-entertainment',path: '/gaming-entertainment.html' },
  { name: 'experiences',         path: '/experiences.html' },
  { name: 'airport-transfers',   path: '/airport-transfers.html' },
  { name: 'plan-my-layover',     path: '/plan-my-layover.html' },
  { name: 'how-it-works',        path: '/how-it-works.html' },
  { name: 'contact',             path: '/contact.html' },
  { name: 'help-center',         path: '/help-center.html' },
  { name: 'faq',                 path: '/faq.html' },
  { name: 'terms',               path: '/terms.html' },
  { name: 'privacy',             path: '/privacy.html' },
  { name: 'service-details',     path: '/service-details.html' },
  { name: 'my-itinerary',        path: '/my-itinerary.html' },
  { name: 'checkout',            path: '/checkout.html' },
  { name: 'my-trips',            path: '/my-trips.html' },
  { name: 'my-profile',          path: '/my-profile.html' },
  { name: 'account-settings',    path: '/account-settings.html' },
  { name: 'saved-itineraries',   path: '/saved-itineraries.html' },
  { name: 'trip-details',        path: '/trip-details.html' },
  { name: 'booking-review',      path: '/booking-review.html' },
  { name: 'payment-selection',   path: '/payment-selection.html' },
  { name: 'booking-confirmation',path: '/booking-confirmation.html' },
  { name: 'supplier-status',     path: '/supplier-status.html' },
  { name: 'supplier-dashboard',  path: '/supplier-dashboard.html' },
  { name: 'partner-registration',path: '/partner-registration.html' },
  { name: 'revenue-admin',       path: '/revenue-admin.html' },
  { name: 'notifications',       path: '/notifications.html' },
];

const TYPO_SELECTORS = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'a', 'button', 'label'];
const COLOR_SELECTORS = ['section', 'header', 'footer', 'main', 'nav', 'div', 'a', 'button'];
const SPACING_SELECTORS = ['section', 'header', 'main', 'div', 'article', 'aside'];
const MAX_ELEMENTS_PER_SELECTOR = 200;

const OUT_DIR = path.join(__dirname, '..', '_audit');
const REPORT_PATH = path.join(OUT_DIR, 'live-audit-report.json');
const SUMMARY_PATH = path.join(OUT_DIR, 'live-audit-summary.json');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

async function extractStyles(page, route) {
  const url = `${BASE_URL}${route.path}`;
  console.log(`\n→ ${route.name}: ${url}`);

  let status = 'ok';
  let title = '';
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    status = resp ? resp.status() : 'no-response';
    title = await page.title();
  } catch (err) {
    console.log(`  ! navigation error: ${err.message}`);
    status = `error: ${err.message}`;
  }

  await page.waitForTimeout(800);

  const extract = await page.evaluate((selectors) => {
    const TYPO = selectors.TYPO;
    const COLOR = selectors.COLOR;
    const SPACE = selectors.SPACE;
    const LIMIT = selectors.LIMIT;

    const safe = (el, prop) => {
      try { return getComputedStyle(el).getPropertyValue(prop).trim(); }
      catch { return ''; }
    };

    const textOf = (el) => {
      try {
        const t = (el.innerText || el.textContent || '').trim();
        return t.length > 80 ? t.slice(0, 80) + '…' : t;
      } catch { return ''; }
    };

    const pickElements = (sel) => Array.from(document.querySelectorAll(sel)).slice(0, LIMIT);

    const typography = {};
    TYPO.forEach((sel) => {
      typography[sel] = pickElements(sel).map((el) => {
        const cs = getComputedStyle(el);
        return {
          text: textOf(el),
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          color: cs.color,
        };
      });
    });

    const colors = {};
    COLOR.forEach((sel) => {
      colors[sel] = pickElements(sel).map((el) => {
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 80),
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          borderColor: cs.borderColor,
          borderWidth: cs.borderTopWidth,
        };
      });
    });

    const spacing = {};
    SPACE.forEach((sel) => {
      spacing[sel] = pickElements(sel).map((el) => {
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 80),
          padding: cs.padding,
          margin: cs.margin,
          gap: cs.gap,
          display: cs.display,
        };
      });
    });

    const buttonStyles = Array.from(document.querySelectorAll('button, .btn, a[class*="btn"], a[class*="button"]'))
      .slice(0, LIMIT)
      .map((el) => {
        const cs = getComputedStyle(el);
        return {
          text: textOf(el),
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          padding: cs.padding,
          borderRadius: cs.borderRadius,
          backgroundColor: cs.backgroundColor,
          color: cs.color,
          height: cs.height,
          minHeight: cs.minHeight,
        };
      });

    const containerWidths = Array.from(document.querySelectorAll('.container, [class*="container"]'))
      .slice(0, 20)
      .map((el) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          maxWidth: cs.maxWidth,
          width: cs.width,
          padding: cs.padding,
          actualWidth: Math.round(r.width),
        };
      });

    return { typography, colors, spacing, buttonStyles, containerWidths };
  }, {
    TYPO: TYPO_SELECTORS,
    COLOR: COLOR_SELECTORS,
    SPACE: SPACING_SELECTORS,
    LIMIT: MAX_ELEMENTS_PER_SELECTOR,
  });

  return {
    route: route.name,
    path: route.path,
    url,
    status,
    title,
    extractedAt: new Date().toISOString(),
    ...extract,
  };
}

function aggregateSummary(reports) {
  const fontSizeCounts = {};
  const colorCounts = {};
  const bgCounts = {};
  const paddingCounts = {};
  const gapCounts = {};
  const borderRadiusCounts = {};
  const buttonHeightCounts = {};
  const lineHeightCounts = {};
  const fontWeightCounts = {};

  const tally = (bag, value) => {
    if (!value || value === 'none' || value === 'normal' || value === 'auto' || value === '0px' || value === 'rgba(0, 0, 0, 0)') return;
    bag[value] = (bag[value] || 0) + 1;
  };

  reports.forEach((r) => {
    if (r.status !== 200 && typeof r.status === 'number') return;
    Object.values(r.typography || {}).forEach((arr) =>
      arr.forEach((e) => {
        tally(fontSizeCounts, e.fontSize);
        tally(lineHeightCounts, e.lineHeight);
        tally(fontWeightCounts, e.fontWeight);
      })
    );
    Object.values(r.colors || {}).forEach((arr) =>
      arr.forEach((e) => {
        tally(colorCounts, e.color);
        tally(bgCounts, e.backgroundColor);
      })
    );
    Object.values(r.spacing || {}).forEach((arr) =>
      arr.forEach((e) => {
        tally(paddingCounts, e.padding);
        tally(gapCounts, e.gap);
      })
    );
    (r.buttonStyles || []).forEach((e) => {
      tally(borderRadiusCounts, e.borderRadius);
      tally(buttonHeightCounts, e.height);
    });
  });

  const topN = (bag, n = 20) =>
    Object.entries(bag)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([value, count]) => ({ value, count }));

  return {
    totalPagesAudited: reports.length,
    successfulPages: reports.filter((r) => r.status === 200).length,
    distinctFontSizes: Object.keys(fontSizeCounts).length,
    distinctLineHeights: Object.keys(lineHeightCounts).length,
    distinctFontWeights: Object.keys(fontWeightCounts).length,
    distinctTextColors: Object.keys(colorCounts).length,
    distinctBackgroundColors: Object.keys(bgCounts).length,
    distinctPaddings: Object.keys(paddingCounts).length,
    distinctGaps: Object.keys(gapCounts).length,
    distinctBorderRadii: Object.keys(borderRadiusCounts).length,
    distinctButtonHeights: Object.keys(buttonHeightCounts).length,
    topFontSizes: topN(fontSizeCounts, 20),
    topLineHeights: topN(lineHeightCounts, 10),
    topFontWeights: topN(fontWeightCounts, 10),
    topTextColors: topN(colorCounts, 15),
    topBackgroundColors: topN(bgCounts, 15),
    topPaddings: topN(paddingCounts, 25),
    topGaps: topN(gapCounts, 15),
    topBorderRadii: topN(borderRadiusCounts, 15),
    topButtonHeights: topN(buttonHeightCounts, 15),
  };
}

(async () => {
  ensureDir(OUT_DIR);

  console.log(`Launching headless Chromium…`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'LayoverX-Design-Audit/1.0 (Playwright)',
  });
  const page = await context.newPage();

  const reports = [];
  for (const route of ROUTES) {
    try {
      const rep = await extractStyles(page, route);
      reports.push(rep);
      console.log(`  ✓ ${route.name} (status ${rep.status}) — ${Object.values(rep.typography || {}).reduce((a, b) => a + b.length, 0)} typographic nodes sampled`);
    } catch (err) {
      console.log(`  ✗ ${route.name}: ${err.message}`);
      reports.push({ route: route.name, path: route.path, url: `${BASE_URL}${route.path}`, status: `error: ${err.message}`, extractedAt: new Date().toISOString() });
    }
  }

  await browser.close();

  const summary = aggregateSummary(reports);

  fs.writeFileSync(REPORT_PATH, JSON.stringify(reports, null, 2), 'utf8');
  fs.writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2), 'utf8');

  console.log(`\n✓ Wrote ${REPORT_PATH}`);
  console.log(`✓ Wrote ${SUMMARY_PATH}`);
  console.log(`\nDistinct design tokens observed:`);
  console.log(`  Font sizes:    ${summary.distinctFontSizes}`);
  console.log(`  Line heights:  ${summary.distinctLineHeights}`);
  console.log(`  Font weights:  ${summary.distinctFontWeights}`);
  console.log(`  Text colors:   ${summary.distinctTextColors}`);
  console.log(`  Bg colors:     ${summary.distinctBackgroundColors}`);
  console.log(`  Paddings:      ${summary.distinctPaddings}`);
  console.log(`  Gaps:          ${summary.distinctGaps}`);
  console.log(`  Radii:         ${summary.distinctBorderRadii}`);
  console.log(`  Button heights:${summary.distinctButtonHeights}`);
})().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
