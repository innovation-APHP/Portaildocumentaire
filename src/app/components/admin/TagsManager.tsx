import { useState, useEffect } from 'react';
import { Plus, Trash2, Tag as TagIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';

interface Tag {
  id: string;
  name: string;
  color: string;
  document_count: number;
}

export function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState({ name: '', color: '#3B82F6' });

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    try {
      setLoading(true);
      const data = await apiClient.getTags();
      setTags(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des tags');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!newTag.name.trim()) {
      toast.error('Le nom du tag est requis');
      return;
    }

    try {
      await apiClient.createTag(newTag);
      toast.success('Tag créé avec succès');
      setNewTag({ name: '', color: '#3B82F6' });
      loadTags();
    } catch (error) {
      toast.error('Erreur lors de la création du tag');
      console.error(error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tag ?')) {
      return;
    }

    try {
      await apiClient.deleteTag(id);
      toast.success('Tag supprimé avec succès');
      loadTags();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error(error);
    }
  }

  const colorPresets = [
    '#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B',
    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Créer un nouveau tag</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <Label htmlFor="tagName">Nom du tag</Label>
            <Input
              id="tagName"
              value={newTag.name}
              onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              placeholder="Ex: API, Sécurité, Guide..."
            />
          </div>
          <div>
            <Label>Couleur</Label>
            <div className="flex gap-2 flex-wrap mb-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewTag({ ...newTag, color })}
                  className="w-8 h-8 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: newTag.color === color ? '#000' : 'transparent',
                  }}
                />
              ))}
            </div>
            <Input
              type="color"
              value={newTag.color}
              onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
              className="w-24 h-10"
            />
          </div>
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" />
            Créer le tag
          </Button>
        </form>
      </Card>

      {loading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : (
        <div className="grid gap-3">
          <h3 className="text-lg font-semibold">Tags existants ({tags.length})</h3>
          {tags.map((tag) => (
            <Card key={tag.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <TagIcon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{tag.name}</span>
                  <span className="text-sm text-gray-500">
                    ({tag.document_count} document{tag.document_count > 1 ? 's' : ''})
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(tag.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </Card>
          ))}
          {tags.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun tag créé
            </div>
          )}
        </div>
      )}
    </div>
  );
}
