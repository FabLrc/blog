# 📝 Blog Full-Stack

Un blog moderne et performant construit avec Next.js et Strapi CMS.

## 🚀 Technologies

### Frontend
- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Styling utilitaire
- **ShadCN UI** - Composants UI élégants
- **Lucide React** - Icônes modernes

### Backend
- **Strapi v5** - Headless CMS
- **SQLite** - Base de données
- **Node.js** - Runtime JavaScript

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Backend (Strapi)

```bash
cd backend
npm install
npm run develop
```

Le backend sera disponible sur http://localhost:1337

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera disponible sur http://localhost:3000

## 🎯 Fonctionnalités

### ✅ Implémenté
- 📄 Page d'accueil
- 📚 Liste des articles de blog avec pagination visuelle
- 📖 Page article individuel avec rendu des blocs de contenu
- 🎨 Design responsive et épuré
- 🖼️ Gestion des images via Strapi
- 👤 Informations auteur avec avatar
- 🏷️ Système de catégories
- 🔍 SEO optimisé (meta tags, Open Graph, Twitter Cards)
- 🧭 Navigation intuitive

### 📋 Types de contenu Strapi
- **Articles** : Titre, description, slug, image de couverture, contenu (blocs)
- **Auteurs** : Nom, email, avatar
- **Catégories** : Nom, slug
- **Blocs de contenu** :
  - Rich Text (Markdown)
  - Citations
  - Images
  - Galeries (Slider)

## 🗂️ Structure du projet

```
blog/
├── backend/          # API Strapi
│   ├── config/      # Configuration Strapi
│   ├── data/        # Données de seed
│   ├── public/      # Fichiers publics
│   └── src/
│       └── api/     # Content types et endpoints
│
└── frontend/        # Application Next.js
    ├── public/      # Assets statiques
    └── src/
        ├── app/     # Pages et routing
        ├── components/ # Composants React
        ├── lib/     # Utilitaires et API
        └── types/   # Types TypeScript
```

## 🔧 Configuration

### Variables d'environnement

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**Backend** (`.env` déjà configuré):
- Configuration de la base de données
- Clés d'API Strapi

## 📊 Données de démonstration

Pour importer les données de démonstration (articles, auteurs, catégories) :

```bash
cd backend
npm run seed:example
```

## 🎨 Design System

Le projet utilise **ShadCN UI** avec un thème neutre et épuré :
- Composants : Card, Badge, Avatar, Separator, Navigation Menu
- Palette de couleurs adaptative (light/dark)
- Typographie optimisée pour la lecture

## 🚧 Développement futur

- [ ] Recherche d'articles
- [ ] Filtres par catégorie
- [ ] Page "À propos"
- [ ] Page "Contact" avec formulaire
- [ ] Commentaires
- [ ] Partage social
- [ ] Mode sombre/clair
- [ ] Internationalisation (i18n)
- [ ] Déploiement en production

## 📝 Scripts disponibles

### Backend
```bash
npm run develop    # Démarrer en mode développement
npm run build      # Build pour production
npm run start      # Démarrer en production
npm run seed:example # Importer les données de démo
```

### Frontend
```bash
npm run dev        # Démarrer en mode développement
npm run build      # Build pour production
npm run start      # Démarrer le build de production
npm run lint       # Linter le code
```

## 📄 License

Ce projet est à usage personnel/éducatif.

---

Développé avec ❤️ en utilisant Next.js et Strapi
