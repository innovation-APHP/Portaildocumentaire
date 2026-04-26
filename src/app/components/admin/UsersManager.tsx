import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Users, Plus, Trash2, Edit, Shield, UserCheck, UserX, Search } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';
import { UserEditor } from './UserEditor';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  created_at: string;
  updated_at: string;
}

export function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await apiClient.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }

  const handleCreateUser = () => {
    setIsCreating(true);
    setEditingUser(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsCreating(false);
  };

  const handleCloseEditor = () => {
    setEditingUser(null);
    setIsCreating(false);
    loadUsers();
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Voulez-vous vraiment supprimer l'utilisateur "${user.username}" ?`)) {
      return;
    }

    try {
      await apiClient.deleteUser(user.id);
      toast.success('Utilisateur supprimé avec succès');
      loadUsers();
    } catch (error: any) {
      const message = error?.message || 'Erreur lors de la suppression';
      toast.error(message);
      console.error('Error deleting user:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'editor':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'user':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'editor':
        return <Edit className="h-3 w-3" />;
      case 'user':
        return <UserCheck className="h-3 w-3" />;
      default:
        return <UserCheck className="h-3 w-3" />;
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (editingUser || isCreating) {
    return (
      <UserEditor
        user={isCreating ? null : editingUser}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
            <p className="text-sm text-gray-600">{users.length} utilisateur(s) total</p>
          </div>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Rechercher par nom, email ou rôle..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{user.username}</h3>
                        <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1 capitalize">{user.role}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Créé le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {/* Permissions Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-blue-900">
            ℹ️ Rôles et Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-blue-800 space-y-2">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 flex-shrink-0 mt-0.5 text-purple-600" />
            <div>
              <strong>Admin</strong> - Tous les droits (gestion utilisateurs, documents, tags, suppression)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Edit className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-600" />
            <div>
              <strong>Éditeur</strong> - Création et modification de documents et tags (pas de suppression)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <UserCheck className="h-4 w-4 flex-shrink-0 mt-0.5 text-gray-600" />
            <div>
              <strong>Utilisateur</strong> - Lecture seule de la documentation et utilisation de l'assistant IA
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
