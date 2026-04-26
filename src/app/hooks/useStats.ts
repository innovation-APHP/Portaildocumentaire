import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export function useStats() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await apiClient.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }

  return { stats, loading, error, refetch: loadStats };
}
