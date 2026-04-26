# Mode Mock - Informations

## 🎭 Mode Actuel: MOCK (Données de démonstration)

L'application fonctionne actuellement en **mode mock** car le backend PostgreSQL n'est pas démarré dans l'environnement Figma Make.

## ✅ Ce qui fonctionne

### Authentification
- ✅ Login avec comptes de démonstration
- ✅ Rôles (admin, editor, user)
- ✅ Token JWT simulé

**Comptes disponibles:**
```
Username: admin   | Password: password123 | Rôle: admin
Username: editor  | Password: password123 | Rôle: editor  
Username: user    | Password: password123 | Rôle: user
```

### Navigation et Lecture
- ✅ Page d'accueil avec statistiques
- ✅ Liste des documents par catégorie
- ✅ Recherche et filtres
- ✅ Visualisation des documents
- ✅ Documents liés
- ✅ Tags

### Interface CRUD (Simulation)
- ⚠️ Création de documents (simulée, non persistée)
- ⚠️ Modification de documents (simulée, non persistée)
- ⚠️ Suppression de documents (simulée, non persistée)
- ⚠️ Création de tags (simulée, non persistée)
- ⚠️ Suppression de tags (simulée, non persistée)

> **Note:** Les opérations CRUD sont simulées. Les changements ne sont pas sauvegardés et disparaîtront au rechargement de la page.

## 📊 Source des données

Les données proviennent de `src/app/data/mockDocuments.ts` :
- 15+ documents de démonstration
- 3 catégories (fonctionnelle, technique, utilisateur)
- Tags variés
- Relations entre documents

## 🔄 Passer en mode Backend Réel

Pour utiliser le backend PostgreSQL réel :

1. **Démarrer le backend:**
   ```bash
   ./START_POSTGRES.sh
   ```

2. **Configurer l'URL de l'API:**
   Éditer `.env.local` :
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

3. **Redémarrer le frontend:**
   L'application détectera automatiquement le backend et passera en mode API.

## 🎯 Avantages du Mode Mock

- ✅ Fonctionne sans infrastructure backend
- ✅ Parfait pour démonstration et développement UI
- ✅ Aucune configuration requise
- ✅ Données cohérentes et prévisibles
- ✅ Pas de latence réseau

## ⚠️ Limitations

- ❌ Modifications non persistées
- ❌ Pas de vraie base de données
- ❌ Pas d'upload de fichiers réel
- ❌ Pas de recherche full-text PostgreSQL
- ❌ Pas d'authentification réelle

## 🔍 Détection automatique

Le mode est détecté automatiquement dans `src/app/services/apiClient.ts` :

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const USE_MOCK_DATA = !API_BASE_URL || API_BASE_URL === '';
```

Si `VITE_API_URL` est vide → Mode MOCK  
Si `VITE_API_URL` est défini → Mode API

## 📝 Console de développement

En mode mock, les opérations CRUD affichent des messages dans la console :

```
Mock: Document créé (simulation uniquement)
Mock: Document mis à jour (simulation uniquement)
Mock: Document supprimé (simulation uniquement)
Mock: Tag créé (simulation uniquement)
```

## 🚀 Pour Production

En production, **toujours** utiliser le mode API avec PostgreSQL :
- Backend sécurisé avec JWT
- Base de données persistante
- Full-text search
- Upload de fichiers
- Gestion des permissions

Voir `MIGRATION_POSTGRES.md` pour le guide complet.
