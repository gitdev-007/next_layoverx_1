import { chromium } from 'playwright';
import { spawn } from 'child_process';
import http from 'http';

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode < 500) resolve(true);
          else reject(new Error(`Status ${res.statusCode}`));
        });
        req.on('error', reject);
        req.end();
      });
      return true;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(`Server at ${url} did not respond within ${timeoutMs}ms`);
}

async function runQA() {
  console.log('🚀 Starting Next.js server for Playwright Visual QA...');
  const nextProcess = spawn('npx', ['next', 'start', '-p', '3000'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'inherit',
  });

  try {
    await waitForServer('http://localhost:3000');
    console.log('✅ Server online at http://localhost:3000. Launching Playwright browser...');

    const browser = await chromium.launch({ headless: true });
    const routes = [
      '/',
      '/hotels',
      '/restaurants',
      '/experiences',
      '/spa-wellness',
      '/gaming-entertainment',
      '/airport-transfers',
      '/plan-my-layover',
      '/service-details',
      '/booking-review',
      '/payment-selection',
      '/checkout',
      '/booking-confirmation',
      '/my-itinerary',
      '/my-profile',
      '/how-it-works',
      '/faq',
      '/contact',
    ];

    const viewports = [
      { name: 'Desktop 1280', width: 1280, height: 800 },
      { name: 'Mobile 375', width: 375, height: 667 },
    ];

    let passed = 0;
    let failed = 0;

    for (const viewport of viewports) {
      console.log(`\n--- Auditing Viewport: ${viewport.name} ---`);
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();

      for (const route of routes) {
        const targetUrl = `http://localhost:3000${route}`;
        try {
          const res = await page.goto(targetUrl, { waitUntil: 'networkidle' });
          const status = res.status();

          // Check overflow-x
          const hasOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
          });

          // Check navbar presence
          const navExists = await page.evaluate(() => {
            return !!document.querySelector('nav');
          });

          if (status === 200 && !hasOverflow && navExists) {
            console.log(`  [PASS] ${route} (${status}) — Nav OK, No Overflow`);
            passed++;
          } else {
            console.log(`  [FAIL] ${route} (${status}) — Overflow: ${hasOverflow}, Nav: ${navExists}`);
            failed++;
          }
        } catch (err) {
          console.log(`  [ERROR] ${route}: ${err.message}`);
          failed++;
        }
      }
      await context.close();
    }

    await browser.close();
    console.log(`\n========================================`);
    console.log(`TOTAL AUDIT RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================`);

    nextProcess.kill();
    if (failed > 0) process.exit(1);
    else process.exit(0);
  } catch (err) {
    console.error('Fatal QA error:', err);
    nextProcess.kill();
    process.exit(1);
  }
}

runQA();
