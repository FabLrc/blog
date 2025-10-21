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

# Copy the secret generation script
COPY generate-secrets.sh /usr/local/bin/generate-secrets.sh
RUN chmod +x /usr/local/bin/generate-secrets.sh

# Build Strapi admin (if needed)
RUN npm run build || true

EXPOSE 1337

# Use the script as entrypoint to auto-generate secrets
ENTRYPOINT ["/usr/local/bin/generate-secrets.sh"]
CMD ["npm", "run", "start"]
