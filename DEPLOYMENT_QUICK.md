# ⚡ Déploiement Express (5 Minutes)

## 🎯 Le Plus Simple et Rapide

Tu veux juste que ça marche ? Voici la méthode **la plus rapide** (vraiment 5 minutes).

---

## Option 1 : Vercel (ULTRA RAPIDE - Recommandé)

### Prérequis
- ✅ Un compte GitHub
- ✅ Un compte Vercel (gratuit : vercel.com)

### Étapes (5 minutes chrono)

**1. Push ton code sur GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ton-username/portail-docs.git
git push -u origin main
```

**2. Déploie sur Vercel**
1. Va sur [vercel.com](https://vercel.com)
2. Clique **"Import Project"**
3. Sélectionne ton repo GitHub
4. **Deploy** (tout est automatique)
5. ✅ **C'est en ligne !** → `https://portail-docs.vercel.app`

**3. Configure Wiki.js (dans l'app)**
1. Ouvre `https://portail-docs.vercel.app`
2. Connecte-toi : `admin@example.com` / `admin123`
3. **Paramètres** ⚙️ → **Paramètres Wiki.js**
4. Entre :
   - **URL** : `https://ton-wiki.com`
   - **Token** : Ta clé API Wiki.js
5. **Tester** → **Sauvegarder**

**4. Migre les données (1 clic)**
1. **Paramètres** → **Migration de données**
2. Clique **"Migrer tous les documents"**
3. Attends 30 secondes
4. ✅ **TERMINÉ !**

### ✅ Résultat
- 🌐 App en ligne : `https://portail-docs.vercel.app`
- 🔒 HTTPS automatique
- 🚀 CDN mondial gratuit
- ♻️ Redéploiement auto à chaque push

---

## Option 2 : VPS avec Nginx (10 minutes)

### Prérequis
- ✅ Un serveur Linux (Ubuntu/Debian)
- ✅ Accès SSH root
- ✅ Wiki.js déjà installé sur ce serveur

### Script Auto (copie-colle)

```bash
#!/bin/bash
# Déploiement automatique du Portail Documentaire

# 1. Installe Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# 2. Clone et build
cd /var/www
sudo git clone https://github.com/ton-username/portail-docs.git
cd portail-docs
sudo npm install
sudo npm run build

# 3. Configure Nginx
sudo tee /etc/nginx/sites-available/portail-docs > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    root /var/www/portail-docs/dist;
    index index.html;
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/portail-docs /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Portail déployé sur http://$(hostname -I | awk '{print $1}')"
```

**Sauvegarde ce script dans `deploy.sh` et lance :**

```bash
chmod +x deploy.sh
./deploy.sh
```

### Configure dans l'app

1. Ouvre `http://IP-de-ton-serveur`
2. Connecte-toi : `admin@example.com` / `admin123`
3. **Paramètres** → Configure Wiki.js
   - **URL** : `http://localhost:3000` (si Wiki.js sur le même serveur)
   - **Token** : Ta clé API
4. **Paramètres** → **Migre les données** (1 clic)

### ✅ C'est fait !

---

## Option 3 : Docker (Une commande)

### Prérequis
- ✅ Docker installé

### Commande magique

```bash
# Clone
git clone <ton-repo> portail-docs
cd portail-docs

# Crée le Dockerfile (copie-colle tout)
cat > Dockerfile <<'EOF'
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    location / { try_files $uri $uri/ /index.html; } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
EOF

# Build et lance
docker build -t portail-docs .
docker run -d -p 8080:80 --name portail-docs portail-docs

# ✅ Disponible sur http://localhost:8080
```

### Configure Wiki.js (dans l'app)

Même chose que les options précédentes.

---

## 📋 Checklist Minimale

```
Choisis ta méthode :

[ ] Option 1 : Vercel (5 min, HTTPS auto, gratuit) ⭐ RECOMMANDÉ
[ ] Option 2 : VPS/Nginx (10 min, contrôle total)
[ ] Option 3 : Docker (5 min, portable)

Puis dans l'app :

[ ] Ouvre l'URL de ton portail
[ ] Connecte-toi (admin@example.com / admin123)
[ ] Paramètres → Configure Wiki.js (URL + Token)
[ ] Paramètres → Migre les données (1 clic)
[ ] ✅ TERMINÉ ! Teste tout

Change le mot de passe admin :
[ ] Paramètres → Compte → Change le mot de passe
```

---

## 🔑 Obtenir le Token Wiki.js (Rappel)

```
1. Ouvre Wiki.js → Administration (⚙️)
2. Menu "API Access"
3. "New API Key"
4. Configure :
   - Name: "Portail Documentaire"
   - Permissions: pages:read, pages:write, pages:manage
5. Crée et COPIE le token (ne sera plus affiché)
```

---

## 🚨 Problèmes Courants

### "Cannot connect to Wiki.js"

```bash
# Vérifie que Wiki.js répond
curl http://ton-wiki.com/graphql

# Si ça marche pas :
# - Vérifie l'URL (avec ou sans /graphql à la fin ?)
# - Vérifie le firewall
# - Si serveurs différents : configure CORS dans Wiki.js
```

### "Unauthorized"

```
→ Regénère une nouvelle clé API dans Wiki.js
→ Vérifie les permissions (pages:write requis)
```

### Nginx : 404 sur les routes

```nginx
# Ajoute dans nginx config :
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 🎉 C'est Tout !

**Voilà, ton portail est en ligne !**

Selon ta méthode :
- **Vercel** : `https://portail-docs.vercel.app`
- **VPS** : `http://ton-serveur-ip`
- **Docker** : `http://localhost:8080`

**Prochaine étape :**
- Configure Wiki.js dans l'app (2 minutes)
- Migre les données (30 secondes)
- Invite tes utilisateurs !

---

## 📚 Documentation Complète

Pour plus de détails : **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

*Déploiement Express - Version 1.0.0 🚀*
