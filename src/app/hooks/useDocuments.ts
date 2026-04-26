import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export function useDocuments(params?: any) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [JSON.stringify(params)]);

  async function loadDocuments() {
    try {
      setLoading(true);
      const data = await apiClient.getDocuments(params);
      setDocuments(data.documents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  }

  return { documents, loading, error, refetch: loadDocuments };
}

export function useDocument(id: string) {
  const [document, setDocument] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocument();
  }, [id]);

  async function loadDocument() {
    if (!id) return;

    try {
      setLoading(true);
      const data = await apiClient.getDocument(id);
      setDocument(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      console.error('Error loading document:', err);
    } finally {
      setLoading(false);
    }
  }

  return { document, loading, error, refetch: loadDocument };
}
