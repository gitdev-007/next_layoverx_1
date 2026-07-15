const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'frontend');
const PORT = 8771;
const OUT = path.join(__dirname, '..', '_audit');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/') url = '/index.html';
  const file = path.join(ROOT, url);
  if (!file.startsWith(ROOT)) { res.statusCode = 403; return res.end('forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.statusCode = 404; return res.end('not found'); }
    const ext = path.extname(file).toLowerCase();
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.end(data);
  });
});

const PUBLIC_PAGES = [
  'index.html','hotels.html','restaurants.html','spa-wellness.html','gaming-entertainment.html',
  'experiences.html','airport-transfers.html','how-it-works.html','contact.html','plan-my-layover.html',
  'partner-registration.html','service-details.html','help-center.html','faq.html','terms.html','privacy.html',
];

const PRIVATE_PAGES = [
  'my-itinerary.html','checkout.html','my-trips.html','my-profile.html','account-settings.html',
  'saved-itineraries.html','trip-details.html','booking-review.html','payment-selection.html',
  'booking-confirmation.html','supplier-dashboard.html','supplier-status.html','revenue-admin.html','notifications.html',
];

const ALL_PAGES = [...PUBLIC_PAGES, ...PRIVATE_PAGES];

const PUBLIC_BPS = [
  { name: 'mobile-xs', width: 320, height: 700 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'ultrawide', width: 1920, height: 1080 },
];
const PRIVATE_BPS = [{ name: 'desktop', width: 1280, height: 800 }];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function collectData(page) {
  return page.evaluate(() => {
    const results = {
      headings: [], paragraphs: [], sections: [], buttons: [], cards: [], inputs: [],
      overlaps: [], overflow: [], touchTargets: [], headingOrder: [], ariaIssues: [],
      containerWidths: [],
    };

    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => {
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return;
      results.headings.push({
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 80),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        marginBottom: cs.marginBottom,
        color: cs.color,
        y: Math.round(rect.top + window.scrollY),
      });
    });

    const hEls = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    let lastLevel = 0;
    hEls.forEach(el => {
      const level = parseInt(el.tagName[1]);
      if (lastLevel && level > lastLevel + 1) {
        results.headingOrder.push({ issue: 'skipped-level', from: 'h' + lastLevel, to: 'h' + level, text: el.textContent.trim().slice(0, 50) });
      }
      lastLevel = level;
    });
    const h1s = hEls.filter(e => e.tagName === 'H1');
    if (h1s.length === 0) results.headingOrder.push({ issue: 'missing-h1' });
    if (h1s.length > 1) results.headingOrder.push({ issue: 'multiple-h1', count: h1s.length });

    document.querySelectorAll('p').forEach(el => {
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return;
      results.paragraphs.push({
        text: (el.textContent || '').trim().slice(0, 80),
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        color: cs.color,
        marginBottom: cs.marginBottom,
        y: Math.round(rect.top + window.scrollY),
      });
    });

    document.querySelectorAll('section, header, footer').forEach(el => {
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.height < 30) return;
      results.sections.push({
        tag: el.tagName,
        cls: (el.className || '').toString().split(/\s+/).slice(0, 2).join('.'),
        pt: cs.paddingTop,
        pb: cs.paddingBottom,
        mt: cs.marginTop,
        mb: cs.marginBottom,
        h: Math.round(rect.height),
        y: Math.round(rect.top + window.scrollY),
      });
    });

    const buttonLike = Array.from(document.querySelectorAll('button, a[class*="btn"], a[class*="px-"], [role="button"]'));
    buttonLike.forEach(el => {
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.height < 12 || rect.width < 12) return;
      const text = (el.textContent || '').trim().slice(0, 40);
      if (!text) return;
      results.buttons.push({
        text, fontSize: cs.fontSize, padding: cs.padding,
        h: Math.round(rect.height), w: Math.round(rect.width),
        br: cs.borderRadius, bg: cs.backgroundColor, color: cs.color,
      });
      if (rect.width < 44 || rect.height < 44) {
        results.touchTargets.push({ text, w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    });

    document.querySelectorAll('.card, article, [class*="card"]').forEach(el => {
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.height < 40 || rect.width < 40) return;
      results.cards.push({
        cls: (el.className || '').toString().split(/\s+/).slice(0, 2).join('.'),
        h: Math.round(rect.height), w: Math.round(rect.width),
        padding: cs.padding, br: cs.borderRadius, shadow: cs.boxShadow,
      });
    });

    document.querySelectorAll('input, select, textarea').forEach(el => {
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return;
      results.inputs.push({
        type: el.type || el.tagName,
        h: Math.round(rect.height), w: Math.round(rect.width),
        fontSize: cs.fontSize, padding: cs.padding,
      });
    });

    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('alt') && !img.getAttribute('aria-label') && !img.getAttribute('aria-labelledby')) {
        results.ariaIssues.push({ issue: 'missing-alt', src: (img.src || '').slice(-40) });
      }
    });
    document.querySelectorAll('a').forEach(a => {
      if (!a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img, svg, [aria-label]')) {
        results.ariaIssues.push({ issue: 'empty-link', href: (a.getAttribute('href') || '').slice(0, 40) });
      }
    });
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.textContent.trim() && !btn.getAttribute('aria-label') && !btn.querySelector('img, svg, [aria-label]')) {
        results.ariaIssues.push({ issue: 'empty-button' });
      }
    });

    document.querySelectorAll('.container').forEach(el => {
      const rect = el.getBoundingClientRect();
      results.containerWidths.push(Math.round(rect.width));
    });

    document.querySelectorAll('body, body > *').forEach(el => {
      if (el.scrollWidth > el.clientWidth + 2) {
        const cs = getComputedStyle(el);
        if (['hidden', 'auto', 'scroll'].includes(cs.overflowX)) return;
        if (el.tagName === 'HTML' || el.tagName === 'BODY') return;
        results.overflow.push({
          tag: el.tagName,
          cls: (el.className || '').toString().split(/\s+/)[0],
          sw: el.scrollWidth, cw: el.clientWidth,
        });
      }
    });

    const allEls = Array.from(document.querySelectorAll('div, section, aside, article, header, footer'));
    for (let i = 0; i < Math.min(allEls.length, 100); i++) {
      const a = allEls[i];
      const ra = a.getBoundingClientRect();
      if (ra.height === 0 || ra.width === 0) continue;
      for (let j = i + 1; j < Math.min(allEls.length, 100); j++) {
        const b = allEls[j];
        const rb = b.getBoundingClientRect();
        if (rb.height === 0 || rb.width === 0) continue;
        const overlapX = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
        const overlapY = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
        const overlapArea = overlapX * overlapY;
        const minArea = Math.min(ra.width * ra.height, rb.width * rb.height);
        if (overlapArea > minArea * 0.4 && minArea > 1200) {
          results.overlaps.push({
            a: a.tagName + '.' + (a.className || '').toString().split(/\s+/)[0],
            b: b.tagName + '.' + (b.className || '').toString().split(/\s+/)[0],
            area: Math.round(overlapArea),
          });
        }
      }
    }

    return results;
  });
}

async function auditPage(page, pageName, bp, takeShot = true) {
  // Some dynamic pages require query params to avoid redirect loops
  const pageUrlMap = {
    'service-details.html': 'service-details.html?type=hotel&id=1',
    'trip-details.html': 'trip-details.html?id=1',
  };
  const url = `http://localhost:${PORT}/${pageUrlMap[pageName] || pageName}`;
  await page.setViewportSize({ width: bp.width, height: bp.height });
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
  } catch (e) {
    console.warn(`  navigation issue for ${pageName} @ ${bp.name}: ${e.message}`);
    try { await page.goto(url, { waitUntil: 'load' }); } catch (e2) {
      console.warn(`  fallback load failed for ${pageName} @ ${bp.name}`);
      return { screenshot: null, data: { headings:[], paragraphs:[], sections:[], buttons:[], cards:[], inputs:[], overlaps:[], overflow:[], touchTargets:[], headingOrder:[], ariaIssues:[], containerWidths:[], error: e2.message } };
    }
  }
  await sleep(400);
  try {
    await page.evaluate(() => { if (document.body) window.scrollTo(0, document.body.scrollHeight); });
    await sleep(200);
    await page.evaluate(() => { if (document.body) window.scrollTo(0, 0); });
    await sleep(100);
  } catch(e) { console.warn(`  scroll issue for ${pageName} @ ${bp.name}: ${e.message}`); }

  const shotName = pageName.replace('.html', '') + '-' + bp.name + '.png';
  const shotPath = path.join(OUT, 'screenshots', shotName);
  if (takeShot) {
    await page.screenshot({ path: shotPath, fullPage: true });
  }

  let data;
  try {
    data = await collectData(page);
  } catch (e) {
    console.warn(`  evaluate failed for ${pageName} @ ${bp.name}: ${e.message}`);
    data = { headings:[], paragraphs:[], sections:[], buttons:[], cards:[], inputs:[], overlaps:[], overflow:[], touchTargets:[], headingOrder:[], ariaIssues:[], containerWidths:[], error: e.message };
  }
  return { screenshot: takeShot ? shotPath : null, data };
}

async function auditInteractions(page, pageName) {
  const url = `http://localhost:${PORT}/${pageName}`;
  await page.setViewportSize({ width: 1280, height: 800 });
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
  } catch (e) {
    console.warn(`  navigation issue for interactions ${pageName}: ${e.message}`);
    try { await page.goto(url, { waitUntil: 'load' }); } catch (e2) { return []; }
  }
  await sleep(400);

  const states = [];

  const menuBtn = await page.$('#menu-btn');
  if (menuBtn) {
    await menuBtn.click();
    await sleep(300);
    await page.screenshot({ path: path.join(OUT, 'screenshots', pageName.replace('.html', '') + '-mobile-menu.png'), fullPage: false });
    states.push('mobile-menu');
    await menuBtn.click();
    await sleep(200);
  }

  const loginTrigger = await page.$('a[href="#login"], button[onclick*="openAuthModal(\'login\')"]');
  if (loginTrigger) {
    await loginTrigger.click();
    await sleep(400);
    await page.screenshot({ path: path.join(OUT, 'screenshots', pageName.replace('.html', '') + '-login-modal.png'), fullPage: false });
    states.push('login-modal');
    await page.keyboard.press('Escape');
    await sleep(200);
  }

  return states;
}

(async () => {
  await new Promise(r => server.listen(PORT, r));
  fs.mkdirSync(path.join(OUT, 'screenshots'), { recursive: true });

  const browser = await chromium.launch();
  const report = { pages: {}, summary: { totalPages: ALL_PAGES.length, breakpoints: PUBLIC_BPS.map(b => b.name), issues: [] } };

  for (const pageName of ALL_PAGES) {
    const isPublic = PUBLIC_PAGES.includes(pageName);
    const bps = isPublic ? PUBLIC_BPS : PRIVATE_BPS;
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();

    report.pages[pageName] = {};
    for (const bp of bps) {
      const result = await auditPage(page, pageName, bp, /* takeShot */ isPublic || bp.name === 'desktop');
      report.pages[pageName][bp.name] = result;
    }

    if (isPublic) {
      try {
        const states = await auditInteractions(page, pageName);
        report.pages[pageName].interactionStates = states;
      } catch (e) { report.pages[pageName].interactionStates = []; }
    }

    await ctx.close();
    console.log(`Audited ${pageName}`);
  }

  const issueSet = new Set();
  for (const pageName of Object.keys(report.pages)) {
    for (const bpName of Object.keys(report.pages[pageName])) {
      if (bpName === 'interactionStates') continue;
      const d = report.pages[pageName][bpName].data;
      if (d.overflow.length) issueSet.add(`${pageName}@${bpName}: ${d.overflow.length} overflow elements`);
      if (d.overlaps.length) issueSet.add(`${pageName}@${bpName}: ${d.overlaps.length} overlaps`);
      if (d.touchTargets.length) issueSet.add(`${pageName}@${bpName}: ${d.touchTargets.length} small touch targets`);
      if (d.ariaIssues.length) issueSet.add(`${pageName}@${bpName}: ${d.ariaIssues.length} ARIA issues`);
      if (d.headingOrder.length) issueSet.add(`${pageName}@${bpName}: ${d.headingOrder.length} heading-order issues`);
    }
  }
  report.summary.issues = Array.from(issueSet);

  fs.writeFileSync(path.join(OUT, 'audit-report.json'), JSON.stringify(report, null, 2));

  await browser.close();
  server.close();

  console.log('\nAudit complete. Output: ' + OUT);
  console.log('Total issue signatures: ' + report.summary.issues.length);
})().catch(e => { console.error(e); process.exit(1); });
