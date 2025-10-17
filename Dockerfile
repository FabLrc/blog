# Multi-stage Dockerfile to build both frontend (Next.js) and backend (Strapi) into a single image

FROM node:20-bullseye-slim AS builder

# Install build deps for native modules (better-sqlite3, etc.)
RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential python3 ca-certificates libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# Copy package files for both projects (to leverage cache)
COPY backend/package.json backend/package-lock.json backend/yarn.lock* backend/
COPY frontend/package.json frontend/package-lock.json frontend/yarn.lock* frontend/

# Install dependencies for backend and frontend
RUN cd backend && npm install --legacy-peer-deps
RUN cd frontend && npm install --legacy-peer-deps

# Copy full sources after deps to avoid invalidating cache early
COPY backend backend/
COPY frontend frontend/
COPY scripts scripts/

# Build frontend and backend
RUN npm run build --prefix frontend
RUN npm run build --prefix backend

# Final image
FROM node:20-bullseye-slim

# Runtime deps for sqlite
RUN apt-get update \
  && apt-get install -y --no-install-recommends libsqlite3-0 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built app from builder
COPY --from=builder /app /app

# Make start script executable
RUN chmod +x /app/scripts/start.sh || true

ENV NODE_ENV=production
ENV HOST=0.0.0.0

EXPOSE 1337 3000

CMD ["/app/scripts/start.sh"]
