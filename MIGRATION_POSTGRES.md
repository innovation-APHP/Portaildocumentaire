# Migration vers PostgreSQL - Portail Documentaire

## Vue d'ensemble

Ce document décrit la migration du portail documentaire de Wiki.js vers une architecture PostgreSQL avec backend Node.js/Express et interface CRUD d'administration complète.

## Fichiers modifiés

### Backend (Nouveau)

**Nouveaux fichiers créés :**

1. **`server/package.json`** - Dépendances backend (Express, PostgreSQL, JWT, Multer)
2. **`server/tsconfig.json`** - Configuration TypeScript backend
3. **`server/.env.example`** - Variables d'environnement backend
4. **`server/Dockerfile`** - Image Docker pour le backend
5. **`server/src/index.ts`** - Serveur Express principal
6. **`server/src/db/pool.ts`** - Pool de connexions PostgreSQL
7. **`server/src/db/schema.sql`** - Schéma complet de la base de données
8. **`server/src/db/seed.sql`** - Données de démonstration
9. **`server/src/db/migrate.ts`** - Script de migration
10. **`server/src/db/seed.ts`** - Script de seeding
11. **`server/src/middleware/auth.ts`** - Middleware d'authentification JWT
12. **`server/src/middleware/upload.ts`** - Middleware upload de fichiers
13. **`server/src/routes/auth.routes.ts`** - Routes d'authentification
14. **`server/src/routes/documents.routes.ts`** - CRUD complet des documents
15. **`server/src/routes/tags.routes.ts`** - Gestion des tags
16. **`server/src/routes/stats.routes.ts`** - Statistiques

### Frontend (Modifié/Nouveau)

**Nouveaux fichiers :**

1. **`src/app/pages/Admin.tsx`** - Page d'administration principale
2. **`src/app/components/admin/DocumentsManager.tsx`** - Gestionnaire CRUD documents
3. **`src/app/components/admin/DocumentEditor.tsx`** - Éditeur de document
4. **`src/app/components/admin/TagsManager.tsx`** - Gestionnaire CRUD tags
5. **`src/app/services/apiClient.ts`** - Client API pour le backend

**Fichiers modifiés :**

1. **`src/app/routes.tsx`** - Ajout de la route `/admin`
2. **`docker-compose.yml`** - Nouvelle architecture avec PostgreSQL
3. **`.env.example`** - Nouvelles variables d'environnement

### Configuration Docker

**Fichiers modifiés :**

1. **`docker-compose.yml`** - Architecture complète :
   - Service `postgres` (PostgreSQL 15)
   - Service `backend` (API Node.js)
   - Service `frontend` (React + Nginx)

## Architecture de la base de données

### Tables créées

1. **`users`** - Utilisateurs avec authentification
   - id, username, email, password_hash, role
   - Rôles : admin, editor, user

2. **`documents`** - Documents principaux
   - id, title, slug, content, category, description
   - Métadonnées : author_id, view_count, created_at, updated_at
   - Support : markdown, html, text
   - Full-text search avec tsvector

3. **`tags`** - Tags pour classification
   - id, name, color

4. **`document_tags`** - Relation many-to-many
   - document_id, tag_id

5. **`related_documents`** - Relations entre documents
   - document_id, related_document_id, relation_type

### Fonctionnalités PostgreSQL

- **Full-text search** (français) sur titre, description, contenu
- **Triggers** pour mise à jour automatique de `updated_at`
- **Indexes** pour optimisation des requêtes
- **UUID** pour les identifiants
- **Contraintes** pour l'intégrité des données

## API REST

### Endpoints disponibles

**Authentification :**
- `POST /api/auth/login` - Connexion (retourne un JWT)

**Documents :**
- `GET /api/documents` - Liste paginée avec filtres
- `GET /api/documents/:id` - Détails d'un document
- `POST /api/documents` - Créer (admin/editor)
- `PUT /api/documents/:id` - Modifier (admin/editor)
- `DELETE /api/documents/:id` - Supprimer (admin/editor)

**Tags :**
- `GET /api/tags` - Liste des tags avec compteurs
- `POST /api/tags` - Créer un tag (admin/editor)
- `DELETE /api/tags/:id` - Supprimer un tag (admin)

**Statistiques :**
- `GET /api/stats` - Statistiques globales

### Authentification

Toutes les routes (sauf `/login`) nécessitent un token JWT :

```bash
Authorization: Bearer <token>
```

## Interface CRUD d'administration

### Accès

Route : `/admin` (nécessite rôle admin ou editor)

### Fonctionnalités

**Gestion des documents :**
- ✅ Créer un document
- ✅ Modifier un document
- ✅ Supprimer un document
- ✅ Upload de fichiers (.md, .txt, .html)
- ✅ Éditeur markdown intégré
- ✅ Gestion des tags par document
- ✅ Recherche et filtres
- ✅ Catégorisation (fonctionnelle, technique, utilisateur)

**Gestion des tags :**
- ✅ Créer des tags
- ✅ Choisir la couleur
- ✅ Voir le nombre de documents par tag
- ✅ Supprimer des tags

## Données de démonstration

### Utilisateurs par défaut

```
Username: admin
Password: password123
Role: admin

Username: editor
Password: password123
Role: editor

Username: user
Password: password123
Role: user
```

### Documents de démonstration

- **Fonctionnels** : 2 documents (Spécifications, Gestion utilisateurs)
- **Techniques** : 3 documents (Architecture, API REST, Déploiement Docker)
- **Utilisateurs** : 3 documents (Guide démarrage, Chatbot, Admin)

### Tags de démonstration

10 tags préconfigurés avec couleurs : API, Architecture, Sécurité, Base de données, etc.

## Installation et déploiement

### Option 1 : Docker Compose (Recommandé)

```bash
# 1. Copier et configurer les variables d'environnement
cp .env.example .env
# Éditer .env et changer les mots de passe

# 2. Démarrer tous les services
docker-compose up -d

# 3. Vérifier les logs
docker-compose logs -f

# 4. Appliquer le schéma et les données de démo
docker-compose exec backend node dist/db/migrate.js
docker-compose exec backend node dist/db/seed.js
```

L'application sera accessible sur :
- Frontend : http://localhost:8080
- Backend API : http://localhost:3001

### Option 2 : Développement local

**Backend :**

```bash
cd server

# Installer les dépendances
pnpm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL

# Démarrer PostgreSQL localement
# Assurez-vous que PostgreSQL est installé et démarré

# Appliquer les migrations
pnpm run migrate

# Insérer les données de démo
pnpm run seed

# Démarrer le serveur en mode développement
pnpm run dev
```

**Frontend :**

```bash
# À la racine du projet
pnpm install

# Configurer l'URL de l'API
echo "VITE_API_URL=http://localhost:3001/api" > .env.local

# Démarrer le serveur de développement
# (déjà configuré dans Figma Make)
```

## Tests

### Tester l'API

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Liste des documents (avec token)
curl http://localhost:3001/api/documents \
  -H "Authorization: Bearer <votre-token>"

# Statistiques
curl http://localhost:3001/api/stats \
  -H "Authorization: Bearer <votre-token>"
```

### Tester l'interface CRUD

1. Ouvrir http://localhost:8080
2. Se connecter avec `admin` / `password123`
3. Aller sur `/admin`
4. Tester la création/modification/suppression de documents
5. Tester la gestion des tags

## Upload de fichiers

### Formats supportés

- `.md` (Markdown)
- `.txt` (Texte)
- `.html` (HTML)

### Limite de taille

10 MB par défaut (configurable via `MAX_FILE_SIZE`)

### Stockage

- Développement : `./uploads`
- Production (Docker) : Volume `uploads-data`

## Sécurité

### Mots de passe

- ⚠️ **IMPORTANT** : Changer tous les mots de passe par défaut en production
- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Jamais stockés en clair

### JWT

- Token valide 7 jours par défaut
- ⚠️ **IMPORTANT** : Changer `JWT_SECRET` en production
- Utiliser une valeur aléatoire longue (32+ caractères)

### CORS

- Par défaut : `*` (tous origins)
- ⚠️ **Production** : Restreindre avec `CORS_ORIGIN=https://votre-domaine.com`

### Permissions

- **Admin** : Accès complet
- **Editor** : Création et modification de documents/tags
- **User** : Lecture seule

## Migration des données existantes

Si vous avez des données dans Wiki.js à migrer :

1. Exporter les données de Wiki.js
2. Créer un script de migration personnalisé
3. Mapper les champs Wiki.js vers le nouveau schéma
4. Importer dans PostgreSQL

Exemple de structure à mapper :

```javascript
// Wiki.js -> PostgreSQL
{
  title: doc.title,
  content: doc.content,
  category: mapCategory(doc.path), // Déterminer la catégorie
  tags: doc.tags.map(t => t.name),
  description: doc.description || generateFromContent(doc.content)
}
```

## Différences par rapport à Wiki.js

### Fonctionnalités ajoutées

✅ Interface CRUD complète
✅ Upload de fichiers direct
✅ Gestion fine des permissions (3 rôles)
✅ API REST documentée
✅ Tags avec couleurs personnalisables
✅ Relations entre documents
✅ Full-text search optimisé
✅ Statistiques en temps réel

### Fonctionnalités retirées

❌ Éditeur WYSIWYG Wiki.js
❌ Gestion Git intégrée
❌ Multi-language natif
❌ Templates Wiki.js

## Support et dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier la connexion PostgreSQL
docker-compose exec backend node -e "
  const pg = require('pg');
  const pool = new pg.Pool({connectionString: process.env.DATABASE_URL});
  pool.query('SELECT NOW()').then(() => console.log('OK')).catch(console.error);
"
```

### Erreurs de migration

```bash
# Réinitialiser complètement la base
docker-compose down -v
docker-compose up -d postgres
docker-compose exec backend node dist/db/migrate.js
docker-compose exec backend node dist/db/seed.js
```

### Frontend ne se connecte pas au backend

Vérifier `.env` :
```bash
VITE_API_URL=http://localhost:3001/api
```

Rebuilder le frontend :
```bash
docker-compose build frontend
docker-compose up -d frontend
```

## Prochaines étapes recommandées

1. **Sécurité** :
   - Changer tous les secrets et mots de passe
   - Configurer HTTPS avec Let's Encrypt
   - Ajouter rate limiting sur l'API

2. **Fonctionnalités** :
   - Intégration du chatbot RAG avec la nouvelle API
   - Export/Import de documents en masse
   - Versioning des documents
   - Commentaires sur les documents

3. **Performance** :
   - Ajouter un cache Redis
   - Optimiser les requêtes PostgreSQL
   - Mettre en place un CDN pour les assets

4. **Monitoring** :
   - Logs centralisés (ELK Stack)
   - Métriques (Prometheus + Grafana)
   - Alerting (PagerDuty, Slack)

## Ressources

- **PostgreSQL** : https://www.postgresql.org/docs/
- **Express** : https://expressjs.com/
- **JWT** : https://jwt.io/
- **Multer** : https://github.com/expressjs/multer
- **React** : https://react.dev/
