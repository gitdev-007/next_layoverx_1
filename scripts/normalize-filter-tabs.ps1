# Increase filter tab touch target height
$files = Get-ChildItem -Path "frontend/pages" -Filter "*.html"

$replacements = @(
  @{
    old = 'py-2 rounded-xl text-xs sm:text-sm font-bold flex-shrink-0';
    new = 'py-2.5 rounded-xl text-xs sm:text-sm font-bold flex-shrink-0 min-h-[2.5rem]'
  }
)

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw
  $modified = $false
  foreach ($r in $replacements) {
    if ($content.Contains($r.old)) {
      $content = $content.Replace($r.old, $r.new)
      $modified = $true
    }
  }
  if ($modified) {
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Updated filter tabs in $($file.Name)"
  }
}

Write-Host "Filter tab normalization complete."
