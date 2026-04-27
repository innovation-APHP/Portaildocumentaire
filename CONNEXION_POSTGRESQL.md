# 🗄️ Configuration de la Connexion PostgreSQL

## 📖 Vue d'ensemble

Ce guide explique comment configurer la connexion PostgreSQL pour votre portail documentaire, soit via l'interface Paramètres, soit via les fichiers de configuration.

---

## 🎯 Deux méthodes de configuration

### Méthode 1 : Interface Paramètres (Recommandé)

**Avantages :**
- ✅ Interface visuelle intuitive
- ✅ Affichage des valeurs par défaut (.env)
- ✅ Sauvegarde dans le navigateur (localStorage)

**Étapes :**
1. Connectez-vous avec un compte admin ou éditeur
2. Menu > **Paramètres** ⚙️
3. Section **"Configuration PostgreSQL"**
4. Remplissez les champs :
   - Hôte PostgreSQL (ex: `localhost`, `192.168.1.50`)
   - Port (défaut: `5432`)
   - Nom de la base de données (ex: `portail_doc`)
   - Utilisateur PostgreSQL (ex: `postgres`)
   - Mot de passe PostgreSQL
5. Cliquez sur **"Sauvegarder et Recharger"**

**⚠️ Important :** Après sauvegarde, vous devez **redémarrer le backend** pour que les changements prennent effet.

### Méthode 2 : Fichiers de configuration (.env)

**Avantages :**
- ✅ Configuration permanente
- ✅ Versionnable (avec .env.example)
- ✅ Pas besoin de redémarrer après chaque modification

**Fichiers concernés :**

#### Frontend (.env.local)
```bash
# Ces variables sont affichées dans l'interface Paramètres
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=portail_doc
VITE_DB_USER=postgres
VITE_DB_PASSWORD=
```

#### Backend (server/.env)
```bash
# Configuration réelle utilisée par le backend
POSTGRES_DB=portail_doc
POSTGRES_USER=postgres
POSTGRES_PASSWORD=votre_mot_de_passe_securise
```

**Note :** Le backend lit les variables `POSTGRES_*` pour se connecter à PostgreSQL.

---

## 🔄 Workflow de configuration

### Configuration initiale

```bash
# 1. Frontend - Créer .env.local
cp .env.example .env.local

# 2. Backend - Créer server/.env
cp server/.env.example server/.env

# 3. Éditer server/.env
nano server/.env

# Modifier :
POSTGRES_DB=portail_doc
POSTGRES_USER=postgres
POSTGRES_PASSWORD=VotreMotDePasse2026!

# 4. Redémarrer le backend
cd server
npm run dev
```

### Modification via l'interface Paramètres

```
1. Paramètres > Configuration PostgreSQL
2. Modifier les valeurs
3. Sauvegarder
4. ⚠️ Exporter vers server/.env (si besoin de persistance)
5. ⚠️ Redémarrer le backend
```

---

## 🗄️ Paramètres PostgreSQL

### Hôte (DB_HOST)

**Exemples :**
- `localhost` - Base de données locale
- `127.0.0.1` - Base de données locale (IP)
- `192.168.1.50` - Base de données sur le réseau local
- `db.monentreprise.com` - Base de données distante
- `postgres-container` - Conteneur Docker

**Port par défaut :** `5432`

### Port (DB_PORT)

**Valeur standard :** `5432`

**Cas particuliers :**
- Docker avec mapping : `5433` (si conflit de port)
- Instance PostgreSQL personnalisée : variable

### Nom de la base de données (DB_NAME)

**Valeur recommandée :** `portail_doc`

**Autres exemples :**
- `documentation_portal`
- `wiki_entreprise`
- `knowledge_base`

### Utilisateur (DB_USER)

**Options :**
- `postgres` - Superutilisateur par défaut
- `portail_user` - Utilisateur dédié (recommandé)
- `app_user` - Utilisateur applicatif

**Recommandation :** Créez un utilisateur dédié avec permissions limitées.

### Mot de passe (DB_PASSWORD)

**⚠️ Sécurité :**
- Minimum 12 caractères
- Mélanger majuscules, minuscules, chiffres et symboles
- Ne JAMAIS committer le mot de passe dans Git
- Utiliser un gestionnaire de secrets en production

**Exemple de mot de passe fort :**
```
P@ssw0rd_P0rt@il_2026!
```

---

## 🔐 Sécurité et Bonnes Pratiques

### 1. Ne pas exposer les credentials

❌ **À éviter :**
```bash
# .env.local (COMMITÉ DANS GIT)
VITE_DB_PASSWORD=password123
```

✅ **Recommandé :**
```bash
# .env.local (IGNORÉ PAR GIT)
VITE_DB_PASSWORD=VotreMotDePasseSecurisé

# .env.example (COMMITÉ DANS GIT)
VITE_DB_PASSWORD=
```

### 2. Utiliser des utilisateurs dédiés

**Créer un utilisateur PostgreSQL dédié :**
```sql
-- Se connecter en tant que postgres
psql -U postgres

-- Créer l'utilisateur
CREATE USER portail_user WITH PASSWORD 'MotDePasseSecurisé2026!';

-- Créer la base de données
CREATE DATABASE portail_doc OWNER portail_user;

-- Accorder les permissions
GRANT ALL PRIVILEGES ON DATABASE portail_doc TO portail_user;
```

### 3. Chiffrement des mots de passe

**Frontend :**
- Les mots de passe sauvegardés dans localStorage sont en clair
- ⚠️ Risque si accès physique à la machine
- Recommandation : Utiliser .env pour les environnements sensibles

**Backend :**
- Les credentials sont lus depuis server/.env
- Fichier protégé par permissions système
- En production : utiliser des variables d'environnement système ou secrets manager

---

## 🔧 Dépannage

### Erreur : "ECONNREFUSED"

**Cause :** PostgreSQL n'est pas accessible

**Solutions :**
1. Vérifiez que PostgreSQL est démarré :
```bash
# Linux/Mac
sudo systemctl status postgresql

# Docker
docker ps | grep postgres
```

2. Vérifiez l'hôte et le port :
```bash
psql -h localhost -p 5432 -U postgres -d portail_doc
```

3. Vérifiez le pare-feu :
```bash
# Autoriser le port 5432
sudo ufw allow 5432/tcp
```

### Erreur : "password authentication failed"

**Cause :** Mot de passe incorrect ou utilisateur inexistant

**Solutions :**
1. Vérifiez les credentials :
```bash
psql -U postgres -d portail_doc
# Entrez le mot de passe manuellement
```

2. Réinitialisez le mot de passe :
```sql
ALTER USER postgres WITH PASSWORD 'NouveauMotDePasse';
```

### Erreur : "database does not exist"

**Cause :** La base de données n'a pas été créée

**Solution :**
```bash
# Créer la base de données
createdb -U postgres portail_doc

# Ou via SQL
psql -U postgres
CREATE DATABASE portail_doc;
```

### La configuration dans Paramètres ne fonctionne pas

**Cause :** Le backend n'a pas été redémarré

**Solution :**
1. Arrêtez le backend (Ctrl+C)
2. Exportez la config de localStorage vers server/.env (manuellement)
3. Redémarrez le backend :
```bash
cd server
npm run dev
```

---

## 🔄 Migration de configuration

### De .env vers Interface Paramètres

```bash
# 1. Notez les valeurs actuelles dans server/.env
cat server/.env | grep POSTGRES

# 2. Ouvrez l'interface Paramètres

# 3. Copiez les valeurs :
# POSTGRES_DB → Nom de la base de données
# POSTGRES_USER → Utilisateur PostgreSQL
# POSTGRES_PASSWORD → Mot de passe PostgreSQL

# 4. Sauvegardez dans l'interface
```

### De Interface Paramètres vers .env

```bash
# 1. Ouvrez DevTools (F12) > Application > Local Storage

# 2. Cherchez la clé "connection_config"

# 3. Copiez les valeurs vers server/.env :
nano server/.env

# 4. Redémarrez le backend
```

---

## 🌐 Configuration réseau

### Base de données locale

```bash
# Frontend (.env.local)
VITE_DB_HOST=localhost
VITE_DB_PORT=5432

# Backend (server/.env)
POSTGRES_DB=portail_doc
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password123
```

### Base de données sur le réseau

```bash
# Frontend (.env.local)
VITE_DB_HOST=192.168.1.50
VITE_DB_PORT=5432

# Backend (server/.env)
POSTGRES_DB=portail_doc
POSTGRES_USER=remote_user
POSTGRES_PASSWORD=RemoteP@ss2026!

# Autoriser les connexions distantes dans PostgreSQL
# Éditer postgresql.conf
listen_addresses = '*'

# Éditer pg_hba.conf
host    all    all    192.168.1.0/24    md5
```

### Docker avec PostgreSQL

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: portail_doc
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: docker_password
    ports:
      - "5432:5432"
```

```bash
# Frontend (.env.local)
VITE_DB_HOST=localhost
VITE_DB_PORT=5432

# Backend (server/.env)
POSTGRES_DB=portail_doc
POSTGRES_USER=postgres
POSTGRES_PASSWORD=docker_password
```

---

## 📊 Vérification de la connexion

### Depuis l'interface Paramètres

1. Configurez les paramètres PostgreSQL
2. ⚠️ Actuellement, il n'y a pas de bouton "Tester" pour PostgreSQL
3. Sauvegardez et redémarrez le backend
4. Vérifiez les logs backend pour confirmer la connexion

### Depuis le terminal

```bash
# Test de connexion basique
psql -h localhost -p 5432 -U postgres -d portail_doc -c "SELECT version();"

# Test avec script Node.js
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'portail_doc',
  user: 'postgres',
  password: 'your_password'
});
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? 'Erreur: ' + err : 'Connexion OK:', res.rows[0]);
  pool.end();
});
"
```

---

## 🚀 Production

### Variables d'environnement système

**Recommandé pour la production :**

```bash
# Ne pas utiliser .env en production
# Utiliser les variables d'environnement système

export POSTGRES_DB=portail_doc_prod
export POSTGRES_USER=portail_prod_user
export POSTGRES_PASSWORD=$(cat /run/secrets/db_password)

# Démarrer le backend
node server/dist/index.js
```

### Secrets Manager

**AWS Secrets Manager :**
```javascript
// server/src/config/database.ts
import { SecretsManager } from 'aws-sdk';

const getDbCredentials = async () => {
  const secrets = new SecretsManager();
  const data = await secrets.getSecretValue({ SecretId: 'prod/postgres' }).promise();
  return JSON.parse(data.SecretString);
};
```

**Docker Secrets :**
```yaml
# docker-compose.yml (Swarm)
version: '3.8'
services:
  app:
    secrets:
      - db_password
secrets:
  db_password:
    external: true
```

---

## 📝 Checklist

### Configuration initiale

- [ ] PostgreSQL installé et démarré
- [ ] Base de données créée (`CREATE DATABASE portail_doc`)
- [ ] Utilisateur créé avec permissions
- [ ] Fichier server/.env configuré
- [ ] Connexion testée avec psql
- [ ] Backend démarré et connecté
- [ ] Frontend configuré (.env.local)

### Vérification

- [ ] Backend affiche "✅ Database connected" au démarrage
- [ ] Aucune erreur de connexion dans les logs
- [ ] Interface Paramètres affiche les bonnes valeurs
- [ ] Mode API (pas Mock) actif
- [ ] Documents chargés depuis PostgreSQL

---

**Votre connexion PostgreSQL est maintenant configurée ! 🗄️✨**
