.PHONY: help build up down restart logs clean secrets

# Configuration
COMPOSE_FILE := docker-compose.yml
COMPOSE_PROD_FILE := docker-compose.prod.yml

help: ## Affiche l'aide
	@echo "📝 Commandes disponibles :"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Développement
build: ## Build les images Docker
	docker compose -f $(COMPOSE_FILE) build

up: ## Démarre les conteneurs en mode détaché
	docker compose -f $(COMPOSE_FILE) up -d

down: ## Arrête les conteneurs
	docker compose -f $(COMPOSE_FILE) down

restart: ## Redémarre les conteneurs
	docker compose -f $(COMPOSE_FILE) restart

logs: ## Affiche les logs en temps réel
	docker compose -f $(COMPOSE_FILE) logs -f

logs-backend: ## Affiche les logs du backend
	docker compose -f $(COMPOSE_FILE) logs -f backend

logs-frontend: ## Affiche les logs du frontend
	docker compose -f $(COMPOSE_FILE) logs -f frontend

ps: ## Liste les conteneurs
	docker compose -f $(COMPOSE_FILE) ps

shell-backend: ## Ouvre un shell dans le conteneur backend
	docker compose -f $(COMPOSE_FILE) exec backend sh

shell-frontend: ## Ouvre un shell dans le conteneur frontend
	docker compose -f $(COMPOSE_FILE) exec frontend sh

# Production
prod-pull: ## Pull les images de production depuis GitHub Registry
	docker compose -f $(COMPOSE_PROD_FILE) pull

prod-up: ## Démarre les conteneurs de production
	docker compose -f $(COMPOSE_PROD_FILE) up -d

prod-down: ## Arrête les conteneurs de production
	docker compose -f $(COMPOSE_PROD_FILE) down

prod-logs: ## Affiche les logs de production
	docker compose -f $(COMPOSE_PROD_FILE) logs -f

prod-restart: ## Redémarre les conteneurs de production
	docker compose -f $(COMPOSE_PROD_FILE) restart

# Utilitaires
secrets: ## Génère des secrets sécurisés pour Strapi
	@echo "🔐 Génération des secrets Strapi..."
	@node scripts/generate-secrets.js

clean: ## Arrête et supprime les conteneurs, volumes et images
	docker compose -f $(COMPOSE_FILE) down -v --remove-orphans
	@echo "⚠️  Volumes supprimés (base de données et uploads)"

rebuild: down build up ## Rebuild complet (down + build + up)

seed: ## Importe les données de démonstration dans Strapi
	docker compose -f $(COMPOSE_FILE) exec backend npm run seed:example

backup: ## Sauvegarde la base de données et les uploads
	@echo "📦 Création d'une sauvegarde..."
	@docker compose -f $(COMPOSE_FILE) exec backend tar czf /tmp/backup.tar.gz .tmp/ public/uploads/ data/
	@docker cp blog-backend:/tmp/backup.tar.gz ./backup-$$(date +%Y%m%d-%H%M%S).tar.gz
	@echo "✅ Sauvegarde créée : backup-$$(date +%Y%m%d-%H%M%S).tar.gz"

install: ## Installation complète (secrets + build + up + seed)
	@echo "🚀 Installation du blog..."
	@echo "1. Génération des secrets..."
	@make secrets
	@echo ""
	@echo "2. Configuration..."
	@echo "⚠️  Veuillez copier les secrets dans le fichier .env avant de continuer"
	@read -p "Appuyez sur Entrée quand c'est fait..."
	@echo ""
	@echo "3. Build des images..."
	@make build
	@echo ""
	@echo "4. Démarrage des conteneurs..."
	@make up
	@echo ""
	@echo "5. Import des données de démonstration..."
	@sleep 10
	@make seed
	@echo ""
	@echo "✅ Installation terminée !"
	@echo ""
	@echo "📍 URLs :"
	@echo "  - Frontend : http://localhost:3000"
	@echo "  - Backend  : http://localhost:1337"
	@echo "  - Admin    : http://localhost:1337/admin"

# Monitoring
health: ## Vérifie la santé des conteneurs
	@echo "🏥 État des services :"
	@docker compose -f $(COMPOSE_FILE) ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

stats: ## Affiche les statistiques des conteneurs
	docker stats blog-backend blog-frontend

# Nettoyage
prune: ## Nettoie les ressources Docker inutilisées
	docker system prune -a --volumes
	@echo "⚠️  Toutes les ressources Docker inutilisées ont été supprimées"
