# Intégration Strapi - Guide de démarrage

## 🚀 Démarrage du backend Strapi

1. **Démarrer le backend** (dans un terminal séparé) :
   ```bash
   cd backend
   npm run develop
   ```

2. **Le backend sera disponible sur** : http://localhost:1337

3. **Panel d'administration** : http://localhost:1337/admin

## 📦 Importer les données de démonstration

Le backend contient des données de démonstration dans `backend/data/data.json` avec :
- Catégories (news, tech, food, nature, story)
- Auteurs (David Doe, Sarah Baker)
- Articles avec images de couverture

Pour importer ces données, utilisez le script de seed :
```bash
cd backend
npm run seed
```

## 🔧 Configuration du frontend

Le frontend est déjà configuré pour se connecter à Strapi :

- **URL de l'API** : Définie dans `.env.local`
- **Types TypeScript** : Définis dans `src/types/strapi.ts`
- **Fonctions API** : Dans `src/lib/strapi.ts`

## 📝 API Endpoints utilisés

- `GET /api/articles?populate=cover,author,category&sort=publishedAt:desc`
  - Récupère tous les articles publiés avec leurs relations

- `GET /api/articles?filters[slug][$eq]={slug}&populate=*`
  - Récupère un article spécifique par son slug

## 🖼️ Gestion des images

Les images Strapi sont automatiquement gérées :
- URL complètes construites avec `getStrapiImageUrl()`
- Support des différents formats (thumbnail, small, medium, large)
- Fallback vers une image placeholder si aucune image n'est disponible

## ⚠️ Important

1. **Le backend Strapi doit être lancé** avant de démarrer le frontend
2. Les articles doivent être **publiés** (draft and publish) pour être visibles
3. Les images doivent être uploadées dans Strapi pour s'afficher
