import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, '..', 'frontend');

const files = [
  'partner-registration.html',
  'pages/partner-registration.html'
];

files.forEach(relFile => {
  const filePath = path.join(frontendDir, relFile);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Replace h4 review labels with p tags
  content = content.replace(
    /<h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0\.5">([^<]+)<\/h4>/g,
    '<p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">$1</p>'
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ ${relFile}`);
  }
});
