#!/usr/bin/env sh
set -e

if [ ! -d "./venv" ]; then
  echo "Error: ./venv not found. Create the virtual environment first." >&2
  exit 1
fi

# Kill any existing process on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

echo "Installing backend dependencies..."
./venv/bin/pip install -r requirements.txt

echo "Starting backend server with uvicorn..."
exec ./venv/bin/python -m uvicorn main:app --reload
