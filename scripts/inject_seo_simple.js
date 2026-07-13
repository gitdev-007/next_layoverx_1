#!/usr/bin/env node
/**
 * Simple SEO injector – no external dependencies.
 * Reads every *.html file under frontend/pages/,
 * injects SEO-friendly tags and writes the files back.
 */

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'frontend', 'pages');
const htmlFiles = fs.readdirSync(pagesDir)
  .filter(f => f.toLowerCase().endsWith('.html'))
  .map(f => path.join(pagesDir, f));

const siteUrl = 'https://layoverx.com';
const description = "LayoverX - Book hotels, tours, spas, transfers and more during your airport layover. Fast, secure, and convenient.";
const placeholderImage = `${siteUrl}/assets/photos/homepage.png`;

htmlFiles.forEach(filePath => {
  const html = fs.readFileSync(filePath, 'utf8');

  // Insert SEO snippet after the opening <head> tag (case‑insensitive)
  const seoSnippet = `
<!-- ====== SEO INJECTION START ====== -->
<title>${path.basename(filePath, '.html').replace(/-/g, ' ')} | LayoverX</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${siteUrl}${filePath.substring(filePath.indexOf('/frontend/'))}">
<meta property="og:title" content="${path.basename(filePath, '.html').replace(/-/g, ' ')} | LayoverX">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${placeholderImage}">
<meta property="og:url" content="${siteUrl}${filePath.substring(filePath.indexOf('/frontend/'))}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${path.basename(filePath, '.html').replace(/-/g, ' ')} | LayoverX">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${placeholderImage}">
<!-- Structured Data (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "LayoverX",
  "url": "${siteUrl}${filePath.substring(filePath.indexOf('/frontend/'))}",
  "telephone": "+1-800-555-0123",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Mumbai",
    "addressCountry": "IN"
  },
  "priceRange": "$$$"
}
</script>
<!-- ====== SEO INJECTION END -->`;

  // Replace <head> (case‑insensitive) with <head> + snippet
  const modified = html.replace(/<head\b/gi, `${'<head>'.trim()}\n${seoSnippet}`);

  // Write modified content back
  fs.writeFileSync(filePath, modified, 'utf8');
  console.log(`Updated ${filePath}`);
});