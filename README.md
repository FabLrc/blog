# 📝 Blog Full-Stack

Blog moderne avec Next.js 15 et Strapi v5. Design minimaliste avec mode sombre et **configuration centralisée dans Strapi CMS**.

## 👀 Aperçu

<div align="center">

![Page d'accueil](screenshots/FireShot%20Capture%20001%20-%20FabLrc%20-%20localhost.png)
![Article avec TOC](screenshots/FireShot%20Capture%20003%20-%20Beautiful%20picture%20-%20localhost.png)

</div>

## 🚀 Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS v4, ShadCN UI
- **Backend**: Strapi v5, SQLite
- **Infrastructure**: Docker, Docker Compose, GitHub Actions
- **Autres**: React Markdown (GFM), Shiki, DM Sans, Lucide Icons

## 🏁 Démarrage

### 🐳 Docker (Recommandé)

```bash
cp .env.example .env
node scripts/generate-secrets.js  # Copier les secrets dans .env
docker compose up -d --build
```

**URLs** : Frontend [localhost:3000](http://localhost:3000) | Backend [localhost:1337](http://localhost:1337) | Admin [localhost:1337/admin](http://localhost:1337/admin)

### 📦 Installation manuelle

```bash
# Backend
cd backend && yarn && yarn dev

# Frontend  
cd frontend && yarn && yarn dev
```

Variables d'environnement : Créer `frontend/.env.local` avec `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`

## ✨ Fonctionnalités

- ✅ Configuration centralisée dans Strapi (profil, liens sociaux, images, SEO)
- ✅ Multi-catégories par article avec filtres URL-based
- ✅ Recherche instantanée (`Ctrl+K`) en temps réel
- ✅ Table des matières interactive avec scroll spy
- ✅ Mode sombre/clair avec persistance
- ✅ Breadcrumb SEO avec Schema.org JSON-LD
- ✅ Sidebar responsive (TOC + partage social)
- ✅ Rendu Markdown complet (GFM)
- ✅ Navigation précédent/suivant
- ✅ Temps de lecture estimé
- ✅ Flux RSS & Sitemap XML
- ✅ Open Graph & Twitter Cards
- ✅ ISR avec revalidation (1h config, 1min articles)

## 📂 Structure & Configuration

```
blog/
├── backend/           # Strapi CMS
│   ├── src/api/      # Content types (articles, categories, authors)  
│   └── config/       # Configuration Strapi
├── frontend/         # Next.js App
│   ├── src/app/      # Routes (layout, pages, api)
│   ├── components/   # Composants React + ShadCN UI
│   └── lib/         # Utils & API Strapi
```

### ⚙️ Configuration Strapi

Configuration centralisée via Strapi CMS (Single Type `site-config`) :
- Profil, liens sociaux, SEO, images
- Voir [`STRAPI_SITE_CONFIG.md`](STRAPI_SITE_CONFIG.md) pour les détails

**APIs** : `/api/articles` • `/api/categories` • `/api/site-config` • `/admin`

**Raccourcis** : `Ctrl+K` recherche • `↑/↓` navigation • `Entrée` sélection

## 🐳 Docker

### ⚡ Démarrage rapide
```bash
cp .env.example .env
node scripts/generate-secrets.js  # Copier les secrets dans .env
docker compose up -d --build
```

### 🔧 Configurations
- `docker-compose.yml` - Production locale (build sources)
- `docker-compose.dev.yml` - Développement (hot-reload)  
- `docker-compose.prod.yml` - Production (images GitHub)

### 📦 Production
```bash
# VPS/Serveur dédié
git clone https://github.com/FabLrc/blog.git && cd blog
cp .env.example .env  # Éditer avec vos valeurs
docker compose -f docker-compose.prod.yml up -d
```

**Images** : `ghcr.io/fablrc/blog-backend:latest` • `ghcr.io/fablrc/blog-frontend:latest`

**Sécurité** : Secrets uniques • HTTPS • PostgreSQL • Sauvegardes • Accès admin restreint

## 🎯 Roadmap

- [x] Coloration syntaxique des blocs de code avec Shiki
- [x] Dockerisation complète avec CI/CD automatique
- [ ] View Transitions API
- [ ] Optimisation des images (blur placeholder, WebP/AVIF)
- [ ] Système de thèmes saisonniers 🎃🎄🧧 (auto-switch Halloween, Noël, Nouvel an chinois)
- [ ] Mode Lecture immersif
- [ ] Newsletter fonctionnelle (Resend/SendGrid)
- [ ] Barre de progression de lecture
- [ ] Images Open Graph dynamiques (@vercel/og)

---

✨ Développé par [FabLrc](https://github.com/FabLrc)

## 📄 Licence

MIT