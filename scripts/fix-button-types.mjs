import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, '..', 'frontend');
const pagesDir = path.join(frontendDir, 'pages');
const componentsDir = path.join(frontendDir, 'components');

const htmlFiles = [
  ...getHtmlFiles(frontendDir),
  ...getHtmlFiles(pagesDir),
  ...getHtmlFiles(componentsDir)
];

function getHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { recursive: true })
    .filter(f => typeof f === 'string' && f.endsWith('.html'))
    .map(f => path.join(dir, f));
}

let changedCount = 0;
let buttonCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Match button tags that don't already have a type attribute
  content = content.replace(/<button(\s+[^>]*)>/gi, (match, attrs) => {
    if (/\stype\s*=/i.test(attrs)) {
      return match;
    }
    buttonCount++;
    return `<button type="button"${attrs}>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedCount++;
    console.log(`✓ ${path.relative(frontendDir, filePath)} (${buttonCount} buttons)`);
    buttonCount = 0;
  }
});

console.log(`\nUpdated ${changedCount} files with button type attributes.`);
