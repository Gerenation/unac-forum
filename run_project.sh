#!/usr/bin/env bash
#
# run_project.sh — UNAC Forum launcher (Linux / Arch-based)
#
# Mirrors run_project.bat but for Linux. Starts:
#   • MongoDB (Docker container)
#   • Backend  (Node + Express)   -> http://localhost:5001  (own terminal window)
#   • Frontend (Vite + React)     -> http://localhost:5173  (own terminal window)
#
# Run:  ./run_project.sh   (from the unac-forum/ folder)
#       or:  bash run_project.sh
#
set -euo pipefail

# -----------------------------------------------------------------------------
# Config
# -----------------------------------------------------------------------------
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend"

LOCAL_NODE_DIR="$HOME/.local/share/pi-node/node-v22.23.3-linux-x64/bin"
MONGO_CONTAINER="unac-mongo"
MONGO_PORT="27017"
MONGO_IMAGE="mongo:7"

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
have() { command -v "$1" >/dev/null 2>&1; }

log()  { printf '\033[1;34m[%s]\033[0m %s\n' "$(date +'%H:%M:%S')" "$*"; }
ok()   { printf '\033[1;32m[OK]\033[0m %s\n' "$*"; }
err()  { printf '\033[1;31m[ERROR]\033[0m %s\n' "$*" >&2; }

# -----------------------------------------------------------------------------
# Detect a terminal emulator (first one found wins)
# -----------------------------------------------------------------------------
detect_terminal() {
  local candidates=(
    "gnome-terminal"
    "konsole"
    "xfce4-terminal"
    "kitty"
    "alacritty"
    "terminator"
    "xterm"
  )
  for t in "${candidates[@]}"; do
    if have "$t"; then
      echo "$t"
      return 0
    fi
  done
  return 1
}

# Build the command string that launches a service inside a terminal.
# We prefix with the local Node PATH so npm works even if it's not system-wide.
term_cmd_for() {
  local dir="$1" label="$2"
  # 'exec bash' at the end keeps the terminal open after the process exits.
  printf 'export PATH="%s:$PATH"; cd "%s" && echo "=== %s starting ===" && npm run dev; echo; echo "=== %s process exited. Press Enter to close ==="; read' \
    "$LOCAL_NODE_DIR" "$dir" "$label" "$label"
}

# -----------------------------------------------------------------------------
# 1. Node / npm
# -----------------------------------------------------------------------------
log "Checking Node.js / npm …"

if ! have node || ! have npm; then
  # Fall back to the user-local Node.js installed under ~/.local
  if [[ -x "$LOCAL_NODE_DIR/node" && -x "$LOCAL_NODE_DIR/npm" ]]; then
    log "Using local Node.js at $LOCAL_NODE_DIR"
    export PATH="$LOCAL_NODE_DIR:$PATH"
  else
    err "Node.js and npm not found. Install them (sudo pacman -S npm) or place Node in $LOCAL_NODE_DIR"
    exit 1
  fi
fi

log "Node: $(node --version)  npm: $(npm --version)"

# -----------------------------------------------------------------------------
# 2. MongoDB via Docker
# -----------------------------------------------------------------------------
log "Checking Docker / MongoDB …"

if ! have docker; then
  err "Docker not found. Install it (sudo pacman -S docker) and add your user to the docker group."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  err "Docker daemon is not running. Start it: sudo systemctl start docker"
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -qx "$MONGO_CONTAINER"; then
  if docker ps -a --format '{{.Names}}' | grep -qx "$MONGO_CONTAINER"; then
    log "MongoDB container exists but is stopped — starting it …"
    docker start "$MONGO_CONTAINER" >/dev/null
  else
    log "Pulling and starting MongoDB container ($MONGO_IMAGE) …"
    docker run -d --name "$MONGO_CONTAINER" -p "$MONGO_PORT:27017" "$MONGO_IMAGE" >/dev/null
  fi
else
  log "MongoDB container '$MONGO_CONTAINER' is already running."
fi

# Wait until MongoDB answers a ping
log "Waiting for MongoDB to accept connections …"
for i in $(seq 1 30); do
  if docker exec "$MONGO_CONTAINER" mongosh --quiet --eval "db.runCommand({ping:1})" >/dev/null 2>&1; then
    ok "MongoDB is ready on 127.0.0.1:$MONGO_PORT"
    break
  fi
  if [[ "$i" -eq 30 ]]; then
    err "MongoDB did not become ready in time."
    exit 1
  fi
  sleep 1
done

# -----------------------------------------------------------------------------
# 3. Backend .env
# -----------------------------------------------------------------------------
if [[ ! -f "$BACKEND_DIR/.env" ]]; then
  log "Creating backend/.env from .env.example …"
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
fi

# -----------------------------------------------------------------------------
# 4. Install dependencies (if node_modules missing)
# -----------------------------------------------------------------------------
install_if_needed() {
  local dir="$1" label="$2"
  if [[ ! -d "$dir/node_modules" ]]; then
    log "Installing $label dependencies (npm install) …"
    (cd "$dir" && npm install --no-audit --no-fund >/dev/null 2>&1)
    ok "$label dependencies installed."
  else
    log "$label dependencies already present."
  fi
}

install_if_needed "$BACKEND_DIR" "backend"
install_if_needed "$FRONTEND_DIR" "frontend"

# -----------------------------------------------------------------------------
# 5. Detect terminal and open one window per service
# -----------------------------------------------------------------------------
TERMINAL="$(detect_terminal)" || {
  err "No supported terminal emulator found (gnome-terminal, konsole, xfce4-terminal, kitty, alacritty, terminator, xterm)."
  err "Install one of them, or run the two services manually in separate terminals."
  exit 1
}

log "Using terminal: $TERMINAL"

# Avoid starting duplicates if already running
if pgrep -f "nodemon server.js" >/dev/null 2>&1; then
  log "Backend appears to be already running — skipping backend window."
else
  log "Opening backend terminal …"
  case "$TERMINAL" in
    gnome-terminal)
      gnome-terminal --title="UNAC Forum Backend" -- bash -c "$(term_cmd_for "$BACKEND_DIR" "Backend")" &
      ;;
    konsole)
      konsole --title "UNAC Forum Backend" -e bash -c "$(term_cmd_for "$BACKEND_DIR" "Backend")" &
      ;;
    xfce4-terminal)
      xfce4-terminal --title="UNAC Forum Backend" -e "bash -c '$(term_cmd_for "$BACKEND_DIR" "Backend")'" &
      ;;
    kitty)
      kitty --title "UNAC Forum Backend" bash -c "$(term_cmd_for "$BACKEND_DIR" "Backend")" &
      ;;
    alacritty)
      alacritty --title "UNAC Forum Backend" -e bash -c "$(term_cmd_for "$BACKEND_DIR" "Backend")" &
      ;;
    terminator)
      terminator --title="UNAC Forum Backend" -e "bash -c '$(term_cmd_for "$BACKEND_DIR" "Backend")'" &
      ;;
    xterm)
      xterm -title "UNAC Forum Backend" -e bash -c "$(term_cmd_for "$BACKEND_DIR" "Backend")" &
      ;;
  esac
fi

if pgrep -f "vite" >/dev/null 2>&1; then
  log "Frontend appears to be already running — skipping frontend window."
else
  log "Opening frontend terminal …"
  case "$TERMINAL" in
    gnome-terminal)
      gnome-terminal --title="UNAC Forum Frontend" -- bash -c "$(term_cmd_for "$FRONTEND_DIR" "Frontend")" &
      ;;
    konsole)
      konsole --title "UNAC Forum Frontend" -e bash -c "$(term_cmd_for "$FRONTEND_DIR" "Frontend")" &
      ;;
    xfce4-terminal)
      xfce4-terminal --title="UNAC Forum Frontend" -e "bash -c '$(term_cmd_for "$FRONTEND_DIR" "Frontend")'" &
      ;;
    kitty)
      kitty --title "UNAC Forum Frontend" bash -c "$(term_cmd_for "$FRONTEND_DIR" "Frontend")" &
      ;;
    alacritty)
      alacritty --title "UNAC Forum Frontend" -e bash -c "$(term_cmd_for "$FRONTEND_DIR" "Frontend")" &
      ;;
    terminator)
      terminator --title="UNAC Forum Frontend" -e "bash -c '$(term_cmd_for "$FRONTEND_DIR" "Frontend")'" &
      ;;
    xterm)
      xterm -title "UNAC Forum Frontend" -e bash -c "$(term_cmd_for "$FRONTEND_DIR" "Frontend")" &
      ;;
  esac
fi

# -----------------------------------------------------------------------------
# 6. Summary
# -----------------------------------------------------------------------------
echo ""
echo "============================================================"
echo "   UNAC Forum launcher finished"
echo "============================================================"
echo ""
echo "  Frontend : http://localhost:5173/"
echo "  Backend  : http://localhost:5001"
echo "  MongoDB  : 127.0.0.1:$MONGO_PORT (container: $MONGO_CONTAINER)"
echo ""
echo "  Two terminal windows should have opened:"
echo "    • UNAC Forum Backend  (npm run dev in backend/)"
echo "    • UNAC Forum Frontend (npm run dev in frontend/)"
echo ""
echo "  Demo credentials:"
echo "    pepito.perez@estudiantes.unac.edu  /  demo123"
echo "    fulano.de.tal@estudiantes.unac.edu /  demo123"
echo ""
echo "============================================================"
echo ""
ok "Done. Watch the two terminal windows to see each service start."
echo ""
