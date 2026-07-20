import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const screensDir = path.join(rootDir, '_screens');

if (!fs.existsSync(screensDir)) {
  fs.mkdirSync(screensDir, { recursive: true });
}

const pages = [
  'index.html',
  'hotels.html',
  'restaurants.html',
  'spa-wellness.html',
  'gaming-entertainment.html',
  'experiences.html',
  'airport-transfers.html',
  'how-it-works.html',
  'contact.html',
  'plan-my-layover.html',
  'checkout.html',
  'my-itinerary.html',
  'supplier-dashboard.html',
  'revenue-admin.html'
];

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'desktop-1920', width: 1920, height: 1080 }
];

// Simple static file server
const server = http.createServer((req, res) => {
  const filePath = path.join(frontendDir, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(8765, async () => {
  console.log('Server running at http://localhost:8765');

  const browser = await chromium.launch();
  const context = await browser.newContext();

  for (const pageName of pages) {
    const page = await context.newPage();
    const url = `http://localhost:8765/${pageName}`;
    console.log(`Capturing ${pageName}...`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for fonts and images to settle
      await page.waitForTimeout(2000);

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(500);

        const safeName = pageName.replace('.html', '');
        const screenshotPath = path.join(screensDir, `${safeName}-${viewport.name}.png`);

        await page.screenshot({
          path: screenshotPath,
          fullPage: true
        });

        console.log(`  ✓ ${viewport.name}`);
      }
    } catch (error) {
      console.error(`  ✗ Error capturing ${pageName}:`, error.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log('Screenshots captured.');
});
