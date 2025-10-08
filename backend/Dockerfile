# Dockerfile multi-stage pour Strapi
# Stage 1: Builder - Installation des dépendances et build
FROM node:20-alpine AS builder

WORKDIR /app

# Installation des outils nécessaires pour better-sqlite3
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation de toutes les dépendances (dev + prod)
RUN npm ci

# Copie du code source
COPY . .

# Variables d'environnement pour le build
ENV NODE_ENV=production

# Build de l'application Strapi
RUN npm run build

# Stage 2: Runner - Image de production légère
FROM node:20-alpine AS runner

WORKDIR /app

# Installation de sqlite pour better-sqlite3
RUN apk add --no-cache sqlite

# Copie des dépendances de production uniquement
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Copie des fichiers buildés depuis le builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.strapi ./.strapi

# Copie des fichiers de configuration
COPY config ./config
COPY database ./database
COPY src ./src

# Création des répertoires pour les uploads et la base de données
RUN mkdir -p public/uploads data

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=1337

# Exposition du port
EXPOSE 1337

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:1337/_health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Démarrage de l'application
CMD ["npm", "run", "start"]
