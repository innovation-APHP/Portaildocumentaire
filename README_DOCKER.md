# 🐳 Déploiement Docker - Portail Documentaire Wiki.js

> **Version** : 1.0.0  
> **Date** : 30 Mars 2026  
> **Statut** : ✅ Prêt à déployer

## 🚀 Démarrage rapide (3 commandes)

```bash
# 1. Corrige les fichiers Docker (si nécessaire)
bash fix-docker-files.sh

# 2. Configure l'environnement
cp .env.docker .env
nano .env  # Change le mot de passe PostgreSQL !

# 3. Lance Docker
docker-compose up -d --build
```

**Accès** :
- 🌐 Portail : http://localhost:8080
- 📚 Wiki.js : http://localhost:3000

---

## 📋 Prérequis

- ✅ Docker 20.10+
- ✅ Docker Compose 2.0+
- ✅ Ports disponibles : 8080, 3000, 5432

---

## 📂 Fichiers Docker disponibles

| Fichier | Description | Statut |
|---------|-------------|--------|
| `Dockerfile` | Image Docker multi-stage | ✅ |
| `docker-compose.yml` | Orchestration complète | ✅ |
| `.env` | Configuration (à créer) | ⚠️ |
| `.env.docker` | Template de configuration | ✅ |
| `.dockerignore` | Optimisation du build | ✅ |
| `docker/nginx.conf` | Configuration Nginx | ✅ |
| `docker/docker-entrypoint.sh` | Script de démarrage | ✅ |

---

## 🛠️ Scripts utiles

### Démarrage automatique

```bash
bash START_DOCKER.sh
```

Ce script :
1. ✅ Vérifie les prérequis
2. ✅ Corrige automatiquement les fichiers Docker
3. ✅ Crée le fichier .env si nécessaire
4. ✅ Lance Docker Compose
5. ✅ Affiche les informations d'accès

### Correction manuelle des fichiers

```bash
bash fix-docker-files.sh
```

Corrige le problème de `Dockerfile` et `VERSION` créés comme répertoires au lieu de fichiers.

---

## ⚙️ Configuration

### Fichier `.env` (obligatoire)

```bash
# Copie le template
cp .env.docker .env

# Édite la configuration
nano .env
```

**Variables importantes** :

```env
# ⚠️ CHANGE CE MOT DE PASSE !
POSTGRES_PASSWORD=ton_mot_de_passe_super_securise

# URL de Wiki.js (si dans Docker Compose)
WIKIJS_URL=http://wikijs:3000

# Ports exposés
PORTAIL_PORT=8080
WIKIJS_PORT=3000
```

---

## 🐳 Commandes Docker

### Lancer le stack complet

```bash
docker-compose up -d --build
```

### Lancer uniquement le Portail

```bash
docker-compose up -d --build portail-docs
```

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f portail-docs
docker-compose logs -f wikijs
```

### Vérifier le statut

```bash
docker-compose ps
```

### Arrêter les conteneurs

```bash
docker-compose stop
```

### Redémarrer les conteneurs

```bash
docker-compose restart
```

### Supprimer les conteneurs

```bash
# Sans supprimer les volumes (données conservées)
docker-compose down

# Avec suppression des volumes (⚠️ perte de données)
docker-compose down -v
```

---

## 🔧 Troubleshooting

### ❌ Dockerfile est un répertoire

**Problème** : `Dockerfile` a été créé comme un répertoire au lieu d'un fichier.

**Solution** :

```bash
bash fix-docker-files.sh
```

Ou manuellement :

```bash
# Sauvegarde le contenu
cp Dockerfile/main.tsx Dockerfile.backup

# Supprime le répertoire
rm -rf Dockerfile VERSION

# Restaure le fichier
mv Dockerfile.backup Dockerfile

# Crée VERSION
echo "1.0.0" > VERSION
```

### ❌ Port already in use

**Problème** : Le port 8080 ou 3000 est déjà utilisé.

**Solution** : Change les ports dans `.env`

```env
PORTAIL_PORT=8081
WIKIJS_PORT=3001
```

Puis redémarre :

```bash
docker-compose down
docker-compose up -d
```

### ❌ Conteneur unhealthy

**Problème** : Le conteneur ne démarre pas correctement.

**Solution** : Vérifie les logs

```bash
docker-compose logs portail-docs
docker-compose restart portail-docs
```

### ❌ Erreur de build

**Problème** : Le build échoue.

**Solution** : Nettoie le cache Docker

```bash
docker-compose build --no-cache portail-docs
docker-compose up -d
```

### ❌ Erreur de connexion à Wiki.js

**Problème** : Le portail ne peut pas se connecter à Wiki.js.

**Solution** : Vérifie la configuration

```bash
# Vérifie que Wiki.js tourne
docker-compose ps wikijs

# Vérifie l'URL dans .env
cat .env | grep WIKIJS_URL
```

---

## 📚 Configuration Wiki.js

1. **Accède à Wiki.js** : http://localhost:3000

2. **Suis l'assistant de configuration** :
   - Base de données : PostgreSQL (pré-configuré)
   - Crée un compte administrateur

3. **Génère un token API** :
   - Va dans `Settings → API`
   - Clique sur `Generate New Key`
   - Copie le token

4. **Configure le Portail** :
   - Va dans http://localhost:8080
   - Clique sur `Paramètres`
   - Entre l'URL et le token Wiki.js
   - Teste la connexion

---

## 🔐 Sécurité Production

⚠️ **Avant de déployer en production** :

1. ✅ Change **tous** les mots de passe dans `.env`
2. ✅ Utilise HTTPS avec un reverse proxy (Nginx, Traefik, Caddy)
3. ✅ Active les limites de ressources (déjà configuré)
4. ✅ Configure des sauvegardes régulières
5. ✅ Active les logs centralisés
6. ✅ Configure un monitoring

### Sauvegardes

```bash
# Backup PostgreSQL
docker exec wikijs-postgres pg_dump -U wikijs wikijs > backup.sql

# Backup volumes
docker run --rm \
  -v wikijs-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/wikijs-data-backup.tar.gz -C /data .
```

### Reverse Proxy (exemple Nginx)

```nginx
server {
    listen 80;
    server_name docs.monentreprise.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name docs.monentreprise.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📊 Architecture Docker

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Compose                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐ │
│  │ Portail Docs   │  │    Wiki.js     │  │  PostgreSQL  │ │
│  │   (Nginx)      │──│   (Node.js)    │──│   (Alpine)   │ │
│  │  Port: 8080    │  │  Port: 3000    │  │  Port: 5432  │ │
│  └────────────────┘  └────────────────┘  └──────────────┘ │
│                                                             │
│  Network: portail-network (172.25.0.0/16)                  │
│                                                             │
│  Volumes:                                                   │
│  • wikijs-data (données Wiki.js)                           │
│  • wikijs-db-data (base PostgreSQL)                        │
│  • ./logs/nginx (logs Nginx)                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📖 Documentation complète

- **DEPLOY_NOW.txt** : Guide de déploiement immédiat
- **DOCKER_START.txt** : Instructions de démarrage
- **DOCKER_DEPLOYMENT.md** : Guide détaillé de déploiement
- **DOCKER_QUICK.md** : Commandes rapides
- **QUICK_START_WIKIJS.md** : Configuration Wiki.js
- **README.md** : Documentation générale

---

## 🎯 Checklist de déploiement

- [ ] Docker et Docker Compose installés
- [ ] Ports 8080, 3000, 5432 disponibles
- [ ] Dockerfile est un **fichier** (pas un répertoire)
- [ ] VERSION est un **fichier** (pas un répertoire)
- [ ] Fichier `.env` créé et configuré
- [ ] Mot de passe PostgreSQL modifié
- [ ] `docker-compose up -d --build` exécuté
- [ ] Conteneurs en status `healthy`
- [ ] Accès au Portail : http://localhost:8080
- [ ] Accès à Wiki.js : http://localhost:3000
- [ ] Wiki.js configuré avec admin
- [ ] Token API Wiki.js généré
- [ ] Portail configuré avec le token
- [ ] Test de connexion réussi

---

## 💬 Support

Pour toute question ou problème :

1. Consulte la section **Troubleshooting** ci-dessus
2. Vérifie les logs : `docker-compose logs -f`
3. Consulte la documentation complète dans les fichiers `.md` et `.txt`

---

**🎉 Tout est prêt ! Lance simplement :**

```bash
bash START_DOCKER.sh
```

ou

```bash
docker-compose up -d --build
```

---

*Dernière mise à jour : 30 Mars 2026*
