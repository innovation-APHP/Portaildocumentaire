┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  🐳 DÉPLOIEMENT DOCKER - PORTAIL DOCUMENTAIRE                      │
│                                                                     │
│  Version 1.0.0 - Configuration Complète                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚡ DÉMARRAGE EXPRESS (3 COMMANDES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  $ cp .env.docker .env
  $ docker-compose up -d --build
  $ # Ouvre http://localhost:8080

  ✅ C'est prêt ! admin@example.com / admin123

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📦 FICHIERS DOCKER CRÉÉS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Dockerfile                    Multi-stage build optimisé
  ✅ docker-compose.yml            Stack complet (Portail + Wiki.js + DB)
  ✅ docker/nginx.conf             Config Nginx production
  ✅ docker/docker-entrypoint.sh   Script d'initialisation
  ✅ .dockerignore                 Optimisation du build
  ✅ .env.docker                   Template d'environnement
  ✅ DOCKER_DEPLOYMENT.md          Guide complet
  ✅ DOCKER_QUICK.md               Guide rapide

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🏗️ ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Docker Compose Stack
  ├─ 🌐 Portail Documentaire (port 8080)
  │   └─ Nginx Alpine + React App (build optimisé ~50 MB)
  │
  ├─ 📚 Wiki.js (port 3000) - OPTIONNEL
  │   └─ Application Wiki.js officielle
  │
  └─ 🗄️ PostgreSQL (interne) - OPTIONNEL
      └─ Base de données pour Wiki.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎯 OPTIONS DE DÉPLOIEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  OPTION A : Portail seul
  ┌───────────────────────────────────────┐
  │  Tu as déjà Wiki.js ailleurs          │
  │                                       │
  │  1. Édite docker-compose.yml          │
  │     (Commente wikijs et wikijs-db)    │
  │                                       │
  │  2. Édite .env                        │
  │     WIKIJS_URL=https://ton-wiki.com   │
  │                                       │
  │  3. docker-compose up -d --build      │
  │                                       │
  │  ✅ Portail seul en Docker            │
  └───────────────────────────────────────┘

  OPTION B : Stack complet
  ┌───────────────────────────────────────┐
  │  Portail + Wiki.js + PostgreSQL       │
  │                                       │
  │  1. Édite .env                        │
  │     Change POSTGRES_PASSWORD !        │
  │                                       │
  │  2. docker-compose up -d --build      │
  │                                       │
  │  3. Configure Wiki.js                 │
  │     http://localhost:3000             │
  │                                       │
  │  4. Configure le Portail              │
  │     http://localhost:8080             │
  │     URL : http://wikijs:3000          │
  │                                       │
  │  ✅ Stack complet prêt !              │
  └───────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚙️ CONFIGURATION (.env)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Copie .env.docker vers .env et édite :

  # URL de Wiki.js
  WIKIJS_URL=http://wikijs:3000  # Si Wiki.js dans Docker Compose
  WIKIJS_URL=https://wiki.com     # Si Wiki.js externe

  # Token Wiki.js (optionnel)
  WIKIJS_TOKEN=

  # PostgreSQL (⚠️ CHANGE LE MOT DE PASSE !)
  POSTGRES_PASSWORD=CHANGE_ME_IN_PRODUCTION

  # Ports
  PORTAIL_PORT=8080
  WIKIJS_PORT=3000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀 COMMANDES ESSENTIELLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  # Démarrer
  docker-compose up -d

  # Démarrer avec rebuild
  docker-compose up -d --build

  # Arrêter
  docker-compose down

  # Voir les logs
  docker-compose logs -f

  # Voir le statut
  docker-compose ps

  # Redémarrer un service
  docker-compose restart portail-docs

  # Entrer dans le conteneur
  docker exec -it portail-documentaire sh

  # Nettoyer tout (⚠️ PERTE DE DONNÉES)
  docker-compose down -v

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ WORKFLOW COMPLET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1️⃣  PRÉPARE L'ENVIRONNEMENT
      $ cp .env.docker .env
      $ nano .env  # Change POSTGRES_PASSWORD !

  2️⃣  LANCE LE STACK
      $ docker-compose up -d --build

  3️⃣  VÉRIFIE LE STATUT
      $ docker-compose ps
      # Tous les conteneurs doivent être "Up"

  4️⃣  CONFIGURE WIKI.JS (si stack complet)
      http://localhost:3000
      • Crée le compte admin
      • Configure la base de données (déjà connectée)
      • Administration → API Access → New API Key
      • Copie le token

  5️⃣  CONFIGURE LE PORTAIL
      http://localhost:8080
      • Connecte-toi : admin@example.com / admin123
      • Change le mot de passe admin
      • Paramètres → Paramètres Wiki.js
        - URL : http://wikijs:3000
        - Token : [le token créé]
      • Teste → Sauvegarde

  6️⃣  MIGRE LES DONNÉES (optionnel)
      • Paramètres → Migration de données
      • "Migrer tous les documents" (1 clic)
      • Attends 30 secondes
      • ✅ 16 documents migrés !

  7️⃣  VÉRIFIE TOUT
      • Navigation, recherche, filtres
      • Assistant IA (si configuré)
      • Logs : docker-compose logs -f

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔒 SÉCURITÉ PRODUCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ⚠️  ACTIONS OBLIGATOIRES :

  [ ] Change POSTGRES_PASSWORD dans .env
  [ ] Change le mot de passe admin du portail
  [ ] Active HTTPS (Traefik ou reverse proxy)
  [ ] Configure les backups automatiques
  [ ] Limite les ressources (déjà configuré)
  [ ] Monitoring (optionnel mais recommandé)

  Reverse Proxy HTTPS avec Traefik (recommandé) :
  → Voir DOCKER_DEPLOYMENT.md section "HTTPS avec Traefik"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📊 CARACTÉRISTIQUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Build :
  • Multi-stage optimisé (Node.js 18 → Nginx Alpine)
  • Taille finale : ~50 MB (vs ~500 MB sans optimisation)
  • Build déterministe avec npm ci
  • Cache intelligent des layers

  Nginx :
  • GZIP compression activée
  • Headers de sécurité (XSS, CSP, etc.)
  • Cache intelligent des assets (1 an pour JS/CSS)
  • Support SPA (React Router)
  • Healthcheck endpoint : /health

  Docker Compose :
  • Réseaux isolés
  • Volumes persistants pour PostgreSQL et Wiki.js
  • Healthchecks automatiques
  • Restart policy : unless-stopped
  • Limites de ressources configurées

  Sécurité :
  • Utilisateur non-root dans le conteneur
  • Secrets supportés (Docker secrets)
  • Permissions minimales
  • Logs séparés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🐛 DÉPANNAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Problème : Port already in use
  → Édite docker-compose.yml, change le port :
    ports:
      - "8081:80"  # Au lieu de 8080

  Problème : Cannot connect to Docker daemon
  → sudo systemctl start docker
  → sudo usermod -aG docker $USER && newgrp docker

  Problème : Conteneur redémarre en boucle
  → docker-compose logs -f portail-docs
  → docker inspect portail-documentaire | grep Health

  Problème : Wiki.js ne se connecte pas à PostgreSQL
  → Attends 1-2 minutes que PostgreSQL soit prêt
  → docker-compose logs wikijs-db
  → Vérifie les credentials dans .env

  Problème : Build échoue
  → docker-compose down -v
  → docker system prune -a
  → docker-compose up -d --build

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  📖 DOCKER_QUICK.md           Guide express (2 min)
  📖 DOCKER_DEPLOYMENT.md      Guide complet (toutes les options)
  📖 README.md                 Documentation générale
  📖 MIGRATION_GUIDE.md        Migration Wiki.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📦 BACKUP ET RESTAURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Backup PostgreSQL :
  $ docker exec wikijs-postgres pg_dump -U wikijs wikijs > backup.sql

  Restaurer :
  $ cat backup.sql | docker exec -i wikijs-postgres psql -U wikijs wikijs

  Backup volumes :
  $ docker run --rm -v wikijs-data:/data -v $(pwd):/backup alpine \
      tar czf /backup/wikijs-data.tar.gz -C /data .

  Voir DOCKER_DEPLOYMENT.md pour scripts automatisés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎉 RÉCAPITULATIF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Configuration Docker COMPLÈTE
  ✅ Multi-stage build OPTIMISÉ (~50 MB)
  ✅ Nginx configuré pour PRODUCTION
  ✅ Stack complet Portail + Wiki.js + PostgreSQL
  ✅ Healthchecks AUTOMATIQUES
  ✅ Sécurité renforcée (non-root, headers, etc.)
  ✅ Documentation complète (2 guides)
  ✅ Prêt pour la PRODUCTION

  POUR DÉMARRER :
  1. cp .env.docker .env
  2. docker-compose up -d --build
  3. http://localhost:8080

  C'EST TOUT ! 🐳🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Version 1.0.0 - Docker Ready ! 🐳
