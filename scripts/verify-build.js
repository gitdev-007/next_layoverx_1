#!/usr/bin/env node
'use strict';
const fs = require('fs');

const pages = ['index.html','hotels.html','contact.html','checkout.html','plan-my-layover.html'];
let pass = 0, fail = 0;

pages.forEach(p => {
  const h = fs.readFileSync('frontend/' + p, 'utf8');
  const results = {
    DOCTYPE:   h.includes('<!DOCTYPE html>'),
    head:      h.includes('<head>'),
    navbar:    h.includes('id="navbar"'),
    main:      h.includes('<main id="main">'),
    footer:    h.includes('<footer '),
    modals:    h.includes('id="modal-login"'),
    supabase:  h.includes('supabase-init.js'),
    appjs:     h.includes('app.js'),
    css:       h.includes('tailwind.min.css'),
    title:     h.includes('LayoverX'),
    robots:    h.includes('meta name="robots"'),
  };
  const failed = Object.entries(results).filter(([,v]) => !v).map(([k]) => k);
  if (failed.length === 0) { console.log('PASS  ' + p); pass++; }
  else { console.log('FAIL  ' + p + ' — missing: ' + failed.join(', ')); fail++; }
});

// Robots directives
const co = fs.readFileSync('frontend/checkout.html','utf8');
const ix = fs.readFileSync('frontend/index.html','utf8');
const ho = fs.readFileSync('frontend/hotels.html','utf8');

console.log('\n--- Robots tags ---');
console.log('checkout noindex:', co.includes('noindex, nofollow'));
console.log('index    index,follow:', ix.includes('index, follow'));

console.log('\n--- Active nav ---');
console.log('hotels page has active-nav-link:', ho.includes('active-nav-link'));
console.log('index  page active-nav-link count:', (ix.match(/active-nav-link/g) || []).length);

console.log('\n--- Theme classes ---');
console.log('hotels has theme-hotels:', ho.includes('theme-hotels'));
const sp = fs.readFileSync('frontend/spa-wellness.html','utf8');
console.log('spa has theme-spa:', sp.includes('theme-spa'));

console.log('\n--- API endpoint ---');
console.log('index references api.layoverx.in:', ix.includes('api.layoverx.in'));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
