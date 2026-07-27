import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const reportsDir = path.join(rootDir, 'audit-reports');

const pages = [
  'index.html', 'hotels.html', 'restaurants.html', 'spa-wellness.html',
  'gaming-entertainment.html', 'experiences.html', 'airport-transfers.html',
  'how-it-works.html', 'contact.html', 'plan-my-layover.html', 'checkout.html',
  'my-itinerary.html', 'supplier-dashboard.html', 'revenue-admin.html'
];

const server = http.createServer((req, res) => {
  const cleanUrl = req.url.split('?')[0];
  const filePath = path.join(frontendDir, cleanUrl === '/' ? 'index.html' : cleanUrl);
  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json'
  };
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(8767, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const results = [];

  for (const pageName of pages) {
    try {
      await page.goto(`http://localhost:8767/${pageName}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000);

      const styles = await page.evaluate(() => {
        const data = {};
        
        // Navbar
        const navbar = document.querySelector('#navbar');
        if (navbar) {
          const navStyle = window.getComputedStyle(navbar);
          data.navbar = {
            height: navStyle.height,
            paddingTop: navStyle.paddingTop,
            paddingBottom: navStyle.paddingBottom,
            backgroundColor: navStyle.backgroundColor
          };
        }

        // Hero section
        const hero = document.querySelector('header, .theme-hero, main > section:first-of-type');
        if (hero) {
          const heroH1 = hero.querySelector('h1');
          if (heroH1) {
            const h1Style = window.getComputedStyle(heroH1);
            data.heroH1 = {
              fontSize: h1Style.fontSize,
              lineHeight: h1Style.lineHeight,
              color: h1Style.color,
              fontWeight: h1Style.fontWeight
            };
          }
        }

        // Section headings
        const sectionH2 = document.querySelector('main h2');
        if (sectionH2) {
          const h2Style = window.getComputedStyle(sectionH2);
          data.sectionH2 = {
            fontSize: h2Style.fontSize,
            color: h2Style.color,
            fontWeight: h2Style.fontWeight
          };
        }

        // Card styles
        const firstCard = document.querySelector('.card, main .bg-white.rounded-2xl, main .bg-white.rounded-3xl');
        if (firstCard) {
          const cardStyle = window.getComputedStyle(firstCard);
          data.card = {
            borderRadius: cardStyle.borderRadius,
            padding: cardStyle.padding,
            boxShadow: cardStyle.boxShadow,
            borderColor: cardStyle.borderColor
          };
        }

        // Button styles — first *visible* primary-like button
        let primaryBtn = null;
        for (const candidate of document.querySelectorAll('.btn-primary, button[type="submit"], #search-btn, a.bg-sky-700, a.bg-theme-primary, button.bg-sky-700, button.bg-theme-primary')) {
          const rect = candidate.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            primaryBtn = candidate;
            break;
          }
        }
        if (primaryBtn) {
          const btnStyle = window.getComputedStyle(primaryBtn);
          const rect = primaryBtn.getBoundingClientRect();
          data.button = {
            height: `${rect.height}px`,
            borderRadius: btnStyle.borderRadius,
            fontSize: btnStyle.fontSize,
            backgroundColor: btnStyle.backgroundColor,
            color: btnStyle.color
          };
        }

        // Body text
        const bodyP = document.querySelector('main p');
        if (bodyP) {
          const pStyle = window.getComputedStyle(bodyP);
          data.bodyText = {
            fontSize: pStyle.fontSize,
            lineHeight: pStyle.lineHeight,
            color: pStyle.color
          };
        }

        // Section padding — first non-hero content section
        let section = null;
        for (const s of document.querySelectorAll('main section')) {
          if (s.classList.contains('theme-hero') || s.id === 'hero-section' || s.closest('.theme-hero') || s.closest('#hero-section')) continue;
          section = s;
          break;
        }
        if (section) {
          const sectionStyle = window.getComputedStyle(section);
          data.section = {
            paddingTop: sectionStyle.paddingTop,
            paddingBottom: sectionStyle.paddingBottom
          };
        }

        // Container width
        const container = document.querySelector('.container');
        if (container) {
          const containerStyle = window.getComputedStyle(container);
          data.container = {
            maxWidth: containerStyle.maxWidth,
            paddingLeft: containerStyle.paddingLeft,
            paddingRight: containerStyle.paddingRight
          };
        }

        return data;
      });

      results.push({ page: pageName, styles });
    } catch (error) {
      results.push({ page: pageName, error: error.message });
    }
  }

  await browser.close();
  server.close();

  // Generate comparison report
  let report = '# Visual Consistency Comparison Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;

  const properties = ['navbar', 'heroH1', 'sectionH2', 'card', 'button', 'bodyText', 'section', 'container'];
  
  properties.forEach(prop => {
    report += `## ${prop}\n\n`;
    report += '| Page | ' + Object.keys(results.find(r => r.styles && r.styles[prop])?.styles[prop] || {}).join(' | ') + ' |\n';
    report += '|------|' + Object.keys(results.find(r => r.styles && r.styles[prop])?.styles[prop] || {}).map(() => '------').join('|') + '|\n';
    
    results.forEach(r => {
      if (r.error) return;
      const values = r.styles[prop];
      if (values) {
        report += `| ${r.page} | ${Object.values(values).join(' | ')} |\n`;
      }
    });
    report += '\n';
  });

  // Find inconsistencies
  report += '## Inconsistencies Detected\n\n';
  let inconsistencies = [];

  properties.forEach(prop => {
    const valueMap = {};
    results.forEach(r => {
      if (r.error || !r.styles[prop]) return;
      // Button background colors are intentional theme variations; compare shape only.
      let comparisonValue = r.styles[prop];
      if (prop === 'button') {
        comparisonValue = { ...r.styles[prop] };
        delete comparisonValue.backgroundColor;
      }
      const key = JSON.stringify(comparisonValue);
      if (!valueMap[key]) valueMap[key] = { value: r.styles[prop], pages: [] };
      valueMap[key].pages.push(r.page);
    });

    const keys = Object.keys(valueMap);
    if (keys.length > 1) {
      inconsistencies.push(`**${prop}** has ${keys.length} different computed styles across pages`);
      keys.forEach(key => {
        inconsistencies.push(`  - ${valueMap[key].pages.join(', ')}: ${JSON.stringify(valueMap[key].value)}`);
      });
    }
  });

  if (inconsistencies.length === 0) {
    report += 'No major inconsistencies detected.\n';
  } else {
    inconsistencies.forEach(item => report += `- ${item}\n`);
  }

  fs.writeFileSync(path.join(reportsDir, 'CONSISTENCY_COMPARISON.md'), report);
  console.log(`Consistency comparison saved. Inconsistencies: ${inconsistencies.filter(i => !i.startsWith('  -')).length}`);
});
