# 🚀 Commandes npm disponibles

## 📦 Installation

```bash
npm install
# ou
pnpm install
```

---

## 🛠️ Développement

```bash
# Démarrer l'application en mode développement
npm run dev

# L'app sera accessible sur http://localhost:5173
```

---

## 🏗️ Build Production

```bash
# Créer un build optimisé pour la production
npm run build

# Les fichiers seront dans /dist
```

---

## 🔄 Migration Wiki.js

### Migration complète (16 documents)

```bash
npm run migrate -- \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN_HERE
```

### Migration par catégorie

```bash
# Documentation Fonctionnelle uniquement
npm run migrate -- \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN_HERE \
  --category=functional

# Documentation Technique uniquement
npm run migrate -- \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN_HERE \
  --category=technical

# Documentation Utilisateur uniquement
npm run migrate -- \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN_HERE \
  --category=user
```

### Migration par application

```bash
# Application spécifique (app-001 à app-006)
npm run migrate -- \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN_HERE \
  --app=app-002
```

### Mode simulation (dry-run)

```bash
# Tester sans créer de pages
npm run migrate:dry-run -- \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN_HERE
```

---

## 🔧 Script CLI détaillé

### Aide complète

```bash
node scripts/migrate-to-wikijs.js --help
```

### Options disponibles

| Option | Description | Valeurs possibles |
|--------|-------------|-------------------|
| `--url` | URL de Wiki.js | `http://localhost:3000` |
| `--token` | Token d'authentification | Clé API ou JWT |
| `--category` | Filtrer par catégorie | `functional`, `technical`, `user` |
| `--app` | Filtrer par application | `app-001` à `app-006` |
| `--dry-run` | Simuler sans créer | (pas de valeur) |
| `--help` | Afficher l'aide | (pas de valeur) |

---

## 📝 Exemples d'utilisation

### 1. Migration complète en production

```bash
npm run migrate -- \
  --url=https://wiki.monentreprise.com \
  --token=wk_1234567890abcdefghijklmnopqrstuvwxyz
```

### 2. Migrer uniquement la doc technique

```bash
npm run migrate -- \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN \
  --category=technical
```

### 3. Migrer une application spécifique

```bash
# Application "API Gateway" (app-002)
npm run migrate -- \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN \
  --app=app-002
```

### 4. Test avant migration réelle

```bash
npm run migrate:dry-run -- \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN
```

---

## 🎯 Workflow recommandé

### Première fois

```bash
# 1. Installation
npm install

# 2. Démarrage en mode dev
npm run dev

# 3. Tester l'app (avec données de démo)
# Ouvrir http://localhost:5173
# Se connecter : admin@example.com / admin123

# 4. Configurer Wiki.js (quand prêt)
# Via l'interface : Paramètres → Paramètres Wiki.js

# 5. Migrer les données
npm run migrate -- --url=XXX --token=YYY
```

### Développement quotidien

```bash
# Lance l'app en mode dev (avec hot reload)
npm run dev
```

### Déploiement production

```bash
# 1. Build production
npm run build

# 2. (Optionnel) Migrer si nouveau Wiki.js
npm run migrate -- --url=https://wiki.prod.com --token=PROD_TOKEN

# 3. Déployer le dossier /dist
# sur Vercel, Netlify, ou autre hébergeur
```

---

## 🐛 Dépannage

### Erreur : "Command not found"

**Problème :** Node.js n'est pas installé ou pas dans le PATH

**Solution :**
```bash
node --version  # Doit afficher v18+
npm --version   # Doit afficher 9+
```

### Erreur : "Cannot find module"

**Problème :** Dépendances non installées

**Solution :**
```bash
rm -rf node_modules
npm install
```

### Migration échoue

**Problème :** Wiki.js non accessible ou token invalide

**Solution :**
```bash
# Test de connexion
curl http://localhost:3000/graphql

# Vérifier le token dans Wiki.js
# Administration → API Access
```

---

## 📚 Documentation complémentaire

- **MIGRATION_GUIDE.md** - Guide complet de migration
- **QUICK_START_WIKIJS.md** - Démarrage rapide
- **README.md** - Documentation générale
- **CHANGELOG.md** - Historique des versions

---

**Version 1.0.0** - Commandes prêtes à l'emploi ! 🚀
