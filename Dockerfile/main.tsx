# ============================================================================
# Dockerfile - Portail Documentaire Wiki.js
# Multi-stage build optimisé pour production
# ============================================================================

# ─────────────────────────────────────────────────────────────────────────
# Stage 1 : Build de l'application
# ─────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

# Métadonnées
LABEL maintainer="Portail Documentaire"
LABEL version="1.0.0"
LABEL description="Portail Documentaire Wiki.js - Build Stage"

# Variables d'environnement pour le build
ENV NODE_ENV=production
ENV CI=true

# Installe les dépendances système nécessaires
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Installe les dépendances (utilise npm ci pour un build déterministe)
RUN npm ci --only=production --no-audit --no-fund

# Copie le code source
COPY . .

# Build de l'application
RUN npm run build

# Nettoie les fichiers inutiles
RUN rm -rf node_modules/.cache \
    && npm prune --production

# ─────────────────────────────────────────────────────────────────────────
# Stage 2 : Image de production avec Nginx
# ─────────────────────────────────────────────────────────────────────────
FROM nginx:alpine

# Métadonnées
LABEL maintainer="Portail Documentaire"
LABEL version="1.0.0"
LABEL description="Portail Documentaire Wiki.js - Production"

# Installe curl pour healthcheck
RUN apk add --no-cache curl

# Copie les fichiers buildés depuis le stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie la configuration Nginx personnalisée
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copie le script d'entrypoint personnalisé
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Crée un utilisateur non-root pour Nginx
RUN addgroup -g 101 -S nginx-user && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx-user -g nginx-user nginx-user

# Modifie les permissions
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    chown -R nginx-user:nginx-user /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

# Switch vers l'utilisateur non-root
USER nginx-user

# Expose le port 80
EXPOSE 80

# Healthcheck pour vérifier que le conteneur est opérationnel
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Entrypoint et commande par défaut
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
