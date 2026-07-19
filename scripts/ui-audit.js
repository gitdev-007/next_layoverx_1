#!/usr/bin/env node
/**
 * UI Audit — Desktop / Tablet / Mobile screenshots + UI/UX/Perf measurements.
 * No file modifications. Output only.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE = 'https://next-layoverx-1.vercel.app';
const OUT = path.join(__dirname, '..', '_audit', 'ui-audit');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  '/','/hotels.html','/restaurants.html','/spa-wellness.html','/gaming-entertainment.html',
  '/experiences.html','/airport-transfers.html','/plan-my-layover.html','/how-it-works.html',
  '/contact.html','/help-center.html','/faq.html','/terms.html','/privacy.html',
  '/service-details.html','/my-itinerary.html','/checkout.html','/my-trips.html',
  '/my-profile.html','/account-settings.html','/saved-itineraries.html','/trip-details.html',
  '/booking-review.html','/payment-selection.html','/booking-confirmation.html',
  '/supplier-status.html','/supplier-dashboard.html','/partner-registration.html',
  '/revenue-admin.html','/notifications.html',
];

const VIEWPORTS = [
  { name: 'desktop', w: 1280, h: 800 },
  { name: 'tablet',  w: 768,  h: 1024 },
  { name: 'mobile',  w: 375,  h: 812 },
];

async function audit() {
  const browser = await chromium.launch();
  const report = { pages: [], aggregate: {} };

  const aggregates = {
    h1: {}, h2: {}, h3: {}, headings: {},
    btnH: {}, btnR: {}, btnP: {},
    cardShadow: {}, cardR: {}, cardP: {},
    textColor: {}, bgColor: {}, borderColor: {},
    containerW: {}, sectionPad: {}, gap: {},
    inputH: {}, labelGap: {},
    issues: { horizontalScroll: [], missingAlt: [], emptyLinks: [], missingFocus: [] },
    perf: { fcp: [], lcp: [], cls: [] },
  };

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();

    for (const route of ROUTES) {
      const url = BASE + route;
      const slug = route === '/' ? 'home' : route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
      const t0 = Date.now();
      let status = 0;
      try {
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        status = resp ? resp.status() : 0;
      } catch (e) { status = 0; }
      await page.waitForTimeout(800);
      const loadMs = Date.now() - t0;

      // Screenshots
      const shot = path.join(OUT, `${slug}__${vp.name}.png`);
      try { await page.screenshot({ path: shot, fullPage: true }); } catch (e) {}

      // Perf metrics
      try {
        const m = await page.evaluate(() => {
          const paint = performance.getEntriesByType('paint');
          const fcp = paint.find(p => p.name === 'first-contentful-paint');
          const nav = performance.getEntriesByType('navigation')[0];
          return { fcp: fcp ? fcp.startTime : null, dom: nav ? nav.domContentLoadedEventEnd : null };
        });
        if (m.fcp) aggregates.perf.fcp.push(m.fcp);
      } catch (e) {}

      // UI/UX measurements
      let metrics = {};
      try {
        metrics = await page.evaluate(() => {
          const out = {
            h1: {}, h2: {}, h3: {}, headings: {},
            btnH: {}, btnR: {}, btnP: {},
            cardShadow: {}, cardR: {}, cardP: {},
            textColor: {}, bgColor: {}, borderColor: {},
            containerW: {}, sectionPad: {}, gap: {},
            inputH: {}, labelGap: {},
            docWidth: document.documentElement.scrollWidth,
            viewport: window.innerWidth,
            horizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
            images: { total: 0, withAlt: 0, noAlt: [] },
            links: { total: 0, empty: [] },
            inputs: { total: 0, noLabel: 0 },
            focusable: document.querySelectorAll('a, button, input, select, textarea').length,
          };

          // Headings
          ['h1','h2','h3','h4'].forEach(t => {
            document.querySelectorAll(t).forEach(el => {
              const fs = getComputedStyle(el).fontSize;
              out[t === 'h4' ? 'headings' : t][fs] = (out[t === 'h4' ? 'headings' : t][fs] || 0) + 1;
            });
          });

          // Buttons
          document.querySelectorAll('button, .btn, a[class*="btn"], a.btn, button[type="submit"]').forEach(el => {
            const cs = getComputedStyle(el);
            out.btnH[cs.height] = (out.btnH[cs.height] || 0) + 1;
            out.btnR[cs.borderRadius] = (out.btnR[cs.borderRadius] || 0) + 1;
            out.btnP[cs.padding] = (out.btnP[cs.padding] || 0) + 1;
          });

          // Cards
          document.querySelectorAll('.card, [class*="rounded-2xl"], [class*="rounded-3xl"]').forEach(el => {
            const cs = getComputedStyle(el);
            out.cardShadow[cs.boxShadow] = (out.cardShadow[cs.boxShadow] || 0) + 1;
            out.cardR[cs.borderRadius] = (out.cardR[cs.borderRadius] || 0) + 1;
            out.cardP[cs.padding] = (out.cardP[cs.padding] || 0) + 1;
          });

          // Colors
          document.querySelectorAll('*').forEach(el => {
            const cs = getComputedStyle(el);
            out.textColor[cs.color] = (out.textColor[cs.color] || 0) + 1;
            if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent')
              out.bgColor[cs.backgroundColor] = (out.bgColor[cs.backgroundColor] || 0) + 1;
            if (cs.borderTopWidth !== '0px' && cs.borderTopColor !== 'rgba(0, 0, 0, 0)')
              out.borderColor[cs.borderTopColor] = (out.borderColor[cs.borderTopColor] || 0) + 1;
          });

          // Containers
          document.querySelectorAll('.container, [class*="container"]').forEach(el => {
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            out.containerW[Math.round(r.width)] = (out.containerW[Math.round(r.width)] || 0) + 1;
          });

          // Sections
          document.querySelectorAll('section, .section').forEach(el => {
            const cs = getComputedStyle(el);
            out.sectionPad[cs.paddingTop + ' / ' + cs.paddingBottom] = (out.sectionPad[cs.paddingTop + ' / ' + cs.paddingBottom] || 0) + 1;
          });

          // Gaps
          document.querySelectorAll('[class*="gap-"]').forEach(el => {
            const cs = getComputedStyle(el);
            if (cs.gap !== 'normal' && cs.gap !== '0px')
              out.gap[cs.gap] = (out.gap[cs.gap] || 0) + 1;
          });

          // Forms
          document.querySelectorAll('input, select, textarea').forEach(el => {
            const cs = getComputedStyle(el);
            out.inputH[cs.height] = (out.inputH[cs.height] || 0) + 1;
            out.inputs.total++;
            const id = el.id;
            const hasLabel = id && document.querySelector(`label[for="${id}"]`);
            const hasAria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
            if (!hasLabel && !hasAria) out.inputs.noLabel++;
          });
          document.querySelectorAll('label').forEach(el => {
            const cs = getComputedStyle(el);
            out.labelGap[cs.marginBottom] = (out.labelGap[cs.marginBottom] || 0) + 1;
          });

          // Images
          document.querySelectorAll('img').forEach(el => {
            out.images.total++;
            if (el.hasAttribute('alt') && el.alt !== '') out.images.withAlt++;
            else out.images.noAlt.push(el.src.slice(0, 80));
          });

          // Links
          document.querySelectorAll('a').forEach(el => {
            out.links.total++;
            if (!el.textContent.trim() && !el.querySelector('img, svg') && !el.getAttribute('aria-label'))
              out.links.empty.push(el.href);
          });

          return out;
        });
      } catch (e) {
        metrics = { error: e.message };
      }

      // Aggregate
      if (!metrics.error) {
        for (const k of Object.keys(metrics)) {
          if (aggregates[k] && typeof metrics[k] === 'object') {
            for (const [v, c] of Object.entries(metrics[k])) {
              if (typeof c === 'number') aggregates[k][v] = (aggregates[k][v] || 0) + c;
            }
          }
        }
        if (metrics.horizontalScroll) aggregates.issues.horizontalScroll.push(`${route}@${vp.name}`);
        if (metrics.images) {
          aggregates.issues.missingAlt.push(...metrics.images.noAlt.map(s => `${route}@${vp.name}: ${s}`));
        }
        if (metrics.links) {
          aggregates.issues.emptyLinks.push(...metrics.links.empty.map(s => `${route}@${vp.name}: ${s}`));
        }
      }

      report.pages.push({ route, viewport: vp.name, status, loadMs, metrics });
    }

    await ctx.close();
  }

  await browser.close();

  // Write outputs
  fs.writeFileSync(path.join(OUT, 'ui-audit-raw.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(OUT, 'ui-audit-aggregated.json'), JSON.stringify(aggregates, null, 2));

  // Compact summary
  const distinctCount = (obj) => obj ? Object.keys(obj).length : 0;
  const summary = {
    pagesAudited: report.pages.length,
    successfulPages: report.pages.filter(p => p.status === 200).length,
    distinctFontSizes: distinctCount(aggregates.h1Sizes) + distinctCount(aggregates.h2Sizes) + distinctCount(aggregates.h3Sizes),
    distinctH1Sizes: distinctCount(aggregates.h1),
    distinctH2Sizes: distinctCount(aggregates.h2),
    distinctH3Sizes: distinctCount(aggregates.h3),
    distinctButtonHeights: distinctCount(aggregates.btnH),
    distinctButtonRadii: distinctCount(aggregates.btnR),
    distinctButtonPaddings: distinctCount(aggregates.btnP),
    distinctCardShadows: distinctCount(aggregates.cardShadow),
    distinctCardRadii: distinctCount(aggregates.cardR),
    distinctCardPaddings: distinctCount(aggregates.cardP),
    distinctTextColors: distinctCount(aggregates.textColor),
    distinctBgColors: distinctCount(aggregates.bgColor),
    distinctBorderColors: distinctCount(aggregates.borderColor),
    distinctContainerWidths: distinctCount(aggregates.containerW),
    distinctSectionPads: distinctCount(aggregates.sectionPad),
    distinctGaps: distinctCount(aggregates.gap),
    distinctInputHeights: distinctCount(aggregates.inputH),
    pagesWithHScroll: aggregates.issues.horizontalScroll.length,
    imagesWithoutAlt: aggregates.issues.missingAlt.length,
    emptyLinks: aggregates.issues.emptyLinks.length,
    topH1: Object.entries(aggregates.h1 || {}).sort((a,b) => b[1]-a[1]).slice(0, 5),
    topH2: Object.entries(aggregates.h2 || {}).sort((a,b) => b[1]-a[1]).slice(0, 5),
    topH3: Object.entries(aggregates.h3 || {}).sort((a,b) => b[1]-a[1]).slice(0, 5),
    topBtnH: Object.entries(aggregates.btnH || {}).sort((a,b) => b[1]-a[1]).slice(0, 10),
    topBtnR: Object.entries(aggregates.btnR || {}).sort((a,b) => b[1]-a[1]).slice(0, 8),
    topBtnP: Object.entries(aggregates.btnP || {}).sort((a,b) => b[1]-a[1]).slice(0, 10),
    topCardShadow: Object.entries(aggregates.cardShadow || {}).sort((a,b) => b[1]-a[1]).slice(0, 5),
    topCardR: Object.entries(aggregates.cardR || {}).sort((a,b) => b[1]-a[1]).slice(0, 5),
    topContainerW: Object.entries(aggregates.containerW || {}).sort((a,b) => b[1]-a[1]).slice(0, 8),
    topSectionPad: Object.entries(aggregates.sectionPad || {}).sort((a,b) => b[1]-a[1]).slice(0, 8),
    topGap: Object.entries(aggregates.gap || {}).sort((a,b) => b[1]-a[1]).slice(0, 8),
    topInputH: Object.entries(aggregates.inputH || {}).sort((a,b) => b[1]-a[1]).slice(0, 8),
    hScrollPages: aggregates.issues.horizontalScroll.slice(0, 30),
    missingAltExamples: aggregates.issues.missingAlt.slice(0, 20),
    emptyLinksExamples: aggregates.issues.emptyLinks.slice(0, 20),
  };
  fs.writeFileSync(path.join(OUT, 'ui-audit-summary.json'), JSON.stringify(summary, null, 2));
  console.log('Done. Output: _audit/ui-audit/');
  console.log(JSON.stringify(summary, null, 2));
}

audit().catch(e => { console.error(e); process.exit(1); });
