# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer au projet ! Voici comment vous pouvez aider.

## 🚀 Démarrage rapide

### 1. Fork et Clone

```bash
# Fork le projet sur GitHub, puis :
git clone https://github.com/VOTRE-USERNAME/blog.git
cd blog
```

### 2. Installation

**Avec Docker (recommandé)** :
```bash
# Windows
.\install.ps1

# Linux/Mac
make install
```

**Sans Docker** :
```bash
# Backend
cd backend
npm install
npm run develop

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

### 3. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

## 📝 Convention de commits

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

### Types

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Changements qui n'affectent pas le sens du code (formatage, etc.)
- `refactor`: Refactoring du code
- `perf`: Amélioration des performances
- `test`: Ajout ou correction de tests
- `chore`: Changements dans le build ou outils auxiliaires
- `ci`: Changements dans les fichiers de CI
- `docker`: Changements liés à Docker

### Exemples

```bash
git commit -m "feat(blog): add reading time estimation"
git commit -m "fix(strapi): resolve image upload issue"
git commit -m "docs: update deployment guide"
git commit -m "docker: optimize frontend build"
git commit -m "style(ui): improve dark mode colors"
```

## 🏗️ Structure du projet

```
blog/
├── .github/                # GitHub Actions & templates
│   └── workflows/         # CI/CD workflows
├── backend/               # Strapi CMS
│   ├── src/api/          # Content types
│   ├── config/           # Configuration
│   └── Dockerfile        # Docker backend
├── frontend/             # Next.js
│   ├── src/
│   │   ├── app/         # Routes & pages
│   │   ├── components/  # React components
│   │   └── lib/         # Utils & API
│   └── Dockerfile       # Docker frontend
├── scripts/              # Scripts utilitaires
├── docker-compose.yml    # Orchestration Docker
└── docs/                 # Documentation
```

## 🧪 Tests

### Backend (Strapi)

```bash
# Dans le conteneur Docker
docker compose exec backend npm test

# Ou localement
cd backend
npm test
```

### Frontend (Next.js)

```bash
# Build de production
docker compose exec frontend npm run build

# Lint
docker compose exec frontend npm run lint
```

## 🎨 Style de code

### TypeScript

- Utiliser `const` par défaut, `let` si nécessaire, jamais `var`
- Typer explicitement les fonctions et interfaces
- Utiliser les interfaces pour les objets
- Préférer les arrow functions pour les composants
- Utiliser les template literals pour les strings complexes

### React/Next.js

- Composants fonctionnels uniquement
- Hooks pour la logique
- Server Components par défaut, Client Components quand nécessaire
- Props typées avec des interfaces
- Utiliser `"use client"` seulement si nécessaire

### Tailwind CSS

- Classes dans l'ordre : layout → display → spacing → typography → colors
- Utiliser les classes Tailwind existantes avant d'ajouter du CSS custom
- Préfixer les classes dark mode avec `dark:`

### Exemple

```typescript
// ✅ Bon
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg font-medium transition-colors
                 bg-primary text-white hover:bg-primary/90
                 dark:bg-primary-dark dark:hover:bg-primary-dark/90"
    >
      {label}
    </button>
  );
}

// ❌ Mauvais
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

## 🐛 Rapporter un bug

Utilisez les [GitHub Issues](https://github.com/FabLrc/blog/issues) avec le template :

```markdown
**Description du bug**
Description claire et concise.

**Reproduction**
1. Aller sur '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement attendu**
Ce qui devrait se passer.

**Screenshots**
Si applicable.

**Environnement**
- OS: [ex. Windows 11]
- Navigateur: [ex. Chrome 120]
- Version: [ex. 1.0.0]
```

## ✨ Proposer une fonctionnalité

1. Vérifier qu'elle n'existe pas déjà dans les [Issues](https://github.com/FabLrc/blog/issues)
2. Créer une issue avec le template "Feature Request"
3. Attendre la validation avant de commencer le développement
4. Créer une branche et développer
5. Soumettre une Pull Request

## 📦 Pull Requests

### Avant de soumettre

- [ ] Le code compile sans erreur
- [ ] Les images Docker se buildent correctement
- [ ] Le style de code est respecté
- [ ] La documentation est à jour
- [ ] Les commits suivent la convention
- [ ] Pas de `console.log()` oubliés
- [ ] Pas de secrets en dur dans le code

### Process

1. **Créer la PR** avec le template fourni
2. **Lier les issues** concernées
3. **Attendre la review** (au moins 1 approbation)
4. **Corriger** si des changements sont demandés
5. **Merge** par un mainteneur

### Format du titre

```
<type>(<scope>): <description courte>
```

Exemple :
```
feat(blog): add pagination to article list
```

## 🐳 Docker

### Build local

```bash
# Backend
docker build -t blog-backend ./backend

# Frontend
docker build -t blog-frontend \
  --build-arg NEXT_PUBLIC_STRAPI_URL=http://localhost:1337 \
  ./frontend
```

### Test des images

```bash
# Utiliser le docker-compose.dev.yml pour le développement
docker compose -f docker-compose.dev.yml up

# Test en production
docker compose up --build
```

## 🔍 Review Checklist

Quand vous reviewez une PR, vérifiez :

- [ ] Le code est lisible et maintenable
- [ ] Les bonnes pratiques sont respectées
- [ ] Les changements sont testés
- [ ] La documentation est à jour
- [ ] Les commits sont propres
- [ ] Pas de régression fonctionnelle
- [ ] Les images Docker fonctionnent
- [ ] Pas de problème de sécurité évident

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

## 💬 Questions ?

- Ouvrir une [Discussion GitHub](https://github.com/FabLrc/blog/discussions)
- Créer une [Issue](https://github.com/FabLrc/blog/issues)

## 📜 Licence

En contribuant, vous acceptez que vos contributions soient sous la même [licence MIT](LICENSE) que le projet.

---

Merci de contribuer ! 🎉
