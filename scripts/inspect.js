const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'frontend');
const PORT = 8766;
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
  const outDir = path.join(__dirname, '..', '_screens');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  for (const p of PAGES) {
    await page.goto(`http://localhost:${PORT}/${p}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const safe = p.replace('.html','');
    await page.screenshot({ path: path.join(outDir, `${safe}-desktop.png`), fullPage: true });
    console.log('shot', p);
  }

  // Mobile pass for representative pages
  await ctx.close();
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mctx.newPage();
  for (const p of PAGES) {
    await mp.goto(`http://localhost:${PORT}/${p}`, { waitUntil: 'networkidle' });
    await mp.waitForTimeout(400);
    const safe = p.replace('.html','');
    await mp.screenshot({ path: path.join(outDir, `${safe}-mobile.png`), fullPage: true });
  }

  await browser.close();
  server.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
