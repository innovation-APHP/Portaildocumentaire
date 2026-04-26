const RAG_API_URL = import.meta.env.VITE_RAG_API_URL || '';
const RAG_API_TOKEN = import.meta.env.VITE_RAG_API_TOKEN || '';
const RAG_ENABLED = !!RAG_API_URL;

export interface RagMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface RagQueryRequest {
  query: string;
  context?: string[];
  max_results?: number;
  conversation_history?: RagMessage[];
}

export interface RagQueryResponse {
  answer: string;
  sources?: Array<{
    document_id?: string;
    title?: string;
    excerpt?: string;
    score?: number;
  }>;
  conversation_id?: string;
}

class RagClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (RAG_API_TOKEN) {
      headers['Authorization'] = `Bearer ${RAG_API_TOKEN}`;
    }

    return headers;
  }

  isEnabled(): boolean {
    return RAG_ENABLED;
  }

  getApiUrl(): string {
    return RAG_API_URL;
  }

  async query(request: RagQueryRequest): Promise<RagQueryResponse> {
    if (!RAG_ENABLED) {
      throw new Error('RAG API non configurée. Définissez VITE_RAG_API_URL dans votre fichier .env');
    }

    try {
      const response = await fetch(`${RAG_API_URL}/query`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erreur API RAG: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('RAG query error:', error);
      throw error;
    }
  }

  async search(query: string, maxResults: number = 5): Promise<RagQueryResponse> {
    if (!RAG_ENABLED) {
      throw new Error('RAG API non configurée');
    }

    try {
      const response = await fetch(`${RAG_API_URL}/search`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ query, max_results: maxResults }),
      });

      if (!response.ok) {
        throw new Error(`Erreur de recherche: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('RAG search error:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!RAG_ENABLED) {
      return false;
    }

    try {
      const response = await fetch(`${RAG_API_URL}/health`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('RAG health check failed:', error);
      return false;
    }
  }
}

export const ragClient = new RagClient();

// Log de l'état au démarrage
if (RAG_ENABLED) {
  console.log('🤖 Assistant IA activé:', RAG_API_URL);
  ragClient.healthCheck().then(healthy => {
    if (healthy) {
      console.log('✅ API RAG opérationnelle');
    } else {
      console.warn('⚠️ API RAG non accessible');
    }
  });
} else {
  console.log('⚪ Assistant IA désactivé (VITE_RAG_API_URL non configuré)');
}
