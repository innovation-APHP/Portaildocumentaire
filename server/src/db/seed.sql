-- ============================================================================
-- Données de démonstration pour Portail Documentaire
-- ============================================================================

-- Nettoyage des données existantes (ordre important à cause des foreign keys)
TRUNCATE TABLE related_documents CASCADE;
TRUNCATE TABLE document_tags CASCADE;
TRUNCATE TABLE documents CASCADE;
TRUNCATE TABLE tags CASCADE;
TRUNCATE TABLE users CASCADE;

-- ============================================================================
-- Utilisateurs de démonstration
-- ============================================================================
-- Mot de passe pour tous: "password123" (hashé avec bcrypt rounds=10)
-- Hash généré: $2a$10$rXK5l5J5J5J5J5J5J5J5JuOqK5J5J5J5J5J5J5J5J5J5J5J5J5J5
INSERT INTO users (id, username, email, password_hash, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'editor', 'editor@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'editor'),
  ('33333333-3333-3333-3333-333333333333', 'user', 'user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user');

-- ============================================================================
-- Tags
-- ============================================================================
INSERT INTO tags (id, name, color) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'API', '#3B82F6'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Architecture', '#8B5CF6'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Sécurité', '#EF4444'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Base de données', '#10B981'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Frontend', '#F59E0B'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Backend', '#6366F1'),
  ('00000000-0000-0000-0000-000000000001', 'Guide utilisateur', '#EC4899'),
  ('00000000-0000-0000-0000-000000000002', 'Installation', '#14B8A6'),
  ('00000000-0000-0000-0000-000000000003', 'Configuration', '#F97316'),
  ('00000000-0000-0000-0000-000000000004', 'Migration', '#8B5CF6');

-- ============================================================================
-- Documents - Catégorie Fonctionnelle
-- ============================================================================
INSERT INTO documents (id, title, slug, content, category, description, author_id) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Spécifications Fonctionnelles du Portail',
    'specifications-fonctionnelles',
    E'# Spécifications Fonctionnelles\n\n## Vue d''ensemble\n\nLe portail documentaire permet de centraliser toute la documentation de l''entreprise.\n\n## Fonctionnalités principales\n\n### 1. Navigation par catégories\n- Documentation fonctionnelle\n- Documentation technique\n- Documentation utilisateur\n\n### 2. Recherche avancée\n- Recherche full-text\n- Filtrage par tags\n- Filtrage par catégorie\n\n### 3. Gestion des documents\n- Création et édition\n- Versioning\n- Relations entre documents',
    'functional',
    'Spécifications complètes des fonctionnalités du portail documentaire',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Gestion des utilisateurs et permissions',
    'gestion-utilisateurs-permissions',
    E'# Gestion des Utilisateurs\n\n## Rôles disponibles\n\n### Administrateur\n- Accès complet\n- Gestion des utilisateurs\n- Configuration système\n\n### Éditeur\n- Création et modification de documents\n- Gestion des tags\n\n### Utilisateur\n- Consultation des documents\n- Recherche\n\n## Authentification\n\nUtilisation de JWT pour l''authentification.',
    'functional',
    'Documentation des rôles et permissions utilisateurs',
    '11111111-1111-1111-1111-111111111111'
  );

-- ============================================================================
-- Documents - Catégorie Technique
-- ============================================================================
INSERT INTO documents (id, title, slug, content, category, description, author_id) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    'Architecture Backend PostgreSQL',
    'architecture-backend-postgresql',
    E'# Architecture Backend\n\n## Stack technique\n\n- **Base de données**: PostgreSQL 15\n- **Backend**: Node.js + Express\n- **ORM**: pg (driver natif)\n\n## Schéma de base de données\n\n### Tables principales\n\n1. **users**: Gestion des utilisateurs\n2. **documents**: Stockage des documents\n3. **tags**: Système de tags\n4. **document_tags**: Relation many-to-many\n5. **related_documents**: Relations entre documents\n\n## API REST\n\nEndpoints disponibles:\n- `GET /api/documents` - Liste des documents\n- `POST /api/documents` - Création\n- `PUT /api/documents/:id` - Mise à jour\n- `DELETE /api/documents/:id` - Suppression',
    'technical',
    'Documentation complète de l''architecture backend et base de données',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'API REST - Référence complète',
    'api-rest-reference',
    E'# API REST - Documentation\n\n## Authentication\n\nToutes les requêtes (sauf login) nécessitent un token JWT:\n\n```bash\nAuthorization: Bearer <token>\n```\n\n## Endpoints Documents\n\n### GET /api/documents\n\nListe paginée des documents\n\n**Query params**:\n- `page` (number): Numéro de page\n- `limit` (number): Éléments par page\n- `category` (string): Filtrer par catégorie\n- `search` (string): Recherche full-text\n- `tags` (string[]): Filtrer par tags\n\n### POST /api/documents\n\nCréation d''un document\n\n**Body**:\n```json\n{\n  "title": "Titre",\n  "content": "Contenu markdown",\n  "category": "technical",\n  "tags": ["api", "backend"]\n}\n```',
    'technical',
    'Référence complète de l''API REST du portail',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Déploiement Docker',
    'deploiement-docker',
    E'# Déploiement Docker\n\n## docker-compose.yml\n\nConfiguration complète avec:\n- Backend Node.js\n- Frontend Nginx\n- PostgreSQL\n\n## Variables d''environnement\n\n```env\nDATABASE_URL=postgresql://...\nJWT_SECRET=...\nNODE_ENV=production\n```\n\n## Commandes\n\n```bash\n# Démarrage\ndocker-compose up -d\n\n# Logs\ndocker-compose logs -f\n\n# Arrêt\ndocker-compose down\n```',
    'technical',
    'Guide de déploiement avec Docker et docker-compose',
    '22222222-2222-2222-2222-222222222222'
  );

-- ============================================================================
-- Documents - Catégorie Utilisateur
-- ============================================================================
INSERT INTO documents (id, title, slug, content, category, description, author_id) VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    'Guide de démarrage rapide',
    'guide-demarrage-rapide',
    E'# Guide de démarrage rapide\n\nBienvenue sur le portail documentaire !\n\n## 1. Connexion\n\nUtilisez vos identifiants fournis par l''administrateur.\n\n## 2. Navigation\n\n### Menu principal\n- **Accueil**: Statistiques et documents récents\n- **Documentation**: Parcourir par catégorie\n- **Recherche**: Trouver des documents\n- **Chat**: Poser des questions au chatbot\n\n## 3. Recherche de documents\n\nUtilisez la barre de recherche ou les filtres:\n- Par catégorie\n- Par tags\n- Recherche textuelle',
    'user',
    'Guide rapide pour les nouveaux utilisateurs',
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'Utilisation du Chatbot RAG',
    'utilisation-chatbot-rag',
    E'# Chatbot RAG - Guide utilisateur\n\n## Qu''est-ce que le chatbot ?\n\nLe chatbot utilise l''intelligence artificielle pour répondre à vos questions sur la documentation.\n\n## Comment l''utiliser ?\n\n1. Cliquez sur "Chat" dans le menu\n2. Posez votre question en langage naturel\n3. Le chatbot analyse la documentation et répond\n\n## Exemples de questions\n\n- "Comment déployer l''application ?"\n- "Quelle est l''architecture de la base de données ?"\n- "Comment créer un nouveau document ?"\n\n## Conseils\n\n- Soyez spécifique dans vos questions\n- Le chatbot recherche dans toute la documentation\n- Les réponses incluent les sources',
    'user',
    'Guide d''utilisation du chatbot intelligent',
    '33333333-3333-3333-3333-333333333333'
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Administration - Gestion des documents',
    'admin-gestion-documents',
    E'# Administration - Gestion des documents\n\n## Interface CRUD\n\nL''interface d''administration permet de:\n\n### Créer un document\n1. Cliquez sur "Nouveau document"\n2. Remplissez le formulaire:\n   - Titre\n   - Catégorie\n   - Contenu (Markdown)\n   - Tags\n3. Cliquez sur "Enregistrer"\n\n### Modifier un document\n1. Trouvez le document\n2. Cliquez sur "Modifier"\n3. Effectuez vos changements\n4. Enregistrez\n\n### Supprimer un document\n1. Sélectionnez le document\n2. Cliquez sur "Supprimer"\n3. Confirmez\n\n### Gestion des tags\n\nCréez et organisez vos tags pour une meilleure classification.',
    'user',
    'Guide pour les administrateurs - gestion CRUD',
    '11111111-1111-1111-1111-111111111111'
  );

-- ============================================================================
-- Relations Documents-Tags
-- ============================================================================
INSERT INTO document_tags (document_id, tag_id) VALUES
  -- Spécifications fonctionnelles
  ('10000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), -- Architecture

  -- Gestion utilisateurs
  ('10000000-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc'), -- Sécurité

  -- Architecture backend
  ('20000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), -- Architecture
  ('20000000-0000-0000-0000-000000000001', 'dddddddd-dddd-dddd-dddd-dddddddddddd'), -- Base de données
  ('20000000-0000-0000-0000-000000000001', 'ffffffff-ffff-ffff-ffff-ffffffffffff'), -- Backend

  -- API REST
  ('20000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'), -- API
  ('20000000-0000-0000-0000-000000000002', 'ffffffff-ffff-ffff-ffff-ffffffffffff'), -- Backend

  -- Déploiement Docker
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002'), -- Installation
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003'), -- Configuration

  -- Guide démarrage
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'), -- Guide utilisateur

  -- Chatbot
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'), -- Guide utilisateur

  -- Admin
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'); -- Guide utilisateur

-- ============================================================================
-- Relations entre documents
-- ============================================================================
INSERT INTO related_documents (document_id, related_document_id, relation_type) VALUES
  -- Architecture backend <-> API REST
  ('20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'related'),

  -- Déploiement Docker -> Architecture backend (prérequis)
  ('20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'prerequisite'),

  -- Guide démarrage -> Admin (continuation)
  ('30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'continuation');
