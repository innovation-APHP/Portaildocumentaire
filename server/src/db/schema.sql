-- ============================================================================
-- Schema PostgreSQL pour Portail Documentaire
-- ============================================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: users (Utilisateurs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Table: tags (Tags/Étiquettes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Table: documents (Documents)
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  content_format VARCHAR(50) DEFAULT 'markdown' CHECK (content_format IN ('markdown', 'html', 'text')),
  category VARCHAR(100) NOT NULL CHECK (category IN ('functional', 'technical', 'user')),
  description TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  file_path VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Table: document_tags (Relation Documents-Tags)
-- ============================================================================
CREATE TABLE IF NOT EXISTS document_tags (
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

-- ============================================================================
-- Table: related_documents (Documents connexes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS related_documents (
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  related_document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  relation_type VARCHAR(50) DEFAULT 'related' CHECK (relation_type IN ('related', 'prerequisite', 'continuation')),
  PRIMARY KEY (document_id, related_document_id),
  CHECK (document_id != related_document_id)
);

-- ============================================================================
-- Indexes pour performance
-- ============================================================================
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_author ON documents(author_id);
CREATE INDEX idx_documents_published ON documents(is_published);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX idx_document_tags_document ON document_tags(document_id);
CREATE INDEX idx_document_tags_tag ON document_tags(tag_id);
CREATE INDEX idx_documents_slug ON documents(slug);

-- ============================================================================
-- Full Text Search
-- ============================================================================
ALTER TABLE documents ADD COLUMN search_vector tsvector;

CREATE INDEX idx_documents_search ON documents USING gin(search_vector);

-- Fonction pour mettre à jour le vecteur de recherche
CREATE OR REPLACE FUNCTION documents_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('french', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(NEW.content, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Trigger pour mise à jour automatique
CREATE TRIGGER documents_search_update_trigger
  BEFORE INSERT OR UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION documents_search_update();

-- ============================================================================
-- Fonction pour mettre à jour updated_at automatiquement
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
