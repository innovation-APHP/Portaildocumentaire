# 🔷 Gestion des Applications - Guide Administrateur

## 📖 Vue d'ensemble

L'onglet **Applications** dans l'interface d'administration permet de **gérer** les applications associées aux documents. Les applications représentent les différents systèmes ou modules de votre infrastructure.

---

## 🎯 Accès

### Qui peut accéder ?

**Éditeurs et Administrateurs** (rôles `editor` et `admin`)

**Comment y accéder :**
1. Connectez-vous avec un compte éditeur ou admin
2. Menu > **Admin** (icône bouclier 🛡️)
3. Onglet **"Applications"** (icône layers 🔷)

---

## 🔐 Permissions par Rôle

### Éditeur (Editor)
- ✅ Voir toutes les applications
- ✅ Créer de nouvelles applications
- ✅ Modifier des applications existantes
- ❌ Supprimer des applications

### Administrateur (Admin)
- ✅ Toutes les permissions Éditeur
- ✅ **Supprimer** des applications (si aucun document associé)

---

## 📋 Gestion des Applications

### Créer une Application

**Étapes :**
1. Cliquez sur **"Nouvelle application"**
2. Remplissez le formulaire :
   - **Nom** - Nom affiché (ex: "Plateforme E-commerce")
   - **ID** - Identifiant unique en minuscules (ex: "ecommerce", "api-gateway")
   - **Description** - Texte descriptif (optionnel)
   - **Icône** - Choisissez une icône parmi 9 options
   - **Couleur** - Sélectionnez une couleur (10 préréglages)
3. Prévisualisez le résultat
4. Cliquez sur **"Enregistrer"**

**Exemple :**
```
Nom: Plateforme E-commerce
ID: ecommerce
Description: Application de vente en ligne et gestion des commandes
Icône: ShoppingCart
Couleur: Bleu (bg-blue-500)
```

**Restrictions :**
- Le nom doit contenir au moins 2 caractères
- L'ID doit être unique et contenir uniquement :
  - Lettres minuscules (a-z)
  - Chiffres (0-9)
  - Tirets (-)
- L'ID est auto-généré depuis le nom si vous créez une nouvelle application

### Modifier une Application

**Étapes :**
1. Trouvez l'application dans la grille
2. Cliquez sur l'icône **"Modifier"** ✏️
3. Modifiez les champs souhaités (sauf l'ID qui est fixe)
4. Cliquez sur **"Enregistrer"**

**Notes :**
- Vous pouvez modifier : nom, description, icône, couleur
- **L'ID ne peut PAS être modifié** après création
- Les changements sont immédiatement visibles

### Supprimer une Application

**Étapes :**
1. Trouvez l'application dans la grille
2. Cliquez sur l'icône **Corbeille** 🗑️
3. Confirmez la suppression

**⚠️ Restrictions IMPORTANTES :**
- Vous **NE POUVEZ PAS** supprimer une application qui a des documents associés
- Le bouton de suppression est désactivé si `document_count > 0`
- Vous devez d'abord réassigner ou supprimer tous les documents de cette application
- Cette action est **irréversible**

---

## 🎨 Personnalisation

### Icônes Disponibles

9 icônes sont proposées :

| Icône | Nom | Utilisation recommandée |
|-------|-----|------------------------|
| 📁 | Folder | Application générale |
| 🛒 | ShoppingCart | E-commerce |
| 👤 | UserCircle | Portail utilisateur |
| ⚙️ | Settings | Administration |
| 🔄 | Workflow | API, Services |
| 📱 | Smartphone | Application mobile |
| 🗄️ | Database | Base de données |
| 📚 | Layers | Architecture |
| ☁️ | Cloud | Services cloud |

### Couleurs Préréglées

10 couleurs sont proposées :
- 🔵 Bleu `bg-blue-500` (#3B82F6)
- 🟢 Vert `bg-green-500` (#10B981)
- 🟣 Violet `bg-purple-500` (#8B5CF6)
- 🟠 Orange `bg-orange-500` (#F97316)
- 🩷 Rose `bg-pink-500` (#EC4899)
- 🔴 Rouge `bg-red-500` (#EF4444)
- 🩵 Turquoise `bg-teal-500` (#14B8A6)
- 💜 Indigo `bg-indigo-500` (#6366F1)
- 🟡 Jaune `bg-yellow-500` (#EAB308)
- 💙 Cyan `bg-cyan-500` (#06B6D4)

---

## 🔍 Recherche d'Applications

**Champ de recherche** en haut de la grille

**Recherche par :**
- Nom
- ID
- Description

**Exemple :** Tapez "mobile" pour trouver l'application mobile

---

## 💡 Bonnes Pratiques

### Nommage des Applications

✅ **Recommandations :**
- Utilisez des noms **clairs et descriptifs**
- Préférez des noms **complets** plutôt que des acronymes
- Exemples : "Plateforme E-commerce", "API Gateway", "Application Mobile"

❌ **À éviter :**
- Noms trop techniques : "SVC-AUTH-01"
- Acronymes obscurs : "PFRM-EC"
- Noms génériques : "App1", "Système A"

### IDs

✅ **Recommandations :**
- Format : **kebab-case en minuscules**
- Court et mémorable
- Exemples : `ecommerce`, `api-gateway`, `mobile`

❌ **À éviter :**
- IDs trop longs : `platforme-ecommerce-complete-v2`
- Caractères spéciaux ou espaces
- Numéros génériques : `app1`, `app2`

### Organisation

**Nombre d'applications recommandé :** 5-10 applications

**Pourquoi ?**
- Trop peu = difficulté à organiser
- Trop d'applications = confusion pour les utilisateurs
- 5-10 = équilibre idéal pour la navigation

**Critères pour créer une application :**
- Représente un **système distinct** (module, API, interface)
- A une **équipe dédiée** ou des responsables spécifiques
- Contient au moins **10-15 documents**

**Structure recommandée :**
```
1. E-commerce (Plateforme de vente)
2. API Gateway (Services API)
3. Portail Client (Interface utilisateur)
4. Backoffice (Administration interne)
5. Mobile (Applications iOS/Android)
```

---

## 📊 Cas d'Usage

### Cas 1 : Nouvelle Application CRM

**Situation :** Vous déployez un nouveau système CRM

**Action :**
1. Créer une application "CRM Client"
2. ID: `crm`
3. Icône: UserCircle 👤
4. Couleur: Turquoise (bg-teal-500)
5. Description: "Système de gestion de la relation client"

### Cas 2 : Fusion d'Applications

**Situation :** "Portal" et "Mobile" fusionnent en une interface unifiée

**Action :**
1. Créer "Application Unifiée" (ID: `unified`)
2. Réassigner tous les documents "portal" et "mobile" vers "unified"
3. Supprimer les anciennes applications (maintenant vides)

### Cas 3 : Renommage

**Situation :** "API Gateway" devient "Services Backend"

**Action :**
1. Modifier l'application `api`
2. Changer le nom en "Services Backend"
3. Mettre à jour la description
4. **Note:** L'ID reste `api` (non modifiable)

---

## 🐛 Dépannage

### Erreur : "Application ID already exists"

**Cause :** Une application avec cet ID existe déjà

**Solution :**
1. Vérifiez dans la liste des applications
2. Utilisez un autre ID
3. Ou modifiez l'application existante

### Erreur : "Cannot delete application with associated documents"

**Cause :** L'application contient encore des documents

**Solution :**
1. Vérifiez le compteur `X docs` sur la carte d'application
2. Réassignez les documents à une autre application
3. Ou supprimez les documents
4. Puis supprimez l'application

### Le bouton "Supprimer" est désactivé

**Cause :** L'application a des documents associés (`document_count > 0`)

**Solution :**
1. Survolez le compteur de documents
2. Accédez à l'onglet "Documents"
3. Filtrez par cette application
4. Réassignez ou supprimez les documents

### L'ID ne peut pas être modifié

**Cause :** C'est une restriction volontaire pour maintenir la cohérence

**Solution :**
1. Si vous devez vraiment changer l'ID :
   - Créez une nouvelle application avec le nouvel ID
   - Réassignez tous les documents
   - Supprimez l'ancienne application
2. Ou conservez l'ID existant et modifiez seulement le nom

---

## 🔄 Différence : Applications vs Catégories

| Aspect | Applications | Catégories |
|---|---|---|
| **Nature** | Systèmes/Modules techniques | Types de documentation |
| **Exemples** | E-commerce, API, Mobile | Fonctionnel, Technique, Utilisateur |
| **Gestion** | CRUD (éditeurs et admins) | CRUD (éditeurs et admins) |
| **Nombre** | 5-10 | 3-8 |
| **Critère** | "Quel système ?" | "Quel type de doc ?" |
| **Organisation** | Par domaine métier/technique | Par audience/contenu |
| **ID modifiable** | ❌ Non (fixe après création) | ✅ Oui (slug modifiable) |

**Un document a :**
- **1 application** (ex: "API Gateway")
- **1 catégorie** (ex: "Technique")
- **0-n tags** (ex: "REST", "Authentification")

---

## 📈 Statistiques et Monitoring

### Informations Affichées

Pour chaque application :
- **Nom complet**
- **ID technique** (ex: `ecommerce`)
- **Description**
- **Icône colorée**
- **Nombre de documents** associés

### Suivi de l'Utilisation

**Interface :**
- Compteur total en haut : `X application(s) total`
- Compteur par application : `X doc(s)`

---

## 🆘 Support

### Problème Technique

Si vous rencontrez un problème :
1. Vérifiez la console navigateur (F12)
2. Vérifiez les logs backend
3. Consultez cette documentation
4. Contactez le support technique

### Questions Fréquentes

**Q : Puis-je créer une application via l'interface ?**
A : Oui ! Cliquez sur "Nouvelle application" dans l'onglet Applications

**Q : Combien d'applications recommandez-vous ?**
A : Entre 5 et 10 pour un équilibre optimal

**Q : Quelle différence entre application et catégorie ?**
A : Application = système technique (E-commerce, API). Catégorie = type de doc (Fonctionnel, Technique)

**Q : Puis-je supprimer une application avec des documents ?**
A : Non, vous devez d'abord réassigner ou supprimer tous les documents

**Q : Puis-je modifier l'ID d'une application ?**
A : Non, l'ID est fixe après création pour garantir la cohérence des références

**Q : Les couleurs et icônes sont-elles modifiables ?**
A : Oui, vous pouvez les modifier à tout moment via "Modifier"

---

## 🔐 Sécurité et Validation

### Validations Backend

**Création :**
- ID : 2-50 caractères, format `^[a-z0-9-]+$`, requis, unique
- Nom : 2-100 caractères, requis
- Couleur : Format `bg-[color]-[shade]` (optionnel)
- Icône : Max 50 caractères (optionnel)
- Description : Texte libre (optionnel)

**Modification :**
- Tous les champs modifiables sauf l'ID
- Validations identiques

**Suppression :**
- Vérification automatique des documents associés
- Blocage si `document_count > 0`

### Logs et Audit

**Actions loguées (côté serveur) :**
- Création d'application (avec utilisateur, timestamp)
- Modification d'application
- Tentative de suppression
- Suppression réussie

---

**Vous êtes maintenant prêt à gérer les applications de votre portail ! 🔷✨**
