# 👥 Gestion des Utilisateurs - Guide Administrateur

## 📖 Vue d'ensemble

L'onglet **Utilisateurs** dans l'interface d'administration permet aux **administrateurs** de gérer les comptes utilisateurs et leurs permissions.

---

## 🎯 Accès

### Qui peut accéder ?

**Uniquement les administrateurs** (rôle `admin`)

**Comment y accéder :**
1. Connectez-vous avec un compte admin
2. Menu > **Admin** (icône bouclier 🛡️)
3. Onglet **"Utilisateurs"** (icône personnes 👥)

---

## 🔐 Rôles et Permissions

### 1. Utilisateur (User)

**Badge:** Gris avec icône ✓

**Permissions:**
- ✅ Consulter la documentation
- ✅ Rechercher dans les documents
- ✅ Utiliser l'assistant IA
- ❌ Créer ou modifier des documents
- ❌ Gérer les tags
- ❌ Accéder à l'administration

**Cas d'usage:** Employés qui ont besoin d'accéder à la documentation

### 2. Éditeur (Editor)

**Badge:** Bleu avec icône ✏️

**Permissions:**
- ✅ Toutes les permissions Utilisateur
- ✅ **Créer** de nouveaux documents
- ✅ **Modifier** des documents existants
- ✅ **Créer et gérer** des tags
- ✅ Uploader des fichiers
- ❌ Supprimer des documents
- ❌ Gérer les utilisateurs
- ❌ Configuration avancée

**Cas d'usage:** Rédacteurs techniques, chefs de projet, documentalistes

### 3. Administrateur (Admin)

**Badge:** Violet avec icône 🛡️

**Permissions:**
- ✅ Toutes les permissions Éditeur
- ✅ **Supprimer** des documents
- ✅ **Créer, modifier, supprimer** des utilisateurs
- ✅ **Gérer les rôles** et permissions
- ✅ **Configuration** complète du portail
- ✅ Accès à toutes les fonctionnalités d'administration

**Cas d'usage:** Administrateurs système, responsables IT

---

## 📋 Gestion des Utilisateurs

### Créer un Utilisateur

**Étapes:**
1. Cliquez sur **"Nouvel utilisateur"**
2. Remplissez le formulaire :
   - **Nom d'utilisateur** (3-50 caractères) - utilisé pour la connexion
   - **Email** - adresse email valide
   - **Rôle** - Utilisateur / Éditeur / Admin
   - **Mot de passe** - minimum 8 caractères
   - **Confirmer le mot de passe**
3. Cliquez sur **"Enregistrer"**

**Exemple:**
```
Nom d'utilisateur: jdupont
Email: jean.dupont@entreprise.com
Rôle: Éditeur
Mot de passe: MotDePasse2026!
```

**Restrictions:**
- Le nom d'utilisateur doit être unique
- L'email doit être unique
- Le mot de passe doit contenir au moins 8 caractères

### Modifier un Utilisateur

**Étapes:**
1. Trouvez l'utilisateur dans la liste
2. Cliquez sur **"Modifier"**
3. Modifiez les champs souhaités :
   - Nom d'utilisateur
   - Email
   - Rôle
   - Mot de passe (optionnel)
4. Cliquez sur **"Enregistrer"**

**Notes:**
- Laisser le champ mot de passe vide conserve le mot de passe actuel
- Vous ne pouvez pas vous retirer vos propres droits admin

### Supprimer un Utilisateur

**Étapes:**
1. Trouvez l'utilisateur dans la liste
2. Cliquez sur l'icône **Corbeille** 🗑️
3. Confirmez la suppression

**Restrictions:**
- Vous ne pouvez pas supprimer votre propre compte
- Cette action est **irréversible**
- Les documents créés par l'utilisateur restent

**⚠️ Attention:** La suppression est définitive !

---

## 🔍 Recherche d'Utilisateurs

**Champ de recherche** en haut de la liste

**Recherche par:**
- Nom d'utilisateur
- Email
- Rôle

**Exemple:** Tapez "edit" pour trouver tous les éditeurs

---

## 💡 Bonnes Pratiques

### Sécurité des Mots de Passe

✅ **Recommandations:**
- Minimum 8 caractères (imposé par le système)
- Mélanger majuscules, minuscules, chiffres et symboles
- Éviter les mots de passe courants (password123, etc.)
- Utiliser un gestionnaire de mots de passe

❌ **À éviter:**
- Mots de passe courts
- Mots du dictionnaire
- Informations personnelles (date de naissance, etc.)

### Gestion des Rôles

**Principe du moindre privilège:**
- Accordez le rôle minimum nécessaire
- Un lecteur occasionnel → **Utilisateur**
- Un rédacteur fréquent → **Éditeur**
- Un responsable IT → **Admin**

**Révision régulière:**
- Vérifiez les permissions tous les 3-6 mois
- Supprimez les comptes inactifs
- Ajustez les rôles selon l'évolution des responsabilités

### Nombre d'Administrateurs

**Recommandation:** 2-3 administrateurs maximum

**Pourquoi ?**
- Trop d'admins = risque de sécurité
- Responsabilité partagée
- Continuité en cas d'absence

---

## 🛡️ Sécurité

### Protection des Comptes Admin

1. **Mots de passe forts** obligatoires
2. **Limitation** du nombre d'admins
3. **Audit régulier** des utilisateurs
4. **Désactivation rapide** des comptes compromis

### Restrictions Système

**Protections intégrées:**
- ❌ Un admin ne peut pas se supprimer lui-même
- ❌ Un admin ne peut pas retirer ses propres droits
- ✅ Validation des données avant enregistrement
- ✅ Mots de passe hashés (bcrypt)
- ✅ Tokens JWT pour l'authentification

---

## 📊 Cas d'Usage

### Cas 1 : Nouvel Employé

**Situation:** Jean Dupont rejoint l'équipe comme rédacteur technique

**Action:**
1. Créer un compte avec rôle **Éditeur**
2. Username: `jdupont`
3. Email: `jean.dupont@entreprise.com`
4. Générer un mot de passe temporaire
5. Communiquer les identifiants de manière sécurisée
6. Demander à Jean de changer son mot de passe dès la première connexion

### Cas 2 : Changement de Rôle

**Situation:** Marie Martin passe de lectrice à rédactrice

**Action:**
1. Rechercher `mmmartin`
2. Cliquer "Modifier"
3. Changer le rôle de **Utilisateur** à **Éditeur**
4. Enregistrer
5. Informer Marie de ses nouvelles permissions

### Cas 3 : Départ d'un Employé

**Situation:** Pierre Durand quitte l'entreprise

**Action:**
1. Rechercher `pdurand`
2. **Supprimer** le compte
3. Vérifier les documents créés par Pierre
4. Réassigner la propriété si nécessaire (via modification manuelle)

### Cas 4 : Promotion Admin

**Situation:** Sophie Lambert devient responsable IT

**Action:**
1. Modifier le compte `slambert`
2. Changer le rôle à **Admin**
3. Informer Sophie de ses nouvelles responsabilités
4. Documenter le changement

---

## 🔄 Workflow Recommandé

### Onboarding (Nouveau Membre)

```
1. Créer le compte utilisateur
   └─> Rôle selon les besoins
2. Générer un mot de passe temporaire fort
3. Envoyer les identifiants de manière sécurisée
   └─> Email chiffré ou système de gestion des secrets
4. Demander un changement de mot de passe à la première connexion
5. Vérifier l'accès avec le nouvel utilisateur
```

### Offboarding (Départ)

```
1. Dès notification du départ
   └─> Planifier la désactivation
2. Le dernier jour
   └─> Supprimer le compte
3. Audit des documents créés
   └─> Vérifier l'intégrité
4. Mise à jour de la documentation
   └─> Si l'utilisateur était référencé
```

---

## 🐛 Dépannage

### Erreur : "Username or email already exists"

**Cause:** Un utilisateur avec ce nom ou email existe déjà

**Solution:**
1. Vérifiez dans la liste des utilisateurs
2. Utilisez un autre nom d'utilisateur
3. Ou utilisez un autre email

### Erreur : "Les mots de passe ne correspondent pas"

**Cause:** Le mot de passe et la confirmation diffèrent

**Solution:**
1. Retapez les deux champs
2. Copiez-collez si nécessaire
3. Vérifiez le CAPS LOCK

### Erreur : "Cannot remove your own admin role"

**Cause:** Vous tentez de vous retirer vos droits admin

**Solution:**
1. Demandez à un autre admin de modifier votre rôle
2. Ou créez un autre admin d'abord

### Erreur : "Cannot delete your own account"

**Cause:** Vous tentez de supprimer votre propre compte

**Solution:**
1. Demandez à un autre admin de supprimer votre compte
2. Ou créez un nouvel admin et supprimez depuis ce compte

---

## 📈 Statistiques et Monitoring

### Informations Affichées

Pour chaque utilisateur, vous voyez :
- **Avatar** (initiale du nom)
- **Nom d'utilisateur**
- **Email**
- **Rôle** (avec badge coloré)
- **Date de création** du compte

### Compteur Total

En haut de la page : **Nombre total d'utilisateurs**

**Utilisation:**
- Suivre la croissance de l'équipe
- Planifier les licences si nécessaire
- Auditer régulièrement

---

## 🔒 Conformité et Audit

### RGPD et Données Personnelles

**Données stockées:**
- Nom d'utilisateur
- Email
- Mot de passe (hashé)
- Rôle
- Dates de création/modification

**Recommandations:**
- Informez les utilisateurs du traitement de leurs données
- Ne collectez que les données nécessaires
- Supprimez les comptes inactifs après période définie
- Documentez les accès et modifications

### Logs et Traçabilité

**Actions loguées (côté serveur):**
- Création d'utilisateur
- Modification de rôle
- Suppression de compte

**Recommandation:** Consultez les logs serveur pour l'audit complet

---

## 📖 API Backend

### Endpoints Utilisés

**Liste des utilisateurs:**
```
GET /api/users
Authorization: Bearer <admin-token>
```

**Créer un utilisateur:**
```
POST /api/users
Authorization: Bearer <admin-token>
Body: { username, email, password, role }
```

**Modifier un utilisateur:**
```
PUT /api/users/:id
Authorization: Bearer <admin-token>
Body: { username?, email?, role?, password? }
```

**Supprimer un utilisateur:**
```
DELETE /api/users/:id
Authorization: Bearer <admin-token>
```

**Restriction:** Tous ces endpoints nécessitent le rôle **admin**

---

## ✅ Checklist Administrateur

### Configuration Initiale

- [ ] Créer au moins 2 comptes admin
- [ ] Tester la création d'un utilisateur test
- [ ] Tester la modification de rôle
- [ ] Vérifier les restrictions (auto-suppression, etc.)
- [ ] Documenter les identifiants admin de manière sécurisée

### Maintenance Régulière (Mensuelle)

- [ ] Revoir la liste des utilisateurs
- [ ] Supprimer les comptes inactifs
- [ ] Vérifier les rôles assignés
- [ ] Auditer les permissions

### Sécurité (Trimestrielle)

- [ ] Demander le changement des mots de passe
- [ ] Vérifier les accès admin
- [ ] Consulter les logs d'activité
- [ ] Mettre à jour la documentation

---

## 🆘 Support

### Problème Technique

Si vous rencontrez un problème :
1. Vérifiez la console navigateur (F12)
2. Vérifiez les logs backend
3. Consultez cette documentation
4. Contactez le support technique

### Questions Fréquentes

**Q : Combien d'admins recommandez-vous ?**
A : 2-3 maximum pour limiter les risques

**Q : Puis-je réinitialiser le mot de passe d'un utilisateur ?**
A : Oui, via "Modifier" > entrez un nouveau mot de passe

**Q : Les utilisateurs peuvent-ils changer leur propre mot de passe ?**
A : Pas dans la version actuelle. Utilisez "Modifier" en tant qu'admin.

**Q : Que se passe-t-il si je supprime un utilisateur qui a créé des documents ?**
A : Les documents restent, mais l'auteur ne sera plus affiché

---

**Vous êtes maintenant prêt à gérer les utilisateurs de votre portail ! 👥✨**
