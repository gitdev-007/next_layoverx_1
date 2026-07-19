import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const routes = [
  '/',
  '/hotels.html',
  '/restaurants.html',
  '/plan-my-layover.html',
  '/how-it-works.html',
  '/contact.html',
  '/experiences.html',
  '/my-itinerary.html',
];
const report = [];

for (const route of routes) {
  await page.goto('https://next-layoverx-1.vercel.app' + route, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.waitForTimeout(700);
  const data = await page.evaluate(() => {
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    };
    const sample = (sel, n = 12) =>
      [...document.querySelectorAll(sel)].filter(visible).slice(0, n).map((el) => {
        const cs = getComputedStyle(el);
        return {
          text: (el.textContent || '').trim().slice(0, 50),
          className: String(el.className || '').slice(0, 90),
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          margin: `${cs.marginTop}/${cs.marginBottom}`,
          padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        };
      });

    const sectionPads = [...document.querySelectorAll('section')]
      .filter(visible)
      .slice(0, 10)
      .map((el) => ({
        id: el.id || '',
        className: String(el.className || '').slice(0, 70),
        padY: `${getComputedStyle(el).paddingTop}/${getComputedStyle(el).paddingBottom}`,
      }));

    const cards = [...document.querySelectorAll('.card, .rounded-2xl, .rounded-3xl')]
      .filter(visible)
      .filter((el) => {
        const c = String(el.className || '');
        return c.includes('shadow') || c.includes('card') || c.includes('border');
      })
      .slice(0, 8)
      .map((el) => {
        const titleEl = el.querySelector('h2, h3');
        const body = el.querySelector('p');
        const padEl = el.querySelector('.p-4, .p-5, .p-6, .p-8') || el;
        return {
          className: String(el.className || '').slice(0, 80),
          title: titleEl?.textContent?.trim().slice(0, 40) || '',
          titleSize: titleEl ? getComputedStyle(titleEl).fontSize : null,
          bodySize: body ? getComputedStyle(body).fontSize : null,
          innerPad: `${getComputedStyle(padEl).paddingTop} ${getComputedStyle(padEl).paddingRight} ${getComputedStyle(padEl).paddingBottom} ${getComputedStyle(padEl).paddingLeft}`,
        };
      });

    return {
      h1: sample('h1', 2),
      h2: sample('h2', 10),
      h3: sample('h3', 10),
      p: sample('main p, section p', 10),
      sectionPads,
      cards,
    };
  });

  report.push({ route, ...data });
  console.log(
    'OK',
    route,
    'h1',
    data.h1[0]?.fontSize,
    'p',
    [...new Set(data.p.map((x) => x.fontSize))].join(','),
    'h2',
    [...new Set(data.h2.map((x) => x.fontSize))].join(','),
    'h3',
    [...new Set(data.h3.map((x) => x.fontSize))].join(',')
  );
}

fs.mkdirSync('audit-reports', { recursive: true });
fs.writeFileSync('audit-reports/live-remaining-debt.json', JSON.stringify(report, null, 2));
const summary = report.map((r) => ({
  route: r.route,
  h1: r.h1[0]?.fontSize,
  pSizes: [...new Set(r.p.map((x) => x.fontSize))],
  h2Sizes: [...new Set(r.h2.map((x) => x.fontSize))],
  h3Sizes: [...new Set(r.h3.map((x) => x.fontSize))],
  sectionPads: [...new Set(r.sectionPads.map((s) => s.padY))],
  cardTitleSizes: [...new Set(r.cards.map((c) => c.titleSize).filter(Boolean))],
  cardBodySizes: [...new Set(r.cards.map((c) => c.bodySize).filter(Boolean))],
  cardPads: [...new Set(r.cards.map((c) => c.innerPad))],
}));
fs.appendFileSync(
  'debug-06d8ce.log',
  JSON.stringify({
    sessionId: '06d8ce',
    runId: 'live-remain',
    message: 'Live remaining debt snapshot',
    timestamp: Date.now(),
    data: { summary },
  }) + '\n'
);
console.log(JSON.stringify(summary, null, 2));
await browser.close();
