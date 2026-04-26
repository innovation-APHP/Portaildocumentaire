-- ============================================================================
-- Migration: Ajout de la table categories
-- ============================================================================

-- Créer la table categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajouter le trigger pour updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer les catégories par défaut
INSERT INTO categories (name, slug, color, icon, description) VALUES
  ('Fonctionnel', 'functional', '#10B981', 'FileText', 'Documentation fonctionnelle et spécifications'),
  ('Technique', 'technical', '#3B82F6', 'Code', 'Documentation technique et guides développeur'),
  ('Utilisateur', 'user', '#F59E0B', 'Users', 'Guides utilisateur et tutoriels')
ON CONFLICT (slug) DO NOTHING;

-- Ajouter la colonne category_id à la table documents
ALTER TABLE documents ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Migrer les données existantes
UPDATE documents SET category_id = (
  SELECT id FROM categories WHERE slug = documents.category
) WHERE category_id IS NULL;

-- Créer un index
CREATE INDEX IF NOT EXISTS idx_documents_category_id ON documents(category_id);

-- Note: La colonne 'category' VARCHAR sera conservée pour compatibilité
-- Elle pourra être supprimée plus tard après validation
