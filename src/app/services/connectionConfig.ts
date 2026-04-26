// Service de gestion de la configuration des connexions (API Backend et RAG)
// Les paramètres sauvegardés ici ont la priorité sur les variables d'environnement

interface ConnectionConfig {
  apiUrl?: string;          // URL de l'API PostgreSQL Backend
  ragApiUrl?: string;        // URL de l'API RAG
  ragApiToken?: string;      // Token d'authentification RAG
}

const CONFIG_KEY = 'connection_config';

class ConnectionConfigService {
  // Récupérer la configuration sauvegardée
  getConfig(): ConnectionConfig {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Erreur lors de la lecture de la configuration de connexion:', error);
      return {};
    }
  }

  // Sauvegarder la configuration
  saveConfig(config: ConnectionConfig): void {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      console.log('✅ Configuration de connexion sauvegardée');
      // Forcer le rechargement de la page pour appliquer les nouveaux paramètres
      window.location.reload();
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la configuration:', error);
      throw new Error('Impossible de sauvegarder la configuration');
    }
  }

  // Récupérer une valeur spécifique avec fallback sur les variables d'environnement
  get<K extends keyof ConnectionConfig>(key: K, envFallback?: string): string | undefined {
    const config = this.getConfig();
    const value = config[key];

    // Si une valeur est configurée dans localStorage, l'utiliser
    if (value && value.trim() !== '') {
      return value;
    }

    // Sinon, utiliser la variable d'environnement
    return envFallback;
  }

  // Mettre à jour une valeur spécifique
  set<K extends keyof ConnectionConfig>(key: K, value: string | undefined): void {
    const config = this.getConfig();
    if (value && value.trim() !== '') {
      config[key] = value.trim();
    } else {
      delete config[key];
    }
    this.saveConfig(config);
  }

  // Supprimer toute la configuration et revenir aux variables d'environnement
  clearConfig(): void {
    if (confirm('Voulez-vous supprimer toute la configuration personnalisée et revenir aux paramètres par défaut (.env) ?')) {
      localStorage.removeItem(CONFIG_KEY);
      console.log('🗑️ Configuration de connexion réinitialisée');
      window.location.reload();
    }
  }

  // Vérifier si une configuration personnalisée existe
  hasCustomConfig(): boolean {
    const config = this.getConfig();
    return Object.keys(config).length > 0;
  }

  // Obtenir l'URL de l'API (avec priorité localStorage > env)
  getApiUrl(): string {
    return this.get('apiUrl', import.meta.env.VITE_API_URL) || '';
  }

  // Obtenir l'URL de l'API RAG (avec priorité localStorage > env)
  getRagApiUrl(): string {
    return this.get('ragApiUrl', import.meta.env.VITE_RAG_API_URL) || '';
  }

  // Obtenir le token RAG (avec priorité localStorage > env)
  getRagApiToken(): string {
    return this.get('ragApiToken', import.meta.env.VITE_RAG_API_TOKEN) || '';
  }

  // Tester la connexion à l'API Backend
  async testBackendConnection(url: string): Promise<{ success: boolean; message: string }> {
    try {
      const testUrl = url.endsWith('/') ? url + 'health' : url + '/health';
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        return { success: true, message: 'Connexion réussie !' };
      } else {
        return { success: false, message: `Erreur HTTP ${response.status}` };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Impossible de se connecter',
      };
    }
  }

  // Tester la connexion à l'API RAG
  async testRagConnection(url: string, token?: string): Promise<{ success: boolean; message: string }> {
    try {
      const testUrl = url.endsWith('/') ? url + 'health' : url + '/health';
      const headers: HeadersInit = { 'Content-Type': 'application/json' };

      if (token && token.trim() !== '') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(testUrl, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        return { success: true, message: 'Connexion RAG réussie !' };
      } else if (response.status === 401) {
        return { success: false, message: 'Token d\'authentification invalide' };
      } else {
        return { success: false, message: `Erreur HTTP ${response.status}` };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Impossible de se connecter au RAG',
      };
    }
  }
}

export const connectionConfig = new ConnectionConfigService();

// Afficher la config au démarrage
const config = connectionConfig.getConfig();
if (connectionConfig.hasCustomConfig()) {
  console.log('⚙️ Configuration de connexion personnalisée détectée:');
  console.log('  📡 API Backend:', config.apiUrl || '(env)');
  console.log('  🤖 API RAG:', config.ragApiUrl || '(env)');
  console.log('  🔑 Token RAG:', config.ragApiToken ? '✓ configuré' : '(env)');
} else {
  console.log('⚙️ Utilisation des variables d\'environnement (.env)');
}
