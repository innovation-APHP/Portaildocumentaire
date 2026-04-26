import { useState } from 'react';
import { X, Save, Smartphone, ShoppingCart, Settings as SettingsIcon, UserCircle, Workflow, Folder, Database, Layers, Cloud } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';

interface Application {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
}

interface ApplicationEditorProps {
  application: Application | null;
  onClose: () => void;
}

export function ApplicationEditor({ application, onClose }: ApplicationEditorProps) {
  const [formData, setFormData] = useState({
    id: application?.id || '',
    name: application?.name || '',
    color: application?.color || 'bg-blue-500',
    icon: application?.icon || 'Folder',
    description: application?.description || '',
  });
  const [saving, setSaving] = useState(false);

  const isEditing = !!application;

  const iconOptions = [
    { name: 'Folder', component: Folder, label: 'Dossier' },
    { name: 'ShoppingCart', component: ShoppingCart, label: 'E-commerce' },
    { name: 'UserCircle', component: UserCircle, label: 'Utilisateur' },
    { name: 'Settings', component: SettingsIcon, label: 'Paramètres' },
    { name: 'Workflow', component: Workflow, label: 'Workflow' },
    { name: 'Smartphone', component: Smartphone, label: 'Mobile' },
    { name: 'Database', component: Database, label: 'Base de données' },
    { name: 'Layers', component: Layers, label: 'Couches' },
    { name: 'Cloud', component: Cloud, label: 'Cloud' },
  ];

  const colorPresets = [
    { class: 'bg-blue-500', hex: '#3B82F6', label: 'Bleu' },
    { class: 'bg-green-500', hex: '#10B981', label: 'Vert' },
    { class: 'bg-purple-500', hex: '#8B5CF6', label: 'Violet' },
    { class: 'bg-orange-500', hex: '#F97316', label: 'Orange' },
    { class: 'bg-pink-500', hex: '#EC4899', label: 'Rose' },
    { class: 'bg-red-500', hex: '#EF4444', label: 'Rouge' },
    { class: 'bg-teal-500', hex: '#14B8A6', label: 'Turquoise' },
    { class: 'bg-indigo-500', hex: '#6366F1', label: 'Indigo' },
    { class: 'bg-yellow-500', hex: '#EAB308', label: 'Jaune' },
    { class: 'bg-cyan-500', hex: '#06B6D4', label: 'Cyan' },
  ];

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-générer l'ID depuis le nom (uniquement en création)
    if (name === 'name' && !isEditing) {
      const autoId = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, id: autoId }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (formData.name.length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères');
      return;
    }

    if (!isEditing && (formData.id.length < 2 || !/^[a-z0-9-]+$/.test(formData.id))) {
      toast.error('L\'ID doit contenir uniquement des lettres minuscules, chiffres et tirets');
      return;
    }

    setSaving(true);

    try {
      const appData = {
        id: formData.id,
        name: formData.name,
        color: formData.color,
        icon: formData.icon,
        description: formData.description || null,
      };

      if (isEditing) {
        // On n'envoie pas l'ID dans l'update
        const { id, ...updateData } = appData;
        await apiClient.updateApplication(application.id, updateData);
        toast.success('Application modifiée avec succès');
      } else {
        await apiClient.createApplication(appData);
        toast.success('Application créée avec succès');
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

  const getColorHex = (colorClass: string) => {
    const preset = colorPresets.find(c => c.class === colorClass);
    return preset?.hex || '#3B82F6';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-y-auto z-50">
      <Card className="w-full max-w-2xl my-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Modifier l\'application' : 'Nouvelle application'}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom et ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de l'application *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                minLength={2}
                maxLength={100}
                placeholder="Ex: Plateforme E-commerce"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nom affiché dans l'interface
              </p>
            </div>

            <div>
              <Label htmlFor="id">ID (identifiant) *</Label>
              <Input
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                required
                disabled={isEditing}
                minLength={2}
                maxLength={50}
                pattern="^[a-z0-9-]+$"
                placeholder="Ex: ecommerce, api-gateway"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                {isEditing ? 'L\'ID ne peut pas être modifié' : 'Minuscules, chiffres et tirets uniquement'}
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
              placeholder="Décrivez brièvement cette application..."
            />
          </div>

          {/* Icône */}
          <div>
            <Label>Icône</Label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
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
            <div className="grid grid-cols-5 gap-2 mt-2">
              {colorPresets.map(({ class: colorClass, hex, label }) => (
                <button
                  key={colorClass}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: colorClass })}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                    formData.color === colorClass
                      ? 'border-black'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={label}
                >
                  <span className="text-xs text-white font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aperçu */}
          <div className="border-t pt-4">
            <Label>Aperçu</Label>
            <Card className="p-4 mt-2">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: getColorHex(formData.color) }}
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
                    {formData.name || 'Nom de l\'application'}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {formData.id || 'id-auto'}
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
