import { useState } from 'react';
import { X, Save, Folder, FileText, Code, Users as UsersIcon, Sparkles, Book, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string;
  description?: string;
}

interface CategoryEditorProps {
  category: Category | null;
  onClose: () => void;
}

export function CategoryEditor({ category, onClose }: CategoryEditorProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    color: category?.color || '#3B82F6',
    icon: category?.icon || 'Folder',
    description: category?.description || '',
  });
  const [saving, setSaving] = useState(false);

  const isEditing = !!category;

  const iconOptions = [
    { name: 'Folder', component: Folder, label: 'Dossier' },
    { name: 'FileText', component: FileText, label: 'Document' },
    { name: 'Code', component: Code, label: 'Code' },
    { name: 'Users', component: UsersIcon, label: 'Utilisateurs' },
    { name: 'Book', component: Book, label: 'Livre' },
    { name: 'Sparkles', component: Sparkles, label: 'Étoile' },
    { name: 'Settings', component: SettingsIcon, label: 'Paramètres' },
  ];

  const colorPresets = [
    '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1'
  ];

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-générer le slug depuis le nom
    if (name === 'name' && !isEditing) {
      const autoSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (formData.name.length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères');
      return;
    }

    if (formData.slug.length < 2 || !/^[a-z0-9-]+$/.test(formData.slug)) {
      toast.error('Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets');
      return;
    }

    setSaving(true);

    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        color: formData.color,
        icon: formData.icon,
        description: formData.description || null,
      };

      if (isEditing) {
        await apiClient.updateCategory(category.id, categoryData);
        toast.success('Catégorie modifiée avec succès');
      } else {
        await apiClient.createCategory(categoryData);
        toast.success('Catégorie créée avec succès');
      }

      onClose();
    } catch (error: any) {
      const message = error?.message || 'Erreur lors de l\'enregistrement';
      toast.error(message);
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-y-auto z-50">
      <Card className="w-full max-w-2xl my-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom et Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de la catégorie *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                minLength={2}
                maxLength={100}
                placeholder="Ex: Technique, Utilisateur..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Nom affiché dans l'interface
              </p>
            </div>

            <div>
              <Label htmlFor="slug">Slug (identifiant) *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                minLength={2}
                maxLength={100}
                pattern="^[a-z0-9-]+$"
                placeholder="Ex: technical, user-guide"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minuscules, chiffres et tirets uniquement
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (optionnel)</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg min-h-[80px]"
              placeholder="Décrivez brièvement cette catégorie..."
            />
          </div>

          {/* Icône */}
          <div>
            <Label>Icône</Label>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
              {iconOptions.map(({ name, component: Icon, label }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: name })}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    formData.icon === name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={label}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div>
            <Label>Couleur</Label>
            <div className="flex gap-2 flex-wrap mt-2 mb-3">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className="w-10 h-10 rounded-lg border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: formData.color === color ? '#000' : 'transparent',
                  }}
                  title={color}
                />
              ))}
            </div>
            <Input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-32 h-10"
            />
          </div>

          {/* Aperçu */}
          <div className="border-t pt-4">
            <Label>Aperçu</Label>
            <Card className="p-4 mt-2">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: formData.color }}
                >
                  {iconOptions.find(i => i.name === formData.icon)?.component && (
                    (() => {
                      const Icon = iconOptions.find(i => i.name === formData.icon)!.component;
                      return <Icon className="h-6 w-6" />;
                    })()
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {formData.name || 'Nom de la catégorie'}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {formData.slug || 'slug-auto'}
                  </p>
                  {formData.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
