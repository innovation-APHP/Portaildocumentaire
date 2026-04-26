# 🎉 Nouveau Système PostgreSQL - Portail Documentaire

## ✅ Migration effectuée avec succès !

Le portail documentaire a été migré de Wiki.js vers une architecture moderne avec :

- **PostgreSQL 15** - Base de données robuste
- **Backend Node.js/Express** - API REST complète
- **Interface CRUD** - Administration intuitive
- **Upload de fichiers** - Support .md, .txt, .html
- **Full-text search** - Recherche optimisée
- **Authentification JWT** - Sécurisée

---

## 🚀 Démarrage rapide

### En 3 commandes

```bash
# 1. Lancer le script de démarrage
./START_POSTGRES.sh

# 2. Ouvrir votre navigateur
open http://localhost:8080

# 3. Se connecter
# Username: admin
# Password: password123
```

**C'est tout !** Le script s'occupe de tout :
- ✅ Démarrer PostgreSQL, Backend, Frontend
- ✅ Appliquer les migrations
- ✅ (Optionnel) Insérer les données de démo

---

## 📂 Fichiers créés et modifiés

### Détails complets
👉 Voir **`FICHIERS_CHANGES.md`** pour la liste complète

### Résumé
- **20 nouveaux fichiers** pour le backend
- **5 nouveaux fichiers** pour l'interface CRUD
- **3 fichiers modifiés** (routes, docker-compose, .env)

---

## 🎯 Nouvelle interface CRUD

### Accès
Route : **`/admin`**  
Rôles autorisés : **admin**, **editor**

### Fonctionnalités

**Gestion des documents :**
- ✅ Créer, modifier, supprimer
- ✅ Upload de fichiers markdown
- ✅ Éditeur intégré
- ✅ Gestion des tags
- ✅ Recherche et filtres

**Gestion des tags :**
- ✅ Créer avec couleur personnalisée
- ✅ Voir le nombre d'utilisations
- ✅ Supprimer

---

## 📊 Données de démonstration

### 3 utilisateurs

| Username | Password    | Rôle   |
|----------|-------------|--------|
| admin    | password123 | admin  |
| editor   | password123 | editor |
| user     | password123 | user   |

### 8 documents

- **2 fonctionnels** - Spécifications, Gestion utilisateurs
- **3 techniques** - Architecture, API REST, Docker
- **3 utilisateurs** - Guide démarrage, Chatbot, Admin

### 10 tags

API, Architecture, Sécurité, Base de données, Frontend, Backend, etc.

---

## 🔌 API REST

### Base URL
```
http://localhost:3001/api
```

### Authentification

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Utiliser le token
curl http://localhost:3001/api/documents \
  -H "Authorization: Bearer <votre-token>"
```

### Endpoints principaux

**Documents :**
- `GET /api/documents` - Liste
- `GET /api/documents/:id` - Détails
- `POST /api/documents` - Créer
- `PUT /api/documents/:id` - Modifier
- `DELETE /api/documents/:id` - Supprimer

**Tags :**
- `GET /api/tags` - Liste
- `POST /api/tags` - Créer
- `DELETE /api/tags/:id` - Supprimer

**Stats :**
- `GET /api/stats` - Statistiques

---

## 📁 Structure de la base de données

### Tables

```sql
users              -- Utilisateurs avec rôles
documents          -- Documents avec full-text search
tags               -- Tags avec couleurs
document_tags      -- Relation documents ↔ tags
related_documents  -- Relations entre documents
```

### Fonctionnalités PostgreSQL

- **Full-text search** en français
- **Triggers** pour updated_at
- **Indexes** optimisés
- **UUID** pour les IDs
- **Contraintes** d'intégrité

---

## 📚 Documentation complète

| Fichier | Description |
|---------|-------------|
| **`MIGRATION_POSTGRES.md`** | 📖 Guide complet de migration |
| **`FICHIERS_CHANGES.md`** | 📝 Liste détaillée des changements |
| **`NOUVEAU_SYSTEME.md`** | 📄 Ce fichier (résumé) |

---

## 🐳 Docker Compose

### Services

```yaml
postgres   # PostgreSQL 15 (port interne 5432)
backend    # API Node.js (port 3001)
frontend   # React + Nginx (port 8080)
```

### Commandes utiles

```bash
# Démarrer
docker-compose up -d

# Logs en temps réel
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend

# Arrêter tout
docker-compose down

# Réinitialiser complètement
docker-compose down -v  # ⚠️ Supprime les données
```

---

## 🔐 Sécurité - Production

### ⚠️ AVANT LA PRODUCTION

Éditez `.env` et changez :

```bash
# 1. Mot de passe PostgreSQL
POSTGRES_PASSWORD=un-mot-de-passe-fort-et-unique

# 2. Secret JWT (32+ caractères aléatoires)
JWT_SECRET=votre-secret-jwt-tres-long-et-aleatoire

# 3. CORS (votre domaine)
CORS_ORIGIN=https://votre-domaine.com
```

### Recommandations

- ✅ Changer tous les mots de passe utilisateurs
- ✅ Activer HTTPS (Let's Encrypt)
- ✅ Configurer un firewall
- ✅ Sauvegardes régulières de PostgreSQL
- ✅ Logs centralisés
- ✅ Monitoring (Prometheus + Grafana)

---

## 🧪 Tester rapidement

```bash
# 1. Health check API
curl http://localhost:3001/health

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  | jq -r '.token')

# 3. Liste des documents
curl http://localhost:3001/api/documents \
  -H "Authorization: Bearer $TOKEN"

# 4. Statistiques
curl http://localhost:3001/api/stats \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔄 Développement local

### Backend

```bash
cd server
pnpm install
cp .env.example .env
# Éditer .env avec vos paramètres
pnpm run dev  # Port 3001
```

### Frontend

```bash
# À la racine
echo "VITE_API_URL=http://localhost:3001/api" > .env.local
# Le serveur dev Figma Make se chargera du reste
```

---

## 🆘 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier PostgreSQL
docker-compose exec postgres pg_isready
```

### La base de données est vide

```bash
# Réappliquer les migrations
docker-compose exec backend node dist/db/migrate.js

# Réinsérer les données de démo
docker-compose exec backend node dist/db/seed.js
```

### Frontend ne se connecte pas

Vérifier `.env` :
```bash
VITE_API_URL=http://localhost:3001/api
```

Rebuilder :
```bash
docker-compose build frontend
docker-compose up -d frontend
```

---

## ✨ Prochaines étapes

### Fonctionnalités suggérées

1. **Chatbot RAG**
   - Intégrer avec la nouvelle API
   - Indexer les documents PostgreSQL

2. **Versioning**
   - Historique des modifications
   - Restauration de versions

3. **Export/Import**
   - Export en masse (JSON, CSV)
   - Import depuis Wiki.js

4. **Commentaires**
   - Système de commentaires par document
   - Notifications

5. **Permissions avancées**
   - Permissions par document
   - Groupes d'utilisateurs

---

## 📞 Support

### Documentation
- 📖 `MIGRATION_POSTGRES.md` - Guide complet
- 📝 `FICHIERS_CHANGES.md` - Détails des changements

### Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

---

## 🎊 C'est prêt !

Votre nouveau portail documentaire est opérationnel avec :

- ✅ Base de données PostgreSQL moderne
- ✅ API REST complète et documentée
- ✅ Interface CRUD intuitive
- ✅ Upload de fichiers
- ✅ Recherche full-text
- ✅ Données de démonstration

**Accédez à l'application :**
👉 http://localhost:8080

**Admin CRUD :**
👉 http://localhost:8080/admin

**Connectez-vous avec :**
- Username: `admin`
- Password: `password123`

---

**Bonne utilisation ! 🚀**
