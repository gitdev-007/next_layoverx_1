import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, '..', 'frontend');

const replacements = [
  {
    files: ['revenue-admin.html', 'pages/revenue-admin.html'],
    changes: [
      { from: /<h3 class="font-bold text-slate-900 text-sm flex items-center justify-between">/g, to: '<h2 class="h3-style flex items-center justify-between">' },
      { from: /<h3 class="font-bold text-slate-900 text-sm">/g, to: '<h2 class="h3-style">' }
    ]
  },
  {
    files: ['faq.html', 'pages/faq.html'],
    changes: [
      { from: /<h3 class="font-extrabold text-gray-900 text-base">/g, to: '<h2 class="h3-style">' }
    ]
  },
  {
    files: ['my-trips.html', 'pages/my-trips.html'],
    changes: [
      { from: /<h3 class="text-base font-bold text-slate-900 mb-1">/g, to: '<h2 class="h3-style mb-1">' }
    ]
  },
  {
    files: ['notifications.html', 'pages/notifications.html'],
    changes: [
      { from: /<h3 class="font-extrabold text-gray-900 text-sm">/g, to: '<h2 class="h3-style">' }
    ]
  },
  {
    files: ['partner-registration.html', 'pages/partner-registration.html'],
    changes: [
      { from: /<h4 class="text-sm font-bold text-gray-900 mb-3">/g, to: '<h3 class="h4-style mb-3">' }
    ]
  },
  {
    files: ['booking-confirmation.html', 'pages/booking-confirmation.html'],
    changes: [
      { from: /<h3 class="font-extrabold text-sky-900 text-xs sm:text-sm">/g, to: '<h2 class="h3-style">' }
    ]
  }
];

let changedCount = 0;

replacements.forEach(group => {
  group.files.forEach(relFile => {
    const filePath = path.join(frontendDir, relFile);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠ Not found: ${relFile}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    group.changes.forEach(change => {
      content = content.replace(change.from, change.to);
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      changedCount++;
      console.log(`✓ ${relFile}`);
    }
  });
});

console.log(`\nUpdated ${changedCount} files for heading hierarchy.`);
