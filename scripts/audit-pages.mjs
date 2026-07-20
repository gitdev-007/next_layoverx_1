import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const reportsDir = path.join(rootDir, 'audit-reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
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
  'revenue-admin.html',
  'faq.html',
  'help-center.html',
  'account-settings.html',
  'my-profile.html',
  'my-trips.html',
  'saved-itineraries.html',
  'notifications.html',
  'partner-registration.html',
  'payment-selection.html',
  'booking-review.html',
  'booking-confirmation.html',
  'service-details.html',
  'trip-details.html',
  'privacy.html',
  'terms.html'
];

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

server.listen(8766, async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  const results = [];

  for (const pageName of pages) {
    const page = await context.newPage();
    const url = `http://localhost:8766/${pageName}`;

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);

      const audit = await page.evaluate(() => {
        const issues = [];
        const info = {};

        // Heading hierarchy
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        let prevLevel = 0;
        headings.forEach(h => {
          const level = parseInt(h.tagName[1]);
          if (level > prevLevel + 1 && prevLevel !== 0) {
            issues.push(`Heading skip: ${h.tagName} after H${prevLevel}: "${h.textContent.slice(0, 50)}"`);
          }
          prevLevel = level;
        });
        if (headings.filter(h => h.tagName === 'H1').length !== 1) {
          issues.push(`Expected exactly one H1, found ${headings.filter(h => h.tagName === 'H1').length}`);
        }

        // Images without alt
        const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])'));
        if (imagesWithoutAlt.length > 0) {
          issues.push(`${imagesWithoutAlt.length} images missing alt text`);
        }

        // Buttons without type
        const buttonsWithoutType = Array.from(document.querySelectorAll('button:not([type])'));
        if (buttonsWithoutType.length > 0) {
          issues.push(`${buttonsWithoutType.length} buttons missing type attribute`);
        }

        // Empty links
        const emptyLinks = Array.from(document.querySelectorAll('a')).filter(a => !a.textContent.trim() && !a.querySelector('img, svg'));
        if (emptyLinks.length > 0) {
          issues.push(`${emptyLinks.length} empty links`);
        }

        // Form labels
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        const unlabeledInputs = inputs.filter(input => {
          const id = input.id;
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          const hasExplicitLabel = id && document.querySelector(`label[for="${id}"]`);
          const hasWrappingLabel = input.closest('label') !== null;
          const isHidden = input.type === 'hidden' || input.disabled || input.offsetParent === null;
          return !isHidden && !hasExplicitLabel && !hasWrappingLabel && !ariaLabel && !ariaLabelledBy && !input.placeholder;
        });
        if (unlabeledInputs.length > 0) {
          issues.push(`${unlabeledInputs.length} form inputs missing labels`);
        }

        // Color contrast check (basic)
        const lowContrastElements = [];
        document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, li').forEach(el => {
          const style = window.getComputedStyle(el);
          const color = style.color;
          const bg = style.backgroundColor;
          if (color.includes('rgb(203, 213, 225)') || color.includes('rgb(148, 163, 184)')) {
            if (bg.includes('255, 255, 255') || bg.includes('transparent')) {
              lowContrastElements.push(el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''));
            }
          }
        });
        if (lowContrastElements.length > 0) {
          issues.push(`${lowContrastElements.length} potentially low-contrast text elements`);
        }

        // Layout overflow
        const bodyWidth = document.body.scrollWidth;
        const viewportWidth = window.innerWidth;
        if (bodyWidth > viewportWidth + 10) {
          issues.push(`Horizontal overflow: body width ${bodyWidth}px > viewport ${viewportWidth}px`);
        }

        // Stats
        info.headingCount = headings.length;
        info.imageCount = document.querySelectorAll('img').length;
        info.buttonCount = document.querySelectorAll('button, .btn').length;
        info.cardCount = document.querySelectorAll('.card, .bg-white.rounded-2xl, .bg-white.rounded-3xl').length;
        info.sectionCount = document.querySelectorAll('section').length;

        return { issues, info };
      });

      results.push({ page: pageName, ...audit });
    } catch (error) {
      results.push({ page: pageName, error: error.message, issues: [`Failed to load: ${error.message}`], info: {} });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  // Generate report
  const reportPath = path.join(reportsDir, 'AUDIT_REPORT.md');
  let report = '# LayoverX Page Audit Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += '## Summary\n\n';
  report += '| Page | Issues | Headings | Images | Buttons | Cards | Sections |\n';
  report += '|------|--------|----------|--------|---------|-------|----------|\n';

  results.forEach(r => {
    const issueCount = r.issues ? r.issues.length : 0;
    report += `| ${r.page} | ${issueCount} | ${r.info.headingCount || '-'} | ${r.info.imageCount || '-'} | ${r.info.buttonCount || '-'} | ${r.info.cardCount || '-'} | ${r.info.sectionCount || '-'} |\n`;
  });

  report += '\n## Detailed Findings\n\n';
  results.forEach(r => {
    report += `### ${r.page}\n\n`;
    if (r.error) {
      report += `**Error:** ${r.error}\n\n`;
    }
    if (r.issues && r.issues.length > 0) {
      r.issues.forEach(issue => {
        report += `- ${issue}\n`;
      });
    } else {
      report += '- No major issues detected\n';
    }
    report += '\n';
  });

  fs.writeFileSync(reportPath, report);
  console.log(`Audit report saved to ${reportPath}`);
  console.log(`Total pages audited: ${results.length}`);
  console.log(`Total issues: ${results.reduce((sum, r) => sum + (r.issues ? r.issues.length : 0), 0)}`);
});
