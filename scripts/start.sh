#!/bin/bash
set -euo pipefail

# Start Strapi and Next in the same container.
# Note: We run both in background and wait; if one exits, the container exits.

echo "Starting Strapi (backend)..."
echo "Starting Next (frontend)..."

# Start Strapi on PORT 1337
export HOST=0.0.0.0
export PORT=1337
cd /app/backend
# Ensure .env is present or required env vars provided by docker-compose
npm run start --prefix /app/backend &
STRAPI_PID=$!

sleep 1

echo "Starting Next (frontend)..."
# Start Next on PORT 3000 and bind to 0.0.0.0
export HOST=0.0.0.0
export PORT=3000
cd /app/frontend
npm run start --prefix /app/frontend &
NEXT_PID=$!

# Wait for either to exit
wait -n $STRAPI_PID $NEXT_PID
EXIT_CODE=$?

echo "One of the processes exited with code $EXIT_CODE. Stopping container."
exit $EXIT_CODE
