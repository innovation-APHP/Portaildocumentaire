# ⚡ Configuration Rapide - Onglet Paramètres

## 🎯 En 3 Étapes

### 1. Accéder aux Paramètres
```
Menu > Paramètres (icône engrenage ⚙️)
```

### 2. Configurer les URLs

**Section "Configuration des Connexions"**

| Champ | Valeur | Exemple |
|-------|--------|---------|
| URL API Backend | Votre serveur PostgreSQL | `http://localhost:3001/api` |
| URL API RAG | Votre serveur RAG | `http://localhost:8000` |
| Token RAG | Token d'auth (optionnel) | `sk-xxxxxxxx...` |

### 3. Tester et Sauvegarder

1. Cliquez **"Tester"** pour chaque URL
2. Attendez le message ✅ "Connexion réussie !"
3. Cliquez **"Sauvegarder et Recharger"**
4. L'application redémarre avec les nouveaux paramètres

---

## 🚀 Exemples Pratiques

### Mode Démonstration (Mock)
```
API Backend: (vide)
API RAG:     (vide)
Token RAG:   (vide)
```
**Résultat:** Fonctionne sans serveur, données de démo

### Backend Local
```
API Backend: http://localhost:3001/api
API RAG:     (vide)
Token RAG:   (vide)
```
**Résultat:** PostgreSQL + Assistant IA mock

### Configuration Complète
```
API Backend: http://localhost:3001/api
API RAG:     http://localhost:8000
Token RAG:   (vide ou votre token)
```
**Résultat:** PostgreSQL + Assistant IA réel

---

## 🔍 Tests de Connexion

### Bouton "Tester" Backend
**Vérifie:**
- URL accessible
- Endpoint `/health` disponible
- Serveur répond HTTP 200

**Si échec:**
1. Vérifiez que le backend est démarré
2. Testez manuellement: `curl http://localhost:3001/api/health`
3. Vérifiez CORS si erreur réseau

### Bouton "Tester" RAG
**Vérifie:**
- URL RAG accessible
- Endpoint `/health` disponible
- Token valide (si fourni)

**Si échec:**
1. Vérifiez que le RAG est démarré
2. Testez manuellement: `curl http://localhost:8000/health`
3. Vérifiez le token si erreur 401

---

## 💾 Priorités

```
Configuration Interface > Fichier .env > Valeurs par défaut
```

**Exemple:**
- `.env` contient: `VITE_API_URL=http://localhost:3001/api`
- Interface configure: `http://192.168.1.100:3001/api`
- **Utilisé:** `http://192.168.1.100:3001/api` ✅

---

## 🔄 Réinitialiser

**Bouton "Réinitialiser"** (visible si config personnalisée)

**Effet:**
- Supprime la configuration interface
- Retour aux paramètres `.env`
- Rechargement automatique

---

## 📖 Documentation Complète

**Guide détaillé:** `CONFIGURATION_INTERFACE.md`

**Contient:**
- Cas d'usage détaillés
- Sécurité et bonnes pratiques
- Dépannage complet
- Exemples concrets

---

## ✅ Checklist

- [ ] J'ai démarré mon backend (si nécessaire)
- [ ] J'ai entré l'URL API Backend
- [ ] J'ai testé la connexion Backend (✅)
- [ ] J'ai entré l'URL API RAG (si assistant IA)
- [ ] J'ai testé la connexion RAG (✅)
- [ ] J'ai cliqué "Sauvegarder et Recharger"
- [ ] Je me suis reconnecté après le rechargement

---

**C'est tout ! Votre portail est configuré 🎉**
