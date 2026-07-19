/**
 * LayoverX Live Site UI Style Audit (Phase 1)
 * Crawls major routes and extracts computed styles for typography, color, spacing.
 *
 * Usage: node scripts/ui-style-audit.mjs
 * Optional: BASE_URL=https://next-layoverx-1.vercel.app node scripts/ui-style-audit.mjs
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE_URL = (process.env.BASE_URL || 'https://next-layoverx-1.vercel.app').replace(/\/$/, '');
const OUT_DIR = join(ROOT, 'audit-reports');
const OUT_JSON = join(OUT_DIR, 'ui-style-audit.json');
const OUT_SUMMARY = join(OUT_DIR, 'ui-style-audit-summary.json');

/** Major public + key flow routes */
const ROUTES = [
  '/',
  '/index.html',
  '/hotels.html',
  '/restaurants.html',
  '/spa-wellness.html',
  '/gaming-entertainment.html',
  '/experiences.html',
  '/airport-transfers.html',
  '/plan-my-layover.html',
  '/how-it-works.html',
  '/contact.html',
  '/faq.html',
  '/help-center.html',
  '/privacy.html',
  '/terms.html',
  '/partner-registration.html',
  '/my-itinerary.html',
  '/my-trips.html',
  '/my-profile.html',
  '/account-settings.html',
  '/saved-itineraries.html',
  '/service-details.html',
  '/checkout.html',
  '/booking-review.html',
  '/payment-selection.html',
  '/booking-confirmation.html',
  '/notifications.html',
  '/supplier-dashboard.html',
  '/supplier-status.html',
  '/revenue-admin.html',
];

const TYPO_TAGS = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'a', 'button', 'label', 'li'];
const MAX_SAMPLES_PER_TAG = 25;

function bump(map, key) {
  if (!key) return;
  map[key] = (map[key] || 0) + 1;
}

function styleKey(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

async function extractPageStyles(page, route) {
  return page.evaluate(
    ({ typoTags, maxSamples }) => {
      const pick = (cs, props) => {
        const out = {};
        for (const p of props) out[p] = cs.getPropertyValue(p).trim();
        return out;
      };

      const isVisible = (el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
        if (r.width < 1 && r.height < 1) return false;
        return true;
      };

      const typography = {};
      for (const tag of typoTags) {
        const els = [...document.querySelectorAll(tag)].filter(isVisible).slice(0, maxSamples);
        typography[tag] = els.map((el, i) => {
          const cs = getComputedStyle(el);
          return {
            index: i,
            text: (el.textContent || '').trim().slice(0, 80),
            className: (el.className && String(el.className).slice?.(0, 120)) || '',
            styles: pick(cs, [
              'font-family',
              'font-size',
              'font-weight',
              'line-height',
              'letter-spacing',
              'color',
              'text-transform',
            ]),
          };
        });
      }

      const buttonSelectors = [
        'button',
        'a.btn',
        '[class*="btn"]',
        'a[class*="bg-sky"]',
        'a[class*="rounded"]',
        'input[type="submit"]',
      ];
      const buttonEls = [];
      const seenButtons = new Set();
      for (const sel of buttonSelectors) {
        for (const el of document.querySelectorAll(sel)) {
          if (!isVisible(el) || seenButtons.has(el)) continue;
          seenButtons.add(el);
          buttonEls.push(el);
          if (buttonEls.length >= 40) break;
        }
        if (buttonEls.length >= 40) break;
      }

      const buttons = buttonEls.map((el, i) => {
        const cs = getComputedStyle(el);
        return {
          index: i,
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 60),
          className: (el.className && String(el.className).slice?.(0, 160)) || '',
          styles: pick(cs, [
            'font-family',
            'font-size',
            'font-weight',
            'line-height',
            'color',
            'background-color',
            'border-top-color',
            'border-top-width',
            'border-radius',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'margin-top',
            'margin-bottom',
          ]),
        };
      });

      const sectionSelectors = [
        'section',
        'header',
        'footer',
        'main',
        'nav',
        '.section',
        '.container',
        '[class*="grid"]',
        '[class*="flex"]',
        'article',
        'aside',
      ];
      const layoutEls = [];
      const seenLayout = new Set();
      for (const sel of sectionSelectors) {
        for (const el of document.querySelectorAll(sel)) {
          if (!isVisible(el) || seenLayout.has(el)) continue;
          seenLayout.add(el);
          layoutEls.push(el);
          if (layoutEls.length >= 60) break;
        }
        if (layoutEls.length >= 60) break;
      }

      const layout = layoutEls.map((el, i) => {
        const cs = getComputedStyle(el);
        return {
          index: i,
          tag: el.tagName.toLowerCase(),
          id: el.id || '',
          className: (el.className && String(el.className).slice?.(0, 160)) || '',
          styles: pick(cs, [
            'display',
            'flex-direction',
            'justify-content',
            'align-items',
            'gap',
            'row-gap',
            'column-gap',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'color',
            'background-color',
            'border-top-color',
            'border-top-width',
            'max-width',
            'width',
          ]),
        };
      });

      const colorTargets = [
        ...document.querySelectorAll('section, header, footer, main, .card, [class*="card"], button, a.btn'),
      ]
        .filter(isVisible)
        .slice(0, 50)
        .map((el, i) => {
          const cs = getComputedStyle(el);
          return {
            index: i,
            tag: el.tagName.toLowerCase(),
            className: (el.className && String(el.className).slice?.(0, 120)) || '',
            styles: pick(cs, ['color', 'background-color', 'border-top-color', 'border-top-width']),
          };
        });

      return {
        title: document.title,
        typography,
        buttons,
        layout,
        colors: colorTargets,
        viewport: { width: window.innerWidth, height: window.innerHeight },
      };
    },
    { typoTags: TYPO_TAGS, maxSamples: MAX_SAMPLES_PER_TAG }
  );
}

function aggregateGlobal(pages) {
  const fontSizesByTag = {};
  const fontWeightsByTag = {};
  const fontFamilies = {};
  const lineHeightsByTag = {};
  const textColors = {};
  const bgColors = {};
  const borderColors = {};
  const paddings = {};
  const margins = {};
  const gaps = {};
  const buttonFontSizes = {};
  const buttonPaddings = {};
  const sectionPaddings = {};

  for (const page of pages) {
    if (!page.ok || !page.styles) continue;

    for (const [tag, samples] of Object.entries(page.styles.typography || {})) {
      if (!fontSizesByTag[tag]) fontSizesByTag[tag] = {};
      if (!fontWeightsByTag[tag]) fontWeightsByTag[tag] = {};
      if (!lineHeightsByTag[tag]) lineHeightsByTag[tag] = {};
      for (const s of samples) {
        bump(fontSizesByTag[tag], s.styles['font-size']);
        bump(fontWeightsByTag[tag], s.styles['font-weight']);
        bump(lineHeightsByTag[tag], s.styles['line-height']);
        bump(fontFamilies, s.styles['font-family']);
        bump(textColors, s.styles.color);
      }
    }

    for (const b of page.styles.buttons || []) {
      bump(buttonFontSizes, b.styles['font-size']);
      bump(bgColors, b.styles['background-color']);
      bump(textColors, b.styles.color);
      bump(borderColors, b.styles['border-top-color']);
      const pad = `${b.styles['padding-top']} ${b.styles['padding-right']} ${b.styles['padding-bottom']} ${b.styles['padding-left']}`;
      bump(buttonPaddings, pad);
    }

    for (const l of page.styles.layout || []) {
      bump(bgColors, l.styles['background-color']);
      bump(textColors, l.styles.color);
      bump(borderColors, l.styles['border-top-color']);
      const pad = `${l.styles['padding-top']} ${l.styles['padding-right']} ${l.styles['padding-bottom']} ${l.styles['padding-left']}`;
      const mar = `${l.styles['margin-top']} ${l.styles['margin-right']} ${l.styles['margin-bottom']} ${l.styles['margin-left']}`;
      bump(paddings, pad);
      bump(margins, mar);
      bump(gaps, l.styles.gap || l.styles['row-gap']);
      if (l.tag === 'section' || (l.className || '').includes('section')) {
        bump(sectionPaddings, pad);
      }
    }

    for (const c of page.styles.colors || []) {
      bump(textColors, c.styles.color);
      bump(bgColors, c.styles['background-color']);
      bump(borderColors, c.styles['border-top-color']);
    }
  }

  const sortFreq = (obj) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count }));

  const uniqueCount = (obj) => Object.keys(obj).length;

  const debtHints = [];
  for (const [tag, sizes] of Object.entries(fontSizesByTag)) {
    const n = uniqueCount(sizes);
    if (n >= 4) {
      debtHints.push({
        type: 'typography',
        severity: n >= 6 ? 'high' : 'medium',
        message: `${tag} uses ${n} distinct font-size values`,
        values: sortFreq(sizes).slice(0, 12),
      });
    }
  }

  const padUnique = uniqueCount(paddings);
  if (padUnique >= 15) {
    debtHints.push({
      type: 'spacing',
      severity: 'high',
      message: `Layout wrappers use ${padUnique} distinct padding combinations`,
      topValues: sortFreq(paddings).slice(0, 20),
    });
  }

  const sectionPadUnique = uniqueCount(sectionPaddings);
  if (sectionPadUnique >= 4) {
    debtHints.push({
      type: 'spacing',
      severity: 'medium',
      message: `Sections use ${sectionPadUnique} distinct padding combinations`,
      values: sortFreq(sectionPaddings),
    });
  }

  const btnPadUnique = uniqueCount(buttonPaddings);
  if (btnPadUnique >= 5) {
    debtHints.push({
      type: 'buttons',
      severity: 'medium',
      message: `Buttons use ${btnPadUnique} distinct padding combinations`,
      values: sortFreq(buttonPaddings).slice(0, 15),
    });
  }

  const btnSizeUnique = uniqueCount(buttonFontSizes);
  if (btnSizeUnique >= 4) {
    debtHints.push({
      type: 'buttons',
      severity: 'medium',
      message: `Buttons use ${btnSizeUnique} distinct font-size values`,
      values: sortFreq(buttonFontSizes),
    });
  }

  const colorUnique = uniqueCount(textColors);
  if (colorUnique >= 12) {
    debtHints.push({
      type: 'color',
      severity: 'high',
      message: `${colorUnique} distinct text colors found`,
      topValues: sortFreq(textColors).slice(0, 20),
    });
  }

  const bgUnique = uniqueCount(bgColors);
  if (bgUnique >= 12) {
    debtHints.push({
      type: 'color',
      severity: 'medium',
      message: `${bgUnique} distinct background colors found`,
      topValues: sortFreq(bgColors).slice(0, 20),
    });
  }

  return {
    fontFamilies: sortFreq(fontFamilies),
    fontSizesByTag: Object.fromEntries(
      Object.entries(fontSizesByTag).map(([tag, sizes]) => [tag, sortFreq(sizes)])
    ),
    fontWeightsByTag: Object.fromEntries(
      Object.entries(fontWeightsByTag).map(([tag, sizes]) => [tag, sortFreq(sizes)])
    ),
    lineHeightsByTag: Object.fromEntries(
      Object.entries(lineHeightsByTag).map(([tag, sizes]) => [tag, sortFreq(sizes)])
    ),
    textColors: sortFreq(textColors),
    backgroundColors: sortFreq(bgColors),
    borderColors: sortFreq(borderColors),
    layoutPaddings: sortFreq(paddings).slice(0, 40),
    layoutMargins: sortFreq(margins).slice(0, 40),
    gaps: sortFreq(gaps),
    buttonFontSizes: sortFreq(buttonFontSizes),
    buttonPaddings: sortFreq(buttonPaddings),
    sectionPaddings: sortFreq(sectionPaddings),
    debtHints,
    counts: {
      uniqueTextColors: colorUnique,
      uniqueBgColors: bgUnique,
      uniqueLayoutPaddings: padUnique,
      uniqueSectionPaddings: sectionPadUnique,
      uniqueButtonPaddings: btnPadUnique,
      uniqueButtonFontSizes: btnSizeUnique,
      uniqueFontFamilies: uniqueCount(fontFamilies),
      uniqueGaps: uniqueCount(gaps),
    },
  };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Auditing ${BASE_URL}`);
  console.log(`Routes: ${ROUTES.length}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 LayoverX-UI-Audit/1.0',
  });

  const pages = [];
  const startedAt = new Date().toISOString();

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    const page = await context.newPage();
    const entry = { route, url, ok: false, status: null, error: null, styles: null };

    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      entry.status = res ? res.status() : null;
      if (!res || res.status() >= 400) {
        entry.error = `HTTP ${entry.status}`;
        console.log(`  FAIL ${route} (${entry.status})`);
      } else {
        // Settle layout / fonts (avoid networkidle — Maps/analytics never idle)
        await page.waitForTimeout(800);
        entry.styles = await extractPageStyles(page, route);
        entry.ok = true;
        const h1n = entry.styles.typography?.h1?.length ?? 0;
        const h2n = entry.styles.typography?.h2?.length ?? 0;
        const btn = entry.styles.buttons?.length ?? 0;
        console.log(`  OK   ${route}  h1=${h1n} h2=${h2n} buttons=${btn}`);
      }
    } catch (err) {
      entry.error = err.message || String(err);
      console.log(`  ERR  ${route}  ${entry.error}`);
    } finally {
      pages.push(entry);
      await page.close();
    }
  }

  await browser.close();

  const summary = aggregateGlobal(pages.filter((p) => p.ok));
  const report = {
    meta: {
      baseUrl: BASE_URL,
      startedAt,
      finishedAt: new Date().toISOString(),
      viewport: { width: 1440, height: 900 },
      routeCount: ROUTES.length,
      okCount: pages.filter((p) => p.ok).length,
      failCount: pages.filter((p) => !p.ok).length,
    },
    summary,
    pages,
  };

  writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), 'utf8');
  writeFileSync(
    OUT_SUMMARY,
    JSON.stringify({ meta: report.meta, summary: report.summary }, null, 2),
    'utf8'
  );

  console.log('\n--- Debt hints ---');
  for (const hint of summary.debtHints) {
    console.log(`[${hint.severity}] ${hint.type}: ${hint.message}`);
  }
  console.log(`\nWrote ${OUT_JSON}`);
  console.log(`Wrote ${OUT_SUMMARY}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
