#!/bin/sh
set -eu

APP_HOST="${APP_HOST:-0.0.0.0}"
PORT="${PORT:-8081}"
BACKEND_ENDPOINT="${BACKEND_ENDPOINT:-}"

export APP_HOST PORT BACKEND_ENDPOINT

cat >/usr/share/nginx/html/runtime-config.js <<EOF
window.__APP_CONFIG__ = {
  backendEndpoint: "${BACKEND_ENDPOINT}"
};
EOF
