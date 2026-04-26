import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Trash2, Edit, Smartphone, ShoppingCart, Settings as SettingsIcon, UserCircle, Workflow, Folder, Search } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';
import { ApplicationEditor } from './ApplicationEditor';

interface Application {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  document_count: number;
  created_at?: string;
}

export function ApplicationsManager() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      const data = await apiClient.getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Erreur lors du chargement des applications');
    } finally {
      setLoading(false);
    }
  }

  const handleCreateApplication = () => {
    setIsCreating(true);
    setEditingApplication(null);
  };

  const handleEditApplication = (app: Application) => {
    setEditingApplication(app);
    setIsCreating(false);
  };

  const handleCloseEditor = () => {
    setEditingApplication(null);
    setIsCreating(false);
    loadApplications();
  };

  const handleDeleteApplication = async (app: Application) => {
    if (app.document_count > 0) {
      toast.error(`Impossible de supprimer: ${app.document_count} document(s) associé(s)`);
      return;
    }

    if (!confirm(`Voulez-vous vraiment supprimer l'application "${app.name}" ?`)) {
      return;
    }

    try {
      await apiClient.deleteApplication(app.id);
      toast.success('Application supprimée avec succès');
      loadApplications();
    } catch (error: any) {
      const message = error?.message || 'Erreur lors de la suppression';
      toast.error(message);
      console.error('Error deleting application:', error);
    }
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'ShoppingCart':
        return <ShoppingCart className="h-5 w-5" />;
      case 'UserCircle':
        return <UserCircle className="h-5 w-5" />;
      case 'Settings':
        return <SettingsIcon className="h-5 w-5" />;
      case 'Workflow':
        return <Workflow className="h-5 w-5" />;
      case 'Smartphone':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Folder className="h-5 w-5" />;
    }
  };

  const getColorClass = (colorClass: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-500': '#3B82F6',
      'bg-green-500': '#10B981',
      'bg-purple-500': '#8B5CF6',
      'bg-orange-500': '#F97316',
      'bg-pink-500': '#EC4899',
      'bg-red-500': '#EF4444',
      'bg-teal-500': '#14B8A6',
      'bg-indigo-500': '#6366F1',
      'bg-yellow-500': '#EAB308',
      'bg-cyan-500': '#06B6D4',
    };
    return colorMap[colorClass] || '#3B82F6';
  };

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  if (editingApplication || isCreating) {
    return (
      <ApplicationEditor
        application={isCreating ? null : editingApplication}
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
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Applications</h2>
            <p className="text-sm text-gray-600">{applications.length} application(s) total</p>
          </div>
        </div>
        <Button onClick={handleCreateApplication}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle application
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Rechercher par nom, ID ou description..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Applications Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune application trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: getColorClass(app.color) }}
                  >
                    {getIconComponent(app.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {app.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                      {app.id}
                    </p>
                  </div>
                </div>

                {app.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {app.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    {app.document_count} doc{app.document_count > 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditApplication(app)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteApplication(app)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={app.document_count > 0}
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
            ℹ️ À propos des Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-blue-800 space-y-2">
          <p>
            <strong>Les applications</strong> représentent les différents systèmes ou modules de votre infrastructure (E-commerce, API, Mobile, etc.)
          </p>
          <p>
            <strong>ID:</strong> Identifiant unique en minuscules, utilisé dans les filtres (ex: "ecommerce", "api-gateway")
          </p>
          <p className="text-red-700">
            <strong>⚠️ Suppression:</strong> Une application ne peut être supprimée que si aucun document n'y est associé
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
