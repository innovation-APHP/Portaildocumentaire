# 🚀 Guide de Migration vers Wiki.js

Ce guide vous explique comment connecter votre portail à une instance Wiki.js et y migrer les données de démonstration.

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Méthode 1 : Migration via l'interface](#méthode-1--migration-via-linterface-recommandé)
3. [Méthode 2 : Migration via script CLI](#méthode-2--migration-via-script-cli)
4. [Structure des données migrées](#structure-des-données-migrées)
5. [Configuration après migration](#configuration-après-migration)
6. [Dépannage](#dépannage)

---

## ✅ Prérequis

### 1. Instance Wiki.js opérationnelle

Vous devez avoir une instance Wiki.js accessible :
- URL de base : `http://votre-wiki.com` ou `http://localhost:3000`
- Compte administrateur créé
- Accès à l'interface d'administration

### 2. Obtenir un token d'authentification

**Option A : Token JWT (après connexion)**
1. Connectez-vous à Wiki.js via l'interface web
2. Le token JWT sera automatiquement disponible
3. Utilisez ce token dans le portail

**Option B : Clé API (recommandé pour la prod)**
1. Dans Wiki.js, allez dans **Administration** (icône engrenage)
2. Section **API Access** dans le menu latéral
3. Cliquez sur **New API Key**
4. Configurez :
   - **Name** : "Portail Documentaire"
   - **Expiration** : Never (ou selon vos besoins)
   - **Permissions** : Cochez au minimum :
     - ✅ `pages:read`
     - ✅ `pages:write`
     - ✅ `pages:manage`
5. Cliquez sur **Create**
6. **Copiez la clé API immédiatement** (elle ne sera plus affichée)

### 3. Ce que vous allez migrer

Le portail contient **16 documents de démonstration** :
- 📊 5 documents de documentation fonctionnelle
- 🔧 6 documents de documentation technique
- 👥 5 documents de documentation utilisateur
- 6 applications : Gestion Commandes, API, Mobile App, CRM, Analytics, E-commerce

---

## 🎯 Méthode 1 : Migration via l'interface (Recommandé)

### Étape 1 : Configurer Wiki.js

1. **Démarrez le portail**
   ```bash
   npm run dev
   ```

2. **Connectez-vous** avec vos identifiants (email/mot de passe)

3. **Allez dans Paramètres** (icône ⚙️ dans le menu)

4. **Section "Paramètres Wiki.js"**
   - **URL de Wiki.js** : `http://localhost:3000` (ou votre URL)
   - **Token d'authentification** : Collez votre clé API ou token JWT
   - Cliquez sur **Tester** pour vérifier la connexion
   - Le badge doit afficher "Connecté" en vert ✅
   - Cliquez sur **Sauvegarder**

### Étape 2 : Lancer la migration

1. **Toujours dans Paramètres**, section **"Migration de données"**

2. **Choisissez le mode de migration** :

   **A) Migration complète (recommandé)**
   - Migre tous les 16 documents
   - Cliquez sur **"Migrer tous les documents"**

   **B) Par catégorie**
   - Documentation Fonctionnelle (5 docs)
   - Documentation Technique (6 docs)
   - Documentation Utilisateur (5 docs)
   - Sélectionnez la catégorie et cliquez sur **"Migrer"**

   **C) Par application**
   - Sélectionnez une application spécifique
   - Cliquez sur **"Migrer"**

3. **Suivez la progression**
   - Une barre de progression s'affiche en temps réel
   - Chaque document migré est listé avec son statut (✅ succès / ❌ erreur)
   - La migration prend environ **30 secondes** pour tous les documents

4. **Vérification**
   - À la fin, un résumé s'affiche :
     - ✅ Documents créés avec succès
     - ❌ Échecs (avec détails des erreurs)
   - Si tout est vert → **Migration réussie !** 🎉

### Étape 3 : Vérifier dans Wiki.js

1. Ouvrez votre instance Wiki.js dans un navigateur
2. Les documents sont organisés par catégorie :
   ```
   📁 documentation-fonctionnelle/
   📁 documentation-technique/
   📁 documentation-utilisateur/
   ```
3. Dans chaque catégorie, vous trouverez les sous-dossiers par application :
   ```
   📁 documentation-technique/
     📁 api-gateway/
       📄 tech-001
       📄 tech-002
     📁 mobile-app/
       📄 tech-003
   ```

---

## 🖥️ Méthode 2 : Migration via script CLI

Pour une migration plus rapide ou automatisée (CI/CD, cron jobs, etc.)

### Prérequis

```bash
node --version  # Doit être 18+
```

### Utilisation

**1. Migration complète (16 documents)**
```bash
node scripts/migrate-to-wikijs.js \
  --url=http://localhost:3000 \
  --token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**2. Migration par catégorie**
```bash
# Documentation technique uniquement
node scripts/migrate-to-wikijs.js \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN \
  --category=technical

# Catégories disponibles: functional, technical, user
```

**3. Migration par application**
```bash
# Application API Gateway uniquement
node scripts/migrate-to-wikijs.js \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN \
  --app=app-002

# Applications disponibles: app-001 à app-006
```

**4. Mode simulation (dry-run)**
```bash
# Tester sans créer de pages
node scripts/migrate-to-wikijs.js \
  --url=http://localhost:3000 \
  --token=YOUR_TOKEN \
  --dry-run
```

### Exemple de sortie

```
═══════════════════════════════════════════════════════════════
  🚀 Migration vers Wiki.js
═══════════════════════════════════════════════════════════════

📍 URL: http://localhost:3000
🔑 Token: eyJhbGciOiJIUzI1NiIs...

🔌 Test de connexion...
✓ Connexion établie

Migration complète
📊 Documents à migrer: 16

Progression:

[████████████████████████████████████████] 100% - Spécification Gestion...

═══════════════════════════════════════════════════════════════
  📊 Résultats de la migration
═══════════════════════════════════════════════════════════════

✓ Créés avec succès: 16
✗ Échecs: 0

✓ Migration terminée !

═══════════════════════════════════════════════════════════════
```

### Aide du script

```bash
node scripts/migrate-to-wikijs.js --help
```

---

## 📁 Structure des données migrées

### Organisation dans Wiki.js

```
Wiki.js
├── 📁 documentation-fonctionnelle/
│   ├── 📁 gestion-commandes/
│   │   ├── 📄 func-001 - Spécification Gestion Commandes
│   │   └── 📄 func-002 - Processus de Validation
│   ├── 📁 api-gateway/
│   │   └── 📄 func-003 - Règles Métier API
│   ├── 📁 crm/
│   │   └── 📄 func-004 - Spécification Module Client CRM
│   └── 📁 plateforme-e-commerce/
│       └── 📄 func-005 - Flux de Paiement E-commerce
│
├── 📁 documentation-technique/
│   ├── 📁 gestion-commandes/
│   │   └── 📄 tech-001 - Architecture Microservices
│   ├── 📁 api-gateway/
│   │   ├── 📄 tech-002 - API REST Documentation
│   │   └── 📄 tech-003 - Schéma Base de Données API
│   ├── 📁 mobile-app/
│   │   └── 📄 tech-004 - Architecture Mobile Flutter
│   ├── 📁 analytics/
│   │   └── 📄 tech-005 - Pipeline de Données Analytics
│   └── 📁 plateforme-e-commerce/
│       └── 📄 tech-006 - Infrastructure Cloud E-commerce
│
└── 📁 documentation-utilisateur/
    ├── 📁 gestion-commandes/
    │   └── 📄 user-001 - Guide Utilisateur Gestion Commandes
    ├── 📁 api-gateway/
    │   └── 📄 user-002 - Tutoriel Intégration API
    ├── 📁 mobile-app/
    │   └── 📄 user-003 - Guide Installation Mobile
    ├── 📁 crm/
    │   └── 📄 user-004 - FAQ Module CRM
    └── 📁 analytics/
        └── 📄 user-005 - Tutoriel Dashboard Analytics
```

### Métadonnées migrées

Pour chaque document :
- ✅ **Titre** du document
- ✅ **Contenu Markdown** complet
- ✅ **Description**
- ✅ **Tags** (catégorie, application, type)
- ✅ **Langue** (fr)
- ✅ **Statut** (publié)
- ✅ **Éditeur** (markdown)

---

## ⚙️ Configuration après migration

### 1. Charger la config depuis Wiki.js

Après la migration, le portail peut charger sa configuration depuis Wiki.js.

**Créer la page de configuration :**

1. Dans Wiki.js, créez une nouvelle page au path : `/config/app-settings`
2. Copiez le contenu depuis **Paramètres → Configuration de l'application**
3. Cliquez sur **"Éditer dans Wiki.js"**
4. Collez le contenu dans la nouvelle page
5. Sauvegardez

**Le portail rechargera automatiquement cette configuration toutes les 5 minutes.**

### 2. Personnalisation

Modifiez la configuration dans Wiki.js pour :
- Changer les libellés de l'application
- Personnaliser les catégories
- Modifier les textes des pages
- Activer/désactiver des fonctionnalités

**Cache :**
- Configuration mise en cache pendant 5 minutes
- Rechargement automatique en arrière-plan
- Fallback sur cache en cas d'erreur

---

## 🔧 Dépannage

### Erreur : "Impossible de se connecter à Wiki.js"

**Causes possibles :**
- ❌ URL incorrecte
- ❌ Wiki.js non démarré
- ❌ Pare-feu bloquant la connexion
- ❌ CORS non configuré

**Solutions :**
1. Vérifiez que Wiki.js est accessible : `curl http://localhost:3000`
2. Testez l'URL dans un navigateur
3. Vérifiez les logs de Wiki.js
4. Si CORS : configurez Wiki.js pour autoriser votre domaine

### Erreur : "Unauthorized" ou "Invalid token"

**Causes possibles :**
- ❌ Token expiré
- ❌ Token invalide
- ❌ Permissions insuffisantes

**Solutions :**
1. Regénérez une nouvelle clé API dans Wiki.js
2. Vérifiez que la clé a les permissions `pages:write`
3. Si JWT : reconnectez-vous pour obtenir un nouveau token

### Erreur : "Page already exists"

**Causes possibles :**
- ❌ Documents déjà migrés
- ❌ Conflit de path

**Solutions :**
1. Supprimez les pages existantes dans Wiki.js
2. Ou modifiez les IDs dans `/src/app/data/mockDocuments.ts`
3. Relancez la migration

### La barre de progression reste bloquée

**Solutions :**
1. Vérifiez les logs de la console du navigateur (F12)
2. Vérifiez les logs de Wiki.js
3. Rechargez la page et réessayez
4. Utilisez le script CLI comme alternative

### Certains documents échouent

**Vérifications :**
1. Consultez le détail des erreurs dans l'interface
2. Vérifiez que les caractères spéciaux sont supportés
3. Vérifiez les quotas Wiki.js (nombre de pages, taille)
4. Contactez l'admin Wiki.js si problème de permissions

---

## 📊 Statistiques de migration

| Type | Nombre de documents |
|------|---------------------|
| **Total** | 16 documents |
| Documentation Fonctionnelle | 5 documents |
| Documentation Technique | 6 documents |
| Documentation Utilisateur | 5 documents |
| **Applications** | 6 applications |

**Temps estimé :**
- Migration complète : ~30 secondes
- Migration par catégorie : ~10 secondes
- Migration par application : ~5 secondes

---

## ✅ Checklist de migration

- [ ] Instance Wiki.js accessible
- [ ] Clé API créée avec permissions `pages:write`
- [ ] URL et token configurés dans le portail
- [ ] Test de connexion réussi (badge vert)
- [ ] Migration lancée (complète ou sélective)
- [ ] Vérification dans Wiki.js (pages créées)
- [ ] Configuration chargée depuis Wiki.js
- [ ] Personnalisation de la config (optionnel)

---

## 🎉 Félicitations !

Votre portail est maintenant connecté à Wiki.js et vos documents sont migrés !

**Prochaines étapes :**
1. Explorez les documents dans Wiki.js
2. Personnalisez la configuration
3. Ajoutez vos propres documents
4. Configurez l'API RAG pour l'assistant IA (optionnel)

---

**Besoin d'aide ?**
- Consultez la [documentation Wiki.js](https://docs.requarks.io/)
- Voir `/README.md` pour plus d'informations sur le portail
- Voir `/CHANGELOG.md` pour l'historique des versions

---

*Guide de migration - Version 1.0.0*
