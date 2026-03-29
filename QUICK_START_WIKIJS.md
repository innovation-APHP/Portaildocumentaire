# 🎯 Résumé : Connexion à Wiki.js

## ✅ Ce qu'il te faut pour utiliser ton Wiki.js

### 1️⃣ **Juste l'URL et le token** ✨

C'est tout ! Pas besoin de configuration complexe :

1. **URL de ton Wiki.js** : `http://localhost:3000` (ou ton URL de prod)
2. **Token d'authentification** : Clé API ou JWT obtenu après connexion

### 2️⃣ **Migration automatique** 🚀

**Tout est déjà prêt !** Aucun script à écrire manuellement.

Tu as **2 méthodes** pour migrer les 16 documents de démo vers ton Wiki.js :

---

## 🖱️ Méthode 1 : Via l'interface (Recommandé)

**La plus simple et visuelle !**

1. Lance l'app : `npm run dev`
2. Connecte-toi : `admin@example.com` / `admin123`
3. Va dans **Paramètres** ⚙️
4. Section **"Paramètres Wiki.js"** :
   - Entre l'URL : `http://localhost:3000`
   - Entre le token
   - Clique sur **Tester** → Badge vert ✅
   - Clique sur **Sauvegarder**
5. Section **"Migration de données"** :
   - Clique sur **"Migrer tous les documents"**
   - Suis la progression en temps réel (30 secondes)
   - C'est fait ! 🎉

**Avantages :**
- ✅ Interface visuelle avec barre de progression
- ✅ Détails de chaque document migré
- ✅ Gestion des erreurs en temps réel
- ✅ Possibilité de migrer par catégorie ou application

---

## 💻 Méthode 2 : Via script CLI (Rapide)

**Pour une migration en une commande !**

```bash
# Migration complète
npm run migrate -- \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN_HERE

# Ou avec node directement
node scripts/migrate-to-wikijs.js \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN_HERE
```

**Options disponibles :**

```bash
# Par catégorie
npm run migrate -- --url=http://localhost:3000 --token=XXX --category=technical

# Par application
npm run migrate -- --url=http://localhost:3000 --token=XXX --app=app-001

# Test sans créer (dry-run)
npm run migrate:dry-run -- --url=http://localhost:3000 --token=XXX

# Aide complète
node scripts/migrate-to-wikijs.js --help
```

**Avantages :**
- ✅ Ultra rapide (une seule commande)
- ✅ Idéal pour automatisation (CI/CD)
- ✅ Affichage coloré dans le terminal
- ✅ Mode dry-run pour tester

---

## 🔑 Comment obtenir le token Wiki.js ?

### Option A : Clé API (Recommandé)

1. Dans Wiki.js → **Administration** (⚙️)
2. **API Access** dans le menu
3. **New API Key**
4. Configure :
   - Name : "Portail Documentaire"
   - Permissions : `pages:read`, `pages:write`, `pages:manage`
   - Expiration : Never
5. **Crée** et **copie la clé** (elle ne sera plus affichée)

### Option B : Token JWT

1. Connecte-toi à Wiki.js
2. Le token JWT est automatiquement généré
3. (Plus complexe à extraire, privilégie la clé API)

---

## 📊 Ce qui sera migré

**16 documents de démonstration** organisés en :

```
📁 documentation-fonctionnelle/     (5 docs)
📁 documentation-technique/         (6 docs)
📁 documentation-utilisateur/       (5 docs)
```

**Répartis dans 6 applications :**
- Gestion Commandes
- API Gateway
- Mobile App
- CRM
- Analytics
- Plateforme E-commerce

**Chaque document contient :**
- Titre complet
- Contenu Markdown
- Description
- Tags (catégorie, application, type)
- Métadonnées (langue, statut)

---

## ⏱️ Temps de migration

| Mode | Nombre de docs | Durée estimée |
|------|----------------|---------------|
| **Complète** | 16 documents | ~30 secondes |
| **Par catégorie** | 5-6 documents | ~10 secondes |
| **Par application** | 2-3 documents | ~5 secondes |

---

## 💡 Mode de fonctionnement

### Sans Wiki.js configuré

L'app fonctionne **immédiatement** avec :
- ✅ 16 documents de démonstration en local
- ✅ Toutes les fonctionnalités (recherche, filtres, chat)
- ✅ Configuration par défaut
- ✅ Aucune erreur en console

### Avec Wiki.js configuré

Tu débloques en plus :
- ✅ Synchronisation avec Wiki.js
- ✅ Migration des données vers Wiki.js
- ✅ Configuration dynamique depuis Wiki.js
- ✅ Possibilité d'éditer dans Wiki.js directement

---

## 🚀 Démarrage Rapide (5 minutes)

```bash
# 1. Installe
npm install

# 2. Lance l'app
npm run dev

# 3. Connecte-toi
# Email: admin@example.com
# Mot de passe: admin123

# 4. (Optionnel) Configure Wiki.js
# Paramètres → Paramètres Wiki.js
# URL + Token → Tester → Sauvegarder

# 5. (Optionnel) Migre les données
# Paramètres → Migration → Migrer tous les documents

# ✅ C'est prêt !
```

---

## 📖 Documentation complète

Pour plus de détails, consulte :

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Guide complet de migration
- **[README.md](./README.md)** - Documentation générale
- **[CHANGELOG.md](./CHANGELOG.md)** - Historique des versions

---

## 🎉 Récapitulatif

✅ **Pas de script à écrire** - Tout est déjà fait !  
✅ **2 méthodes** : Interface ou CLI  
✅ **30 secondes** pour migrer 16 documents  
✅ **Fonctionne sans Wiki.js** (mode démo)  
✅ **Configuration en 2 clics**  

**Il te suffit de :**
1. Avoir une URL Wiki.js accessible
2. Obtenir un token (clé API ou JWT)
3. Choisir ta méthode préférée (UI ou CLI)
4. Lancer la migration

**C'est fait ! 🚀**

---

*Version 1.0.0 - Migration prête à l'emploi*
