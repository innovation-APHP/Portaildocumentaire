# 🐳 Docker - Démarrage Express

## ⚡ En 3 Commandes (2 minutes)

```bash
# 1. Copie le fichier d'environnement
cp .env.docker .env

# 2. Lance tout le stack
docker-compose up -d --build

# 3. C'est prêt !
# Ouvre http://localhost:8080
# Connecte-toi : admin@example.com / admin123
```

---

## 📋 Options de Déploiement

### Option A : Portail seul (Tu as déjà Wiki.js ailleurs)

```bash
# 1. Édite docker-compose.yml
# Commente (ou supprime) les services wikijs et wikijs-db

# 2. Édite .env
WIKIJS_URL=https://ton-wiki-existant.com
WIKIJS_TOKEN=ton_token_wiki

# 3. Lance
docker-compose up -d --build
```

### Option B : Stack complet (Portail + Wiki.js + PostgreSQL)

```bash
# 1. Édite .env (IMPORTANT : change POSTGRES_PASSWORD)
nano .env

# 2. Lance tout
docker-compose up -d --build

# Attends 1-2 minutes que tout démarre

# 3. Configure Wiki.js
# Ouvre http://localhost:3000 (première fois)
# Crée le compte admin

# 4. Configure le Portail
# Ouvre http://localhost:8080
# Connecte-toi : admin@example.com / admin123
# Paramètres → Configure Wiki.js :
#   URL : http://wikijs:3000
#   Token : (créé dans Wiki.js)
```

---

## 🔧 Commandes Essentielles

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Rebuilder
docker-compose up -d --build

# Statut
docker-compose ps

# Entrer dans le conteneur
docker exec -it portail-documentaire sh
```

---

## 📦 Fichiers Créés

| Fichier | Description |
|---------|-------------|
| **Dockerfile** | Build multi-stage optimisé |
| **docker-compose.yml** | Orchestration complète |
| **docker/nginx.conf** | Config Nginx production |
| **docker/docker-entrypoint.sh** | Script d'initialisation |
| **.dockerignore** | Optimisation du build |
| **.env.docker** | Template d'environnement |

---

## 🎯 Architecture

```
Docker Compose
├── Portail Documentaire (port 8080)
│   └── Nginx + React App
├── Wiki.js (port 3000)
│   └── Application Wiki.js
└── PostgreSQL (interne)
    └── Base de données Wiki.js
```

---

## ⚙️ Variables d'Environnement (.env)

```bash
# URL Wiki.js
WIKIJS_URL=http://wikijs:3000

# Token Wiki.js (optionnel)
WIKIJS_TOKEN=

# PostgreSQL (CHANGE LE MOT DE PASSE !)
POSTGRES_PASSWORD=CHANGE_ME_IN_PRODUCTION

# Ports
PORTAIL_PORT=8080
WIKIJS_PORT=3000
```

---

## 🐛 Problèmes Courants

### Port déjà utilisé

```bash
# Change le port dans docker-compose.yml
ports:
  - "8081:80"  # Au lieu de 8080
```

### Conteneur redémarre en boucle

```bash
# Voir les logs
docker-compose logs -f portail-docs

# Vérifier le healthcheck
docker ps
```

### Cannot connect to Docker

```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📚 Documentation Complète

**Voir [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)** pour :
- Configuration avancée
- Sécurité production
- HTTPS avec Traefik
- Backups et restauration
- Monitoring
- Dépannage complet

---

## ✅ Checklist Rapide

```
[ ] Docker installé (docker --version)
[ ] .env créé (cp .env.docker .env)
[ ] POSTGRES_PASSWORD changé (dans .env)
[ ] docker-compose up -d --build
[ ] http://localhost:8080 accessible
[ ] Connexion OK (admin@example.com / admin123)
[ ] Mot de passe admin changé
[ ] Wiki.js configuré (si nécessaire)
```

---

## 🎉 C'est Tout !

**Ton portail tourne maintenant en Docker ! 🐳**

- Portail : http://localhost:8080
- Wiki.js : http://localhost:3000

**Pour aller plus loin : [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)**

---

*Docker Express - Version 1.0.0*
