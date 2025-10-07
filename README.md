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
- **Autres**: React Markdown (GFM), DM Sans, Lucide Icons

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

## ✨ Fonctionnalités

### 📖 Contenu
- ✅ **Configuration centralisée dans Strapi** (profil, social, images, SEO)
- ✅ Rendu Markdown complet (GFM)
- ✅ Table des matières avec scroll spy
- ✅ Navigation précédent/suivant
- ✅ Temps de lecture estimé (200 mots/min)
- ✅ Multi-catégories par article
- ✅ Filtres par catégorie avec URL sync
- ✅ Ancres de partage (copie lien vers section)

### 🔍 Recherche & Navigation
- ✅ Barre de recherche avec `Ctrl+K` / `Cmd+K`
- ✅ Résultats en temps réel
- ✅ Navbar sticky avec backdrop blur
- ✅ Menu hamburger responsive

### 🎨 Interface
- ✅ Mode sombre/clair avec persistance
- ✅ Thème TweakCN (Mocha Mousse)
- ✅ Typographie DM Sans
- ✅ Design responsive (mobile-first)
- ✅ Sidebar unifiée (TOC + partage social)

### 🚀 SEO & Performance
- ✅ **Fil d'Ariane** (Breadcrumb) avec Schema.org JSON-LD
- ✅ Sitemap XML automatique (`/sitemap.xml`)
- ✅ Flux RSS dynamique (`/rss.xml`)
- ✅ Robots.txt
- ✅ Open Graph & Twitter Cards
- ✅ Balises meta dynamiques depuis Strapi
- ✅ ISR avec revalidation (1h pour config, 1min pour articles)

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

## 🎯 Roadmap

- [x] Configuration centralisée dans Strapi
- [x] Multi-catégories par article
- [x] Filtres URL-based (deep linking)
- [x] Breadcrumb avec Schema.org
- [x] Sidebar responsive (desktop fixe + mobile sticky)
- [ ] Coloration syntaxique des blocs de code
- [ ] Système de commentaires (Giscus)
- [ ] Newsletter fonctionnelle (intégration Mailchimp/SendGrid)
- [ ] Analytics (Plausible/Google Analytics)
- [ ] JSON-LD pour rich snippets articles

## 🚢 Déploiement

### Frontend (Vercel recommandé)
1. Push sur GitHub
2. Connecter à Vercel
3. Configurer les variables d'environnement :
   ```
   NEXT_PUBLIC_STRAPI_URL=https://votre-strapi.com
   NEXT_PUBLIC_SITE_URL=https://votre-blog.com
   ```
4. Deploy automatique sur chaque push

### Backend (Strapi Cloud, Railway, ou VPS)
1. **Strapi Cloud** : Import direct depuis GitHub
2. **Railway** : Template Strapi disponible
3. **VPS** : 
   ```bash
   npm run build
   NODE_ENV=production npm start
   ```

### Configuration post-déploiement
1. Créer le content-type `site-config` dans Strapi production
2. Configurer les permissions publiques
3. Remplir les données dans Content Manager
4. Tester l'endpoint : `https://votre-strapi.com/api/site-config?populate=*`

---

✨ Développé par [FabLrc](https://github.com/FabLrc)

## 📄 Licence

MIT
