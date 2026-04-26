# Fichiers modifiés - Migration PostgreSQL

## Résumé des changements

Migration complète du portail documentaire de Wiki.js vers PostgreSQL avec backend Node.js/Express et interface CRUD d'administration.

---

## 📁 Nouveaux fichiers créés

### Backend (15 fichiers)

#### Configuration
- ✅ `server/package.json` - Dépendances backend
- ✅ `server/tsconfig.json` - Configuration TypeScript
- ✅ `server/.env.example` - Variables d'environnement backend
- ✅ `server/Dockerfile` - Image Docker backend

#### Base de données
- ✅ `server/src/db/pool.ts` - Pool de connexions PostgreSQL
- ✅ `server/src/db/schema.sql` - **Schéma complet avec données de structure**
- ✅ `server/src/db/seed.sql` - **Données de démonstration (8 documents, 10 tags, 3 users)**
- ✅ `server/src/db/migrate.ts` - Script de migration
- ✅ `server/src/db/seed.ts` - Script de seeding

#### Middleware
- ✅ `server/src/middleware/auth.ts` - Authentification JWT
- ✅ `server/src/middleware/upload.ts` - Upload fichiers

#### Routes API
- ✅ `server/src/routes/auth.routes.ts` - Authentification (login)
- ✅ `server/src/routes/documents.routes.ts` - **CRUD complet documents**
- ✅ `server/src/routes/tags.routes.ts` - **CRUD tags**
- ✅ `server/src/routes/stats.routes.ts` - Statistiques

#### Serveur
- ✅ `server/src/index.ts` - Serveur Express principal

### Frontend (5 fichiers)

#### Pages
- ✅ `src/app/pages/Admin.tsx` - **Page d'administration principale**

#### Composants Admin
- ✅ `src/app/components/admin/DocumentsManager.tsx` - **Gestionnaire CRUD documents**
- ✅ `src/app/components/admin/DocumentEditor.tsx` - **Éditeur de document avec upload**
- ✅ `src/app/components/admin/TagsManager.tsx` - **Gestionnaire CRUD tags**

#### Services
- ✅ `src/app/services/apiClient.ts` - **Client API pour communiquer avec le backend**

### Viewers et Visualisation
- ✅ `src/app/components/FileViewer.tsx` - **Composant de visualisation multi-formats (PDF, Office, images)**

### Assistant IA / RAG
- ✅ `src/app/services/ragClient.ts` - **Client pour API RAG (nouveau)**
- ✅ `src/app/services/ragService.ts` - **Service RAG avec mode réel/mock (mis à jour)**
- ✅ `src/app/components/AIAssistant.tsx` - **Composant assistant IA (nouveau)**
- ✅ `src/app/pages/Assistant.tsx` - **Page dédiée assistant (nouveau)**

### Configuration via Interface (Nouveauté 🎉)
- ✅ `src/app/services/connectionConfig.ts` - **Service de gestion des URLs de connexion (nouveau)**
- ✅ `src/app/services/apiClient.ts` - **Utilise connectionConfig (mis à jour)**
- ✅ `src/app/services/ragService.ts` - **Utilise connectionConfig (mis à jour)**
- ✅ `src/app/pages/Settings.tsx` - **Formulaires de configuration intégrés (mis à jour)**

### Documentation
- ✅ `MIGRATION_POSTGRES.md` - Guide complet de migration
- ✅ `FICHIERS_CHANGES.md` - Ce fichier
- ✅ `SUPPORT_FICHIERS.md` - Documentation support multi-formats
- ✅ `VIEWERS_INTEGRATION.md` - **Documentation viewers intégrés**
- ✅ `ASSISTANT_IA_RAG.md` - **Documentation complète assistant IA avec RAG**
- ✅ `ASSISTANT_IA_QUICKSTART.md` - **Guide de démarrage rapide assistant IA**
- ✅ `rag-api-swagger.yaml` - **Spécification OpenAPI de l'API RAG attendue**
- ✅ `MODE_MOCK_FIX.md` - **Documentation fix mode mock**
- ✅ `VIEWERS_README.md` - **Guide utilisateur viewers**
- ✅ `CONFIGURATION_INTERFACE.md` - **Guide configuration via l'interface**
- ✅ `CONNEXION_DEBUG.md` - **Guide de dépannage connexion**
- ✅ `PROBLEME_CONNEXION_FIX.md` - **Fix rapide problème connexion**

---

## 📝 Fichiers modifiés

### Frontend
- ✅ `src/app/routes.tsx` - Ajout de la route `/admin`

### Docker
- ✅ `docker-compose.yml` - **Architecture complète PostgreSQL + Backend + Frontend**
- ✅ `.env.example` - Variables d'environnement PostgreSQL et backend

---

## 🗑️ Fichiers supprimés/obsolètes

Les fichiers suivants ne sont plus nécessaires :

- ❌ `src/app/components/WikiJsSettings.tsx` - Configuration Wiki.js (obsolète)
- ❌ `scripts/migrate-to-wikijs.js` - Script de migration Wiki.js (obsolète)
- ❌ Toute référence à Wiki.js dans le frontend

**Note :** Ces fichiers peuvent être supprimés manuellement si souhaité.

---

## 🎯 Fonctionnalités ajoutées

### Interface CRUD d'administration (`/admin`)

**Gestion des documents :**
- ✅ Créer un document (titre, catégorie, description, contenu)
- ✅ Modifier un document
- ✅ Supprimer un document
- ✅ **Upload de fichiers** (.md, .txt, .html)
- ✅ Éditeur markdown intégré
- ✅ Attribution de tags multiples
- ✅ Recherche et filtres (catégorie, texte)

**Gestion des tags :**
- ✅ Créer des tags avec nom et couleur personnalisée
- ✅ Voir le nombre de documents par tag
- ✅ Supprimer des tags
- ✅ Palette de couleurs prédéfinies

### Viewers Intégrés (Nouveauté 🎉)

**Visualisation directe dans le navigateur :**
- ✅ **PDF** - Viewer react-pdf avec navigation page par page
- ✅ **Word/Excel/PowerPoint** - Google Docs Viewer en iframe
- ✅ **Images** - Affichage natif avec zoom
- ✅ **JSON/XML/CSV** - Coloration syntaxique
- ✅ **Markdown** - Rendu HTML avec GFM
- ✅ Bouton de téléchargement toujours disponible

**Formats supportés :**
- Documents : `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx`
- Images : `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`
- Texte : `.md`, `.txt`, `.json`, `.xml`, `.csv`, `.html`

### Assistant IA avec RAG (Nouveauté 🤖)

**Fonctionnalités :**
- ✅ **Interrogation en langage naturel** de la documentation
- ✅ **Mode API réelle** - Connexion à votre API RAG personnalisée
- ✅ **Mode Mock** - Réponses prédéfinies intelligentes (sans configuration)
- ✅ **Sources citées** - Affichage des documents utilisés avec scores de pertinence
- ✅ **Historique de conversation** - Contexte maintenu entre les questions
- ✅ **Authentification Bearer** - Support des tokens d'API
- ✅ **Interface intuitive** - Chat moderne avec suggestions de questions
- ✅ **Health check automatique** - Vérification de disponibilité au démarrage

**Configuration :**
```bash
# .env.local
VITE_RAG_API_URL=http://localhost:8000      # URL de votre API RAG
VITE_RAG_API_TOKEN=sk-xxxxxxxx              # Token d'authentification (optionnel)
```

**Contrat d'API :**
- Endpoint `POST /query` pour interroger la base documentaire
- Endpoint `GET /health` pour le monitoring
- Format de réponse avec `answer` et `sources[]`
- Spécification OpenAPI complète fournie dans `rag-api-swagger.yaml`

**Accès :**
- Page dédiée : `/chat`
- Menu de navigation : "Assistant IA"
- Interface de chat moderne avec historique

### Configuration via Interface (Nouveauté 🎛️)

**Fonctionnalités :**
- ✅ **Configuration graphique** - Paramétrez les URLs depuis l'onglet Paramètres
- ✅ **Test de connexion** - Boutons "Tester" pour vérifier la connectivité
- ✅ **Priorité sur .env** - Les paramètres interface ont priorité sur les variables d'environnement
- ✅ **Sauvegarde localStorage** - Persistance dans le navigateur
- ✅ **Réinitialisation facile** - Bouton pour revenir aux paramètres .env
- ✅ **Rechargement automatique** - Application des nouveaux paramètres après sauvegarde

**Paramètres configurables :**
1. **URL API Backend** - Connexion PostgreSQL (ou vide pour mode Mock)
2. **URL API RAG** - Système d'assistant IA (ou vide pour désactiver)
3. **Token RAG** - Authentification Bearer pour l'API RAG (optionnel)

**Accès :**
- Menu : "Paramètres" (icône engrenage)
- Section : "Configuration des Connexions"
- Badge "Personnalisé" si configuration active

**Avantages :**
- ✅ **Pas besoin de modifier .env** - Configuration sans édition de fichiers
- ✅ **Un seul build** - Déployez une fois, configurez partout
- ✅ **Changement rapide** - Basculez entre dev/prod instantanément
- ✅ **Pas de redéploiement** - Changez la config sans rebuild

### API REST Backend

**Endpoints authentification :**
- `POST /api/auth/login` - Connexion (retourne JWT)

**Endpoints documents :**
- `GET /api/documents` - Liste paginée avec filtres
- `GET /api/documents/:id` - Détails d'un document
- `POST /api/documents` - Créer (admin/editor) avec upload
- `PUT /api/documents/:id` - Modifier (admin/editor) avec upload
- `DELETE /api/documents/:id` - Supprimer (admin/editor)

**Endpoints tags :**
- `GET /api/tags` - Liste avec compteurs
- `POST /api/tags` - Créer (admin/editor)
- `DELETE /api/tags/:id` - Supprimer (admin)

**Endpoints stats :**
- `GET /api/stats` - Statistiques globales

### Base de données PostgreSQL

**Tables :**
- `users` - Utilisateurs avec rôles (admin, editor, user)
- `documents` - Documents avec full-text search
- `tags` - Tags avec couleurs
- `document_tags` - Relations many-to-many
- `related_documents` - Relations entre documents

**Fonctionnalités :**
- ✅ Full-text search en français (titre, description, contenu)
- ✅ Indexes optimisés
- ✅ Triggers pour `updated_at` automatique
- ✅ UUID pour tous les IDs
- ✅ Contraintes d'intégrité

---

## 📊 Données de démonstration

Après exécution de `seed.sql`, vous aurez :

### Utilisateurs (3)
```
admin / password123 (admin)
editor / password123 (editor)
user / password123 (user)
```

### Documents (8)
- **Fonctionnels** (2) : Spécifications, Gestion utilisateurs
- **Techniques** (3) : Architecture backend, API REST, Déploiement Docker
- **Utilisateurs** (3) : Guide démarrage, Chatbot RAG, Administration

### Tags (10)
API, Architecture, Sécurité, Base de données, Frontend, Backend, Guide utilisateur, Installation, Configuration, Migration

### Relations
- Documents liés entre eux
- Tags assignés aux documents

---

## 🚀 Déploiement

### Services Docker

**Nouveau docker-compose.yml contient :**

1. **`postgres`** - PostgreSQL 15 Alpine
   - Port : 5432 (interne)
   - Volume : `postgres-data`
   - Healthcheck : pg_isready

2. **`backend`** - API Node.js/Express
   - Port : 3001
   - Volume : `uploads-data`
   - Dépend de : postgres
   - Healthcheck : /health

3. **`frontend`** - React + Nginx
   - Port : 8080
   - Dépend de : backend
   - Healthcheck : curl

### Commandes

```bash
# Démarrer tous les services
docker-compose up -d

# Appliquer les migrations
docker-compose exec backend node dist/db/migrate.js

# Insérer les données de démo
docker-compose exec backend node dist/db/seed.js

# Vérifier les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

---

## 🔐 Sécurité

### ⚠️ IMPORTANT pour la production

1. **Changer tous les secrets dans `.env` :**
   - `POSTGRES_PASSWORD`
   - `JWT_SECRET` (utiliser une longue chaîne aléatoire)

2. **Changer les mots de passe par défaut des utilisateurs**

3. **Configurer CORS :**
   - `CORS_ORIGIN=https://votre-domaine.com`

4. **Activer HTTPS avec Let's Encrypt**

---

## 📚 Documentation complète

Voir `MIGRATION_POSTGRES.md` pour :
- Guide d'installation détaillé
- Documentation API complète
- Exemples d'utilisation
- Dépannage
- Migration des données existantes
- Prochaines étapes recommandées

---

## 🧪 Test rapide

```bash
# 1. Démarrer
docker-compose up -d

# 2. Migrer
docker-compose exec backend node dist/db/migrate.js

# 3. Seed
docker-compose exec backend node dist/db/seed.js

# 4. Tester l'API
curl http://localhost:3001/health

# 5. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# 6. Ouvrir l'interface
# http://localhost:8080
# Login : admin / password123
# Admin : http://localhost:8080/admin
```

---

## ✅ Checklist de vérification

- [ ] Backend démarre sans erreur
- [ ] PostgreSQL est accessible
- [ ] Migrations appliquées avec succès
- [ ] Données de démo insérées
- [ ] Login fonctionne (admin/password123)
- [ ] Page `/admin` accessible
- [ ] Création d'un document fonctionne
- [ ] Upload de fichier .md fonctionne
- [ ] Création d'un tag fonctionne
- [ ] Recherche de documents fonctionne
- [ ] API retourne des données correctes

---

**Migration effectuée le :** 2026-04-26
**Version :** 1.0.0
