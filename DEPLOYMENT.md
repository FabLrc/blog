# 🚀 Guide de Déploiement Docker

Ce guide vous accompagne pour déployer votre blog avec Docker en local et en production.

## 📋 Prérequis

- **Docker** (v20+) et **Docker Compose** (v2+) installés
- **Node.js 20+** (pour générer les secrets)
- Un compte GitHub (pour CI/CD automatique)

## 🏠 Déploiement Local

### 1. Configuration initiale

```bash
# Cloner le repository
git clone https://github.com/FabLrc/blog.git
cd blog

# Copier les fichiers d'environnement
cp .env.example .env

# Générer des secrets sécurisés
node scripts/generate-secrets.js

# Copier les secrets générés dans .env
nano .env  # ou votre éditeur préféré
```

### 2. Configuration des variables d'environnement

Éditez le fichier `.env` à la racine :

```bash
# Secrets Strapi (coller ceux générés par le script)
APP_KEYS=votre-clé-1,votre-clé-2,votre-clé-3,votre-clé-4
API_TOKEN_SALT=votre-salt
ADMIN_JWT_SECRET=votre-secret
TRANSFER_TOKEN_SALT=votre-salt
JWT_SECRET=votre-jwt-secret

# URLs (local)
PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### 3. Lancer les conteneurs

```bash
# Build et démarrage en mode détaché
docker compose up -d --build

# Voir les logs en temps réel
docker compose logs -f

# Voir uniquement les logs du backend
docker compose logs -f backend

# Voir uniquement les logs du frontend
docker compose logs -f frontend
```

### 4. Accéder à l'application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:1337
- **Admin Strapi** : http://localhost:1337/admin

### 5. Première configuration Strapi

1. Ouvrir http://localhost:1337/admin
2. Créer votre compte administrateur
3. Importer les données de démonstration (optionnel) :
   ```bash
   docker compose exec backend npm run seed:example
   ```
4. Configurer le Single Type `site-config` (voir [STRAPI_SITE_CONFIG.md](STRAPI_SITE_CONFIG.md))

### 6. Commandes utiles

```bash
# Arrêter les conteneurs
docker compose down

# Arrêter et supprimer les volumes (⚠️ supprime la BDD)
docker compose down -v

# Rebuild après changement de code
docker compose up -d --build

# Redémarrer un service spécifique
docker compose restart backend

# Voir l'état des conteneurs
docker compose ps

# Accéder au shell d'un conteneur
docker compose exec backend sh
docker compose exec frontend sh
```

## 🌍 Déploiement Production

### Option 1 : VPS/Serveur Dédié

#### A. Préparation du serveur

```bash
# Installer Docker sur Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Se déconnecter/reconnecter pour appliquer les permissions
```

#### B. Configuration de l'application

```bash
# Sur votre serveur
git clone https://github.com/FabLrc/blog.git
cd blog

# Configurer les variables d'environnement
cp .env.example .env
nano .env

# ⚠️ IMPORTANT : Modifier les URLs pour la production
# PUBLIC_STRAPI_URL=https://api.votre-domaine.com
# NEXT_PUBLIC_STRAPI_URL=https://api.votre-domaine.com
```

#### C. Utiliser les images pré-buildées

```bash
# Utiliser le docker-compose.prod.yml
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

#### D. Configuration Nginx (Reverse Proxy)

Créer `/etc/nginx/sites-available/blog` :

```nginx
# Backend API
server {
    listen 80;
    server_name api.votre-domaine.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Installer un certificat SSL avec Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com -d api.votre-domaine.com
```

### Option 2 : Railway

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Créer un nouveau projet
railway init

# Déployer
railway up
```

### Option 3 : Fly.io

```bash
# Installer Fly CLI
curl -L https://fly.io/install.sh | sh

# Se connecter
fly auth login

# Créer et déployer le backend
cd backend
fly launch
fly deploy

# Créer et déployer le frontend
cd ../frontend
fly launch
fly deploy
```

### Option 4 : DigitalOcean App Platform

1. Connecter votre repository GitHub
2. Créer une **App** avec 2 composants :
   - **Backend** : Dockerfile = `backend/Dockerfile`, Port = 1337
   - **Frontend** : Dockerfile = `frontend/Dockerfile`, Port = 3000
3. Configurer les variables d'environnement
4. Déployer

## 🔐 Sécurité Production

### Checklist de sécurité

- [ ] **Générer des secrets uniques** (jamais les exemples)
- [ ] **Utiliser HTTPS** avec certificat SSL/TLS valide
- [ ] **Configurer un reverse proxy** (Nginx, Caddy, Traefik)
- [ ] **Restreindre l'accès admin** Strapi (whitelist IP si possible)
- [ ] **Utiliser PostgreSQL** au lieu de SQLite pour la scalabilité
- [ ] **Configurer les CORS** correctement dans Strapi
- [ ] **Activer les rate limits** pour protéger l'API
- [ ] **Mettre en place des sauvegardes** automatiques (BDD + uploads)
- [ ] **Surveiller les logs** et mettre en place des alertes
- [ ] **Utiliser un service de stockage cloud** pour les uploads (S3, Cloudinary)

### Migrer vers PostgreSQL

Modifier le `docker-compose.yml` :

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: blog-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: strapi
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - blog-network

  backend:
    # ...
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: strapi
      DATABASE_USERNAME: strapi
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## 🔄 CI/CD avec GitHub Actions

Le workflow est déjà configuré dans `.github/workflows/docker-build.yml`.

### Configuration requise

1. **Activer GitHub Container Registry** :
   - Aller dans Settings → Actions → General
   - Activer "Read and write permissions"

2. **Ajouter les secrets GitHub** (Settings → Secrets and variables → Actions) :
   - `NEXT_PUBLIC_STRAPI_URL` : URL publique de votre API

3. **Pousser sur main** :
   ```bash
   git add .
   git commit -m "feat: setup Docker deployment"
   git push origin main
   ```

4. **Les images seront buildées automatiquement** et disponibles sur :
   - `ghcr.io/fablrc/blog-backend:latest`
   - `ghcr.io/fablrc/blog-frontend:latest`

### Déploiement automatique sur serveur

Décommenter et configurer la section `deploy` dans le workflow :

```yaml
deploy:
  needs: [build-backend, build-frontend]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
    - name: Deploy to production server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        script: |
          cd /path/to/blog
          docker compose -f docker-compose.prod.yml pull
          docker compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring et Logs

### Voir les logs en production

```bash
# Tous les logs
docker compose logs -f

# Dernières 100 lignes
docker compose logs --tail=100 -f

# Logs d'un service spécifique
docker compose logs -f backend
```

### Sauvegarder les données

```bash
# Sauvegarder la base de données SQLite
docker compose exec backend tar czf /tmp/backup.tar.gz .tmp/ public/uploads/ data/

# Copier depuis le conteneur
docker cp blog-backend:/tmp/backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz

# Restaurer
docker cp ./backup-20240101.tar.gz blog-backend:/tmp/
docker compose exec backend tar xzf /tmp/backup-20240101.tar.gz
```

### Mettre à jour l'application

```bash
# Sur votre serveur
cd /path/to/blog
git pull origin main
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## 🆘 Troubleshooting

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker compose logs

# Vérifier l'état
docker compose ps

# Rebuild complet
docker compose down -v
docker compose up -d --build
```

### Problème de connexion entre frontend et backend

Vérifier que `NEXT_PUBLIC_STRAPI_URL` est correctement configuré :
- **En local** : `http://localhost:1337`
- **En production** : URL publique avec HTTPS

### Erreur "secret invalide" dans Strapi

Régénérer tous les secrets :
```bash
node scripts/generate-secrets.js
```

Puis les copier dans `.env` et redémarrer :
```bash
docker compose restart backend
```

## 📚 Ressources

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Strapi](https://docs.strapi.io/)
- [Documentation Next.js](https://nextjs.org/docs)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

✨ Bon déploiement !
