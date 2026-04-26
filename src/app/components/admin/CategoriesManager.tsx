import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Trash2, Edit, Folder, FileText, Code, Users as UsersIcon, Search } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';
import { CategoryEditor } from './CategoryEditor';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string;
  description?: string;
  document_count: number;
  created_at: string;
  updated_at: string;
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await apiClient.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  }

  const handleCreateCategory = () => {
    setIsCreating(true);
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCreating(false);
  };

  const handleCloseEditor = () => {
    setEditingCategory(null);
    setIsCreating(false);
    loadCategories();
  };

  const handleDeleteCategory = async (category: Category) => {
    if (category.document_count > 0) {
      toast.error(`Impossible de supprimer: ${category.document_count} document(s) associé(s)`);
      return;
    }

    if (!confirm(`Voulez-vous vraiment supprimer la catégorie "${category.name}" ?`)) {
      return;
    }

    try {
      await apiClient.deleteCategory(category.id);
      toast.success('Catégorie supprimée avec succès');
      loadCategories();
    } catch (error: any) {
      const message = error?.message || 'Erreur lors de la suppression';
      toast.error(message);
      console.error('Error deleting category:', error);
    }
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="h-5 w-5" />;
      case 'Code':
        return <Code className="h-5 w-5" />;
      case 'Users':
        return <UsersIcon className="h-5 w-5" />;
      default:
        return <Folder className="h-5 w-5" />;
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  if (editingCategory || isCreating) {
    return (
      <CategoryEditor
        category={isCreating ? null : editingCategory}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
            <p className="text-sm text-gray-600">{categories.length} catégorie(s) total</p>
          </div>
        </div>
        <Button onClick={handleCreateCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Rechercher par nom, slug ou description..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune catégorie trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {getIconComponent(category.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                      {category.slug}
                    </p>
                  </div>
                </div>

                {category.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    {category.document_count} doc{category.document_count > 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={category.document_count > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-blue-900">
            ℹ️ À propos des Catégories
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-blue-800 space-y-2">
          <p>
            <strong>Les catégories</strong> permettent d'organiser vos documents par grands thèmes (Fonctionnel, Technique, Utilisateur, etc.)
          </p>
          <p>
            <strong>Slug:</strong> Identifiant unique en minuscules, utilisé dans les URLs (ex: "technical", "user-guide")
          </p>
          <p className="text-red-700">
            <strong>⚠️ Suppression:</strong> Une catégorie ne peut être supprimée que si aucun document n'y est associé
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
