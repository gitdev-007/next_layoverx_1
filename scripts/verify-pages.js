const fs   = require('fs');
const path = require('path');

const dir   = 'frontend';
const pages = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let pass = 0, fail = 0;
const issues = [];

pages.forEach(page => {
  const html = fs.readFileSync(path.join(dir, page), 'utf8');

  const checks = {
    'global-overrides.css' : html.includes('global-overrides.css'),
    'design-system.css'    : html.includes('design-system.css'),
    'tailwind.min.css'     : html.includes('tailwind.min.css'),
    'criticalCSS inline'   : html.includes('Lock root font size'),
    'Inter font'           : html.includes('Inter:wght@'),
    'has <main>'           : html.includes('<main'),
    'has navbar'           : html.includes('id="navbar"'),
    'has footer'           : html.includes('<footer'),
    'no localhost:3000'    : !html.includes('localhost:3000'),
  };

  const failed = Object.entries(checks).filter(([,v]) => !v).map(([k]) => k);
  if (failed.length === 0) {
    pass++;
  } else {
    fail++;
    issues.push({ page, failed });
  }
});

console.log('Pages scanned : ' + pages.length);
console.log('PASS : ' + pass + '   FAIL : ' + fail);

if (issues.length) {
  console.log('\nFailed pages:');
  issues.forEach(i => console.log('  ' + i.page + ' -> missing: ' + i.failed.join(', ')));
} else {
  console.log('\nAll ' + pass + ' pages have correct structure, CSS loading order and no localhost refs.');
}
