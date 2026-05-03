#!/bin/bash

# =============================================================================
# Script de démarrage du serveur RAG de démonstration
# =============================================================================

echo "🤖 Démarrage du serveur RAG de démonstration"
echo "============================================="
echo ""

# Vérifier si Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Erreur: Python 3 n'est pas installé"
    exit 1
fi

echo "✅ Python 3 détecté: $(python3 --version)"
echo ""

# Créer un environnement virtuel si nécessaire
if [ ! -d "venv-rag" ]; then
    echo "📦 Création de l'environnement virtuel..."
    python3 -m venv venv-rag
    echo "✅ Environnement virtuel créé"
fi

# Activer l'environnement virtuel
echo "🔧 Activation de l'environnement virtuel..."
source venv-rag/bin/activate

# Installer les dépendances
echo "📥 Installation des dépendances..."
pip install -q -r requirements-rag.txt
echo "✅ Dépendances installées"
echo ""

# Configuration
export RAG_API_SECRET_TOKEN="${RAG_API_SECRET_TOKEN:-demo-token-change-me}"

echo "="*60
echo "🚀 Serveur RAG démarré"
echo "="*60
echo "📡 URL: http://localhost:8000"
echo "📚 Documentation: http://localhost:8000/docs"
echo "🔑 Token: $RAG_API_SECRET_TOKEN"
echo "="*60
echo ""
echo "💡 Conseil: Configurez l'URL dans le portail :"
echo "   Paramètres > URL de l'API RAG: http://localhost:8000"
echo "   Paramètres > Token RAG: $RAG_API_SECRET_TOKEN"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

# Démarrer le serveur
python3 example-rag-server.py
