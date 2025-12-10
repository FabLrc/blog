# 📝 Blog Full-Stack

Blog moderne propulsé par Next.js 15 et WordPress en mode Headless CMS via WPGraphQL. Design minimaliste avec mode sombre, interface ShadCN UI et **configuration centralisée dans WordPress**.

## 👀 Aperçu

<div align="center">

### Page d'accueil
![Page d'accueil](screenshots/screencapture-localhost-3000-2025-11-20-14_55_05.png)

### Barre de recherche
![Barre de recherche](screenshots/screencapture-localhost-3000-2025-11-20-14_58_09.png)

### Blog
![Liste des articles](screenshots/screencapture-localhost-3000-blog-2025-11-20-14_55_34.png)

### Article
![Article avec TOC](screenshots/screencapture-localhost-3000-blog-gemini-3-pro-le-nouveau-modele-qui-depasse-claude-sonnet-4-5-2025-11-20-15_04_27)

### Contact
![Page de contact](screenshots/screencapture-localhost-3000-contact-2025-11-20-14_57_42.png)

</div>

## 🚀 Stack Technique

### Frontend
- **Framework** : Next.js 15 (App Router) avec Turbopack
- **Langage** : TypeScript 5
- **Styling** : Tailwind CSS v4
- **UI Components** : ShadCN UI (Radix UI primitives)
- **Animations** : Motion (Framer Motion)
- **Icons** : Lucide React
- **Font** : DM Sans (Google Fonts)

## 🏁 Démarrage

### Installation

```bash
npm install
```

### Configuration

Créer un fichier `.env.local` à la racine du projet :

```env
# WordPress GraphQL API URL
# Cette URL est utilisée pour :
# - Les requêtes GraphQL vers WordPress
# - Autoriser automatiquement les images provenant de ce domaine
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql

# Site URL (pour SEO, sitemap, RSS, etc.)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# GitHub Token (Optionnel - recommandé pour éviter les erreurs 403)
# Améliore la limite de rate de l'API GitHub de 60 à 5000 requêtes/heure
# Pour créer un token : https://github.com/settings/tokens
# Permissions : Aucune permission nécessaire (token public read-only)
GITHUB_TOKEN=
```

> 💡 **Configuration automatique des images** : Le hostname de `NEXT_PUBLIC_WORDPRESS_API_URL` est automatiquement extrait et ajouté à `images.remotePatterns` de Next.js pour autoriser le chargement des images WordPress.

> ⚠️ **Prérequis WordPress** : Votre instance WordPress doit avoir le plugin **WPGraphQL** installé et activé.

> 💡 **GitHub Token (Optionnel)** : Pour éviter les erreurs 403 lors de l'affichage du nombre d'étoiles GitHub, vous pouvez créer un token personnel sans aucune permission. Cela augmente la limite de 60 à 5000 requêtes/heure. Sans token, un système de cache en mémoire limite les appels à l'API.

### Lancement en développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### Build de production

```bash
npm run build
npm start
```

## ✨ Fonctionnalités

### Contenu et navigation
- ✅ Configuration centralisée dans WordPress (titre, description, URL)
- ✅ Multi-catégories par article avec filtres dynamiques
- ✅ Recherche instantanée (`Ctrl+K` / `Cmd+K`) en temps réel
- ✅ Navigation précédent/suivant entre articles
- ✅ Breadcrumb SEO avec Schema.org JSON-LD
- ✅ Flux RSS & Sitemap XML dynamiques

### Interface utilisateur
- ✅ Table des matières interactive avec scroll spy
- ✅ Mode sombre/clair avec persistance localStorage
- ✅ Sidebar responsive (TOC + partage social)
- ✅ Barre de progression de lecture
- ✅ Design minimaliste et épuré
- ✅ Animations fluides avec Motion

### Article et contenu
- ✅ Rendu HTML WordPress avec sanitization
- ✅ Coloration syntaxique des blocs de code (Shiki)
- ✅ Images optimisées avec Next.js Image
- ✅ Temps de lecture estimé
- ✅ Partage social (X, LinkedIn, WhatsApp, Email)
- ✅ Support Markdown enrichi

### SEO et performance
- ✅ Open Graph & Twitter Cards
- ✅ ISR (Incremental Static Regeneration)
- ✅ Metadata dynamiques depuis WordPress
- ✅ Sitemap XML automatique
- ✅ robots.txt configuré
- ✅ Accessibilité (skip links, ARIA labels)

### Extras
- ✅ Formulaire de contact
- ✅ Page À propos
- ✅ Bouton vers le repo Github (avec étoiles dynamiques)
- ✅ Support React 19

## 📊 Données récupérées depuis WordPress

Le frontend récupère dynamiquement les données suivantes depuis WordPress via WPGraphQL :

### 🌐 Configuration générale du site (`GeneralSettings`)
Récupérée via `getGeneralSettings()` :

**Champs disponibles** :
- `title` : Titre du site (ex: "Mon Blog")
- `description` : Description du site pour le SEO
- `url` : URL racine du site WordPress

**Utilisée dans** :
- Métadonnées SEO (`layout.tsx`)
- Flux RSS (`rss.xml/route.ts`)
- Footer (`footer.tsx`)
- Navbar (`navbar.tsx`)

### 📝 Articles de blog (`Post`)
Récupérés via `getAllPosts()`, `getPostBySlug()`, `getPaginatedPosts()`, `searchPosts()` :

**Champs de base** :
- `id` : Identifiant unique GraphQL
- `databaseId` : ID numérique dans la base de données
- `title` : Titre de l'article
- `slug` : Slug URL-friendly (ex: "mon-article")
- `date` : Date de publication (ISO 8601)
- `excerpt` : Extrait/résumé de l'article (HTML)
- `content` : Contenu complet de l'article (HTML)

**Image à la une** (`featuredImage`) :
- `sourceUrl` : URL de l'image
- `altText` : Texte alternatif pour l'accessibilité

**Auteur** (`author.node`) :
- `name` : Nom complet de l'auteur
- `avatar.url` : URL de l'avatar Gravatar

**Catégories** (`categories.nodes[]`) :
- `name` : Nom de la catégorie (ex: "Technologie")
- `slug` : Slug de la catégorie (ex: "technologie")

### 🏷️ Catégories (`Category`)
Récupérées via `getAllCategories()` :
- `id` : Identifiant unique GraphQL
- `databaseId` : ID numérique
- `name` : Nom de la catégorie
- `slug` : Slug URL
- `count` : Nombre d'articles dans cette catégorie

### ⬅️➡️ Navigation entre articles
Récupération des articles adjacents via `getAdjacentPosts(slug)` :
- `previousPost` : Article précédent (`{ slug, title }`)
- `nextPost` : Article suivant (`{ slug, title }`)

### 📍 Utilisation des données par composant

| Composant/Page | Données WordPress utilisées |
|----------------|----------------------------|
| `layout.tsx` | `GeneralSettings` (title, description, url) |
| `page.tsx` (accueil) | Liste des 6 articles les plus récents |
| `blog/page.tsx` | Tous les articles + catégories pour filtres |
| `blog/[slug]/page.tsx` | Article complet avec auteur, catégories, image |
| `navbar.tsx` | Titre du site depuis `GeneralSettings` |
| `footer.tsx` | Titre du site depuis `GeneralSettings` |
| `rss.xml/route.ts` | Articles + métadonnées du site |
| `sitemap.ts` | Tous les slugs d'articles |
| `search-dialog.tsx` | Recherche d'articles via `searchPosts()` |
| `article-navigation.tsx` | Articles précédent/suivant |
| `blog-list.tsx` | Articles paginés avec filtres catégorie |

## 🔧 Configuration WordPress requise

Pour que le frontend fonctionne correctement, assurez-vous que WordPress est configuré avec :

### 1. Plugin WPGraphQL
- Installer et activer le plugin **WPGraphQL** (version 1.13+ recommandée)
- Accessible depuis WordPress Admin → Extensions → Ajouter
- Vérifier que l'endpoint `/graphql` est accessible

### 2. Paramètres généraux
Remplir dans **Réglages → Général** :
- **Titre du site** : Utilisé dans navbar, footer, metadata
- **Slogan** : Utilisé comme description SEO
- **URL WordPress** : URL de base du site

### 3. Contenu des articles
Pour chaque article publié, s'assurer de :
- ✅ Assigner une **image à la une** (recommandé: 1200x630px)
- ✅ Assigner au moins une **catégorie**
- ✅ Renseigner un **extrait** (sinon généré automatiquement)
- ✅ Structurer le contenu avec des **titres H2/H3** (pour la TOC)

### 4. Structure recommandée
- Créer des catégories pertinentes (Tech, Design, Business, etc.)
- Utiliser des slugs URL-friendly
- Optimiser les images avant upload
- Utiliser le champ Alt Text pour l'accessibilité

## ⚙️ Configuration et personnalisation

### Personnaliser le thème
Modifier les variables CSS dans `src/app/globals.css` :

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... autres variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... autres variables */
  }
}
```

### Changer la police

Modifier dans `src/app/layout.tsx` :

```typescript
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
```

## ⌨️ Raccourcis clavier

- `Ctrl+K` / `Cmd+K` - Ouvrir la barre de recherche
- `↑` / `↓` - Naviguer dans les résultats de recherche
- `Entrée` - Sélectionner un résultat
- `Échap` - Fermer la recherche

## 🚀 Déploiement

### Vercel (recommandé)

1. Push le code sur GitHub
2. Importer le projet sur [Vercel](https://vercel.com)
3. Configurer les variables d'environnement :
   - `NEXT_PUBLIC_WORDPRESS_API_URL`
   - `NEXT_PUBLIC_SITE_URL`
4. Déployer

### Autres plateformes

Le projet supporte `output: "standalone"` pour :
- **Docker** : Créer une image Docker avec `Dockerfile`
- **VPS** : Déployer avec PM2 ou systemd
- **Netlify** : Adapter pour les Edge Functions

## 🐳 Docker (optionnel)

Un `Dockerfile` est inclus pour le déploiement containerisé :

```bash
# Build l'image
docker build -t blog-nextjs .

# Run le conteneur
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress.com/graphql \
  -e NEXT_PUBLIC_SITE_URL=https://your-blog.com \
  blog-nextjs
```

## 🎯 Roadmap

### À court terme
- [ ] View Transitions API (navigation fluide)
- [ ] Images Open Graph dynamiques avec `@vercel/og`
- [ ] Newsletter fonctionnelle (Resend/SendGrid)
- [ ] Commentaires

### À moyen terme
- [ ] Optimisation des images (blur placeholder automatique)
- [ ] Mode Lecture immersif (sans distractions)
- [ ] Support multi-langue (i18n)
- [ ] Dark mode par défaut selon système

### À long terme
- [ ] Système de thèmes saisonniers 🎃🎄🧧 (auto-switch Halloween, Noël, Nouvel an chinois)
- [ ] PWA (Progressive Web App)
- [ ] Analytics intégré
- [ ] CI/CD automatisé

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 Scripts disponibles

- `npm run dev` - Lancer le serveur de développement avec Turbopack
- `npm run build` - Build de production
- `npm start` - Démarrer le serveur de production
- `npm run lint` - Linter le code avec ESLint

## 📄 Licence

MIT © [FabLrc](https://github.com/FabLrc)

---

✨ **Développé avec ❤️ par [FabLrc](https://github.com/FabLrc)**

Si ce projet vous plaît, n'hésitez pas à lui donner une ⭐️ sur GitHub !
