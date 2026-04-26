# 📁 Gestion des Catégories - Guide Administrateur

## 📖 Vue d'ensemble

L'onglet **Catégories** dans l'interface d'administration permet aux **éditeurs et administrateurs** de gérer les catégories de documents.

---

## 🎯 Accès

### Qui peut accéder ?

**Éditeurs et Administrateurs** (rôles `editor` et `admin`)

**Comment y accéder :**
1. Connectez-vous avec un compte éditeur ou admin
2. Menu > **Admin** (icône bouclier 🛡️)
3. Onglet **"Catégories"** (icône dossier 📁)

---

## 🔐 Permissions par Rôle

### Éditeur (Editor)
- ✅ Voir toutes les catégories
- ✅ Créer de nouvelles catégories
- ✅ Modifier des catégories existantes
- ❌ Supprimer des catégories

### Administrateur (Admin)
- ✅ Toutes les permissions Éditeur
- ✅ **Supprimer** des catégories (si aucun document associé)

---

## 📋 Gestion des Catégories

### Créer une Catégorie

**Étapes :**
1. Cliquez sur **"Nouvelle catégorie"**
2. Remplissez le formulaire :
   - **Nom** - Nom affiché (ex: "Technique", "Guide Utilisateur")
   - **Slug** - Identifiant unique en minuscules (ex: "technical", "user-guide")
   - **Description** - Texte descriptif (optionnel)
   - **Icône** - Choisissez une icône parmi 7 options
   - **Couleur** - Sélectionnez une couleur (10 préréglages + sélecteur personnalisé)
3. Prévisualisez le résultat
4. Cliquez sur **"Enregistrer"**

**Exemple :**
```
Nom: Guide Technique
Slug: technical-guide
Description: Documentation technique pour les développeurs
Icône: Code
Couleur: #3B82F6 (Bleu)
```

**Restrictions :**
- Le nom doit contenir au moins 2 caractères
- Le slug doit être unique et contenir uniquement :
  - Lettres minuscules (a-z)
  - Chiffres (0-9)
  - Tirets (-)
- Le slug est auto-généré depuis le nom si vous créez une nouvelle catégorie

### Modifier une Catégorie

**Étapes :**
1. Trouvez la catégorie dans la grille
2. Cliquez sur l'icône **"Modifier"** ✏️
3. Modifiez les champs souhaités
4. Cliquez sur **"Enregistrer"**

**Notes :**
- Vous pouvez modifier tous les champs (nom, slug, description, icône, couleur)
- Le changement de slug peut affecter les URLs si utilisées dans le routing

### Supprimer une Catégorie

**Étapes :**
1. Trouvez la catégorie dans la grille
2. Cliquez sur l'icône **Corbeille** 🗑️
3. Confirmez la suppression

**⚠️ Restrictions IMPORTANTES :**
- Vous **NE POUVEZ PAS** supprimer une catégorie qui a des documents associés
- Le bouton de suppression est désactivé si `document_count > 0`
- Vous devez d'abord réassigner ou supprimer tous les documents de cette catégorie
- Cette action est **irréversible**

---

## 🎨 Personnalisation

### Icônes Disponibles

7 icônes sont proposées :

| Icône | Nom | Utilisation recommandée |
|-------|-----|------------------------|
| 📁 | Folder | Catégorie générale |
| 📄 | FileText | Documentation fonctionnelle |
| 💻 | Code | Documentation technique |
| 👥 | Users | Guides utilisateurs |
| 📚 | Book | Tutoriels et formations |
| ✨ | Sparkles | Nouveautés, annonces |
| ⚙️ | Settings | Configuration, paramètres |

### Couleurs Préréglées

10 couleurs sont proposées par défaut :
- 🟢 Vert #10B981
- 🔵 Bleu #3B82F6
- 🟡 Jaune/Orange #F59E0B
- 🔴 Rouge #EF4444
- 🟣 Violet #8B5CF6
- 🩷 Rose #EC4899
- 🩵 Cyan #14B8A6
- 🟠 Orange vif #F97316
- 💙 Bleu clair #06B6D4
- 💜 Indigo #6366F1

**+ Sélecteur de couleur personnalisé** pour n'importe quelle couleur hexadécimale

---

## 🔍 Recherche de Catégories

**Champ de recherche** en haut de la grille

**Recherche par :**
- Nom
- Slug
- Description

**Exemple :** Tapez "tech" pour trouver toutes les catégories techniques

---

## 💡 Bonnes Pratiques

### Nommage des Catégories

✅ **Recommandations :**
- Utilisez des noms **clairs et descriptifs**
- Préférez des noms **courts** (2-3 mots max)
- Soyez **cohérent** dans la nomenclature
- Exemple : "Technique", "Fonctionnel", "Guide Utilisateur"

❌ **À éviter :**
- Noms trop longs ou complexes
- Abréviations obscures
- Doublons ou synonymes (ex: "Tech" et "Technique")

### Slugs

✅ **Recommandations :**
- Utilisez des slugs **courts et mémorables**
- Format : `nom-categorie` (kebab-case)
- Exemples : `technical`, `user-guide`, `api-reference`

❌ **À éviter :**
- Slugs trop longs
- Caractères spéciaux ou espaces
- Changements fréquents (impact sur les URLs)

### Organisation

**Nombre de catégories recommandé :** 3-8 catégories

**Pourquoi ?**
- Trop peu = difficulté à organiser
- Trop de catégories = confusion pour les utilisateurs
- 3-8 = équilibre idéal pour la navigation

**Structure recommandée :**
```
1. Fonctionnel (Spécifications, Processus métier)
2. Technique (API, Architecture, Code)
3. Utilisateur (Tutoriels, Guides, FAQ)
4. Référence (Glossaire, Standards)
```

### Couleurs

**Utilisez les couleurs de manière cohérente :**
- 🟢 Vert : Guides pratiques, succès
- 🔵 Bleu : Documentation technique
- 🟡 Jaune : Avertissements, important
- 🔴 Rouge : Critique, sécurité
- 🟣 Violet : Administration, configuration

---

## 📊 Cas d'Usage

### Cas 1 : Nouvelle Catégorie pour API

**Situation :** Vous développez une nouvelle section API dans votre documentation

**Action :**
1. Créer une catégorie "Référence API"
2. Slug: `api-reference`
3. Icône: Code 💻
4. Couleur: Bleu #3B82F6
5. Description: "Documentation complète de l'API REST"

### Cas 2 : Réorganisation des Catégories

**Situation :** Vous voulez fusionner "Guide" et "Tutoriel" en une seule catégorie

**Action :**
1. Créer une nouvelle catégorie "Guides & Tutoriels"
2. Réassigner tous les documents des anciennes catégories
3. Supprimer les anciennes catégories (maintenant vides)

### Cas 3 : Catégorie Temporaire

**Situation :** Lancement d'un nouveau produit avec documentation temporaire

**Action :**
1. Créer "Lancement Produit X"
2. Icône: Sparkles ✨
3. Couleur: Rose #EC4899
4. Après le lancement, migrer vers catégories standards

---

## 🐛 Dépannage

### Erreur : "Category name or slug already exists"

**Cause :** Une catégorie avec ce nom ou slug existe déjà

**Solution :**
1. Vérifiez dans la liste des catégories
2. Utilisez un autre nom ou slug
3. Ou modifiez la catégorie existante

### Erreur : "Cannot delete category with associated documents"

**Cause :** La catégorie contient encore des documents

**Solution :**
1. Vérifiez le compteur `X docs` sur la carte de catégorie
2. Réassignez les documents à une autre catégorie
3. Ou supprimez les documents
4. Puis supprimez la catégorie

### Le bouton "Supprimer" est désactivé

**Cause :** La catégorie a des documents associés (`document_count > 0`)

**Solution :**
1. Survolez le compteur de documents
2. Accédez à l'onglet "Documents"
3. Filtrez par cette catégorie
4. Réassignez ou supprimez les documents

---

## 🔄 Migration depuis Catégories Fixes

### Ancien Système (Hardcodé)

Avant cette fonctionnalité, les catégories étaient fixes :
- `functional` (Fonctionnel)
- `technical` (Technique)
- `user` (Utilisateur)

### Nouveau Système (CRUD)

Les catégories sont maintenant **dynamiques** et stockées en base de données.

**Migration automatique :**
1. Exécutez le script de migration SQL : `server/src/db/migrations/add_categories_table.sql`
2. Les 3 catégories par défaut sont créées automatiquement
3. Les documents existants sont automatiquement liés aux nouvelles catégories

**Commande :**
```bash
cd server
psql -U postgres -d portail_doc -f src/db/migrations/add_categories_table.sql
```

---

## 🛡️ Sécurité et Validation

### Validations Backend

**Création/Modification :**
- Nom : 2-100 caractères, requis
- Slug : 2-100 caractères, format `^[a-z0-9-]+$`, requis, unique
- Couleur : Format hexadécimal `#RRGGBB` (optionnel)
- Icône : Max 50 caractères (optionnel)
- Description : Texte libre (optionnel)

**Suppression :**
- Vérification automatique des documents associés
- Blocage si `document_count > 0`

### Logs et Audit

**Actions loguées (côté serveur) :**
- Création de catégorie (avec utilisateur, timestamp)
- Modification de catégorie
- Tentative de suppression
- Suppression réussie

---

## 📈 Interface Utilisateur

### Grille des Catégories

**Affichage :**
- Grille responsive : 1 colonne (mobile), 2 colonnes (tablette), 3 colonnes (desktop)
- Cartes avec :
  - Icône colorée (12x12, arrondie)
  - Nom de la catégorie
  - Slug (fond gris, police mono)
  - Description (2 lignes max, tronquée)
  - Compteur de documents
  - Boutons Modifier/Supprimer

**Statistiques :**
- Compteur total en haut : `X catégorie(s) total`

### Formulaire d'Édition

**Aperçu en temps réel :**
- Prévisualisation de la carte catégorie
- Mise à jour automatique lors de la saisie

---

## 🆘 Support

### Problème Technique

Si vous rencontrez un problème :
1. Vérifiez la console navigateur (F12)
2. Vérifiez les logs backend
3. Consultez cette documentation
4. Contactez le support technique

### Questions Fréquentes

**Q : Combien de catégories recommandez-vous ?**
A : Entre 3 et 8 catégories pour un équilibre optimal

**Q : Puis-je supprimer une catégorie avec des documents ?**
A : Non, vous devez d'abord réassigner ou supprimer tous les documents

**Q : Le slug peut-il contenir des majuscules ?**
A : Non, uniquement des minuscules, chiffres et tirets

**Q : Puis-je changer le slug d'une catégorie existante ?**
A : Oui, mais attention si le slug est utilisé dans des URLs ou références

**Q : Les couleurs sont-elles obligatoires ?**
A : Non, une couleur par défaut (#3B82F6 - Bleu) est appliquée automatiquement

---

**Vous êtes maintenant prêt à gérer les catégories de votre portail ! 📁✨**
