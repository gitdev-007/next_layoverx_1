const fs = require('fs');

// Check CSS load order in compiled page
const html = fs.readFileSync('frontend/airport-transfers.html', 'utf8');
const styleLinks = [];
const re = /href="(css\/[^"]+\.css)"/g;
let m;
while ((m = re.exec(html)) !== null) styleLinks.push(m[1]);

console.log('CSS Load Order in airport-transfers.html:');
styleLinks.forEach(function(l, i) { console.log('  ' + (i+1) + '. ' + l); });

// File sizes
console.log('\nCSS File Sizes:');
const cssFiles = [
  ['tailwind.min.css',     'frontend/css/tailwind.min.css'],
  ['design-system.css',    'frontend/css/design-system.css'],
  ['global-overrides.css', 'frontend/css/global-overrides.css'],
];
cssFiles.forEach(function(pair) {
  const name = pair[0];
  const p    = pair[1];
  const kb   = (fs.statSync(p).size / 1024).toFixed(1);
  console.log('  ' + name + ': ' + kb + ' KB');
});
