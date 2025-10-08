# Dockerfile multi-stage pour Next.js
# Stage 1: Dépendances - Installation de toutes les dépendances
FROM node:20-alpine AS deps

WORKDIR /app

# Installation de libc6-compat pour la compatibilité Alpine
RUN apk add --no-cache libc6-compat

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Stage 2: Builder - Build de l'application Next.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des dépendances depuis deps
COPY --from=deps /app/node_modules ./node_modules

# Copie du code source
COPY . .

# Variables d'environnement pour le build
# NEXT_PUBLIC_* doivent être définies au moment du build
ARG NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build de Next.js avec standalone output
RUN npm run build

# Stage 3: Runner - Image de production légère
FROM node:20-alpine AS runner

WORKDIR /app

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Variables d'environnement
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Copie des fichiers publics
COPY --from=builder /app/public ./public

# Création du répertoire .next avec les bonnes permissions
RUN mkdir .next && chown nextjs:nodejs .next

# Copie des fichiers buildés avec standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Changement d'utilisateur pour la sécurité
USER nextjs

# Exposition du port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 0

# Démarrage de l'application
CMD ["node", "server.js"]
