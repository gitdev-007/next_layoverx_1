const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const css  = fs.readFileSync('frontend/css/design-system.css', 'utf8');

const checks = {
  'Critical CSS block'    : html.includes('Lock root font size'),
  'Inter 300-900 weights' : html.includes(':wght@300;400;500;600;700;800;900'),
  'design-system.css link': html.includes('design-system.css'),
  'tailwind.min.css link' : html.includes('tailwind.min.css'),
  'Base font-size 1rem'   : html.includes('font-size: 1rem'),
  'h1 clamp scale'        : html.includes('clamp(2rem'),
  'h2 clamp scale'        : html.includes('clamp(1.5rem'),
  'noscript font fallback': html.includes('<noscript>'),
  '.btn class defined'    : css.includes('.btn {'),
  '.btn-sm defined'       : css.includes('.btn-sm {'),
  '.btn-lg defined'       : css.includes('.btn-lg {'),
  'form-input 15px'       : css.includes('0.9375rem'),
  'section-title helper'  : css.includes('.section-title'),
  'section-label helper'  : css.includes('.section-label'),
  'No old tiny font fixes': !css.includes('.50rem'),
};

let pass = 0, fail = 0;
for (const [k, v] of Object.entries(checks)) {
  console.log((v ? 'PASS' : 'FAIL') + '  ' + k);
  v ? pass++ : fail++;
}
console.log('\n' + pass + ' passed, ' + fail + ' failed');
