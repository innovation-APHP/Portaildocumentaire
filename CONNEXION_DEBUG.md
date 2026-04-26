# 🔍 Dépannage Connexion - Guide de Debug

## Problème : "Identifiants invalides"

Si vous voyez cette erreur malgré l'utilisation des bons identifiants, suivez ce guide.

---

## ✅ Étape 1 : Vérifier le Mode

Sur la page de connexion, regardez en bas de page :

```
🔍 Mode détecté: MOCK
VITE_API_URL: "(vide)"
```

**Mode MOCK attendu :** `MOCK` et `VITE_API_URL: "(vide)"`

Si vous voyez `Mode détecté: API`, le fichier `.env.local` n'est pas pris en compte.

---

## ✅ Étape 2 : Vérifier le Fichier .env.local

Le fichier `.env.local` doit exister à la racine du projet :

```bash
# Vérifier si le fichier existe
ls -la .env.local

# Afficher le contenu
cat .env.local
```

**Contenu attendu :**
```bash
VITE_API_URL=
```

La ligne `VITE_API_URL=` doit être **vide** (pas d'espace après le `=`).

---

## ✅ Étape 3 : Ouvrir la Console Navigateur

1. Appuyez sur **F12** pour ouvrir la console
2. Rafraîchissez la page (**Ctrl+R** ou **Cmd+R**)
3. Cherchez ces messages :

```
🔧 API Client Mode: MOCK (Données de démo)
```

Lors de la tentative de connexion, vous devriez voir :

```
🔐 Tentative de connexion en mode MOCK
📝 Username fourni: admin
📝 Password fourni: ***123
👥 Utilisateurs disponibles: ["admin", "editor", "user"]
✅ Connexion réussie: admin - admin
```

---

## ❌ Erreurs Courantes

### Erreur 1 : Mode API au lieu de MOCK

**Symptôme :**
```
🔧 API Client Mode: API (http://localhost:3001/api)
```

**Cause :** Le fichier `.env.local` n'existe pas ou `VITE_API_URL` n'est pas vide.

**Solution :**
1. Créer `.env.local` à la racine du projet
2. Ajouter `VITE_API_URL=` (ligne vide)
3. Rafraîchir complètement la page (**Ctrl+Shift+R**)

### Erreur 2 : Username ou Password incorrect

**Symptôme dans la console :**
```
❌ Aucun utilisateur trouvé avec ces identifiants
🔍 Vérification: { usernameMatch: false, passwordMatch: false }
```

**Cause :** Les identifiants saisis ne correspondent pas exactement.

**Solutions :**
1. **Utilisez le bouton "Remplir avec admin"** (le plus simple !)
2. Ou copiez-collez exactement : `admin` et `password123`
3. Attention à la casse : tout en minuscules
4. Pas d'espaces avant ou après

### Erreur 3 : Variables d'environnement non rechargées

**Symptôme :** Le mode affiché est incorrect même après modification de `.env.local`

**Solution :**
1. **Hard refresh** : Ctrl+Shift+R (Windows/Linux) ou Cmd+Shift+R (Mac)
2. Vider le cache navigateur
3. Fermer tous les onglets et rouvrir
4. En dernier recours, redémarrer le serveur de développement

---

## 🎯 Solution Rapide (Recommandée)

1. **Cliquez sur le bouton "Remplir avec admin"**
2. **Cliquez sur "Se connecter"**

C'est tout ! Le bouton pré-remplit automatiquement les bons identifiants.

---

## 📋 Checklist de Vérification

- [ ] Le fichier `.env.local` existe à la racine
- [ ] `VITE_API_URL=` est vide (pas de valeur après le `=`)
- [ ] La page affiche "Mode détecté: MOCK"
- [ ] La console affiche "🔧 API Client Mode: MOCK"
- [ ] J'utilise exactement `admin` et `password123`
- [ ] Pas d'espaces dans les identifiants
- [ ] J'ai fait un hard refresh de la page

---

## 🔬 Tests Manuels

### Test 1 : Vérifier les Variables d'Environnement

Ouvrez la console et tapez :

```javascript
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Mode MOCK:', !import.meta.env.VITE_API_URL);
```

**Résultat attendu :**
```
VITE_API_URL: undefined
Mode MOCK: true
```

### Test 2 : Vérifier localStorage

Nettoyez le localStorage avant de tester :

```javascript
localStorage.clear();
```

Puis rechargez la page et tentez de vous connecter.

### Test 3 : Tester manuellement la fonction login

Dans la console, après avoir ouvert la page de connexion :

```javascript
// Simuler la logique de connexion
const mockUsers = [
  { username: 'admin', password: 'password123', id: '1', role: 'admin' },
];

const testUser = 'admin';
const testPass = 'password123';

const found = mockUsers.find(u => u.username === testUser && u.password === testPass);
console.log('Utilisateur trouvé:', found);
```

**Résultat attendu :** Vous devriez voir l'objet utilisateur.

---

## 🆘 Dernier Recours

Si rien ne fonctionne :

### Option 1 : Forcer le Mode Mock dans le Code

Éditez temporairement `src/app/services/apiClient.ts` :

```typescript
// Ligne 2 - Forcer le mode mock
const USE_MOCK_DATA = true; // Forcé à true temporairement
```

### Option 2 : Vérifier les Fichiers Générés

Vérifiez que le build ne contient pas d'anciennes valeurs :

```bash
# Nettoyer le build
rm -rf dist/
rm -rf node_modules/.vite/

# Redémarrer
pnpm install
# Redémarrer le serveur dev
```

### Option 3 : Utiliser un Autre Navigateur

Testez dans un navigateur en navigation privée pour éliminer les problèmes de cache.

---

## 📞 Support

Si le problème persiste après toutes ces étapes :

1. **Copiez les logs de la console** (F12 > Console > Clic droit > Save as...)
2. **Faites une capture d'écran** de la page de connexion avec la section debug
3. **Notez** la valeur affichée dans "Mode détecté:" et "VITE_API_URL:"

---

## 🎉 Une Fois Connecté

Après connexion réussie, vous devriez :

1. Être redirigé vers la page d'accueil (`/`)
2. Voir votre nom d'utilisateur dans le menu
3. Pouvoir accéder aux différentes pages

**Identifiants valides :**
- `admin` / `password123` → Accès complet (admin)
- `editor` / `password123` → Édition (editor)
- `user` / `password123` → Lecture seule (user)
