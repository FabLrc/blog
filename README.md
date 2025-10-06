# 📝 Blog Full-Stack

Blog moderne avec Next.js 15 et Strapi v5. Design minimaliste avec mode sombre et thème TweakCN.

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

- ✅ Rendu Markdown complet (GFM)
- ✅ Table des matières avec scroll spy
- ✅ Navigation précédent/suivant
- ✅ Temps de lecture estimé
- ✅ Filtres par catégorie
- ✅ Mode sombre/clair
- ✅ Partage social (X, LinkedIn, Facebook)
- ✅ SEO optimisé (Open Graph, Twitter Cards)
- ✅ Design responsive

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

- **Profil**: `frontend/src/config/profile.ts`
- **Thème**: `frontend/src/app/globals.css`
- **Données démo**: `cd backend && npm run seed:example`

## 🎯 Roadmap

- [ ] Flux RSS
- [ ] Analytics & SEO avancé

## 🚢 Déploiement

- **Frontend**: Vercel (recommandé)
- **Backend**: Strapi Cloud, Railway, VPS

---

✨ Développé par [FabLrc](https://github.com/FabLrc)
