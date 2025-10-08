# 📝 Blog Full-Stack

Blog moderne avec Next.js 15 et Strapi v5. Design minimaliste avec mode sombre, thème TweakCN et **configuration centralisée dans Strapi CMS**.

## 👀 Aperçu

<div align="center">

### Page d'accueil
![Page d'accueil](screenshots/FireShot%20Capture%20001%20-%20FabLrc%20-%20localhost.png)

### Blog
![Liste des articles](screenshots/FireShot%20Capture%20002%20-%20FabLrc%20-%20localhost.png)

### Article
![Article avec TOC](screenshots/FireShot%20Capture%20003%20-%20Beautiful%20picture%20-%20localhost.png)

### A propos
![Recherche](screenshots/FireShot%20Capture%20004%20-%20FabLrc%20-%20localhost.png)

### Contact
![Menu mobile](screenshots/FireShot%20Capture%20005%20-%20FabLrc%20-%20localhost.png)

</div>

## 🚀 Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS v4, ShadCN UI
- **Backend**: Strapi v5, SQLite
- **Infrastructure**: Docker, Docker Compose, GitHub Actions
- **Autres**: React Markdown (GFM), Shiki, DM Sans, Lucide Icons

## 🏁 Démarrage

```bash
# Backend
cd backend && npm install && npm run develop

# Frontend
cd frontend && npm install && npm run dev
```

**Variables d'environnement**: Créer `frontend/.env.local`:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### 🐳 Avec Docker (Recommandé)

```bash
# Installation rapide avec le script
.\install.ps1  # Windows
# ou
make install   # Linux/Mac

# Ou manuellement
docker compose up -d --build
```

**URLs** :
- Frontend : http://localhost:3000
- Backend : http://localhost:1337
- Admin : http://localhost:1337/admin

📖 **Documentation complète** : Voir [`DEPLOYMENT.md`](DEPLOYMENT.md) | Windows : [`WINDOWS.md`](WINDOWS.md)

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

## 📂 Structure

```
blog/
├── backend/                 # Strapi CMS
│   ├── src/api/            # Content types (articles, categories, authors)
│   ├── config/             # Configuration Strapi
│   └── data/               # Data seed
│
└── frontend/               # Next.js App
    └── src/
        ├── app/            # Routes (App Router)
        │   ├── layout.tsx          # Layout global + metadata
        │   ├── page.tsx            # Homepage (profil)
        │   ├── blog/               # Liste + articles
        │   ├── about/              # À propos
        │   ├── contact/            # Contact
        │   ├── rss.xml/            # Flux RSS
        │   └── sitemap.xml/        # Sitemap
        │
        ├── components/     # Composants React
        │   ├── navbar.tsx          # Navigation principale
        │   ├── footer.tsx          # Footer
        │   ├── breadcrumb.tsx      # Fil d'Ariane + Schema.org
        │   ├── blog-list.tsx       # Liste avec filtres
        │   ├── article-sidebar.tsx # TOC + Partage
        │   ├── contact-form.tsx    # Formulaire contact
        │   └── ui/                 # ShadCN components
        │
        ├── lib/            # Utils
        │   ├── strapi.ts           # API Strapi + getSiteConfig()
        │   └── utils.ts            # Helpers
        │
        └── types/          # TypeScript
            └── strapi.ts           # Interfaces Strapi
```

## 🏗️ Architecture

### Configuration centralisée
- **Toutes les données du site** sont gérées dans Strapi (Single Type `site-config`)
- Le frontend récupère la config via `getSiteConfig()` avec cache 1h
- Fallback automatique si Strapi indisponible

### Pattern Server/Client Components
- **Server Components** : Fetch les données (pages, layout)
- **Client Components** : Interactivité (filtres, recherche, formulaires)
- Config passée via props depuis serveur vers client

### Flux de données
```
Strapi Admin → site-config → API → getSiteConfig() → Server Components → Props → Client Components
```

## ⚙️ Configuration

### 🎛️ Configuration du site (Strapi CMS)
Toute la configuration du site est gérée via Strapi :

1. **Créer le content-type `site-config`** dans Strapi (Single Type)
2. **Configurer les champs** (voir `STRAPI_SITE_CONFIG.md`)
3. **Activer les permissions** : Settings → Users & Permissions → Public → site-config (find ✓)
4. **Remplir les données** : Content Manager → Site Config

**Champs disponibles** :
- Informations du site (nom, description, URL)
- Profil (nom, username, bio, email, avatar)
- Liens sociaux (GitHub, Twitter, LinkedIn, email)
- SEO (meta description, keywords)
- Images (logo, favicon)
- Options (newsletter, commentaires)
- Textes (footer, copyright)

Voir la **documentation complète** : [`STRAPI_SITE_CONFIG.md`](STRAPI_SITE_CONFIG.md)

### 🎨 Thème visuel
- **Couleurs et design** : `frontend/src/app/globals.css`
- **Données démo** : `cd backend && npm run seed:example`

## 🎨 Personnalisation

### Changer le titre du blog
Via **Strapi Admin** → Content Manager → Site Config → `siteName`

Ou temporairement dans le code (`frontend/src/lib/strapi.ts`) :
```typescript
// Valeurs par défaut si Strapi n'est pas disponible
return {
  siteName: "Mon Super Blog",
  // ...
}
```

### URLs importantes
- `/` - Page d'accueil (profil social)
- `/blog` - Liste des articles avec filtres
- `/blog?category=slug` - Articles filtrés par catégorie
- `/blog/[slug]` - Article individuel avec TOC et partage
- `/about` - À propos
- `/contact` - Contact (formulaire + liens sociaux)
- `/rss.xml` - Flux RSS dynamique
- `/sitemap.xml` - Sitemap SEO
- `/robots.txt` - Instructions robots

### API Strapi
- `http://localhost:1337/api/articles` - Articles
- `http://localhost:1337/api/categories` - Catégories
- `http://localhost:1337/api/site-config` - Configuration du site
- `http://localhost:1337/admin` - Panel d'administration

### Raccourcis clavier
- `Ctrl+K` / `Cmd+K` - Ouvrir la recherche
- `↑` / `↓` - Navigation dans les résultats
- `Entrée` - Sélectionner un résultat
- `Échap` - Fermer la recherche

## 🐳 Déploiement avec Docker

### 🚀 Build et exécution en local

**Prérequis** : Docker et Docker Compose installés

1. **Cloner le repository** :
```bash
git clone https://github.com/FabLrc/blog.git
cd blog
```

2. **Configurer les variables d'environnement** :
```bash
# Copier le fichier exemple
cp .env.example .env

# Générer des secrets sécurisés pour Strapi
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Éditer .env et remplacer les valeurs par défaut
```

3. **Lancer les conteneurs** :
```bash
# Build et démarrage
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter les conteneurs
docker compose down

# Arrêter et supprimer les volumes (⚠️ supprime la BDD)
docker compose down -v
```

4. **Accéder à l'application** :
   - **Frontend** : http://localhost:3000
   - **Backend Strapi** : http://localhost:1337
   - **Admin Strapi** : http://localhost:1337/admin

### 📦 Images Docker

Les images sont automatiquement buildées et publiées sur **GitHub Container Registry** via GitHub Actions à chaque push sur `main`.

**Pull les images** :
```bash
# Backend
docker pull ghcr.io/fablrc/blog-backend:latest

# Frontend
docker pull ghcr.io/fablrc/blog-frontend:latest
```

### ⚙️ Configuration pour production

**Variables d'environnement importantes** :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRAPI_URL` | URL publique de l'API Strapi | `https://api.votredomaine.com` |
| `PUBLIC_STRAPI_URL` | URL du backend Strapi | `https://api.votredomaine.com` |
| `APP_KEYS` | Secrets Strapi (4 clés séparées par virgule) | Générer avec crypto |
| `JWT_SECRET` | Secret JWT pour Strapi | Générer avec crypto |

**Générer des secrets sécurisés** :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 🚢 Déploiement en production

#### Option 1 : GitHub Actions automatique

Les images Docker sont automatiquement buildées et publiées à chaque push sur `main`. 

**Configuration nécessaire** :
- Les images sont publiques sur `ghcr.io/fablrc/blog-*`
- Pour déploiement automatique : ajouter les secrets GitHub (voir `.github/workflows/docker-build.yml`)

#### Option 2 : Serveur VPS/Dédié

Sur votre serveur :

```bash
# 1. Installer Docker et Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Cloner le repository
git clone https://github.com/FabLrc/blog.git
cd blog

# 3. Configurer .env avec vos valeurs de production
cp .env.example .env
nano .env

# 4. Lancer avec les images pré-buildées
docker compose pull
docker compose up -d

# 5. Configurer un reverse proxy (Nginx/Caddy)
```

#### Option 3 : Plateformes Cloud

**Railway** :
```bash
railway up
```

**Fly.io** :
```bash
fly launch
fly deploy
```

**Render, DigitalOcean App Platform, AWS ECS, etc.** :
- Pointer vers les Dockerfiles
- Configurer les variables d'environnement
- Déployer

### 🔒 Sécurité

**En production, pensez à** :
- ✅ Générer des secrets uniques (ne jamais utiliser les exemples)
- ✅ Utiliser HTTPS (certificat SSL/TLS)
- ✅ Configurer un reverse proxy (Nginx, Caddy, Traefik)
- ✅ Sauvegarder régulièrement la base de données et les uploads
- ✅ Restreindre l'accès à l'admin Strapi (whitelist IP)
- ✅ Utiliser une base de données externe en production (PostgreSQL recommandé)
- ✅ Configurer les CORS correctement dans Strapi

### 📁 Persistance des données

Docker Compose utilise des volumes pour persister :
- **Base de données SQLite** : `./backend/.tmp/`
- **Uploads Strapi** : `./backend/public/uploads/`
- **Data** : `./backend/data/`

**⚠️ En production PostgreSQL** : Utiliser une base externe pour la scalabilité.

### 🧪 Build manuel des images

Si vous voulez builder les images localement :

```bash
# Backend
docker build -t blog-backend ./backend

# Frontend
docker build -t blog-frontend \
  --build-arg NEXT_PUBLIC_STRAPI_URL=http://localhost:1337 \
  ./frontend
```

## 📚 Documentation complète

| Document | Description |
|----------|-------------|
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | 🚀 Guide de déploiement complet (local, VPS, cloud) |
| **[DOCKER_SETUP.md](DOCKER_SETUP.md)** | 🐳 Architecture Docker détaillée et configuration |
| **[WINDOWS.md](WINDOWS.md)** | 🪟 Guide spécifique Windows/PowerShell |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | 🤝 Guide de contribution et conventions |
| **[STRAPI_SITE_CONFIG.md](STRAPI_SITE_CONFIG.md)** | ⚙️ Configuration du content-type site-config |

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
