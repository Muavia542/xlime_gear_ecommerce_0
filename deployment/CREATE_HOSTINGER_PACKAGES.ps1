$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$out = Join-Path $root "deployment\packages"
New-Item -ItemType Directory -Force $out | Out-Null

function New-CleanZip($source, $destination) {
  $temp = Join-Path $env:TEMP ("xlime-package-" + [guid]::NewGuid().ToString())
  New-Item -ItemType Directory -Force $temp | Out-Null
  robocopy $source $temp /E /XD node_modules .next dist coverage /XF .env .env.local *.log | Out-Null
  if (Test-Path $destination) { Remove-Item $destination -Force }
  Compress-Archive -Path (Join-Path $temp "*") -DestinationPath $destination -CompressionLevel Optimal
  Remove-Item $temp -Recurse -Force
}

New-CleanZip (Join-Path $root "frontend") (Join-Path $out "XLIME_FRONTEND_HOSTINGER.zip")
New-CleanZip (Join-Path $root "backend") (Join-Path $out "XLIME_BACKEND_HOSTINGER.zip")
Write-Host "Created Hostinger upload packages in: $out" -ForegroundColor Green
