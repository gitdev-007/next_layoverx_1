const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'frontend');
const PORT = 8767;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
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

const PAGES = ['index.html','hotels.html','airport-transfers.html','my-itinerary.html','how-it-works.html','contact.html'];

(async () => {
  await new Promise(r => server.listen(PORT, r));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  const report = {};

  for (const p of PAGES) {
    await page.goto(`http://localhost:${PORT}/${p}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // Extract typography & spacing issues
    const data = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const body = getComputedStyle(document.body);
      const rootFontSize = parseFloat(root.fontSize);

      // 1) Find all headings & their computed sizes
      const headings = [];
      document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        headings.push({
          tag: el.tagName,
          text: (el.textContent || '').trim().slice(0, 60),
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          fontWeight: cs.fontWeight,
          marginBottom: cs.marginBottom,
          color: cs.color,
          height: Math.round(rect.height),
          width: Math.round(rect.width),
        });
      });

      // 2) Find paragraphs and any with mismatched sizes
      const paragraphs = [];
      document.querySelectorAll('p').forEach((el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) return;
        const px = parseFloat(cs.fontSize);
        paragraphs.push({
          text: (el.textContent || '').trim().slice(0, 60),
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          color: cs.color,
          height: Math.round(rect.height),
          marginBottom: cs.marginBottom,
        });
      });

      // 3) Sections and their padding/margin
      const sections = [];
      document.querySelectorAll('section, header, footer, main > div').forEach((el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.height < 50) return;
        sections.push({
          tag: el.tagName + (el.id ? '#'+el.id : '') + (el.className ? '.'+(el.className.toString().split(/\s+/).slice(0,2).join('.')) : ''),
          paddingTop: cs.paddingTop,
          paddingBottom: cs.paddingBottom,
          marginTop: cs.marginTop,
          marginBottom: cs.marginBottom,
          height: Math.round(rect.height),
        });
      });

      // 4) Cards
      const cards = [];
      document.querySelectorAll('.card, [class*="rounded-2xl"], [class*="rounded-3xl"]').forEach((el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.height < 40) return;
        cards.push({
          cls: el.className.toString().slice(0, 80),
          padding: cs.padding,
          gap: cs.gap,
          borderRadius: cs.borderRadius,
          height: Math.round(rect.height),
          width: Math.round(rect.width),
        });
      });

      // 5) Buttons
      const buttons = [];
      document.querySelectorAll('button, a.btn, a[class*="px-"]').forEach((el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.height < 20) return;
        const text = (el.textContent || '').trim().slice(0, 30);
        if (!text) return;
        buttons.push({
          text,
          fontSize: cs.fontSize,
          padding: cs.padding,
          height: Math.round(rect.height),
          width: Math.round(rect.width),
          borderRadius: cs.borderRadius,
        });
      });

      // 6) Detect overlapping/broken-layout: zero-height containers with content, or overflow
      const overflows = [];
      document.querySelectorAll('*').forEach((el) => {
        if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
          const cs = getComputedStyle(el);
          if (cs.overflowX === 'hidden' || cs.overflowX === 'auto' || cs.overflowX === 'scroll') return;
          overflows.push({
            tag: el.tagName + (el.className ? '.'+(el.className.toString().split(/\s+/)[0] || '') : ''),
            scrollW: el.scrollWidth,
            clientW: el.clientWidth,
          });
        }
      });

      return {
        rootFontSize,
        bodyFontSize: body.fontSize,
        bodyLineHeight: body.lineHeight,
        headings: headings.slice(0, 60),
        paragraphs: paragraphs.slice(0, 60),
        sections: sections.slice(0, 30),
        cards: cards.slice(0, 20),
        buttons: buttons.slice(0, 30),
        overflows: overflows.slice(0, 10),
      };
    });

    report[p] = data;
  }

  fs.writeFileSync(path.join(__dirname, '..', '_screens', 'report.json'), JSON.stringify(report, null, 2));
  await browser.close();
  server.close();
  console.log('report written');
})().catch(e => { console.error(e); process.exit(1); });
