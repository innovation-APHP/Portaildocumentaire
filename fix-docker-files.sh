#!/bin/bash

# ============================================================================
# Script de correction des fichiers Docker
# Corrige le problème de Dockerfile et VERSION créés comme répertoires
# ============================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║              🔧 CORRECTION DES FICHIERS DOCKER                               ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Fonction de vérification
# ─────────────────────────────────────────────────────────────────────────

check_file() {
    local file=$1
    if [ -f "$file" ]; then
        echo "✅ $file est un fichier"
        return 0
    elif [ -d "$file" ]; then
        echo "❌ $file est un répertoire (ERREUR)"
        return 1
    else
        echo "⚠️  $file n'existe pas"
        return 2
    fi
}

# ─────────────────────────────────────────────────────────────────────────
# Vérification initiale
# ─────────────────────────────────────────────────────────────────────────

echo "🔍 Vérification des fichiers..."
echo ""

NEEDS_FIX=0

if ! check_file "Dockerfile"; then
    NEEDS_FIX=1
fi

if ! check_file "VERSION"; then
    NEEDS_FIX=1
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────
# Correction si nécessaire
# ─────────────────────────────────────────────────────────────────────────

if [ $NEEDS_FIX -eq 0 ]; then
    echo "✅ Aucune correction nécessaire !"
    exit 0
fi

echo "🔧 Correction en cours..."
echo ""

# Sauvegarde le contenu si Dockerfile est un répertoire
if [ -d "Dockerfile" ]; then
    echo "📝 Sauvegarde du contenu de Dockerfile..."
    
    if [ -f "Dockerfile/main.tsx" ]; then
        cp "Dockerfile/main.tsx" "Dockerfile.tmp"
        echo "   ✓ Contenu sauvegardé dans Dockerfile.tmp"
    fi
    
    echo "   ✓ Suppression du répertoire Dockerfile..."
    rm -rf Dockerfile
    
    if [ -f "Dockerfile.tmp" ]; then
        echo "   ✓ Restauration du Dockerfile..."
        mv "Dockerfile.tmp" "Dockerfile"
    else
        echo "   ⚠️  Création d'un nouveau Dockerfile..."
        cat > Dockerfile << 'DOCKERFILE_CONTENT'
# ============================================================================
# Dockerfile - Portail Documentaire Wiki.js
# Multi-stage build optimisé pour production
# ============================================================================

# Stage 1 : Build de l'application
FROM node:18-alpine AS builder

LABEL maintainer="Portail Documentaire"
LABEL version="1.0.0"
LABEL description="Portail Documentaire Wiki.js - Build Stage"

ENV NODE_ENV=production
ENV CI=true

RUN apk add --no-cache python3 make g++ git

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml* ./

RUN npm ci --only=production --no-audit --no-fund

COPY . .

RUN npm run build

RUN rm -rf node_modules/.cache && npm prune --production

# Stage 2 : Image de production avec Nginx
FROM nginx:alpine

LABEL maintainer="Portail Documentaire"
LABEL version="1.0.0"
LABEL description="Portail Documentaire Wiki.js - Production"

RUN apk add --no-cache curl

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

RUN addgroup -g 101 -S nginx-user && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx-user -g nginx-user nginx-user

RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    chown -R nginx-user:nginx-user /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

USER nginx-user

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
DOCKERFILE_CONTENT
    fi
    
    echo "   ✅ Dockerfile corrigé !"
fi

# Sauvegarde le contenu si VERSION est un répertoire
if [ -d "VERSION" ]; then
    echo "📝 Sauvegarde du contenu de VERSION..."
    
    if [ -f "VERSION/main.tsx" ]; then
        cp "VERSION/main.tsx" "VERSION.tmp"
        echo "   ✓ Contenu sauvegardé dans VERSION.tmp"
    fi
    
    echo "   ✓ Suppression du répertoire VERSION..."
    rm -rf VERSION
    
    if [ -f "VERSION.tmp" ]; then
        echo "   ✓ Restauration du VERSION..."
        mv "VERSION.tmp" "VERSION"
    else
        echo "   ⚠️  Création d'un nouveau VERSION..."
        echo "1.0.0" > VERSION
    fi
    
    echo "   ✅ VERSION corrigé !"
fi

echo ""
echo "─────────────────────────────────────────────────────────────────────────"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Vérification finale
# ─────────────────────────────────────────────────────────────────────────

echo "🔍 Vérification finale..."
echo ""

check_file "Dockerfile"
check_file "VERSION"

echo ""

# Affiche le type de fichier
echo "📋 Détails des fichiers :"
echo ""
ls -lh Dockerfile VERSION 2>/dev/null || echo "Erreur lors de l'affichage"
echo ""

# ─────────────────────────────────────────────────────────────────────────
# Message final
# ─────────────────────────────────────────────────────────────────────────

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                        ✅ CORRECTION TERMINÉE !                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Tu peux maintenant lancer Docker Compose :"
echo ""
echo "   docker-compose up -d --build"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
