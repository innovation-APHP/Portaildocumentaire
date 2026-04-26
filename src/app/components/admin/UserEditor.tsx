import { useState } from 'react';
import { X, Save, Shield, Edit as EditIcon, UserCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
}

interface UserEditorProps {
  user: User | null;
  onClose: () => void;
}

export function UserEditor({ user, onClose }: UserEditorProps) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || 'user',
    password: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  const isEditing = !!user;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation du mot de passe
    if (!isEditing || formData.password) {
      if (formData.password.length < 8) {
        toast.error('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas');
        return;
      }
    }

    setSaving(true);

    try {
      const userData: any = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
      };

      // Ajouter le mot de passe seulement s'il est renseigné
      if (formData.password) {
        userData.password = formData.password;
      }

      if (isEditing) {
        await apiClient.updateUser(user.id, userData);
        toast.success('Utilisateur modifié avec succès');
      } else {
        if (!formData.password) {
          toast.error('Le mot de passe est requis pour créer un utilisateur');
          setSaving(false);
          return;
        }
        await apiClient.createUser(userData);
        toast.success('Utilisateur créé avec succès');
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
            {isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Nom d'utilisateur *</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                minLength={3}
                maxLength={50}
                placeholder="johndoe"
              />
              <p className="text-xs text-gray-500 mt-1">
                3-50 caractères, utilisé pour la connexion
              </p>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="role">Rôle *</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="user">Utilisateur - Lecture seule</option>
              <option value="editor">Éditeur - Créer et modifier</option>
              <option value="admin">Admin - Tous les droits</option>
            </select>

            {/* Explications des rôles */}
            <div className="mt-3 space-y-2">
              <div className={`p-3 rounded-lg border ${formData.role === 'user' ? 'bg-gray-50 border-gray-300' : 'bg-gray-50/50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="h-4 w-4 text-gray-600" />
                  <strong className="text-sm">Utilisateur</strong>
                </div>
                <p className="text-xs text-gray-600">
                  Peut consulter la documentation et utiliser l'assistant IA
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${formData.role === 'editor' ? 'bg-blue-50 border-blue-300' : 'bg-blue-50/50 border-blue-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <EditIcon className="h-4 w-4 text-blue-600" />
                  <strong className="text-sm text-blue-900">Éditeur</strong>
                </div>
                <p className="text-xs text-blue-700">
                  + Créer et modifier des documents et tags
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${formData.role === 'admin' ? 'bg-purple-50 border-purple-300' : 'bg-purple-50/50 border-purple-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <strong className="text-sm text-purple-900">Admin</strong>
                </div>
                <p className="text-xs text-purple-700">
                  + Gérer les utilisateurs, supprimer des documents, configuration complète
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">
              {isEditing ? 'Modifier le mot de passe (optionnel)' : 'Mot de passe *'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">
                  {isEditing ? 'Nouveau mot de passe' : 'Mot de passe'}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!isEditing}
                  minLength={8}
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isEditing ? 'Laissez vide pour ne pas changer' : 'Minimum 8 caractères'}
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isEditing || !!formData.password}
                  minLength={8}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

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
