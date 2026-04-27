#!/usr/bin/env sh
set -e

export NODE_EXTRA_CA_CERTS="$HOME/Library/Application Support/mkcert/rootCA.pem"

# Kill any existing process on port 5173
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

echo "Installing frontend dependencies..."
npm install

echo "Starting frontend dev server..."
npm run dev
