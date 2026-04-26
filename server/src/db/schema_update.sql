-- ============================================================================
-- Mise à jour du schéma pour supporter les liens externes et fichiers
-- ============================================================================

-- Ajouter une colonne pour les URLs externes
ALTER TABLE documents ADD COLUMN IF NOT EXISTS external_url VARCHAR(2000);

-- Ajouter une colonne pour le type de fichier
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_type VARCHAR(50);

-- Ajouter une colonne pour indiquer si c'est un lien externe
ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_external BOOLEAN DEFAULT false;

-- Commenter les nouvelles colonnes
COMMENT ON COLUMN documents.external_url IS 'URL externe pour les documents hébergés ailleurs';
COMMENT ON COLUMN documents.file_type IS 'Type MIME du fichier uploadé (ex: application/pdf)';
COMMENT ON COLUMN documents.is_external IS 'True si le document est un lien externe, false si stocké localement';
