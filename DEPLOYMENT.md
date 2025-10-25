# 🚀 Guide de Déploiement sur NAS

Ce guide explique comment déployer votre blog sur votre NAS avec mise à jour automatique depuis GitHub.

## 📋 Prérequis

1. **NAS avec Docker** (Synology, QNAP, CasaOS, etc.)
2. **GitHub Account** et accès au repository
3. **Accès SSH au NAS** (optionnel mais recommandé)

## 🔐 Étape 1 : Configuration GitHub Container Registry (GHCR)

### 1.1 Créer un Personal Access Token (PAT)

1. Aller sur GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquer sur "Generate new token (classic)"
3. Donner un nom : `GHCR_PAT` ou `blog-deployment`
4. Cocher les permissions :
   - ✅ `write:packages` (inclut read, write, delete packages)
   - ✅ `read:packages`
   - ✅ `delete:packages`
   - ✅ `repo` (si repository privé)
5. Générer et **copier le token** (vous ne le reverrez plus !)

### 1.2 Ajouter le Secret au Repository

1. Aller sur votre repository GitHub
2. Settings → Secrets and variables → Actions
3. Cliquer sur "New repository secret"
4. Name: `GHCR_PAT`
5. Value: Coller le token créé précédemment
6. Sauvegarder

### 1.3 Rendre les packages publics (optionnel mais recommandé)

Après le premier push d'images :
1. Aller sur votre profil GitHub → Packages
2. Sélectionner `blog-backend` → Package settings
3. Scroll down → "Change visibility" → Public
4. Répéter pour `blog-frontend`

⚠️ **Si vous gardez les packages privés**, Watchtower aura besoin d'authentification (voir section avancée).

## 🐳 Étape 2 : Premier Déploiement

### 2.1 Push vers GitHub

Committez et pushez vos changements :

```bash
git add .
git commit -m "Configure Docker deployment for NAS"
git push origin main
```

Le workflow GitHub Actions va automatiquement :
- Builder les images Docker du backend et frontend
- Les pousser vers GHCR (ghcr.io/fablrc/blog-backend:latest et blog-frontend:latest)

Vérifiez que le workflow s'est exécuté avec succès dans l'onglet "Actions" de votre repository.

### 2.2 Préparation sur le NAS

Connectez-vous en SSH à votre NAS ou utilisez l'interface de gestion de fichiers :

```bash
# Créer un dossier pour le blog
mkdir -p ~/blog
cd ~/blog

# Créer les dossiers de données persistantes
mkdir -p data uploads
```

### 2.3 Télécharger le docker-compose

Copiez le fichier `docker-compose.nas.yml` sur votre NAS dans le dossier `~/blog/` et renommez-le :

```bash
# Via SCP depuis votre machine locale
scp docker-compose.nas.yml user@nas-ip:~/blog/docker-compose.yml

# Ou créez-le directement sur le NAS
nano ~/blog/docker-compose.yml
# Copiez-collez le contenu de docker-compose.nas.yml
```

### 2.4 Démarrer les conteneurs

```bash
cd ~/blog
docker-compose up -d
```

Vérifier que tout fonctionne :

```bash
docker-compose ps
docker-compose logs -f
```

## 🌐 Étape 3 : Accès au Blog

- **Frontend** : http://IP-DU-NAS:3000
- **Admin Strapi** : http://IP-DU-NAS:1337/admin

### Premier accès à Strapi Admin

1. Aller sur http://IP-DU-NAS:1337/admin
2. Créer le compte administrateur
3. Configurer votre site dans "Site Config"
4. Créer vos premiers articles

## 🔄 Étape 4 : Mises à jour automatiques

**Watchtower** est déjà configuré dans le `docker-compose.yml`. Il va :
- Vérifier toutes les 5 minutes (300 secondes) si de nouvelles images sont disponibles
- Télécharger automatiquement les nouvelles versions
- Redémarrer les conteneurs avec les nouvelles images
- Nettoyer les anciennes images

### Pour déclencher une mise à jour :

1. Modifier votre code localement
2. Commit et push vers GitHub :
   ```bash
   git add .
   git commit -m "Update blog features"
   git push origin main
   ```
3. Attendre que GitHub Actions build les images (~3-5 min)
4. Attendre que Watchtower détecte et applique la mise à jour (~5 min max)

### Forcer une mise à jour immédiate

```bash
# Sur le NAS
docker-compose pull
docker-compose up -d
```

## 📊 Commandes utiles

```bash
# Voir les logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart backend
docker-compose restart frontend

# Arrêter tout
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Voir l'état
docker-compose ps

# Mettre à jour manuellement
docker-compose pull
docker-compose up -d
```

## 🔧 Configuration Avancée

### Utiliser un nom de domaine

Si vous avez un reverse proxy (Nginx, Traefik, etc.) :

1. Modifier `docker-compose.yml` pour retirer les ports publiés
2. Configurer le reverse proxy pour pointer vers :
   - Frontend : `blog-frontend:3000`
   - Backend : `blog-backend:1337`

### Packages GHCR privés avec Watchtower

Si vos packages sont privés, ajoutez l'authentification à Watchtower :

```yaml
watchtower:
  environment:
    - REPO_USER=fablrc
    - REPO_PASS=${GITHUB_TOKEN}
  command: blog-backend blog-frontend --debug
```

Et créez un fichier `.env` :
```bash
GITHUB_TOKEN=ghp_votre_token_github
```

### Changer l'intervalle de vérification

Modifier dans `docker-compose.yml` :
```yaml
- WATCHTOWER_POLL_INTERVAL=600  # 10 minutes au lieu de 5
```

### Notifications Watchtower

Ajouter des notifications par email/Slack :
```yaml
watchtower:
  environment:
    - WATCHTOWER_NOTIFICATIONS=email
    - WATCHTOWER_NOTIFICATION_EMAIL_FROM=watchtower@example.com
    - WATCHTOWER_NOTIFICATION_EMAIL_TO=admin@example.com
```

## 🐛 Dépannage

### Les images ne se mettent pas à jour

```bash
# Vérifier les logs de Watchtower
docker logs blog-watchtower

# Vérifier que les images existent sur GHCR
# Aller sur https://github.com/FabLrc?tab=packages

# Forcer la mise à jour
docker-compose pull
docker-compose up -d
```

### Erreur de connexion backend/frontend

```bash
# Vérifier que le réseau Docker est OK
docker network inspect blog_blog-network

# Redémarrer les services
docker-compose restart
```

### Perte de données après redémarrage

Vérifier que les volumes sont bien montés :
```bash
docker-compose config
# Vérifier que ./data et ./uploads existent et sont bien montés
```

### Images trop grosses / build lent

Les `.dockerignore` sont déjà configurés pour optimiser les builds.

## 📝 Notes importantes

1. **Sauvegardes** : Sauvegardez régulièrement les dossiers `data/` et `uploads/`
2. **Sécurité** : Utilisez un reverse proxy avec HTTPS en production
3. **Performance** : Sur NAS avec peu de RAM, limitez les resources Docker si besoin
4. **Base de données** : SQLite est utilisé (fichier dans `data/`), pour une vraie prod considérez PostgreSQL

## ✅ Checklist Finale

- [ ] Token GHCR créé et ajouté aux secrets GitHub
- [ ] Workflow GitHub Actions exécuté avec succès
- [ ] Images disponibles sur ghcr.io/fablrc/blog-*
- [ ] Docker-compose.yml copié sur le NAS
- [ ] Dossiers data/ et uploads/ créés
- [ ] Conteneurs démarrés avec `docker-compose up -d`
- [ ] Frontend accessible sur :3000
- [ ] Backend accessible sur :1337
- [ ] Compte admin Strapi créé
- [ ] Test de mise à jour : push → build → auto-update ✨
