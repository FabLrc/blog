# install.ps1 - Script d'installation automatique du blog

Write-Host "🚀 Installation du blog..." -ForegroundColor Green
Write-Host ""

# 1. Vérifier Docker
Write-Host "1️⃣  Vérification de Docker..." -ForegroundColor Cyan
try {
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Docker installé : $dockerVersion" -ForegroundColor Green
    } else {
        throw "Docker non détecté"
    }
} catch {
    Write-Host "   ❌ Docker n'est pas installé ou non démarré" -ForegroundColor Red
    Write-Host "   📥 Installez Docker Desktop : https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# 2. Vérifier Node.js
Write-Host ""
Write-Host "2️⃣  Vérification de Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Node.js installé : $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js non détecté"
    }
} catch {
    Write-Host "   ❌ Node.js n'est pas installé" -ForegroundColor Red
    Write-Host "   📥 Installez Node.js : https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# 3. Générer les secrets
Write-Host ""
Write-Host "3️⃣  Génération des secrets Strapi..." -ForegroundColor Cyan
node scripts/generate-secrets.js
Write-Host ""

# 4. Configuration
Write-Host "4️⃣  Configuration de l'environnement..." -ForegroundColor Cyan
if (-Not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "   ✅ Fichier .env créé" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Fichier .env existe déjà" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "⚠️  IMPORTANT : Copiez les secrets générés ci-dessus dans le fichier .env" -ForegroundColor Yellow
Write-Host "   Ouvrez .env avec : notepad .env" -ForegroundColor Yellow
Write-Host ""
$continue = Read-Host "Appuyez sur Entrée quand vous avez terminé la configuration"

# 5. Build
Write-Host ""
Write-Host "5️⃣  Build des images Docker..." -ForegroundColor Cyan
Write-Host "   ⏳ Cela peut prendre plusieurs minutes..." -ForegroundColor Gray
docker compose build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Build réussi" -ForegroundColor Green

# 6. Démarrage
Write-Host ""
Write-Host "6️⃣  Démarrage des conteneurs..." -ForegroundColor Cyan
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Erreur lors du démarrage" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Conteneurs démarrés" -ForegroundColor Green

# 7. Attendre que les services soient prêts
Write-Host ""
Write-Host "7️⃣  Attente du démarrage des services..." -ForegroundColor Cyan
Write-Host "   ⏳ Patience, les services se lancent..." -ForegroundColor Gray
Start-Sleep -Seconds 20

# 8. Vérifier l'état
Write-Host ""
Write-Host "8️⃣  Vérification de l'état des services..." -ForegroundColor Cyan
docker compose ps
Write-Host ""

# 9. Import des données (optionnel)
Write-Host "9️⃣  Import des données de démonstration..." -ForegroundColor Cyan
$import = Read-Host "Voulez-vous importer les données de démonstration ? (O/n)"
if ($import -ne "n" -and $import -ne "N") {
    Write-Host "   ⏳ Import en cours..." -ForegroundColor Gray
    docker compose exec backend npm run seed:example
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Données importées avec succès" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Erreur lors de l'import (vous pourrez le faire plus tard)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⏭️  Import des données ignoré" -ForegroundColor Gray
}

# 10. Fin
Write-Host ""
Write-Host "=" * 70 -ForegroundColor Green
Write-Host "✅ Installation terminée avec succès !" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Green
Write-Host ""

Write-Host "📍 URLs d'accès :" -ForegroundColor Cyan
Write-Host "   🌐 Frontend : http://localhost:3000" -ForegroundColor White
Write-Host "   🔌 API      : http://localhost:1337" -ForegroundColor White
Write-Host "   👤 Admin    : http://localhost:1337/admin" -ForegroundColor White
Write-Host ""

Write-Host "📝 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "   1. Ouvrir http://localhost:1337/admin dans votre navigateur"
Write-Host "   2. Créer votre compte administrateur Strapi"
Write-Host "   3. Configurer le Single Type 'site-config' (voir STRAPI_SITE_CONFIG.md)"
Write-Host "   4. Visiter votre blog sur http://localhost:3000"
Write-Host ""

Write-Host "📚 Commandes utiles :" -ForegroundColor Cyan
Write-Host "   docker compose logs -f           # Voir les logs en temps réel"
Write-Host "   docker compose ps                # État des conteneurs"
Write-Host "   docker compose restart           # Redémarrer les services"
Write-Host "   docker compose down              # Arrêter les conteneurs"
Write-Host ""
Write-Host "   Voir WINDOWS.md pour plus de commandes PowerShell"
Write-Host ""

Write-Host "🎉 Bon développement !" -ForegroundColor Green
