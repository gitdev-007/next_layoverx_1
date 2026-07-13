const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'frontend');
const PORT = 8770;

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

const PAGES = [
  'index.html',
  'hotels.html',
  'airport-transfers.html',
  'my-itinerary.html',
  'how-it-works.html',
  'contact.html',
];

(async () => {
  await new Promise(r => server.listen(PORT, r));
  const outDir = path.join(__dirname, '..', '_qa');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();

  // Desktop
  const dCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const dPage = await dCtx.newPage();
  for (const p of PAGES) {
    await dPage.goto(`http://localhost:${PORT}/${p}`, { waitUntil: 'networkidle' });
    await dPage.waitForTimeout(500);
    const safe = p.replace('.html', '');
    await dPage.screenshot({ path: path.join(outDir, `${safe}-desktop.png`), fullPage: true });
  }

  // Measure all pages
  const report = {};
  for (const p of PAGES) {
    await dPage.goto(`http://localhost:${PORT}/${p}`, { waitUntil: 'networkidle' });
    await dPage.waitForTimeout(300);
    const data = await dPage.evaluate(() => {
      const results = { issues: [] };

      // 1) All headings - font sizes
      results.headings = [];
      document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) return;
        results.headings.push({
          tag: el.tagName,
          text: (el.textContent||'').trim().slice(0,50),
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          marginBottom: cs.marginBottom,
          color: cs.color,
          y: Math.round(rect.top + window.scrollY),
          h: Math.round(rect.height),
        });
      });

      // 2) All paragraphs
      results.paragraphs = [];
      document.querySelectorAll('p').forEach(el => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) return;
        results.paragraphs.push({
          text: (el.textContent||'').trim().slice(0,50),
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          color: cs.color,
          marginBottom: cs.marginBottom,
          y: Math.round(rect.top + window.scrollY),
          h: Math.round(rect.height),
        });
      });

      // 3) All sections with padding/margin
      results.sections = [];
      document.querySelectorAll('section, header, footer, [class*="section"]').forEach(el => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.height < 30) return;
        results.sections.push({
          cls: el.tagName + (el.className ? '.' + el.className.toString().split(/\s+/).slice(0,2).join('.') : ''),
          pt: cs.paddingTop,
          pb: cs.paddingBottom,
          mt: cs.marginTop,
          mb: cs.marginBottom,
          h: Math.round(rect.height),
          y: Math.round(rect.top + window.scrollY),
        });
      });

      // 4) All buttons/links that look like buttons
      results.buttons = [];
      document.querySelectorAll('button, a[class*="px-"]').forEach(el => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.height < 20 || rect.width < 20) return;
        const text = (el.textContent||'').trim().slice(0,30);
        if (!text) return;
        results.buttons.push({
          text,
          fontSize: cs.fontSize,
          padding: cs.padding,
          h: Math.round(rect.height),
          w: Math.round(rect.width),
          br: cs.borderRadius,
        });
      });

      // 5) Detect overlapping elements
      results.overlaps = [];
      const allEls = document.querySelectorAll('div, section, aside, article');
      for (let i = 0; i < Math.min(allEls.length, 200); i++) {
        const a = allEls[i];
        const ra = a.getBoundingClientRect();
        if (ra.height === 0 || ra.width === 0) continue;
        for (let j = i+1; j < Math.min(allEls.length, 200); j++) {
          const b = allEls[j];
          const rb = b.getBoundingClientRect();
          if (rb.height === 0 || rb.width === 0) continue;
          // Check if they overlap significantly
          const overlapX = Math.max(0, Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left));
          const overlapY = Math.max(0, Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top));
          const overlapArea = overlapX * overlapY;
          const minArea = Math.min(ra.width * ra.height, rb.width * rb.height);
          if (overlapArea > minArea * 0.3 && minArea > 1000) {
            results.overlaps.push({
              a: a.tagName + '.' + (a.className||'').toString().split(/\s+/)[0],
              b: b.tagName + '.' + (b.className||'').toString().split(/\s+/)[0],
              area: Math.round(overlapArea),
            });
          }
        }
      }

      // 6) Overflow detection
      results.overflow = [];
      document.querySelectorAll('*').forEach(el => {
        if (el.scrollWidth > el.clientWidth + 5 && el.clientWidth > 50) {
          const cs = getComputedStyle(el);
          if (cs.overflowX === 'hidden' || cs.overflowX === 'auto' || cs.overflowX === 'scroll') return;
          results.overflow.push({
            tag: el.tagName + '.' + (el.className||'').toString().split(/\s+/)[0],
            sw: el.scrollWidth,
            cw: el.clientWidth,
          });
        }
      });

      return results;
    });
    report[p] = data;
  }

  fs.writeFileSync(path.join(outDir, 'full-report.json'), JSON.stringify(report, null, 2));

  // Tablet
  await dCtx.close();
  const tCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const tPage = await tCtx.newPage();
  for (const p of PAGES) {
    await tPage.goto(`http://localhost:${PORT}/${p}`, { waitUntil: 'networkidle' });
    await tPage.waitForTimeout(300);
    const safe = p.replace('.html', '');
    await tPage.screenshot({ path: path.join(outDir, `${safe}-tablet.png`), fullPage: true });
  }
  await tCtx.close();

  // Mobile
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mCtx.newPage();
  for (const p of PAGES) {
    await mPage.goto(`http://localhost:${PORT}/${p}`, { waitUntil: 'networkidle' });
    await mPage.waitForTimeout(300);
    const safe = p.replace('.html', '');
    await mPage.screenshot({ path: path.join(outDir, `${safe}-mobile.png`), fullPage: true });
  }
  await mCtx.close();

  await browser.close();
  server.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
