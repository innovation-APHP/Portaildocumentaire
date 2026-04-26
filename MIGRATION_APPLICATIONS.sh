#!/bin/bash

# =============================================================================
# Script de migration pour ajouter la table applications (lecture seule)
# =============================================================================

echo "🔄 Migration: Ajout de la table applications"
echo "============================================="
echo ""

# Vérifier si PostgreSQL est accessible
if ! command -v psql &> /dev/null; then
    echo "❌ Erreur: PostgreSQL (psql) n'est pas installé ou n'est pas dans le PATH"
    exit 1
fi

# Configuration (à adapter selon votre environnement)
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-portail_doc}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo "📝 Configuration:"
echo "  - Database: $DB_NAME"
echo "  - User: $DB_USER"
echo "  - Host: $DB_HOST:$DB_PORT"
echo ""

# Demander confirmation
read -p "⚠️  Cette migration va modifier la structure de la base de données. Continuer ? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration annulée"
    exit 0
fi

# Exécuter la migration
echo "🚀 Exécution de la migration..."
echo ""

MIGRATION_FILE="server/src/db/migrations/add_applications_table.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Erreur: Fichier de migration introuvable: $MIGRATION_FILE"
    exit 1
fi

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration réussie!"
    echo ""
    echo "📊 Vérification des applications créées:"
    echo "SELECT id, name, description FROM applications ORDER BY name;" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"
    echo ""
    echo "✨ Les applications sont maintenant disponibles!"
    echo ""
    echo "📖 Informations importantes:"
    echo "  ✅  Les applications peuvent être gérées via l'interface Admin"
    echo "  ✅  Éditeurs et admins peuvent créer et modifier"
    echo "  ✅  Seuls les admins peuvent supprimer (si aucun document associé)"
    echo ""
    echo "📚 Prochaines étapes:"
    echo "  1. Redémarrez le serveur backend: cd server && npm run dev"
    echo "  2. Accédez à l'interface admin: /admin > Onglet Applications"
    echo "  3. Consultez les 5 applications par défaut"
    echo ""
    echo "📚 Documentation: GESTION_APPLICATIONS.md"
else
    echo ""
    echo "❌ Erreur lors de la migration"
    echo "Vérifiez les logs ci-dessus pour plus de détails"
    exit 1
fi
