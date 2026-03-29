#!/bin/sh
# ============================================================================
# Docker Entrypoint pour Portail Documentaire
# Initialisation et configuration au démarrage du conteneur
# ============================================================================

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 Portail Documentaire Wiki.js - Version 1.0.0"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Vérifications de santé
# ─────────────────────────────────────────────────────────────────────────

echo "📋 Vérification de l'environnement..."

# Vérifier que les fichiers existent
if [ ! -f "/usr/share/nginx/html/index.html" ]; then
    echo "❌ Erreur: index.html introuvable"
    exit 1
fi

echo "✅ Fichiers de l'application présents"

# ─────────────────────────────────────────────────────────────────────────
# Afficher les variables d'environnement (sans les secrets)
# ─────────────────────────────────────────────────────────────────────────

if [ -n "$VITE_WIKIJS_URL" ]; then
    echo "🔌 URL Wiki.js configurée: $VITE_WIKIJS_URL"
else
    echo "⚠️  URL Wiki.js non configurée (peut être configurée via l'interface)"
fi

if [ -n "$VITE_WIKIJS_TOKEN" ]; then
    echo "🔑 Token Wiki.js: [CONFIGURÉ]"
else
    echo "⚠️  Token Wiki.js non configuré (peut être configuré via l'interface)"
fi

if [ -n "$VITE_RAG_API_URL" ]; then
    echo "🤖 API RAG configurée: $VITE_RAG_API_URL"
fi

echo "🌍 Timezone: ${TZ:-UTC}"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Permissions
# ─────────────────────────────────────────────────────────────────────────

echo "🔒 Vérification des permissions..."

# Vérifier les permissions sur les répertoires Nginx
if [ -w "/var/log/nginx" ] && [ -w "/var/cache/nginx" ]; then
    echo "✅ Permissions OK"
else
    echo "⚠️  Permissions limitées (normal en mode non-root)"
fi

# ─────────────────────────────────────────────────────────────────────────
# Informations de démarrage
# ─────────────────────────────────────────────────────────────────────────

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Initialisation terminée"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 L'application sera disponible sur http://localhost (port mappé)"
echo ""
echo "🔐 Identifiants par défaut:"
echo "   Email: admin@example.com"
echo "   Mot de passe: admin123"
echo ""
echo "⚠️  IMPORTANT: Changez le mot de passe admin après la première connexion"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 Démarrage de Nginx..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Exécuter la commande principale (Nginx)
# ─────────────────────────────────────────────────────────────────────────

exec "$@"
