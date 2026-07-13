#!/usr/bin/env node
/**
 * full_seo_fix.js
 * Convert every HTML fragment under frontend/pages into a complete HTML document
 * and inject a full SEO suite (title, meta description, OG tags, Twitter cards,
 * JSON‑LD structured data). The script also adds <!DOCTYPE html>, <html>,
 * <head>, and <body> tags so each page becomes a valid, SEO‑friendly page.
 *
 * Usage:
 *   $ node scripts/full_seo_fix.js
 *
 * The script will overwrite each file in place.
 */

const fs = require('fs');
const path = require('path');

// Root directory that contains the page fragments
const rootDir = path.join(__dirname, '..', 'frontend', 'pages');

// SEO constants
const SITE_NAME = 'LayoverX';
const SITE_DESCRIPTION = 'LayoverX - Book hotels, tours, spas, transfers and more during your airport layover. Fast, secure, and convenient.';
const PLACEHOLDER_IMAGE = 'https://layoverx.com/assets/photos/homepage.png';
const BASE_URL = 'https://layoverx.com';

// Helper: generate a canonical URL for a given file path
function buildUrl(filePath) {
  // Convert Windows path separators to forward slashes
  const normalized = filePath.replace(/\\/g, '/');
  // Remove the absolute part, keep everything after 'frontend/pages/'
  const relativePart = normalized.split('frontend/pages/')[1];
  // Encode special characters (encodeURIComponent) but keep .html
  const encoded = encodeURIComponent(relativePart).replace(/%2F/g, '/');
  return `${BASE_URL}/${encoded}`;
}

// Helper: escape XML attribute values
function escXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Process each file
fs.readdirSync(rootDir)
  .filter(f => f.toLowerCase().endsWith('.html'))
  .forEach(file => {
    const filePath = path.join(rootDir, file);
    const html = fs.readFileSync(filePath, 'utf8');

    // Title derived from filename (human‑readable)
    const rawTitle = file.replace(/\.html$/i, '').replace(/-/g, ' ');
    const title = escXml(rawTitle);

    // Build the canonical URL for this page
    const url = buildUrl(filePath);

    // Build the SEO snippet (as a string)
    const seoSnippet = `
<!-- ====== SEO INJECTION START ====== -->
<title>${title} | ${SITE_NAME}</title>
<meta name="description" content="${escXml(SITE_DESCRIPTION)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${title} | ${SITE_NAME}">
<meta property="og:description" content="${escXml(SITE_DESCRIPTION)}">
<meta property="og:image" content="${PLACEHOLDER_IMAGE}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title} | ${SITE_NAME}">
<meta name="twitter:description" content="${escXml(SITE_DESCRIPTION)}">
<meta name="twitter:image" content="${PLACEHOLDER_IMAGE}">
<!-- Structured Data (JSON‑LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "${SITE_NAME}",
  "url": "${url}",
  "telephone": "+1-800-555-0123",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Mumbai",
    "addressCountry": "IN"
  },
  "priceRange": "$$$"
}
</script>
<!-- ====== SEO INJECTION END -------- -->
`;

    // Build a brand‑new full HTML document
    const doctype = '<!DOCTYPE html>';
    const htmlStart = '<html lang="en">';
    // Insert the SEO snippet inside <head> right after <html>
    const headStart = `${htmlStart}\n<head>\n${seoSnippet}</head>`;
    // The original content becomes the body
    const bodyStartTag = '</head>\n<body>\n';
    const bodyEndTag = '\n</body>\n</html>';

    // Assemble the final document
    const finalHtml = `${doctype}\n${headStart}${bodyStartTag}${html}${bodyEndTag}`;

    // Overwrite the file with the new, complete HTML
    fs.writeFileSync(filePath, finalHtml, 'utf8');
    console.log(`✅ Converted ${file}`);
  });

console.log('✅ All pages have been processed and SEO tags injected.');