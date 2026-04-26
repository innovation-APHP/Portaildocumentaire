# 🔧 Configuration via l'Interface - Guide Utilisateur

## 📖 Vue d'ensemble

Vous pouvez maintenant **configurer les URLs de connexion directement depuis l'interface** dans l'onglet **Paramètres**, sans avoir à modifier les fichiers `.env` !

---

## 🎯 Accéder aux Paramètres

1. **Connectez-vous** au portail
2. Cliquez sur **"Paramètres"** dans le menu de navigation (icône engrenage)
3. Cherchez la section **"Configuration des Connexions"**

---

## ⚙️ Paramètres Configurables

### 1. URL de l'API Backend (PostgreSQL)

**Qu'est-ce que c'est ?**
- L'URL de votre serveur backend Node.js/Express qui communique avec PostgreSQL

**Exemples:**
```
http://localhost:3001/api              (Développement local)
https://api.monportail.com/api         (Production)
http://192.168.1.100:3001/api          (Serveur réseau local)
```

**Comment l'utiliser:**
1. Entrez l'URL complète de votre API backend
2. Cliquez sur **"Tester"** pour vérifier la connexion
3. Si le test réussit ✅, cliquez sur **"Sauvegarder et Recharger"**

**Mode Mock:**
- Laissez ce champ **vide** pour utiliser le mode démonstration (sans backend)
- Idéal pour tester l'interface sans avoir de serveur

### 2. URL de l'API RAG (Assistant IA)

**Qu'est-ce que c'est ?**
- L'URL de votre système RAG (Retrieval-Augmented Generation) pour l'assistant IA

**Exemples:**
```
http://localhost:8000                  (Développement local)
https://rag.monentreprise.com          (Production)
http://192.168.1.200:8000              (Serveur RAG réseau)
```

**Comment l'utiliser:**
1. Entrez l'URL de votre API RAG
2. Cliquez sur **"Tester"** pour vérifier la connexion
3. Si le test réussit ✅, sauvegardez

**Désactivation:**
- Laissez ce champ **vide** pour désactiver l'assistant IA
- L'onglet Chat fonctionnera en mode mock avec réponses prédéfinies

### 3. Token d'authentification RAG (optionnel)

**Qu'est-ce que c'est ?**
- Un token Bearer pour s'authentifier auprès de l'API RAG

**Format:**
```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
votre-token-secret-ici
```

**Quand l'utiliser:**
- Seulement si votre API RAG nécessite une authentification
- Si votre RAG est publique ou sans auth, laissez vide

**Sécurité:**
- Le token est stocké dans le localStorage du navigateur (côté client)
- Utilisez uniquement sur des postes de confiance
- Pour la production, considérez une authentification côté serveur

---

## 🚀 Cas d'Usage

### Cas 1 : Développement Local

**Objectif:** Tester l'application avec un backend local

**Configuration:**
```
API Backend: http://localhost:3001/api
API RAG:     http://localhost:8000
Token RAG:   (vide)
```

**Étapes:**
1. Démarrez votre backend : `./START_POSTGRES.sh`
2. Démarrez votre RAG : `python api_rag.py`
3. Configurez les URLs dans Paramètres
4. Testez chaque connexion
5. Sauvegardez

### Cas 2 : Production

**Objectif:** Connecter le portail à des serveurs de production

**Configuration:**
```
API Backend: https://api-docs.monentreprise.com/api
API RAG:     https://rag-api.monentreprise.com
Token RAG:   sk-prod-xxxxxxxxxxxxxxxxxxxx
```

**Étapes:**
1. Obtenez les URLs auprès de votre équipe IT
2. Obtenez le token RAG (si nécessaire)
3. Configurez dans Paramètres
4. Testez les connexions
5. Sauvegardez

### Cas 3 : Mode Démonstration

**Objectif:** Tester l'interface sans aucun backend

**Configuration:**
```
API Backend: (vide)
API RAG:     (vide)
Token RAG:   (vide)
```

**Étapes:**
1. Laissez tous les champs vides
2. L'application fonctionnera en mode mock
3. Utilisez les identifiants : admin / password123

### Cas 4 : Backend Réel + RAG Mock

**Objectif:** Utiliser PostgreSQL mais pas l'assistant IA

**Configuration:**
```
API Backend: http://localhost:3001/api
API RAG:     (vide)
Token RAG:   (vide)
```

**Comportement:**
- Les documents sont sauvegardés dans PostgreSQL
- L'assistant IA répond avec des messages prédéfinis

---

## ✅ Test de Connexion

### Tester l'API Backend

**Bouton "Tester" à côté de l'URL API Backend**

**Ce qui est vérifié :**
- Accessibilité de l'URL
- Endpoint `/health` disponible
- Réponse HTTP 200 OK

**Messages possibles :**
- ✅ "Connexion réussie !" → L'API est accessible
- ❌ "Erreur HTTP 500" → Le serveur a un problème
- ❌ "Impossible de se connecter" → URL incorrecte ou serveur arrêté
- ❌ "CORS error" → Configuration CORS à ajuster côté backend

### Tester l'API RAG

**Bouton "Tester" à côté de l'URL API RAG**

**Ce qui est vérifié :**
- Accessibilité de l'URL RAG
- Endpoint `/health` disponible
- Authentification (si token fourni)

**Messages possibles :**
- ✅ "Connexion RAG réussie !" → L'API RAG est accessible
- ❌ "Token d'authentification invalide" → Vérifiez le token
- ❌ "Impossible de se connecter au RAG" → URL incorrecte ou RAG arrêté

---

## 💾 Sauvegarde et Priorité

### Priorité des Configurations

L'application applique les paramètres dans cet ordre :

1. **Configuration Interface** (localStorage) ← **PRIORITAIRE**
2. Variables d'environnement (.env)
3. Valeurs par défaut (mode mock)

**Exemple :**
```
.env contient :           VITE_API_URL=http://localhost:3001/api
Interface configure :     http://192.168.1.50:3001/api

→ L'application utilisera : http://192.168.1.50:3001/api
```

### Stockage

**Où sont sauvegardés les paramètres ?**
- Dans le **localStorage** du navigateur (clé: `connection_config`)
- Visible dans : DevTools (F12) > Application > Local Storage

**Persistance :**
- ✅ Les paramètres restent même après fermeture du navigateur
- ✅ Valides tant que le localStorage n'est pas vidé
- ❌ Spécifiques à ce navigateur/appareil

**Réinitialisation :**
- Bouton **"Réinitialiser"** pour supprimer la configuration personnalisée
- Retour aux variables d'environnement (.env)

---

## 🔄 Rechargement Automatique

**Après avoir cliqué sur "Sauvegarder et Recharger" :**

1. La configuration est sauvegardée dans localStorage
2. **La page se recharge automatiquement**
3. Les nouveaux paramètres sont appliqués
4. Vous devrez vous reconnecter

**Pourquoi le rechargement ?**
- Les services (apiClient, ragService) sont initialisés au démarrage
- Le rechargement garantit l'utilisation des nouveaux paramètres

---

## 🛡️ Sécurité

### Bonnes Pratiques

1. **Ne partagez pas votre token RAG** publiquement
2. **Utilisez HTTPS** en production (https://)
3. **Tokens temporaires** : Changez régulièrement le token RAG
4. **Poste de confiance** : Configurez uniquement sur des machines sécurisées

### Risques

⚠️ **LocalStorage n'est pas chiffré**
- Tout script JavaScript peut lire le localStorage
- N'utilisez pas de tokens très sensibles
- Privilégiez l'authentification côté serveur pour la production

⚠️ **XSS (Cross-Site Scripting)**
- Si un attaquant injecte du JavaScript, il peut lire vos tokens
- L'application est protégée, mais restez vigilant sur les extensions navigateur

### Recommandations Production

Pour un environnement de production sécurisé :

1. **Utilisez les variables d'environnement** (.env) au lieu de l'interface
2. **Déployez** avec Docker et docker-compose
3. **Authentification centralisée** (OAuth, SAML)
4. **Tokens rotatifs** avec expiration courte
5. **HTTPS obligatoire** pour toutes les communications

---

## 🐛 Dépannage

### Problème : "Impossible de sauvegarder la configuration"

**Cause :** LocalStorage désactivé ou plein

**Solution :**
1. Vérifiez que les cookies/stockage sont autorisés
2. Videz le cache du navigateur
3. Utilisez un autre navigateur

### Problème : Le test de connexion échoue

**Backend API :**
1. Vérifiez que le backend est démarré : `./START_POSTGRES.sh`
2. Testez manuellement : `curl http://localhost:3001/api/health`
3. Vérifiez l'URL (doit finir par `/api`)
4. Vérifiez CORS dans `server/src/index.ts`

**RAG API :**
1. Vérifiez que le RAG est démarré
2. Testez manuellement : `curl http://localhost:8000/health`
3. Vérifiez le token si l'API nécessite une auth
4. Vérifiez CORS côté RAG

### Problème : La configuration ne s'applique pas

**Solutions :**
1. **Hard refresh** : Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
2. **Vider le cache** navigateur
3. **Vérifier la console** (F12) pour voir les logs :
   ```
   ⚙️ Configuration personnalisée détectée
   🔧 API Client Mode: API (configuré via Paramètres)
   ```

### Problème : Retour au mode Mock non désiré

**Cause :** L'URL API Backend est vide

**Solution :**
1. Allez dans Paramètres
2. Remplissez l'URL API Backend
3. Testez la connexion
4. Sauvegardez

---

## 📊 Indicateurs Visuels

### Badge "Personnalisé"

Si vous voyez ce badge à côté du titre "Configuration des Connexions" :
- ✅ Une configuration personnalisée est active
- Les paramètres localStorage sont utilisés

### Badge de Mode

**Informations Système :**
- 🟡 Badge jaune "Mock (Démonstration)" → Mode mock actif
- 🟢 Badge vert "API PostgreSQL" → Backend connecté

---

## 🎓 Exemples Concrets

### Exemple 1 : Premier Démarrage

**Situation :** Vous venez d'installer l'application

**Étapes :**
1. Lancez l'application → Mode mock par défaut
2. Connectez-vous : admin / password123
3. Allez dans Paramètres
4. Vous voyez : "Aucune configuration personnalisée"
5. Laissez vide pour tester en mode mock

### Exemple 2 : Connexion au Backend

**Situation :** Vous voulez utiliser PostgreSQL

**Étapes :**
1. Démarrez le backend : `./START_POSTGRES.sh`
2. Attendez que PostgreSQL soit prêt (~10 secondes)
3. Allez dans Paramètres
4. Entrez : `http://localhost:3001/api`
5. Cliquez "Tester" → "Connexion réussie !"
6. Cliquez "Sauvegarder et Recharger"
7. L'application se recharge en mode API

### Exemple 3 : Activation du RAG

**Situation :** Vous avez un serveur RAG local

**Étapes :**
1. Démarrez votre RAG : `python api_rag.py`
2. Le RAG écoute sur `http://localhost:8000`
3. Allez dans Paramètres
4. Entrez URL RAG : `http://localhost:8000`
5. Token RAG : (vide si pas d'auth)
6. Cliquez "Tester" → "Connexion RAG réussie !"
7. Sauvegardez
8. Allez dans Chat → L'assistant IA utilise votre RAG !

---

## 🔗 Liens Utiles

- **Documentation Backend :** `MIGRATION_POSTGRES.md`
- **Documentation RAG :** `ASSISTANT_IA_RAG.md`
- **Guide Rapide RAG :** `ASSISTANT_IA_QUICKSTART.md`
- **Spec API RAG :** `rag-api-swagger.yaml`

---

## ✨ Avantages de la Configuration via Interface

### ✅ Pour les Utilisateurs

- **Aucune modification de fichier** nécessaire
- **Interface graphique** intuitive
- **Test de connexion** intégré
- **Changement rapide** entre environnements

### ✅ Pour les Administrateurs

- **Déploiement simplifié** : un seul build pour tous les environnements
- **Configuration à la volée** sans redéploiement
- **Test facile** de différentes URLs
- **Pas besoin d'accès aux fichiers .env**

### ✅ Pour les Développeurs

- **Variables .env** gardent la priorité basse
- **Override facile** pour tester localement
- **Pas de commit** de configuration sensible

---

**Profitez de votre portail documentaire configuré ! 🎉**
