# 🔧 FIX: Erreur "Identifiants invalides"

## ⚡ Solution Rapide (30 secondes)

### 1. Cliquez sur "Remplir avec admin"

Sur la page de connexion, utilisez le **bouton vert "Remplir avec admin"** qui pré-remplit automatiquement les identifiants.

### 2. Vérifiez le Mode

En bas de la page de connexion, vous devriez voir :

```
🔍 Mode détecté: MOCK
VITE_API_URL: "(vide)"
```

### 3. Ouvrez la Console (F12)

Vous devriez voir :

```
🔧 API Client Mode: MOCK (Données de démo)
```

---

## 🛠️ Si le Problème Persiste

### Le fichier .env.local doit exister

```bash
# Créer ou vérifier le fichier
cat > .env.local << 'EOF'
VITE_API_URL=
VITE_RAG_API_URL=
VITE_RAG_API_TOKEN=
EOF
```

**Important :** `VITE_API_URL=` doit être **VIDE** (rien après le `=`).

### Hard Refresh

Après avoir créé/modifié `.env.local` :

- **Windows/Linux :** Ctrl + Shift + R
- **Mac :** Cmd + Shift + R

---

## ✅ Identifiants Valides (Mode Mock)

Utilisez **EXACTEMENT** ces identifiants :

| Username | Password    | Rôle   |
|----------|-------------|--------|
| admin    | password123 | Admin  |
| editor   | password123 | Éditeur|
| user     | password123 | Utilisateur |

**Attention :**
- ❌ "Admin" (majuscule) → **INVALIDE**
- ✅ "admin" (minuscule) → **VALIDE**
- ❌ Espaces avant/après → **INVALIDE**

---

## 🔍 Diagnostic Automatique

La page de connexion affiche maintenant :

1. **Indicateur de mode** (🟢 Mode démonstration)
2. **Bouton de remplissage automatique** (Remplir avec admin)
3. **Section debug** avec mode détecté et VITE_API_URL
4. **Message d'erreur amélioré** avec instructions

Si vous voyez l'erreur "Identifiants invalides", le message affichera :

```
⚠️ Utilisez exactement : admin / password123
```

---

## 📊 Logs de Debug

Les logs détaillés sont maintenant affichés dans la console :

```
🔐 Tentative de connexion en mode MOCK
📝 Username fourni: admin
📝 Password fourni: ***123
👥 Utilisateurs disponibles: ["admin", "editor", "user"]
```

Si la connexion échoue :

```
❌ Aucun utilisateur trouvé avec ces identifiants
🔍 Vérification: { usernameMatch: false, passwordMatch: true }
```

Cela vous indique exactement quel champ est incorrect.

---

## 🎯 Résumé en 3 Points

1. ✅ **Fichier `.env.local`** existe avec `VITE_API_URL=` vide
2. ✅ **Hard refresh** de la page (Ctrl+Shift+R)
3. ✅ **Bouton "Remplir avec admin"** + clic sur "Se connecter"

**Documentation complète :** `CONNEXION_DEBUG.md`
