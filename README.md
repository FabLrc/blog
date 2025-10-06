# 📝 Blog Full-Stack

Blog moderne avec Next.js 15 et Strapi v5. Design minimaliste avec mode sombre et thème TweakCN.

## � Aperçu

<div align="center">

### Page d'accueil
![Page d'accueil](screenshots/FireShot%20Capture%20001%20-%20FabLrc%20-%20localhost.png)

### Liste des articles
![Liste des articles](screenshots/FireShot%20Capture%20002%20-%20FabLrc%20-%20localhost.png)

### Article avec table des matières
![Article avec TOC](screenshots/FireShot%20Capture%20003%20-%20Beautiful%20picture%20-%20localhost.png)

### Recherche avec Ctrl+K
![Recherche](screenshots/FireShot%20Capture%20004%20-%20FabLrc%20-%20localhost.png)

### Menu mobile responsive
![Menu mobile](screenshots/FireShot%20Capture%20005%20-%20FabLrc%20-%20localhost.png)

</div>

## �🚀 Stack

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
- ✅ Rendu Markdown complet (GFM)
- ✅ Table des matières avec scroll spy
- ✅ Navigation précédent/suivant
- ✅ Temps de lecture estimé (200 mots/min)
- ✅ Filtres par catégorie
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
- ✅ Sitemap XML automatique (`/sitemap.xml`)
- ✅ Flux RSS (`/rss.xml`)
- ✅ Robots.txt
- ✅ Open Graph & Twitter Cards
- ✅ Balises meta optimisées

## 📂 Structure

```
blog/
├── backend/         # Strapi CMS
└── frontend/        # Next.js App
    └── src/
        ├── app/         # Routes
        ├── components/  # Composants React
        ├── lib/         # Utils
        └── config/      # Configuration
```

## ⚙️ Configuration

- **Profil**: `frontend/src/config/profile.ts` (nom, titre blog, bio, liens sociaux)
- **Thème**: `frontend/src/app/globals.css` (couleurs, ombres, polices)
- **Données démo**: `cd backend && npm run seed:example`

## 🎨 Personnalisation

### Changer le titre du blog
Éditer `frontend/src/config/profile.ts`:
```typescript
blogTitle: "Mon Super Blog"
```

### URLs importantes
- `/` - Page d'accueil
- `/blog` - Liste des articles
- `/blog/[slug]` - Article individuel
- `/about` - À propos
- `/contact` - Contact
- `/rss.xml` - Flux RSS
- `/sitemap.xml` - Sitemap SEO
- `/robots.txt` - Instructions robots

### Raccourcis clavier
- `Ctrl+K` / `Cmd+K` - Ouvrir la recherche
- `↑` / `↓` - Navigation dans les résultats
- `Entrée` - Sélectionner un résultat
- `Échap` - Fermer la recherche

## 🎯 Roadmap

- [ ] Coloration syntaxique des blocs de code
- [ ] Système de commentaires (Giscus)
- [ ] Newsletter fonctionnelle
- [ ] Analytics (Plausible/Google Analytics)
- [ ] JSON-LD pour rich snippets

## 🚢 Déploiement

- **Frontend**: Vercel (recommandé)
- **Backend**: Strapi Cloud, Railway, VPS

---

✨ Développé par [FabLrc](https://github.com/FabLrc)
