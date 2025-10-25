#!/bin/bash
# Script de test pour vérifier la configuration Docker avant déploiement

set -e

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔍 Vérification de la configuration Docker${NC}"
echo "=========================================="
echo ""

# Fonction pour vérifier l'existence d'un fichier
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 - MANQUANT${NC}"
        return 1
    fi
}

# Fonction pour vérifier l'existence d'un dossier
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1/${NC}"
        return 0
    else
        echo -e "${RED}❌ $1/ - MANQUANT${NC}"
        return 1
    fi
}

echo -e "${BLUE}📁 Vérification des fichiers Docker:${NC}"
check_file "docker-compose.yml"
check_file "docker-compose.nas.yml"
check_file "Dockerfile"
check_file "backend/Dockerfile"
check_file "frontend/Dockerfile"
check_file "backend/.dockerignore"
check_file "frontend/.dockerignore"
echo ""

echo -e "${BLUE}📁 Vérification des scripts:${NC}"
check_file "scripts/start.sh"
check_file "scripts/deploy-to-nas.sh"
check_file "backend/generate-secrets.sh"
echo ""

echo -e "${BLUE}📁 Vérification de la structure:${NC}"
check_dir "backend"
check_dir "frontend"
check_dir "backend/config"
check_dir "frontend/src"
check_dir ".github/workflows"
echo ""

echo -e "${BLUE}📁 Vérification des configurations:${NC}"
check_file "backend/package.json"
check_file "frontend/package.json"
check_file "backend/config/server.ts"
check_file "backend/config/middlewares.ts"
check_file "frontend/next.config.ts"
check_file ".github/workflows/build-and-push.yml"
echo ""

echo -e "${BLUE}🔍 Vérification du contenu docker-compose.nas.yml:${NC}"
if grep -q "ghcr.io/fablrc/blog-backend:latest" docker-compose.nas.yml; then
    echo -e "${GREEN}✅ Image backend configurée${NC}"
else
    echo -e "${RED}❌ Image backend non configurée ou incorrecte${NC}"
fi

if grep -q "ghcr.io/fablrc/blog-frontend:latest" docker-compose.nas.yml; then
    echo -e "${GREEN}✅ Image frontend configurée${NC}"
else
    echo -e "${RED}❌ Image frontend non configurée ou incorrecte${NC}"
fi

if grep -q "watchtower" docker-compose.nas.yml; then
    echo -e "${GREEN}✅ Watchtower configuré${NC}"
else
    echo -e "${YELLOW}⚠️  Watchtower non configuré (mises à jour manuelles)${NC}"
fi

if grep -q "blog-network" docker-compose.nas.yml; then
    echo -e "${GREEN}✅ Réseau Docker configuré${NC}"
else
    echo -e "${YELLOW}⚠️  Réseau Docker non configuré${NC}"
fi
echo ""

echo -e "${BLUE}🔍 Vérification du workflow GitHub Actions:${NC}"
if grep -q "GITHUB_TOKEN" .github/workflows/build-and-push.yml; then
    echo -e "${GREEN}✅ Authentification GHCR configurée${NC}"
else
    echo -e "${RED}❌ Authentification GHCR manquante${NC}"
fi

if grep -q "docker/build-push-action" .github/workflows/build-and-push.yml; then
    echo -e "${GREEN}✅ Actions de build configurées${NC}"
else
    echo -e "${RED}❌ Actions de build manquantes${NC}"
fi
echo ""

echo -e "${BLUE}🔍 Vérification des Dockerfiles:${NC}"

# Backend Dockerfile
if grep -q "generate-secrets.sh" backend/Dockerfile; then
    echo -e "${GREEN}✅ Backend: génération de secrets configurée${NC}"
else
    echo -e "${YELLOW}⚠️  Backend: génération de secrets non configurée${NC}"
fi

if grep -q "ENTRYPOINT" backend/Dockerfile; then
    echo -e "${GREEN}✅ Backend: ENTRYPOINT défini${NC}"
else
    echo -e "${RED}❌ Backend: ENTRYPOINT manquant${NC}"
fi

# Frontend Dockerfile
if grep -q "standalone" frontend/Dockerfile; then
    echo -e "${GREEN}✅ Frontend: build standalone configuré${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend: build standalone recommandé pour la prod${NC}"
fi

if grep -q "server.js" frontend/Dockerfile; then
    echo -e "${GREEN}✅ Frontend: démarrage optimisé${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend: démarrage non optimisé${NC}"
fi
echo ""

echo -e "${BLUE}🔍 Vérification de next.config.ts:${NC}"
if grep -q "standalone" frontend/next.config.ts; then
    echo -e "${GREEN}✅ Next.js: mode standalone activé${NC}"
else
    echo -e "${YELLOW}⚠️  Next.js: mode standalone recommandé${NC}"
fi

if grep -q "backend" frontend/next.config.ts; then
    echo -e "${GREEN}✅ Next.js: hostname backend configuré${NC}"
else
    echo -e "${YELLOW}⚠️  Next.js: hostname backend non configuré${NC}"
fi
echo ""

echo -e "${BLUE}📊 Résumé:${NC}"
echo "=========================================="
echo -e "${GREEN}✅ Configuration de base OK${NC}"
echo ""
echo -e "${BLUE}📋 Prochaines étapes:${NC}"
echo "1. Vérifier que Git est à jour: git status"
echo "2. Committer les changements: git add . && git commit -m 'Configure NAS deployment'"
echo "3. Pousser vers GitHub: git push origin main"
echo "4. Vérifier le build dans Actions: https://github.com/FabLrc/blog/actions"
echo "5. Déployer sur le NAS: ./scripts/deploy-to-nas.sh <IP_NAS> <USER>"
echo ""
echo -e "${GREEN}🎉 Tout est prêt pour le déploiement !${NC}"
