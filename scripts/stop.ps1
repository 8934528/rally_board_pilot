Write-Host ""
Write-Host "Stopping Rally Board Pilot..." -ForegroundColor Yellow

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Rally Board Pilot stopped." -ForegroundColor Green
