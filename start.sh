#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║  Sentinel-Skin Startup Script                                    ║
# ║  Starts FastAPI backend (port 8000) + Next.js frontend (3000)    ║
# ╚══════════════════════════════════════════════════════════════════╝

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo ""
echo "  ███████╗███████╗███╗   ██╗████████╗██╗███╗   ██╗███████╗██╗     "
echo "  ██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║████╗  ██║██╔════╝██║     "
echo "  ███████╗█████╗  ██╔██╗ ██║   ██║   ██║██╔██╗ ██║█████╗  ██║     "
echo "  ╚════██║██╔══╝  ██║╚██╗██║   ██║   ██║██║╚██╗██║██╔══╝  ██║     "
echo "  ███████║███████╗██║ ╚████║   ██║   ██║██║ ╚████║███████╗███████╗"
echo "  ╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝"
echo "                   SKIN — Biometric Monitoring System              "
echo ""
echo "  Niral Thiruvizha Hackathon 2025 // Tamil Nadu Police"
echo ""

# ─── Check backend venv ───────────────────────────────────────────────────────
if [ ! -d "$BACKEND_DIR/venv" ]; then
  echo "[SETUP] Creating Python virtualenv..."
  cd "$BACKEND_DIR"
  python3 -m venv venv
  ./venv/bin/pip install -r requirements.txt
fi

# ─── Start backend ────────────────────────────────────────────────────────────
echo "[STARTING] FastAPI backend → http://localhost:8000"
cd "$BACKEND_DIR"
./venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Give backend a moment to start
sleep 2

# ─── Check frontend deps ──────────────────────────────────────────────────────
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "[SETUP] Installing Node.js dependencies..."
  cd "$FRONTEND_DIR"
  npm install
fi

# ─── Start frontend ───────────────────────────────────────────────────────────
echo "[STARTING] Next.js frontend → http://localhost:3000"
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │  SENTINEL-SKIN is running                       │"
echo "  │                                                 │"
echo "  │  Frontend (Login)   → http://localhost:3000     │"
echo "  │  Backend  (API)     → http://localhost:8000     │"
echo "  │  API Docs           → http://localhost:8000/docs│"
echo "  │                                                 │"
echo "  │  Click 'Bypass to Demo Mode' on login page      │"
echo "  │  Press Ctrl+C to stop all services             │"
echo "  └─────────────────────────────────────────────────┘"
echo ""

# ─── Graceful shutdown ────────────────────────────────────────────────────────
cleanup() {
  echo ""
  echo "[STOPPING] Shutting down Sentinel-Skin..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  echo "[DONE] All services stopped."
  exit 0
}

trap cleanup SIGINT SIGTERM
wait
