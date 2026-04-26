-- ============================================================================
-- Migration: Ajout de la table applications (lecture seule)
-- ============================================================================

-- Créer la table applications
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(50) DEFAULT 'bg-blue-500',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer les applications par défaut (FIXES - ne peuvent pas être modifiées via l'interface)
INSERT INTO applications (id, name, description, color, icon) VALUES
  ('ecommerce', 'Plateforme E-commerce', 'Application de vente en ligne et gestion des commandes', 'bg-blue-500', 'ShoppingCart'),
  ('portal', 'Portail Client', 'Interface client pour la gestion de compte et suivi', 'bg-green-500', 'UserCircle'),
  ('backoffice', 'Backoffice Admin', 'Outil d''administration interne', 'bg-purple-500', 'Settings'),
  ('api', 'API Gateway', 'Services API et intégrations', 'bg-orange-500', 'Workflow'),
  ('mobile', 'Application Mobile', 'Application mobile iOS et Android', 'bg-pink-500', 'Smartphone')
ON CONFLICT (id) DO NOTHING;

-- Ajouter la colonne application_id à la table documents
ALTER TABLE documents ADD COLUMN IF NOT EXISTS application_id VARCHAR(50) REFERENCES applications(id) ON DELETE SET NULL;

-- Créer un index
CREATE INDEX IF NOT EXISTS idx_documents_application_id ON documents(application_id);

-- Note: Les applications peuvent être gérées via l'interface Admin
-- (Création, modification, suppression par les éditeurs et admins)
-- Ces données par défaut peuvent être modifiées selon vos besoins
