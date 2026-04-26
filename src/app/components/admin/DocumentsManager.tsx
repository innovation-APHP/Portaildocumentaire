import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { DocumentEditor } from './DocumentEditor';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
  tags: Array<{ id: string; name: string; color: string }>;
  author_name: string;
}

export function DocumentsManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    loadDocuments();
  }, [categoryFilter]);

  async function loadDocuments() {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      if (categoryFilter) params.category = categoryFilter;

      const data = await apiClient.getDocuments(params);
      setDocuments(data.documents);
    } catch (error) {
      toast.error('Erreur lors du chargement des documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return;
    }

    try {
      await apiClient.deleteDocument(id);
      toast.success('Document supprimé avec succès');
      loadDocuments();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error(error);
    }
  }

  function handleEdit(doc: Document) {
    setSelectedDocument(doc);
    setIsEditorOpen(true);
  }

  function handleCreate() {
    setSelectedDocument(null);
    setIsEditorOpen(true);
  }

  function handleEditorClose() {
    setIsEditorOpen(false);
    setSelectedDocument(null);
    loadDocuments();
  }

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isEditorOpen) {
    return <DocumentEditor document={selectedDocument} onClose={handleEditorClose} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 flex gap-4">
          <Input
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">Toutes les catégories</option>
            <option value="functional">Fonctionnelle</option>
            <option value="technical">Technique</option>
            <option value="user">Utilisateur</option>
          </select>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau document
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : (
        <div className="grid gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold">{doc.title}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {doc.category}
                    </span>
                  </div>
                  {doc.description && (
                    <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Par {doc.author_name}</span>
                    <span>•</span>
                    <span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                    {doc.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex gap-1">
                          {doc.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 text-xs rounded"
                              style={{ backgroundColor: tag.color + '20', color: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(doc)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun document trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
}
