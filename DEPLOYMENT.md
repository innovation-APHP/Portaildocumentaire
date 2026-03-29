# 🚀 Guide de Déploiement Production

## 🎯 Réponse Rapide

**OUI, c'est exactement ça !**

1. ✅ Installe l'app sur un serveur (peut être le même que Wiki.js ou différent)
2. ✅ Configure l'URL de ton Wiki.js
3. ✅ Migre les données (1 clic ou 1 commande)
4. ✅ **C'est prêt !**

---

## 📦 Options de Déploiement

Tu as **3 options principales** :

### Option 1️⃣ : Sur le même serveur que Wiki.js (Simple)
### Option 2️⃣ : Sur un serveur séparé (Recommandé)
### Option 3️⃣ : Sur une plateforme cloud (Vercel/Netlify) (Le plus simple)

---

## 🎯 Option 1 : Même Serveur que Wiki.js

**Avantages :** Pas de CORS, même machine, simple  
**Inconvénients :** Tout sur un seul serveur

### Architecture

```
Serveur Unique (VPS/VM)
├── Wiki.js (Port 3000)
│   └── http://ton-serveur.com:3000
└── Portail Documentaire (Port 5173 ou 80/443)
    └── http://ton-serveur.com:5173
```

### Étapes

```bash
# 1. Connecte-toi à ton serveur
ssh user@ton-serveur.com

# 2. Clone le projet
cd /var/www
git clone <ton-repo> portail-docs
cd portail-docs

# 3. Installe Node.js 18+ (si pas déjà fait)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Installe les dépendances
npm install

# 5. Build pour production
npm run build

# 6. Servir avec nginx ou autre (voir section Nginx ci-dessous)
```

### Configuration Nginx

```nginx
# /etc/nginx/sites-available/portail-docs

server {
    listen 80;
    server_name docs.ton-serveur.com;

    root /var/www/portail-docs/dist;
    index index.html;

    # Gestion du routing React
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Active le site
sudo ln -s /etc/nginx/sites-available/portail-docs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Configuration dans l'app

Une fois déployé :
1. Ouvre `http://docs.ton-serveur.com`
2. Connecte-toi : `admin@example.com` / `admin123`
3. Va dans **Paramètres** ⚙️
4. Configure :
   - **URL Wiki.js** : `http://localhost:3000` (même serveur)
   - **Token** : Ta clé API
5. Teste et sauvegarde
6. Migre les données

---

## 🎯 Option 2 : Serveur Séparé (Recommandé)

**Avantages :** Isolation, scaling indépendant, plus sûr  
**Inconvénients :** Besoin de configurer CORS dans Wiki.js

### Architecture

```
┌─────────────────────────────────────────────┐
│                                             │
│  Serveur 1 - Wiki.js                       │
│  wiki.monentreprise.com                     │
│  Port 3000                                  │
│                                             │
└─────────────────────────────────────────────┘
                    ↑ GraphQL
                    │
┌─────────────────────────────────────────────┐
│                                             │
│  Serveur 2 - Portail Documentaire          │
│  docs.monentreprise.com                     │
│  Port 80/443                                │
│                                             │
└─────────────────────────────────────────────┘
```

### Étapes

**Sur le serveur du Portail :**

```bash
# 1. Connecte-toi
ssh user@serveur-portail.com

# 2. Clone et installe (même que Option 1)
cd /var/www
git clone <ton-repo> portail-docs
cd portail-docs
npm install
npm run build

# 3. Configure nginx (même config que Option 1)
```

**Sur le serveur Wiki.js :**

```bash
# Configure CORS dans Wiki.js
# Édite /path/to/wikijs/config.yml

# Ajoute :
cors:
  origin: 'https://docs.monentreprise.com'
  credentials: true
```

**Dans l'app :**
- **URL Wiki.js** : `https://wiki.monentreprise.com` (URL publique)

---

## 🎯 Option 3 : Plateforme Cloud (Le Plus Simple)

**Avantages :** Zéro config serveur, HTTPS auto, CDN gratuit  
**Inconvénients :** Dépendance à la plateforme

### 🔵 Vercel (Recommandé)

**Installation en 2 minutes :**

```bash
# 1. Installe Vercel CLI
npm i -g vercel

# 2. Dans ton projet
cd portail-docs
vercel

# 3. Suis les instructions
# ✓ Project créé
# ✓ Build automatique
# ✓ Déployé sur : https://portail-docs.vercel.app
```

**Configuration après déploiement :**
1. Va sur `https://portail-docs.vercel.app`
2. Connecte-toi
3. Paramètres → Configure Wiki.js :
   - **URL** : `https://wiki.monentreprise.com` (ton Wiki.js public)
   - **Token** : Ta clé API

**Variables d'environnement (optionnel) :**

Dans Vercel Dashboard :
```
Settings → Environment Variables

VITE_WIKIJS_URL = https://wiki.monentreprise.com
VITE_WIKIJS_TOKEN = wk_xxxxxxxxxxxxx
```

### 🟢 Netlify

```bash
# 1. Installe Netlify CLI
npm i -g netlify-cli

# 2. Build
npm run build

# 3. Déploie
netlify deploy --prod --dir=dist

# ✓ Déployé sur : https://portail-docs.netlify.app
```

**Configuration netlify.toml :**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🔐 Configuration HTTPS (Production)

### Avec Nginx + Let's Encrypt (Gratuit)

```bash
# 1. Installe certbot
sudo apt install certbot python3-certbot-nginx

# 2. Obtiens un certificat
sudo certbot --nginx -d docs.monentreprise.com

# 3. Renouvellement auto (déjà configuré par certbot)
# Le certificat se renouvelle automatiquement
```

**Nginx sera mis à jour automatiquement :**

```nginx
server {
    listen 443 ssl http2;
    server_name docs.monentreprise.com;

    ssl_certificate /etc/letsencrypt/live/docs.monentreprise.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docs.monentreprise.com/privkey.pem;

    # ... reste de la config
}
```

---

## 🐳 Option Bonus : Docker

**Si tu préfères Docker :**

### Dockerfile

```dockerfile
# /Dockerfile

FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf (pour Docker)

```nginx
# /nginx.conf

server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  portail-docs:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### Déploiement

```bash
# Build et lance
docker-compose up -d

# L'app est disponible sur http://ton-serveur:8080
```

---

## ⚙️ Configuration Post-Déploiement

### Étape 1 : Première Connexion

```
URL : https://docs.monentreprise.com
Email : admin@example.com
Mot de passe : admin123
```

**⚠️ IMPORTANT : Change le mot de passe admin immédiatement !**

### Étape 2 : Configuration Wiki.js

Dans **Paramètres** ⚙️ :

```
┌─────────────────────────────────────────────┐
│  Paramètres Wiki.js                         │
├─────────────────────────────────────────────┤
│                                             │
│  URL de Wiki.js                             │
│  https://wiki.monentreprise.com             │
│                                             │
│  Token d'authentification                   │
│  wk_xxxxxxxxxxxxxxxxxxxxxxxxxx              │
│                                             │
│  [ Tester ]  [ Sauvegarder ]                │
│                                             │
│  ✅ Connecté                                │
│                                             │
└─────────────────────────────────────────────┘
```

### Étape 3 : Migration des Données

**Option A : Via l'interface**
```
Paramètres → Migration de données
→ Clic sur "Migrer tous les documents"
→ Attends 30 secondes
→ ✅ 16 documents migrés
```

**Option B : Via SSH (si accès serveur)**
```bash
ssh user@serveur-portail.com
cd /var/www/portail-docs

node scripts/migrate-to-wikijs.js \
  --url=https://wiki.monentreprise.com \
  --token=wk_xxxxxxxxxx
```

### Étape 4 : Vérification

1. Ouvre Wiki.js : `https://wiki.monentreprise.com`
2. Vérifie que les dossiers existent :
   ```
   📁 documentation-fonctionnelle/
   📁 documentation-technique/
   📁 documentation-utilisateur/
   ```
3. Ouvre quelques documents pour vérifier
4. Retourne sur le portail : `https://docs.monentreprise.com`
5. Teste la navigation, recherche, chat

### Étape 5 : Configuration Avancée (Optionnel)

**Créer la page de config dans Wiki.js :**

1. Dans Wiki.js, crée une page : `/config/app-settings`
2. Contenu (JSON) :

```json
{
  "labels": {
    "appName": "Documentation Entreprise",
    "appDescription": "Portail centralisé de documentation",
    "welcomeMessage": "Bienvenue sur notre portail"
  },
  "categories": {
    "functional": {
      "label": "Documentation Fonctionnelle",
      "description": "Spécifications et processus métier"
    },
    "technical": {
      "label": "Documentation Technique",
      "description": "Architecture et API"
    },
    "user": {
      "label": "Documentation Utilisateur",
      "description": "Guides et tutoriels"
    }
  },
  "features": {
    "chatEnabled": true,
    "searchEnabled": true,
    "treeViewEnabled": true,
    "authRequired": true
  }
}
```

3. Le portail rechargera automatiquement cette config toutes les 5 min

---

## 🔒 Sécurité Production

### ⚠️ Actions Obligatoires

```bash
# 1. Change le mot de passe admin par défaut
# Via l'interface : Paramètres → Compte

# 2. Configure un vrai système d'auth (v1.1)
# Pour l'instant, c'est auth locale basique

# 3. Active HTTPS (Let's Encrypt gratuit)
sudo certbot --nginx -d docs.monentreprise.com

# 4. Configure le firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 5. Ne commit JAMAIS les tokens
# Vérifie .gitignore contient .env
```

### Permissions Wiki.js

Dans Wiki.js, la clé API doit avoir :
- ✅ `pages:read`
- ✅ `pages:write`
- ✅ `pages:manage`

---

## 📊 Récapitulatif des URLs

| Service | URL Exemple | Port |
|---------|-------------|------|
| **Wiki.js** | `https://wiki.monentreprise.com` | 3000 |
| **Portail** | `https://docs.monentreprise.com` | 80/443 |
| **API RAG** (optionnel) | `https://rag.monentreprise.com` | 8000 |

---

## ✅ Checklist Complète de Déploiement

### Avant Déploiement
- [ ] Wiki.js installé et accessible
- [ ] Clé API Wiki.js créée
- [ ] Serveur/VPS prêt (ou compte Vercel/Netlify)
- [ ] Nom de domaine configuré (optionnel)

### Déploiement
- [ ] Code cloné sur serveur (ou push sur Vercel)
- [ ] Dépendances installées (`npm install`)
- [ ] Build créé (`npm run build`)
- [ ] Nginx/serveur web configuré
- [ ] HTTPS configuré (Let's Encrypt)

### Post-Déploiement
- [ ] Première connexion réussie
- [ ] Mot de passe admin changé
- [ ] Wiki.js configuré (URL + Token)
- [ ] Test de connexion ✅ (badge vert)
- [ ] Migration lancée (16 documents)
- [ ] Vérification dans Wiki.js (pages créées)
- [ ] Test navigation, recherche, filtres
- [ ] Test assistant IA (si configuré)

### Production
- [ ] HTTPS actif
- [ ] Firewall configuré
- [ ] Backups Wiki.js configurés
- [ ] Monitoring (optionnel)
- [ ] Documentation interne à jour

---

## 🚀 Workflow Complet (Résumé)

```bash
# ═══════════════════════════════════════════════════════════
# SCÉNARIO COMPLET : Déploiement sur VPS avec Nginx
# ═══════════════════════════════════════════════════════════

# 1️⃣ SUR TON SERVEUR
ssh user@mon-serveur.com

# Installe Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx

# Clone le projet
cd /var/www
sudo git clone <ton-repo> portail-docs
cd portail-docs
sudo npm install
sudo npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/portail-docs
# (Copie la config nginx ci-dessus)

sudo ln -s /etc/nginx/sites-available/portail-docs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Active HTTPS
sudo certbot --nginx -d docs.monentreprise.com

# 2️⃣ DANS TON NAVIGATEUR
# Ouvre https://docs.monentreprise.com
# Connecte-toi : admin@example.com / admin123
# Paramètres → Configure Wiki.js
# URL : https://wiki.monentreprise.com
# Token : wk_xxxx
# Teste → Sauvegarde

# 3️⃣ MIGRATION
# Paramètres → Migration → "Migrer tous les documents"
# Attends 30 secondes
# ✅ TERMINÉ !

# 4️⃣ VÉRIFICATION
# Ouvre Wiki.js et vérifie les pages
# Retourne sur le portail et teste tout
```

---

## 🆘 Dépannage

### Erreur : "Failed to connect to Wiki.js"

**Causes :**
- Wiki.js pas accessible depuis le serveur du portail
- URL incorrecte
- CORS non configuré (si serveurs différents)

**Solutions :**
```bash
# Teste depuis le serveur du portail
curl https://wiki.monentreprise.com/graphql

# Si erreur, vérifie :
# - Wiki.js est bien démarré
# - Firewall autorise la connexion
# - CORS configuré dans Wiki.js (si serveurs différents)
```

### Erreur : "Token invalid"

**Solution :**
1. Dans Wiki.js → Administration → API Access
2. Regénère une nouvelle clé API
3. Copie-la dans le portail

### Build échoue

```bash
# Nettoie et réinstalle
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Nginx : 404 sur les routes

**Problème :** React Router n'est pas géré

**Solution :**
```nginx
# Ajoute dans la config nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 📞 Support

Pour plus d'aide :
- **Guide migration** : `MIGRATION_GUIDE.md`
- **Commandes npm** : `NPM_COMMANDS.md`
- **Quick start** : `QUICK_START_WIKIJS.md`

---

## 🎉 Félicitations !

Une fois ces étapes terminées, ton portail est **100% opérationnel en production** ! 🚀

**Tu as maintenant :**
- ✅ Un portail accessible publiquement
- ✅ Connecté à ton Wiki.js
- ✅ 16 documents migrés et accessibles
- ✅ HTTPS sécurisé
- ✅ Prêt à accueillir tes utilisateurs

**Prochaines étapes :**
1. Ajoute tes propres documents dans Wiki.js
2. Configure l'API RAG pour l'assistant IA (optionnel)
3. Personnalise la configuration
4. Invite tes utilisateurs

---

*Guide de Déploiement - Version 1.0.0*
