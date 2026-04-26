import { connectionConfig } from './connectionConfig';

const API_BASE_URL = connectionConfig.getApiUrl();
const USE_MOCK_DATA = !API_BASE_URL || API_BASE_URL === '';

// Log du mode au démarrage
const configSource = connectionConfig.hasCustomConfig() ? '(configuré via Paramètres)' : '(fichier .env)';
console.log('🔧 API Client Mode:', USE_MOCK_DATA ? 'MOCK (Données de démo)' : `API ${configSource} - ${API_BASE_URL}`);

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  }

  private getHeadersMultipart(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async login(username: string, password: string) {
    // Mode mock pour développement Figma Make
    if (USE_MOCK_DATA) {
      console.log('🔐 Tentative de connexion en mode MOCK');
      console.log('📝 Username fourni:', username);
      console.log('📝 Password fourni:', password ? '***' + password.slice(-3) : 'vide');

      await new Promise(resolve => setTimeout(resolve, 500)); // Simule latence réseau

      // Utilisateurs de démonstration
      const mockUsers = [
        { username: 'admin', password: 'password123', id: '1', email: 'admin@example.com', role: 'admin' },
        { username: 'editor', password: 'password123', id: '2', email: 'editor@example.com', role: 'editor' },
        { username: 'user', password: 'password123', id: '3', email: 'user@example.com', role: 'user' },
      ];

      console.log('👥 Utilisateurs disponibles:', mockUsers.map(u => u.username));

      const user = mockUsers.find(u => u.username === username && u.password === password);

      if (!user) {
        console.error('❌ Aucun utilisateur trouvé avec ces identifiants');
        console.log('🔍 Vérification:', {
          usernameMatch: mockUsers.some(u => u.username === username),
          passwordMatch: mockUsers.some(u => u.password === password),
        });
        throw new Error('Identifiants invalides');
      }

      console.log('✅ Connexion réussie:', user.username, '-', user.role);

      const mockToken = btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role }));
      localStorage.setItem('auth_token', mockToken);

      return {
        token: mockToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    }

    // Mode API réel
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async getDocuments(params: any = {}) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { mockDocuments } = await import('../data/mockDocuments');

      let filtered = [...mockDocuments];

      if (params.category) {
        filtered = filtered.filter(doc => doc.category === params.category);
      }

      if (params.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(doc =>
          doc.title.toLowerCase().includes(search) ||
          doc.description.toLowerCase().includes(search)
        );
      }

      return {
        documents: filtered.map(doc => ({
          ...doc,
          author_name: doc.author,
          created_at: doc.lastUpdated,
          updated_at: doc.lastUpdated,
          tags: doc.tags.map((tag, idx) => ({ id: String(idx), name: tag, color: '#3B82F6' })),
        })),
        pagination: {
          page: 1,
          limit: 50,
          total: filtered.length,
          pages: 1,
        },
      };
    }

    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/documents?${query}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    return response.json();
  }

  async getDocument(id: string) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { mockDocuments } = await import('../data/mockDocuments');

      const doc = mockDocuments.find(d => d.id === id);

      if (!doc) {
        throw new Error('Document not found');
      }

      return {
        ...doc,
        author_name: doc.author,
        created_at: doc.lastUpdated,
        updated_at: doc.lastUpdated,
        tags: doc.tags.map((tag, idx) => ({ id: String(idx), name: tag, color: '#3B82F6' })),
        related_documents: doc.relatedDocs?.map(relId => {
          const rel = mockDocuments.find(d => d.id === relId);
          return rel ? { id: rel.id, title: rel.title, slug: rel.id } : null;
        }).filter(Boolean) || [],
      };
    }

    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }

    return response.json();
  }

  async createDocument(formData: FormData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Document créé (simulation uniquement)');
      return { id: Date.now().toString(), success: true };
    }

    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: this.getHeadersMultipart(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create document');
    }

    return response.json();
  }

  async updateDocument(id: string, formData: FormData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Document mis à jour (simulation uniquement)');
      return { id, success: true };
    }

    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: this.getHeadersMultipart(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update document');
    }

    return response.json();
  }

  async deleteDocument(id: string) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Document supprimé (simulation uniquement)');
      return { success: true };
    }

    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete document');
    }

    return response.json();
  }

  async getTags() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { mockDocuments } = await import('../data/mockDocuments');

      const allTags = new Set(mockDocuments.flatMap(d => d.tags));
      const tagsArray = Array.from(allTags).map((tag, idx) => ({
        id: String(idx + 1),
        name: tag,
        color: '#3B82F6',
        document_count: mockDocuments.filter(d => d.tags.includes(tag)).length,
      }));

      return tagsArray;
    }

    const response = await fetch(`${API_BASE_URL}/tags`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    return response.json();
  }

  async createTag(tag: { name: string; color?: string }) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Tag créé (simulation uniquement)', tag);
      return { id: Date.now().toString(), ...tag, color: tag.color || '#3B82F6' };
    }

    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(tag),
    });

    if (!response.ok) {
      throw new Error('Failed to create tag');
    }

    return response.json();
  }

  async deleteTag(id: string) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Tag supprimé (simulation uniquement)');
      return { success: true };
    }

    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete tag');
    }

    return response.json();
  }

  async getStats() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { mockDocuments } = await import('../data/mockDocuments');

      const categoryCount = {
        functional: mockDocuments.filter(d => d.category === 'functional').length,
        technical: mockDocuments.filter(d => d.category === 'technical').length,
        user: mockDocuments.filter(d => d.category === 'user').length,
      };

      const allTags = new Set(mockDocuments.flatMap(d => d.tags));

      const recent = [...mockDocuments]
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, 5)
        .map(doc => ({
          ...doc,
          author_name: doc.author,
          created_at: doc.lastUpdated,
          tags: doc.tags.map((tag, idx) => ({ id: String(idx), name: tag, color: '#3B82F6' })),
        }));

      return {
        totalDocuments: mockDocuments.length,
        documentsByCategory: categoryCount,
        totalTags: allTags.size,
        recentDocuments: recent,
      };
    }

    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  }

  // ========== Gestion des Utilisateurs ==========

  async getUsers() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Retourner des utilisateurs de démonstration
      return [
        { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin', created_at: '2026-01-01', updated_at: '2026-01-01' },
        { id: '2', username: 'editor', email: 'editor@example.com', role: 'editor', created_at: '2026-01-02', updated_at: '2026-01-02' },
        { id: '3', username: 'user', email: 'user@example.com', role: 'user', created_at: '2026-01-03', updated_at: '2026-01-03' },
      ];
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  async createUser(userData: { username: string; email: string; password: string; role: string }) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Utilisateur créé (simulation uniquement)', userData);
      return { id: Date.now().toString(), ...userData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    return response.json();
  }

  async updateUser(id: string, userData: { username?: string; email?: string; password?: string; role?: string }) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Utilisateur mis à jour (simulation uniquement)', id, userData);
      return { id, ...userData, updated_at: new Date().toISOString() };
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }

    return response.json();
  }

  async deleteUser(id: string) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Utilisateur supprimé (simulation uniquement)', id);
      return { success: true };
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }

    return response.json();
  }

  // ========== Gestion des Catégories ==========

  async getCategories() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Retourner des catégories de démonstration
      return [
        { id: '1', name: 'Fonctionnel', slug: 'functional', color: '#10B981', icon: 'FileText', description: 'Documentation fonctionnelle et spécifications', document_count: 5, created_at: '2026-01-01', updated_at: '2026-01-01' },
        { id: '2', name: 'Technique', slug: 'technical', color: '#3B82F6', icon: 'Code', description: 'Documentation technique et guides développeur', document_count: 8, created_at: '2026-01-01', updated_at: '2026-01-01' },
        { id: '3', name: 'Utilisateur', slug: 'user', color: '#F59E0B', icon: 'Users', description: 'Guides utilisateur et tutoriels', document_count: 3, created_at: '2026-01-01', updated_at: '2026-01-01' },
      ];
    }

    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  }

  async createCategory(categoryData: { name: string; slug: string; color?: string; icon?: string; description?: string | null }) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Catégorie créée (simulation uniquement)', categoryData);
      return { id: Date.now().toString(), ...categoryData, document_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }

    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create category');
    }

    return response.json();
  }

  async updateCategory(id: string, categoryData: { name?: string; slug?: string; color?: string; icon?: string; description?: string | null }) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Catégorie mise à jour (simulation uniquement)', id, categoryData);
      return { id, ...categoryData, updated_at: new Date().toISOString() };
    }

    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }

    return response.json();
  }

  async deleteCategory(id: string) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Catégorie supprimée (simulation uniquement)', id);
      return { success: true };
    }

    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }

    return response.json();
  }

  // ========== Gestion des Applications ==========

  async getApplications() {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Retourner des applications de démonstration
      const { applications } = await import('../data/mockDocuments');
      return applications.map((app, idx) => ({
        id: app.id,
        name: app.name,
        description: app.description,
        color: app.color,
        icon: 'Folder',
        document_count: idx + 2, // Mock count
      }));
    }

    const response = await fetch(`${API_BASE_URL}/applications`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    return response.json();
  }

  async createApplication(appData: { id: string; name: string; color?: string; icon?: string; description?: string | null }) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Application créée (simulation uniquement)', appData);
      return { ...appData, document_count: 0, created_at: new Date().toISOString() };
    }

    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(appData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create application');
    }

    return response.json();
  }

  async updateApplication(id: string, appData: { name?: string; color?: string; icon?: string; description?: string | null }) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Application mise à jour (simulation uniquement)', id, appData);
      return { id, ...appData };
    }

    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(appData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update application');
    }

    return response.json();
  }

  async deleteApplication(id: string) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Application supprimée (simulation uniquement)', id);
      return { success: true };
    }

    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete application');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
