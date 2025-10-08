#!/bin/bash

# install.sh - Script d'installation automatique du blog
# Pour Linux et macOS

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Installation du blog...${NC}"
echo ""

# 1. Vérifier Docker
echo -e "${CYAN}1️⃣  Vérification de Docker...${NC}"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "   ${GREEN}✅ Docker installé : ${DOCKER_VERSION}${NC}"
else
    echo -e "   ${RED}❌ Docker n'est pas installé${NC}"
    echo -e "   ${YELLOW}📥 Installez Docker : https://docs.docker.com/get-docker/${NC}"
    exit 1
fi

# 2. Vérifier Docker Compose
echo ""
echo -e "${CYAN}2️⃣  Vérification de Docker Compose...${NC}"
if command -v docker compose &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    echo -e "   ${GREEN}✅ Docker Compose installé : ${COMPOSE_VERSION}${NC}"
else
    echo -e "   ${RED}❌ Docker Compose n'est pas installé${NC}"
    echo -e "   ${YELLOW}📥 Installez Docker Compose : https://docs.docker.com/compose/install/${NC}"
    exit 1
fi

# 3. Vérifier Node.js
echo ""
echo -e "${CYAN}3️⃣  Vérification de Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "   ${GREEN}✅ Node.js installé : ${NODE_VERSION}${NC}"
else
    echo -e "   ${RED}❌ Node.js n'est pas installé${NC}"
    echo -e "   ${YELLOW}📥 Installez Node.js : https://nodejs.org/${NC}"
    exit 1
fi

# 4. Générer les secrets
echo ""
echo -e "${CYAN}4️⃣  Génération des secrets Strapi...${NC}"
node scripts/generate-secrets.js
echo ""

# 5. Configuration
echo -e "${CYAN}5️⃣  Configuration de l'environnement...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "   ${GREEN}✅ Fichier .env créé${NC}"
else
    echo -e "   ${YELLOW}⚠️  Fichier .env existe déjà${NC}"
fi

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT : Copiez les secrets générés ci-dessus dans le fichier .env${NC}"
echo -e "   ${YELLOW}Ouvrez .env avec : nano .env (ou votre éditeur préféré)${NC}"
echo ""
read -p "Appuyez sur Entrée quand vous avez terminé la configuration..."

# 6. Build
echo ""
echo -e "${CYAN}6️⃣  Build des images Docker...${NC}"
echo -e "   ⏳ Cela peut prendre plusieurs minutes..."
if docker compose build; then
    echo -e "   ${GREEN}✅ Build réussi${NC}"
else
    echo -e "   ${RED}❌ Erreur lors du build${NC}"
    exit 1
fi

# 7. Démarrage
echo ""
echo -e "${CYAN}7️⃣  Démarrage des conteneurs...${NC}"
if docker compose up -d; then
    echo -e "   ${GREEN}✅ Conteneurs démarrés${NC}"
else
    echo -e "   ${RED}❌ Erreur lors du démarrage${NC}"
    exit 1
fi

# 8. Attendre que les services soient prêts
echo ""
echo -e "${CYAN}8️⃣  Attente du démarrage des services...${NC}"
echo -e "   ⏳ Patience, les services se lancent..."
sleep 20

# 9. Vérifier l'état
echo ""
echo -e "${CYAN}9️⃣  Vérification de l'état des services...${NC}"
docker compose ps
echo ""

# 10. Import des données (optionnel)
echo -e "${CYAN}🔟  Import des données de démonstration...${NC}"
read -p "Voulez-vous importer les données de démonstration ? (O/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo -e "   ⏳ Import en cours..."
    if docker compose exec backend npm run seed:example; then
        echo -e "   ${GREEN}✅ Données importées avec succès${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Erreur lors de l'import (vous pourrez le faire plus tard)${NC}"
    fi
else
    echo -e "   ⏭️  Import des données ignoré"
fi

# 11. Fin
echo ""
echo -e "${GREEN}======================================================================${NC}"
echo -e "${GREEN}✅ Installation terminée avec succès !${NC}"
echo -e "${GREEN}======================================================================${NC}"
echo ""

echo -e "${CYAN}📍 URLs d'accès :${NC}"
echo -e "   🌐 Frontend : http://localhost:3000"
echo -e "   🔌 API      : http://localhost:1337"
echo -e "   👤 Admin    : http://localhost:1337/admin"
echo ""

echo -e "${CYAN}📝 Prochaines étapes :${NC}"
echo "   1. Ouvrir http://localhost:1337/admin dans votre navigateur"
echo "   2. Créer votre compte administrateur Strapi"
echo "   3. Configurer le Single Type 'site-config' (voir STRAPI_SITE_CONFIG.md)"
echo "   4. Visiter votre blog sur http://localhost:3000"
echo ""

echo -e "${CYAN}📚 Commandes utiles :${NC}"
echo "   docker compose logs -f           # Voir les logs en temps réel"
echo "   docker compose ps                # État des conteneurs"
echo "   docker compose restart           # Redémarrer les services"
echo "   docker compose down              # Arrêter les conteneurs"
echo "   make help                        # Voir toutes les commandes Make"
echo ""

echo -e "${GREEN}🎉 Bon développement !${NC}"
