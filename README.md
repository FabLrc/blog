# 📝 Blog Full-Stack

Un blog personnel moderne et performant construit avec Next.js et Strapi CMS. Design minimaliste, mode sombre, et expérience utilisateur optimisée.

## 🚀 Technologies

### Frontend
- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Styling utilitaire moderne
- **ShadCN UI** - Composants UI élégants et accessibles
- **Lucide React** - Icônes modernes
- **React Context** - Gestion d'état pour le thème

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
- 🏠 **Page d'accueil** avec profil personnalisé et articles récents
- 📚 **Liste des articles** avec pagination visuelle et filtres par catégorie
- 📖 **Pages articles** avec rendu des blocs de contenu riches
- 📄 **Page "À propos"** personnalisable avec profil complet
- 📧 **Page "Contact"** avec formulaire et protection anti-spam
- 🌓 **Mode sombre/clair** paramétrable avec persistance localStorage
- 🔗 **Partage social** (X/Twitter, LinkedIn, Facebook) avec boutons flottants
- 📑 **Table des matières** auto-générée avec scroll spy pour les longs articles
- ⏭️ **Navigation article** précédent/suivant basée sur la date de publication
- 📝 **Support Markdown complet** (GFM) avec conversion en HTML propre
- 🎨 **Design responsive** et minimaliste sur tous les écrans
- 🖼️ **Gestion d'images** optimisée (Next.js Image + Strapi)
- 👤 **Système d'auteurs** avec avatars et fallback sur image de profil locale
- 🏷️ **Catégories** pour organiser les articles
- 🔍 **SEO optimisé** (meta tags, Open Graph, X/Twitter Cards)
- 🧭 **Navigation intuitive** avec indicateur de page active
- 🛡️ **Protection email** anti-bots par obfuscation
- ⚙️ **Configuration centralisée** du profil dans `config/profile.ts`

### 📋 Types de contenu Strapi
- **Articles** : Titre, description, slug, image de couverture, contenu (blocs)
- **Auteurs** : Nom, email, avatar
- **Catégories** : Nom, slug
- **Blocs de contenu** :
  - Rich Text (Markdown avec support complet de la syntaxe)
  - Citations
  - Images
  - Galeries (Slider)

### 📝 Support Markdown
Le blog supporte **GitHub Flavored Markdown** (GFM) avec :
- Titres (`#` à `######`) avec génération automatique d'IDs pour ancres
- Formatage (gras, italique, barré, code inline)
- Listes (ordonnées, non-ordonnées, tâches)
- Liens et images
- Blocs de code avec coloration syntaxique
- Tableaux
- Citations
- Lignes horizontales

Voir `MARKDOWN_EXAMPLE.md` pour des exemples complets et `MARKDOWN_CONVERSION.md` pour la documentation technique.

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
    ├── public/      # Assets statiques (profile.jpg, etc.)
    └── src/
        ├── app/          # Pages et routing (App Router)
        │   ├── page.tsx           # Page d'accueil
        │   ├── layout.tsx         # Layout principal
        │   ├── blog/              # Liste des articles
        │   │   └── [slug]/        # Page article dynamique
        │   ├── about/             # Page "À propos"
        │   ├── contact/           # Page "Contact"
        │   └── not-found.tsx      # Page 404
        ├── components/   # Composants React
        │   ├── ui/               # Composants ShadCN UI
        │   ├── theme-provider.tsx # Context du mode sombre
        │   ├── navbar.tsx         # Navigation
        │   ├── footer.tsx         # Footer
        │   ├── social-share.tsx   # Boutons de partage
        │   ├── table-of-contents.tsx  # Table des matières
        │   ├── article-navigation.tsx # Navigation prev/next
        │   ├── block-renderer.tsx     # Rendu Markdown → HTML
        │   └── ...
        ├── config/       # Configuration
        │   └── profile.ts         # Configuration du profil
        ├── lib/          # Utilitaires et API
        │   ├── strapi.ts          # Client API Strapi
        │   └── utils.ts           # Fonctions utilitaires
        └── types/        # Types TypeScript
```

## 🔧 Configuration

### Variables d'environnement

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # URL du site (pour le partage social)
```

**Backend** (`backend/.env.local`):
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS="key1,key2"  # À générer (voir installation)
API_TOKEN_SALT=xxxxx  # À générer
ADMIN_JWT_SECRET=xxxxx  # À générer
TRANSFER_TOKEN_SALT=xxxxx  # À générer
JWT_SECRET=xxxxx  # À générer
ENCRYPTION_KEY=xxxxx  # À générer
```

> **Note** : Les clés de sécurité doivent être générées avec des valeurs aléatoires sécurisées. Un fichier `.env.example` est fourni dans le backend.

### Configuration du profil

Personnalisez votre profil dans `frontend/src/config/profile.ts` :
- Nom et titre
- Biographie
- Image de profil (placez votre photo dans `/public/profile.jpg`)
- Liens vers vos réseaux sociaux
- Compétences techniques
- Centres d'intérêt

## 📊 Données de démonstration

Pour importer les données de démonstration (articles, auteurs, catégories) :

```bash
cd backend
npm run seed:example
```

## 🎨 Design System

Le projet utilise **ShadCN UI** avec un thème personnalisable :
- **Composants** : Card, Badge, Avatar, Button, Input, Textarea, Label, Separator, Navigation Menu
- **Thème** : Mode clair/sombre avec transition fluide
- **Couleurs** : Palette adaptative utilisant oklch pour une meilleure cohérence
- **Typographie** : Optimisée pour la lisibilité des articles
- **Animations** : Transitions douces et micro-interactions
- **Responsive** : Mobile-first avec breakpoints adaptés

## 🎯 Fonctionnalités à venir

### Court terme
- [ ] Recherche d'articles (barre de recherche)
- [ ] Temps de lecture estimé pour chaque article
- [ ] Coloration syntaxique pour les blocs de code (rehype-highlight)
- [ ] Statistiques publiques (nombre d'articles, catégories)

### Moyen terme
- [ ] Système de commentaires (Giscus)
- [ ] Newsletter fonctionnelle (Mailchimp/ConvertKit)
- [ ] Flux RSS
- [ ] Page "Projets" / Portfolio
- [ ] Archives par date

### Long terme
- [ ] Analytics (Plausible/Google Analytics)
- [ ] SEO avancé (sitemap dynamique, JSON-LD)
- [ ] Internationalisation (i18n)
- [ ] Mode lecture amélioré
- [ ] PWA (Progressive Web App)

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

## � Déploiement

### Frontend (Vercel recommandé)
1. Push ton code sur GitHub
2. Importe le projet sur Vercel
3. Configure les variables d'environnement
4. Déploie !

### Backend (plusieurs options)
- **Strapi Cloud** (recommandé)
- **Railway**
- **Heroku**
- **VPS** (Digital Ocean, Linode)

> N'oublie pas de configurer les webhooks Strapi pour redéployer automatiquement le frontend lors de la publication de nouveaux articles.

## 🤝 Contribution

Ce projet est personnel mais les suggestions sont les bienvenues ! N'hésite pas à ouvrir une issue pour :
- Reporter un bug
- Proposer une amélioration
- Partager une idée de fonctionnalité

## �📄 License

Ce projet est à usage personnel/éducatif.

---

✨ Développé avec ❤️ par [FabLrc](https://github.com/FabLrc) utilisant Next.js et Strapi
