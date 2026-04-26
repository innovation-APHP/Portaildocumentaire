#!/bin/bash

# ============================================================================
# Script de démarrage - Portail Documentaire PostgreSQL
# ============================================================================

set -e

echo "============================================================================"
echo "🚀 Démarrage du Portail Documentaire avec PostgreSQL"
echo "============================================================================"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Vérification des prérequis
# ─────────────────────────────────────────────────────────────────────────

echo "📋 Vérification des prérequis..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Configuration de l'environnement
# ─────────────────────────────────────────────────────────────────────────

if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Éditez .env et changez les mots de passe avant la production !"
    echo ""
fi

# ─────────────────────────────────────────────────────────────────────────
# Arrêt des services existants
# ─────────────────────────────────────────────────────────────────────────

echo "🛑 Arrêt des services existants..."
docker-compose down 2>/dev/null || true
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Construction des images
# ─────────────────────────────────────────────────────────────────────────

echo "🔨 Construction des images Docker..."
docker-compose build
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Démarrage des services
# ─────────────────────────────────────────────────────────────────────────

echo "🚀 Démarrage des services..."
docker-compose up -d
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Attente que PostgreSQL soit prêt
# ─────────────────────────────────────────────────────────────────────────

echo "⏳ Attente que PostgreSQL soit prêt..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U portail_user &> /dev/null; then
        echo "✅ PostgreSQL est prêt"
        break
    fi
    echo -n "."
    sleep 1
    if [ $i -eq 30 ]; then
        echo ""
        echo "❌ Timeout: PostgreSQL n'a pas démarré"
        docker-compose logs postgres
        exit 1
    fi
done
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Attente que le backend soit prêt
# ─────────────────────────────────────────────────────────────────────────

echo "⏳ Attente que le backend soit prêt..."
for i in {1..30}; do
    if curl -f http://localhost:3001/health &> /dev/null; then
        echo "✅ Backend est prêt"
        break
    fi
    echo -n "."
    sleep 1
    if [ $i -eq 30 ]; then
        echo ""
        echo "❌ Timeout: Backend n'a pas démarré"
        docker-compose logs backend
        exit 1
    fi
done
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Application des migrations
# ─────────────────────────────────────────────────────────────────────────

echo "📊 Application des migrations..."
if docker-compose exec -T backend node dist/db/migrate.js; then
    echo "✅ Migrations appliquées avec succès"
else
    echo "❌ Erreur lors de l'application des migrations"
    docker-compose logs backend
    exit 1
fi
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Insertion des données de démonstration
# ─────────────────────────────────────────────────────────────────────────

read -p "Voulez-vous insérer les données de démonstration ? (o/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[OoYy]$ ]]; then
    echo "🌱 Insertion des données de démonstration..."
    if docker-compose exec -T backend node dist/db/seed.js; then
        echo "✅ Données de démonstration insérées avec succès"
    else
        echo "❌ Erreur lors de l'insertion des données"
        docker-compose logs backend
        exit 1
    fi
    echo ""
fi

# ─────────────────────────────────────────────────────────────────────────
# Affichage du statut
# ─────────────────────────────────────────────────────────────────────────

echo "============================================================================"
echo "✅ Démarrage terminé avec succès !"
echo "============================================================================"
echo ""
echo "📊 Statut des services:"
docker-compose ps
echo ""

echo "🌐 URLs d'accès:"
echo "  - Frontend:     http://localhost:8080"
echo "  - Backend API:  http://localhost:3001"
echo "  - Admin:        http://localhost:8080/admin"
echo ""

echo "🔑 Identifiants par défaut:"
echo "  - Admin:   admin / password123"
echo "  - Editor:  editor / password123"
echo "  - User:    user / password123"
echo ""

echo "📋 Commandes utiles:"
echo "  - Voir les logs:           docker-compose logs -f"
echo "  - Arrêter:                 docker-compose down"
echo "  - Redémarrer:              docker-compose restart"
echo "  - Réinitialiser la DB:     docker-compose down -v && ./START_POSTGRES.sh"
echo ""

echo "📚 Documentation:"
echo "  - Guide de migration:      MIGRATION_POSTGRES.md"
echo "  - Fichiers modifiés:       FICHIERS_CHANGES.md"
echo ""

echo "============================================================================"
