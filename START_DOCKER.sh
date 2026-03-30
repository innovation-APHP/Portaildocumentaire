#!/bin/bash

# ============================================================================
# Script de démarrage Docker - Portail Documentaire Wiki.js
# ============================================================================

clear

cat << "EOF"
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🐳 PORTAIL DOCUMENTAIRE WIKI.JS                           ║
║                         Démarrage Docker v1.0.0                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
EOF

echo ""

# ─────────────────────────────────────────────────────────────────────────
# Vérification des prérequis
# ─────────────────────────────────────────────────────────────────────────

echo "🔍 Vérification des prérequis..."
echo ""

# Vérifie Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    echo "   Installe Docker : https://docs.docker.com/get-docker/"
    exit 1
fi
echo "✅ Docker installé : $(docker --version)"

# Vérifie Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    echo "   Installe Docker Compose : https://docs.docker.com/compose/install/"
    exit 1
fi
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose installé : $(docker-compose --version)"
else
    echo "✅ Docker Compose installé : $(docker compose version)"
fi

echo ""
echo "─────────────────────────────────────────────────────────────────────────"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Correction des fichiers si nécessaire
# ─────────────────────────────────────────────────────────────────────────

if [ -d "Dockerfile" ] || [ -d "VERSION" ]; then
    echo "⚠️  Détection de fichiers Docker incorrects..."
    echo ""
    echo "   Lancement du script de correction..."
    echo ""
    
    if [ -f "fix-docker-files.sh" ]; then
        chmod +x fix-docker-files.sh
        ./fix-docker-files.sh
    else
        echo "❌ fix-docker-files.sh introuvable"
        echo ""
        echo "   Correction manuelle nécessaire :"
        echo "   rm -rf Dockerfile VERSION"
        echo "   # Puis recrée ces fichiers (voir DEPLOY_NOW.txt)"
        exit 1
    fi
    
    echo ""
    echo "─────────────────────────────────────────────────────────────────────────"
    echo ""
fi

# ─────────────────────────────────────────────────────────────────────────
# Vérification du fichier .env
# ─────────────────────────────────────────────────────────────────────────

echo "📋 Vérification de la configuration..."
echo ""

if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env introuvable"
    
    if [ -f ".env.docker" ]; then
        echo "   Copie de .env.docker vers .env..."
        cp .env.docker .env
        echo "   ✅ Fichier .env créé"
    else
        echo "   ❌ .env.docker introuvable également"
        exit 1
    fi
else
    echo "✅ Fichier .env présent"
fi

# Vérifie le mot de passe PostgreSQL
if grep -q "POSTGRES_PASSWORD=changeme" .env 2>/dev/null; then
    echo ""
    echo "⚠️  ATTENTION : Le mot de passe PostgreSQL est encore celui par défaut !"
    echo ""
    read -p "   Veux-tu le modifier maintenant ? (o/N) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        nano .env || vi .env || echo "Édite .env manuellement"
    else
        echo "   ⚠️  N'oublie pas de le changer avant la production !"
    fi
fi

echo ""
echo "─────────────────────────────────────────────────────────────────────────"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Choix du mode de déploiement
# ─────────────────────────────────────────────────────────────────────────

echo "🚀 Choix du mode de déploiement :"
echo ""
echo "   1) Stack complet (Portail + Wiki.js + PostgreSQL)"
echo "   2) Portail uniquement (Wiki.js existe ailleurs)"
echo "   3) Annuler"
echo ""
read -p "Ton choix (1-3) : " choice

case $choice in
    1)
        echo ""
        echo "🐳 Lancement du stack complet..."
        echo ""
        COMPOSE_CMD="docker-compose up -d --build"
        ;;
    2)
        echo ""
        echo "🐳 Lancement du Portail uniquement..."
        echo ""
        COMPOSE_CMD="docker-compose up -d --build portail-docs"
        ;;
    3)
        echo ""
        echo "❌ Annulation"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

echo "─────────────────────────────────────────────────────────────────────────"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Lancement de Docker Compose
# ─────────────────────────────────────────────────────────────────────────

echo "⚙️  Exécution de la commande :"
echo "   $COMPOSE_CMD"
echo ""

eval $COMPOSE_CMD

if [ $? -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                        ✅ DÉPLOIEMENT RÉUSSI !                               ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "🌐 Accès aux services :"
    echo ""
    echo "   • Portail Documentaire : http://localhost:8080"
    
    if [ "$choice" == "1" ]; then
        echo "   • Wiki.js              : http://localhost:3000"
    fi
    
    echo ""
    echo "📊 Vérification du statut :"
    echo ""
    docker-compose ps
    echo ""
    echo "📝 Commandes utiles :"
    echo ""
    echo "   # Voir les logs en temps réel"
    echo "   docker-compose logs -f"
    echo ""
    echo "   # Arrêter les conteneurs"
    echo "   docker-compose stop"
    echo ""
    echo "   # Redémarrer les conteneurs"
    echo "   docker-compose restart"
    echo ""
    echo "═══════════════════════════════════════════════════════════════════════════════"
else
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                        ❌ ERREUR DE DÉPLOIEMENT                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📝 Consulte les logs pour plus d'informations :"
    echo ""
    echo "   docker-compose logs"
    echo ""
    echo "📚 Documentation disponible :"
    echo ""
    echo "   • DEPLOY_NOW.txt"
    echo "   • DOCKER_START.txt"
    echo "   • DOCKER_DEPLOYMENT.md"
    echo ""
    exit 1
fi
