#!/usr/bin/env bash
set -euo pipefail
echo "Starting dev stack (server:4000, web:5173)..."
docker compose up --remove-orphans
