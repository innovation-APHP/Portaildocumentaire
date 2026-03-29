# 🐳 Guide de Déploiement Docker

## 📦 Vue d'ensemble

Configuration Docker complète et optimisée pour déployer le Portail Documentaire en production.

---

## 🎯 Ce qui est inclus

### Fichiers créés

| Fichier | Description |
|---------|-------------|
| **Dockerfile** | Multi-stage build optimisé (Node.js + Nginx) |
| **docker-compose.yml** | Orchestration complète (Portail + Wiki.js + PostgreSQL) |
| **docker/nginx.conf** | Configuration Nginx avec cache et sécurité |
| **docker/docker-entrypoint.sh** | Script d'initialisation au démarrage |
| **.dockerignore** | Optimisation du contexte de build |
| **.env.docker** | Template de variables d'environnement |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Docker Compose Stack                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐    ┌──────────────────────┐         │
│  │  Portail Docs        │    │  Wiki.js             │         │
│  │  (Nginx + React)     │◄───│  (Application)       │         │
│  │  Port: 8080          │    │  Port: 3000          │         │
│  └──────────────────────┘    └──────────┬───────────┘         │
│                                          │                      │
│                               ┌──────────▼───────────┐         │
│                               │  PostgreSQL          │         │
│                               │  (Base de données)   │         │
│                               └──────────────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Démarrage Rapide (5 minutes)

### Prérequis

```bash
# Vérifier que Docker est installé
docker --version  # Doit être 20.10+
docker-compose --version  # Doit être 1.29+
```

### 1. Préparer l'environnement

```bash
# Créer le fichier .env
cp .env.docker .env

# Éditer les variables (optionnel)
nano .env

# IMPORTANT: Change au minimum POSTGRES_PASSWORD en production !
```

### 2. Lancer le stack complet

```bash
# Build et lancement (première fois)
docker-compose up -d --build

# Vérifier les logs
docker-compose logs -f

# Vérifier le statut
docker-compose ps
```

### 3. Accéder à l'application

**Portail Documentaire :**
- URL : `http://localhost:8080`
- Identifiants : `admin@example.com` / `admin123`

**Wiki.js (si activé) :**
- URL : `http://localhost:3000`
- Configuration initiale via l'interface

### 4. Configuration du Portail

1. Ouvre `http://localhost:8080`
2. Connecte-toi avec les identifiants par défaut
3. **Paramètres** → **Paramètres Wiki.js**
4. Configure :
   - **URL** : `http://wikijs:3000` (nom du service Docker)
   - **Token** : Ta clé API Wiki.js (créée dans Wiki.js)
5. Teste et sauvegarde

### 5. Migration des données

```bash
# Via l'interface (recommandé)
# Paramètres → Migration de données → "Migrer tous les documents"

# Ou via CLI depuis le conteneur
docker exec -it portail-documentaire sh
node scripts/migrate-to-wikijs.js \
  --url=http://wikijs:3000 \
  --token=YOUR_TOKEN
```

---

## 📋 Configuration Détaillée

### Option A : Portail seul (Sans Wiki.js)

Si tu as déjà Wiki.js ailleurs, modifie `docker-compose.yml` :

```yaml
version: '3.8'

services:
  portail-docs:
    container_name: portail-documentaire
    build: .
    restart: unless-stopped
    ports:
      - "8080:80"
    environment:
      - VITE_WIKIJS_URL=https://wiki.monentreprise.com  # Ton Wiki.js existant
      - VITE_WIKIJS_TOKEN=${WIKIJS_TOKEN}
      - TZ=Europe/Paris
    networks:
      - portail-network

networks:
  portail-network:
    driver: bridge
```

```bash
# Lancer
docker-compose up -d --build
```

### Option B : Stack complet (Portail + Wiki.js + PostgreSQL)

Utilise le `docker-compose.yml` fourni tel quel :

```bash
# Lancer tout le stack
docker-compose up -d --build

# Attendre que tout soit prêt (1-2 minutes)
docker-compose logs -f

# Vérifier que tout est up
docker-compose ps

# Devrait afficher :
# portail-documentaire  Up  0.0.0.0:8080->80/tcp
# wikijs                Up  0.0.0.0:3000->3000/tcp
# wikijs-postgres       Up  5432/tcp
```

---

## 🔧 Variables d'Environnement

### Fichier `.env`

```bash
# ═══════════════════════════════════════════════════════════════
# Configuration Portail
# ═══════════════════════════════════════════════════════════════

# URL de Wiki.js
# - Si Wiki.js dans Docker Compose : http://wikijs:3000
# - Si Wiki.js externe : https://wiki.monentreprise.com
WIKIJS_URL=http://wikijs:3000

# Token Wiki.js (optionnel, peut être configuré via l'interface)
WIKIJS_TOKEN=

# URL API RAG (optionnel)
RAG_API_URL=

# ═══════════════════════════════════════════════════════════════
# Configuration PostgreSQL (pour Wiki.js)
# ═══════════════════════════════════════════════════════════════

POSTGRES_DB=wikijs
POSTGRES_USER=wikijs
POSTGRES_PASSWORD=CHANGE_ME_IN_PRODUCTION  # ⚠️ IMPORTANT !

# ═══════════════════════════════════════════════════════════════
# Ports
# ═══════════════════════════════════════════════════════════════

PORTAIL_PORT=8080
WIKIJS_PORT=3000

# ═══════════════════════════════════════════════════════════════
# Système
# ═══════════════════════════════════════════════════════════════

TZ=Europe/Paris
NODE_ENV=production
```

---

## 🛠️ Commandes Utiles

### Gestion des conteneurs

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Redémarrer un service spécifique
docker-compose restart portail-docs

# Voir les logs
docker-compose logs -f portail-docs
docker-compose logs -f wikijs

# Voir le statut
docker-compose ps

# Entrer dans un conteneur
docker exec -it portail-documentaire sh
docker exec -it wikijs sh
```

### Build et Images

```bash
# Rebuilder les images
docker-compose build --no-cache

# Rebuilder et redémarrer
docker-compose up -d --build

# Voir les images
docker images | grep portail

# Nettoyer les images inutilisées
docker image prune -a
```

### Volumes et Données

```bash
# Lister les volumes
docker volume ls

# Sauvegarder la base de données
docker exec wikijs-postgres pg_dump -U wikijs wikijs > backup.sql

# Restaurer la base de données
cat backup.sql | docker exec -i wikijs-postgres psql -U wikijs wikijs

# Supprimer tous les volumes (⚠️ PERTE DE DONNÉES)
docker-compose down -v
```

### Logs et Debugging

```bash
# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f portail-docs

# Dernières 100 lignes
docker-compose logs --tail=100 portail-docs

# Vérifier les healthchecks
docker inspect portail-documentaire | grep -A 10 Health
```

---

## 🔒 Sécurité Production

### 1. Utiliser Docker Secrets

Au lieu de mettre les mots de passe dans `.env` :

```yaml
# docker-compose.yml
version: '3.8'

secrets:
  wikijs_token:
    file: ./secrets/wikijs_token.txt
  postgres_password:
    file: ./secrets/postgres_password.txt

services:
  portail-docs:
    secrets:
      - wikijs_token
    environment:
      - VITE_WIKIJS_TOKEN=/run/secrets/wikijs_token
```

```bash
# Créer les secrets
mkdir secrets
echo "wk_your_token_here" > secrets/wikijs_token.txt
echo "super_secret_password" > secrets/postgres_password.txt
chmod 600 secrets/*
```

### 2. Changer le mot de passe admin

```bash
# Dans l'interface du portail
# Paramètres → Compte → Changer le mot de passe
```

### 3. Activer HTTPS avec Traefik (recommandé)

```yaml
# docker-compose.yml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@monentreprise.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-certificates:/letsencrypt
    networks:
      - portail-network

  portail-docs:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portail.rule=Host(`docs.monentreprise.com`)"
      - "traefik.http.routers.portail.entrypoints=websecure"
      - "traefik.http.routers.portail.tls.certresolver=letsencrypt"

volumes:
  traefik-certificates:
```

### 4. Limiter les ressources

Déjà configuré dans `docker-compose.yml` :

```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

---

## 📊 Monitoring et Healthchecks

### Vérifier la santé des conteneurs

```bash
# Statut général
docker-compose ps

# Healthcheck spécifique
docker inspect --format='{{json .State.Health}}' portail-documentaire | jq

# Logs de healthcheck
docker logs portail-documentaire 2>&1 | grep -i health
```

### Healthcheck endpoints

- **Portail** : `http://localhost:8080/health`
- **Wiki.js** : `http://localhost:3000/healthz`

### Intégration avec Prometheus (optionnel)

```yaml
# docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - portail-network
```

---

## 🔄 Mises à jour

### Mettre à jour le Portail

```bash
# 1. Récupérer les dernières modifications
git pull

# 2. Rebuilder l'image
docker-compose build --no-cache portail-docs

# 3. Redémarrer avec la nouvelle version
docker-compose up -d portail-docs

# 4. Vérifier les logs
docker-compose logs -f portail-docs
```

### Mettre à jour Wiki.js

```bash
# 1. Modifier la version dans docker-compose.yml
# image: ghcr.io/requarks/wiki:2.5.300

# 2. Pull et redémarrer
docker-compose pull wikijs
docker-compose up -d wikijs
```

---

## 📦 Backup et Restauration

### Sauvegarder tout

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup PostgreSQL
docker exec wikijs-postgres pg_dump -U wikijs wikijs > "$BACKUP_DIR/wikijs.sql"

# Backup volumes Docker
docker run --rm -v wikijs-data:/data -v "$BACKUP_DIR":/backup alpine \
  tar czf /backup/wikijs-data.tar.gz -C /data .

docker run --rm -v wikijs-db-data:/data -v "$BACKUP_DIR":/backup alpine \
  tar czf /backup/wikijs-db-data.tar.gz -C /data .

echo "✅ Backup créé dans $BACKUP_DIR"
```

### Restaurer

```bash
#!/bin/bash
# restore.sh

BACKUP_DIR="./backups/20240321_120000"  # Remplace par ton backup

# Restaurer PostgreSQL
cat "$BACKUP_DIR/wikijs.sql" | docker exec -i wikijs-postgres psql -U wikijs wikijs

# Restaurer volumes
docker run --rm -v wikijs-data:/data -v "$BACKUP_DIR":/backup alpine \
  tar xzf /backup/wikijs-data.tar.gz -C /data

echo "✅ Restauration terminée"
```

---

## 🐛 Dépannage

### Erreur : "Cannot connect to Docker daemon"

```bash
# Vérifier que Docker est lancé
sudo systemctl start docker

# Vérifier les permissions
sudo usermod -aG docker $USER
newgrp docker
```

### Erreur : "Port already in use"

```bash
# Voir quel processus utilise le port
sudo lsof -i :8080
sudo lsof -i :3000

# Changer le port dans docker-compose.yml
ports:
  - "8081:80"  # Au lieu de 8080
```

### Le conteneur redémarre en boucle

```bash
# Voir les logs détaillés
docker-compose logs -f portail-docs

# Vérifier le healthcheck
docker inspect portail-documentaire | grep -A 20 Health

# Entrer dans le conteneur pour debug
docker run -it --entrypoint /bin/sh portail-documentaire:1.0.0
```

### Wiki.js ne se connecte pas à PostgreSQL

```bash
# Vérifier que PostgreSQL est prêt
docker-compose logs wikijs-db

# Tester la connexion
docker exec -it wikijs-postgres psql -U wikijs -d wikijs

# Vérifier les variables d'environnement
docker exec wikijs env | grep DB
```

### Le build échoue

```bash
# Nettoyer tout et recommencer
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## 📊 Performance et Optimisation

### Taille des images

```bash
# Voir la taille
docker images portail-documentaire

# Notre image multi-stage :
# - Stage builder : ~500 MB (jeté après build)
# - Image finale : ~50 MB (nginx + app)
```

### Cache du build

```bash
# Build avec cache (rapide)
docker-compose build

# Build sans cache (propre)
docker-compose build --no-cache
```

### Limites de ressources

Ajustées dans `docker-compose.yml` selon ton serveur :

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'        # Augmente si tu as plus de CPU
      memory: 1024M      # Augmente si tu as plus de RAM
```

---

## ✅ Checklist de Déploiement

```
Avant le déploiement :
[ ] Docker et docker-compose installés
[ ] Fichier .env créé et configuré
[ ] POSTGRES_PASSWORD changé (si Wiki.js avec Docker)
[ ] Ports 8080 et 3000 disponibles (ou modifiés)

Déploiement :
[ ] docker-compose up -d --build
[ ] Vérifier les logs : docker-compose logs -f
[ ] Vérifier le statut : docker-compose ps
[ ] Tous les conteneurs sont "Up"

Configuration :
[ ] Ouvrir http://localhost:8080
[ ] Se connecter (admin@example.com / admin123)
[ ] Changer le mot de passe admin
[ ] Configurer Wiki.js (Paramètres → Paramètres Wiki.js)
[ ] Tester la connexion (badge vert ✅)
[ ] Migrer les données (optionnel)

Sécurité :
[ ] HTTPS activé (Traefik ou reverse proxy)
[ ] Mots de passe changés
[ ] Backups configurés (cron)
[ ] Monitoring en place (optionnel)

Production :
[ ] Tester navigation, recherche, filtres
[ ] Tester assistant IA (si configuré)
[ ] Vérifier les logs (pas d'erreurs)
[ ] Documenter l'installation
[ ] Former les utilisateurs
```

---

## 🎉 C'est Prêt !

**Ton Portail Documentaire tourne maintenant en Docker ! 🐳**

### URLs

- **Portail** : `http://localhost:8080`
- **Wiki.js** : `http://localhost:3000` (si activé)

### Prochaines étapes

1. Configure un reverse proxy avec HTTPS (Traefik recommandé)
2. Configure les backups automatiques
3. Ajoute du monitoring (optionnel)
4. Invite tes utilisateurs !

---

*Guide Docker - Version 1.0.0*
