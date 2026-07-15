# Normalize card/button classes across page templates
$files = Get-ChildItem -Path "frontend/pages" -Filter "*.html"

$replacements = @(
  # View Details secondary card CTA
  @{
    old = 'class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"';
    new = 'class="btn-card btn-card-secondary"'
  },
  # Blue primary card CTA (index.html)
  @{
    old = 'class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:-translate-y-0.5 transform"';
    new = 'class="btn-card btn-card-primary shadow-md transition-all hover:-translate-y-0.5 transform"'
  },
  # Theme primary card CTA with hover lift
  @{
    old = 'class="px-4 py-2 bg-theme-primary hover:bg-theme-primary text-white font-bold text-xs rounded-xl shadow-md transition transform hover:-translate-y-0.5"';
    new = 'class="btn-card btn-card-primary shadow-md transition transform hover:-translate-y-0.5"'
  },
  # Theme primary card CTA without hover lift (Add to Itinerary in some places)
  @{
    old = 'class="px-4 py-2 bg-theme-primary hover:bg-theme-primary text-white font-bold text-xs rounded-xl shadow-md"';
    new = 'class="btn-card btn-card-primary shadow-md"'
  },
  # Theme primary standalone button (Reset Filters)
  @{
    old = 'class="px-4 py-2 bg-theme-primary text-white font-bold text-xs rounded-xl shadow-md"';
    new = 'class="btn-card btn-card-primary shadow-md"'
  },
  # Modal Cancel buttons
  @{
    old = 'class="px-5 py-2.5 bg-gray-100 hover:bg-theme-primary text-gray-800 font-bold text-sm rounded-xl"';
    new = 'class="btn-card btn-card-secondary hover:bg-gray-200"'
  },
  @{
    old = 'class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-xl transition"';
    new = 'class="btn-card btn-card-secondary transition"'
  },
  # Modal primary action buttons
  @{
    old = 'class="px-6 py-2.5 bg-theme-primary hover:bg-theme-primary text-white font-bold text-sm rounded-xl shadow-md"';
    new = 'class="btn-card btn-card-primary shadow-md"'
  },
  @{
    old = 'class="px-6 py-2.5 bg-theme-primary hover:bg-theme-primary text-white font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5"';
    new = 'class="btn-card btn-card-primary shadow-md transition transform hover:-translate-y-0.5"'
  },
  # Contact page buttons
  @{
    old = 'class="inline-block px-4 py-2 bg-white text-sky-700 font-bold text-xs rounded-xl shadow-md hover:bg-gray-50 transition"';
    new = 'class="btn-card bg-white text-sky-700 shadow-md hover:bg-gray-50 transition"'
  },
  @{
    old = 'class="inline-block px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-lg hover:bg-sky-700 transition shadow-md"';
    new = 'class="btn-card btn-card-primary rounded-lg shadow-md"'
  },
  # My Trips buttons
  @{
    old = 'class="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition shadow"';
    new = 'class="btn-card btn-card-primary gap-2 transition shadow"'
  },
  @{
    old = 'class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow"';
    new = 'class="btn-card bg-slate-900 text-white hover:bg-black gap-2 transition shadow"'
  },
  # Dark form submit buttons
  @{
    old = 'class="px-5 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-black hover:shadow-lg transition"';
    new = 'class="btn-card bg-gray-900 text-white shadow-md hover:bg-black hover:shadow-lg transition"'
  },
  # Booking review / saved itineraries dark buttons
  @{
    old = 'class="mt-4 inline-block px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl"';
    new = 'class="mt-4 btn-card bg-slate-900 text-white hover:bg-black"'
  },
  @{
    old = 'class="mt-4 inline-block px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"';
    new = 'class="mt-4 btn-card bg-slate-900 text-white hover:bg-black transition"'
  },
  # Checkout button
  @{
    old = 'class="whitespace-nowrap px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"';
    new = 'class="btn-card bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition"'
  },
  # Supplier dashboard button
  @{
    old = 'class="inline-block px-4 py-2 bg-white text-indigo-600 font-bold text-xs rounded-xl shadow-md hover:bg-gray-50 transition"';
    new = 'class="btn-card bg-white text-indigo-600 shadow-md hover:bg-gray-50 transition"'
  },
  # Partner registration file upload labels
  @{
    old = 'class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition"';
    new = 'class="cursor-pointer btn-card btn-card-secondary text-gray-800"'
  }
)

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw
  $modified = $false
  foreach ($r in $replacements) {
    if ($content.Contains($r.old)) {
      $content = $content.Replace($r.old, $r.new)
      $modified = $true
      Write-Host "Replaced in $($file.Name): $($r.old.Substring(0,50))..."
    }
  }
  if ($modified) {
    Set-Content -Path $file.FullName -Value $content -NoNewline
  }
}

Write-Host "Button normalization complete."
