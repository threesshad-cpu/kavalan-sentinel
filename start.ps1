# ╔══════════════════════════════════════════════════════════════════╗
# ║  Sentinel-Skin Windows Startup Script (PowerShell)              ║
# ║  Starts FastAPI backend (port 8000) + Next.js frontend (3000)   ║
# ╚══════════════════════════════════════════════════════════════════╝

$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend"

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║  SENTINEL-SKIN — Biometric Monitoring       ║" -ForegroundColor Cyan
Write-Host "  ║  Niral Thiruvizha Hackathon 2025            ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ─── Start Backend ─────────────────────────────────────────────────────────────
Write-Host "[STARTING] FastAPI Backend → http://localhost:8000" -ForegroundColor Green
$backendScript = @"
cd '$BackendDir'
.\venv\Scripts\uvicorn main:app --reload --host 0.0.0.0 --port 8000
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 2

# ─── Start Frontend ────────────────────────────────────────────────────────────
Write-Host "[STARTING] Next.js Frontend → http://localhost:3000" -ForegroundColor Green
$frontendScript = @"
cd '$FrontendDir'
npm run dev
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "  ┌─────────────────────────────────────────────────┐" -ForegroundColor Yellow
Write-Host "  │  SENTINEL-SKIN is running!                      │" -ForegroundColor Yellow
Write-Host "  │                                                 │" -ForegroundColor Yellow
Write-Host "  │  Frontend (Login)  → http://localhost:3000      │" -ForegroundColor Yellow
Write-Host "  │  Backend  (API)    → http://localhost:8000      │" -ForegroundColor Yellow
Write-Host "  │  Swagger Docs      → http://localhost:8000/docs │" -ForegroundColor Yellow
Write-Host "  │                                                 │" -ForegroundColor Yellow
Write-Host "  │  Click 'Bypass to Demo Mode' on login page      │" -ForegroundColor Yellow
Write-Host "  └─────────────────────────────────────────────────┘" -ForegroundColor Yellow
Write-Host ""

# Open browser
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"
