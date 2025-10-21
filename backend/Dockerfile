FROM node:20-bullseye-slim

# Install build deps for native modules if needed
RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential python3 ca-certificates libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps --production=false

# Copy source
COPY . .

# Build Strapi admin (if needed)
RUN npm run build || true

EXPOSE 1337

CMD ["npm", "run", "start"]
