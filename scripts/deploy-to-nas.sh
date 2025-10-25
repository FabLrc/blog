#!/bin/bash
# Script de déploiement rapide sur NAS
# Usage: ./deploy-to-nas.sh [NAS_IP] [NAS_USER]

set -e

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Arguments
NAS_IP=${1:-"192.168.1.100"}
NAS_USER=${2:-"admin"}
DEPLOY_PATH="/volume1/docker/blog"

echo -e "${BLUE}🚀 Déploiement du blog sur NAS${NC}"
echo -e "${BLUE}================================${NC}"
echo "NAS: ${NAS_USER}@${NAS_IP}"
echo "Path: ${DEPLOY_PATH}"
echo ""

# Vérifier que docker-compose.nas.yml existe
if [ ! -f "docker-compose.nas.yml" ]; then
    echo -e "${RED}❌ Erreur: docker-compose.nas.yml introuvable${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Création des dossiers sur le NAS...${NC}"
ssh ${NAS_USER}@${NAS_IP} "mkdir -p ${DEPLOY_PATH}/{data,uploads}"

echo -e "${GREEN}📤 Copie du docker-compose.yml...${NC}"
scp docker-compose.nas.yml ${NAS_USER}@${NAS_IP}:${DEPLOY_PATH}/docker-compose.yml

echo -e "${GREEN}📤 Copie du .env.example (optionnel)...${NC}"
scp .env.nas.example ${NAS_USER}@${NAS_IP}:${DEPLOY_PATH}/.env.example 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ Fichiers copiés avec succès !${NC}"
echo ""
echo -e "${BLUE}📋 Prochaines étapes sur le NAS:${NC}"
echo "  1. Se connecter en SSH: ssh ${NAS_USER}@${NAS_IP}"
echo "  2. Aller dans le dossier: cd ${DEPLOY_PATH}"
echo "  3. (Optionnel) Configurer .env si packages privés: cp .env.example .env"
echo "  4. Démarrer les conteneurs: docker-compose up -d"
echo "  5. Voir les logs: docker-compose logs -f"
echo ""
echo -e "${BLUE}🌐 Une fois démarré, accédez à:${NC}"
echo "  - Frontend: http://${NAS_IP}:3000"
echo "  - Backend Admin: http://${NAS_IP}:1337/admin"
echo ""

read -p "Voulez-vous démarrer les conteneurs maintenant ? (o/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[OoYy]$ ]]; then
    echo -e "${GREEN}🐳 Démarrage des conteneurs...${NC}"
    ssh ${NAS_USER}@${NAS_IP} "cd ${DEPLOY_PATH} && docker-compose pull && docker-compose up -d"
    echo ""
    echo -e "${GREEN}✅ Conteneurs démarrés !${NC}"
    echo ""
    echo -e "${BLUE}📊 Status des conteneurs:${NC}"
    ssh ${NAS_USER}@${NAS_IP} "cd ${DEPLOY_PATH} && docker-compose ps"
    echo ""
    echo -e "${GREEN}🎉 Déploiement terminé !${NC}"
else
    echo -e "${BLUE}ℹ️  OK, démarrez manuellement quand vous serez prêt.${NC}"
fi
