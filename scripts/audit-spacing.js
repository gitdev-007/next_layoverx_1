const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('frontend');
const PORT = 8789;
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

const PAGES = [
  'index.html', 'hotels.html', 'restaurants.html', 'spa-wellness.html', 'gaming-entertainment.html',
  'experiences.html', 'airport-transfers.html', 'how-it-works.html', 'contact.html', 'plan-my-layover.html',
  'partner-registration.html', 'service-details.html', 'help-center.html', 'faq.html', 'terms.html', 'privacy.html',
  'my-itinerary.html', 'checkout.html', 'my-trips.html', 'my-profile.html', 'account-settings.html',
  'saved-itineraries.html', 'trip-details.html', 'booking-review.html', 'payment-selection.html',
  'booking-confirmation.html', 'supplier-dashboard.html', 'supplier-status.html', 'revenue-admin.html', 'notifications.html',
];

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

(async () => {
  server.listen(PORT);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const allSpacingData = {};

  for (const pageName of PAGES) {
    try {
      await page.goto(`http://localhost:${PORT}/${pageName}`, { waitUntil: 'networkidle' });
      const data = await page.evaluate(() => {
        const sections = Array.from(document.querySelectorAll('section, .section'));
        return sections.map(s => {
          const cs = getComputedStyle(s);
          return {
            text: s.textContent.trim().slice(0, 30),
            paddingTop: cs.paddingTop,
            paddingBottom: cs.paddingBottom,
            marginTop: cs.marginTop,
            marginBottom: cs.marginBottom,
            classes: s.className
          };
        });
      });
      allSpacingData[pageName] = data;
    } catch (e) {
      allSpacingData[pageName] = `Error: ${e.message}`;
    }
  }

  console.log(JSON.stringify(allSpacingData, null, 2));
  await browser.close();
  server.close();
})();
