# 🪟 Scripts PowerShell pour Windows

Ce fichier contient les équivalents PowerShell des commandes du Makefile pour les utilisateurs Windows.

## 📋 Installation

**Prérequis** : Docker Desktop pour Windows installé

### Configuration initiale

```powershell
# 1. Générer les secrets
node scripts/generate-secrets.js

# 2. Copier le fichier d'environnement
Copy-Item .env.example .env

# 3. Éditer .env avec les secrets générés
notepad .env

# 4. Build et démarrage
docker compose up -d --build

# 5. Importer les données de démonstration (optionnel)
Start-Sleep -Seconds 10
docker compose exec backend npm run seed:example
```

## 🚀 Commandes principales

### Développement

```powershell
# Build les images
docker compose build

# Démarrer les conteneurs
docker compose up -d

# Arrêter les conteneurs
docker compose down

# Redémarrer les conteneurs
docker compose restart

# Voir les logs en temps réel
docker compose logs -f

# Logs du backend uniquement
docker compose logs -f backend

# Logs du frontend uniquement
docker compose logs -f frontend

# Voir l'état des conteneurs
docker compose ps

# Rebuild complet
docker compose down
docker compose up -d --build
```

### Shell dans les conteneurs

```powershell
# Backend
docker compose exec backend sh

# Frontend
docker compose exec frontend sh
```

### Production

```powershell
# Pull les images pré-buildées
docker compose -f docker-compose.prod.yml pull

# Démarrer en production
docker compose -f docker-compose.prod.yml up -d

# Logs de production
docker compose -f docker-compose.prod.yml logs -f

# Arrêter la production
docker compose -f docker-compose.prod.yml down
```

## 🔧 Utilitaires

### Générer des secrets

```powershell
node scripts/generate-secrets.js
```

### Sauvegarder les données

```powershell
# Créer une sauvegarde
$date = Get-Date -Format "yyyyMMdd-HHmmss"
docker compose exec backend tar czf /tmp/backup.tar.gz .tmp/ public/uploads/ data/
docker cp blog-backend:/tmp/backup.tar.gz "./backup-$date.tar.gz"
Write-Host "✅ Sauvegarde créée : backup-$date.tar.gz"
```

### Restaurer une sauvegarde

```powershell
# Remplacer 'backup-XXXXXXXX-XXXXXX.tar.gz' par votre fichier
docker cp ./backup-20240101-120000.tar.gz blog-backend:/tmp/
docker compose exec backend tar xzf /tmp/backup-20240101-120000.tar.gz
docker compose restart backend
```

### Nettoyer complètement

```powershell
# Arrêter et supprimer tout (⚠️ supprime la BDD)
docker compose down -v --remove-orphans
Write-Host "⚠️  Volumes supprimés (base de données et uploads)"
```

### Importer les données de démonstration

```powershell
docker compose exec backend npm run seed:example
```

## 📊 Monitoring

### État des services

```powershell
docker compose ps --format "table {{.Name}}`t{{.Status}}`t{{.Ports}}"
```

### Statistiques en temps réel

```powershell
docker stats blog-backend blog-frontend
```

### Vérifier la santé des conteneurs

```powershell
docker inspect blog-backend --format='{{.State.Health.Status}}'
docker inspect blog-frontend --format='{{.State.Health.Status}}'
```

## 🧹 Nettoyage

### Supprimer les ressources inutilisées

```powershell
# Images, conteneurs, volumes et réseaux inutilisés
docker system prune -a --volumes

# Uniquement les images non utilisées
docker image prune -a

# Uniquement les volumes non utilisés
docker volume prune
```

## 📦 Script d'installation complet

Créez un fichier `install.ps1` :

```powershell
# install.ps1 - Script d'installation automatique

Write-Host "🚀 Installation du blog..." -ForegroundColor Green
Write-Host ""

# 1. Vérifier Docker
Write-Host "1️⃣  Vérification de Docker..." -ForegroundColor Cyan
$dockerVersion = docker --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Docker installé : $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Docker n'est pas installé" -ForegroundColor Red
    exit 1
}

# 2. Générer les secrets
Write-Host ""
Write-Host "2️⃣  Génération des secrets..." -ForegroundColor Cyan
node scripts/generate-secrets.js

# 3. Configuration
Write-Host ""
Write-Host "3️⃣  Configuration..." -ForegroundColor Cyan
if (-Not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "   ✅ Fichier .env créé" -ForegroundColor Green
}

Write-Host ""
Write-Host "⚠️  Veuillez copier les secrets dans le fichier .env" -ForegroundColor Yellow
$continue = Read-Host "   Appuyez sur Entrée quand c'est fait"

# 4. Build
Write-Host ""
Write-Host "4️⃣  Build des images Docker..." -ForegroundColor Cyan
docker compose build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Build réussi" -ForegroundColor Green

# 5. Démarrage
Write-Host ""
Write-Host "5️⃣  Démarrage des conteneurs..." -ForegroundColor Cyan
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erreur lors du démarrage" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Conteneurs démarrés" -ForegroundColor Green

# 6. Attendre que les services soient prêts
Write-Host ""
Write-Host "6️⃣  Attente du démarrage des services..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# 7. Import des données
Write-Host ""
Write-Host "7️⃣  Import des données de démonstration..." -ForegroundColor Cyan
$import = Read-Host "   Voulez-vous importer les données de démonstration ? (O/n)"
if ($import -ne "n") {
    docker compose exec backend npm run seed:example
    Write-Host "   ✅ Données importées" -ForegroundColor Green
}

# Fin
Write-Host ""
Write-Host "✅ Installation terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs :" -ForegroundColor Cyan
Write-Host "   - Frontend : http://localhost:3000"
Write-Host "   - Backend  : http://localhost:1337"
Write-Host "   - Admin    : http://localhost:1337/admin"
Write-Host ""
Write-Host "📝 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "   1. Ouvrir http://localhost:1337/admin"
Write-Host "   2. Créer votre compte administrateur Strapi"
Write-Host "   3. Configurer le Single Type 'site-config'"
Write-Host "   4. Visiter http://localhost:3000"
```

Pour l'utiliser :

```powershell
# Donner les permissions d'exécution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Exécuter le script
.\install.ps1
```

## 🔗 Liens utiles

- [Docker Desktop pour Windows](https://www.docker.com/products/docker-desktop)
- [Guide PowerShell](https://learn.microsoft.com/fr-fr/powershell/)
- [Documentation Docker Compose](https://docs.docker.com/compose/)

---

💡 **Astuce** : Ajoutez `docker compose` en alias dans votre profil PowerShell :

```powershell
# Éditer le profil PowerShell
notepad $PROFILE

# Ajouter ces alias
function dc { docker compose @args }
function dcup { docker compose up -d @args }
function dcdown { docker compose down @args }
function dclogs { docker compose logs -f @args }

# Recharger le profil
. $PROFILE

# Maintenant vous pouvez utiliser :
# dc up -d
# dcdown
# dclogs
```
