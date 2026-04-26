# 🔧 Fix Mode Mock - Connexion

## Problème Résolu

**Erreur:** "Login failed: Error: Identifiants invalides"

## Cause

L'application n'était pas clairement en mode mock, ou les identifiants entrés ne correspondaient pas exactement aux valeurs attendues.

## Solutions Appliquées

### 1. Fichier `.env.local` créé

Nouveau fichier avec configuration explicite du mode mock :

```bash
# .env.local
VITE_API_URL=
```

Lorsque `VITE_API_URL` est vide, l'application utilise automatiquement le **mode mock** avec données de démonstration.

### 2. Console de débogage

Le client API affiche maintenant au démarrage :

```
🔧 API Client Mode: MOCK (Données de démo)
```

ou

```
🔧 API Client Mode: API (http://localhost:3001/api)
```

### 3. Interface de connexion améliorée

**Indicateur visuel :**
- 🟢 Point vert animé indiquant le mode démonstration
- Message clair : "Mode démonstration - Utilisez les identifiants ci-dessous"

**Bouton rapide :**
- Nouveau bouton "Remplir avec admin" qui pré-remplit automatiquement :
  - Nom d'utilisateur : `admin`
  - Mot de passe : `password123`

**Instructions claires :**
```
💡 Comptes de démonstration (Mode Mock)

Utilisez exactement ces identifiants :

• Nom d'utilisateur: admin | Mot de passe: password123
• Nom d'utilisateur: editor | Mot de passe: password123
• Nom d'utilisateur: user | Mot de passe: password123
```

### 4. Meilleure gestion des erreurs

L'AuthContext re-lance maintenant l'erreur originale au lieu d'un message générique, permettant un meilleur débogage.

---

## 🎯 Comment Se Connecter

### Méthode 1 : Bouton Rapide (Recommandé)

1. Ouvrir la page de connexion
2. Cliquer sur **"Remplir avec admin"**
3. Cliquer sur **"Se connecter"**

### Méthode 2 : Saisie Manuelle

1. **Nom d'utilisateur :** Taper exactement `admin` (en minuscules)
2. **Mot de passe :** Taper exactement `password123`
3. Cliquer sur **"Se connecter"**

⚠️ **ATTENTION :** Les identifiants sont sensibles à la casse !

---

## 🔍 Vérification du Mode

### Dans la Console Navigateur

Ouvrir la console (F12) et chercher :

```
🔧 API Client Mode: MOCK (Données de démo)
```

Si vous voyez ce message, vous êtes en mode mock.

### Sur la Page de Connexion

Rechercher le point vert animé 🟢 et le message "Mode démonstration".

---

## 📋 Identifiants de Démonstration

| Utilisateur | Nom d'utilisateur | Mot de passe | Rôle    | Permissions         |
|-------------|-------------------|--------------|---------|---------------------|
| Admin       | `admin`           | `password123`| admin   | Toutes              |
| Éditeur     | `editor`          | `password123`| editor  | Créer/Modifier docs |
| Utilisateur | `user`            | `password123`| user    | Lecture seule       |

---

## 🐛 Dépannage

### L'erreur persiste

1. **Vérifier le mode :**
   - Ouvrir la console (F12)
   - Chercher "🔧 API Client Mode"
   - Doit afficher "MOCK"

2. **Vider le cache :**
   ```
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

3. **Vérifier les identifiants :**
   - Utiliser le bouton "Remplir avec admin"
   - Ou copier-coller : `admin` et `password123`

4. **Vérifier localStorage :**
   - F12 > Application > Local Storage
   - Supprimer `auth_token` et `auth_user` si présents
   - Rafraîchir la page

### Mode API au lieu de Mock

Si vous voyez "API (http://localhost:3001/api)" :

1. Vérifier `.env.local` :
   ```bash
   cat .env.local
   # Doit contenir : VITE_API_URL=
   ```

2. Reconstruire l'application :
   ```bash
   # Dans Figma Make, cela se fait automatiquement
   # Sinon : pnpm build
   ```

---

## ✅ Test Rapide

```bash
# 1. Ouvrir l'application
# 2. Page de connexion doit afficher 🟢 et "Mode démonstration"
# 3. Cliquer "Remplir avec admin"
# 4. Cliquer "Se connecter"
# 5. ✅ Vous êtes connecté !
```

---

## 📂 Fichiers Modifiés

1. **`.env.local`** (nouveau)
   - Configuration mode mock explicite

2. **`src/app/services/apiClient.ts`**
   - Ajout console.log pour indiquer le mode

3. **`src/app/contexts/AuthContext.tsx`**
   - Meilleure propagation des erreurs

4. **`src/app/pages/Login.tsx`**
   - Indicateur visuel mode mock
   - Bouton "Remplir avec admin"
   - Instructions améliorées

---

## 🎉 Résultat

La connexion est maintenant **simple et évidente** en mode mock :

- ✅ Mode clairement indiqué
- ✅ Bouton de remplissage automatique
- ✅ Instructions détaillées
- ✅ Messages d'erreur clairs
- ✅ Console de débogage

**Vous ne devriez plus avoir d'erreur de connexion !**
