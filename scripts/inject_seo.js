#!/usr/bin/env node
/**
 * inject_seo.js
 * Reads every HTML file under frontend/pages/,
 * injects SEO-friendly tags:
 *   - <title> (preserve existing)
 *   - <meta name="description" ...>
 *   - <link rel="canonical" ...>
 *   - Open Graph / Twitter Card tags (og:title, og:description, og:image, og:url)
 *   - JSON-LD structured data for a generic TravelAgency.
 * The script writes the modified files back in-place.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Adjust if your project layout changes
const pagesGlob = path.join(__dirname, '..', 'frontend', 'pages', '*.html');

glob(pagesGlob, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const html = fs.readFileSync(file, 'utf8');
    // Basic capture groups for <head>
    const headOpen = '<head>';
    const headClose = '</head>';
    const hasHead = html.includes(headOpen) && html.includes(headClose);
    if (!hasHead) {
      console.warn(`No <head> found in ${file}, skipping`);
      return;
    }

    // Build SEO snippet
    const siteUrl = 'https://layoverx.com'; // placeholder; change per page if desired
    const pageUrl = `${siteUrl}${file.substring(file.indexOf('/frontend/'))}`;
    const description = "LayoverX - Book hotels, tours, spas, transfers and more during your airport layover. Fast, secure, and convenient.";
    const imageUrl = `${siteUrl}/assets/photos/homepage.png`; // placeholder image

    const seoSnippet = `<!-- ====== SEO INJECTION START ====== -->\n<title>${path.basename(file, '.html').replace(/-/g, ' ')} | LayoverX</title>\n<meta name="description" content="${description}">\n<link rel="canonical" href="${pageUrl}">\n<meta property="og:title" content="${path.basename(file, '.html').replace(/-/g, ' ')} | LayoverX">\n<meta property="og:description" content="${description}">\n<meta property="og:image" content="${imageUrl}">\n<meta property="og:url" content="${pageUrl}">\n<meta property="og:type" content="website">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${path.basename(file, '.html').replace(/-/g, ' ')} | LayoverX">\n<meta name="twitter:description" content="${description}">\n<meta name="twitter:image" content="${imageUrl}">\n<!-- Structured Data (JSON-LD) -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "TravelAgency",\n  "name": "LayoverX",\n  "url": "${pageUrl}",\n  "telephone": "+1-800-555-0123",\n  "address": {\n    "@type": "PostalAddress",\n    "addressLocality": "Mumbai",\n    "addressCountry": "IN"\n  },\n  "priceRange": "$$$"\n}\n</script>\n<!-- ====== SEO INJECTION END -->`;

    // Insert snippet right after the opening <head> tag
    const modified = html.replace(headOpen, `${headOpen}\n${seoSnippet}`);

    // Save back
    fs.writeFileSync(file, modified, 'utf8');
    console.log(`Updated ${file}`);
  });
});