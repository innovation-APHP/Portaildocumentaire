import { useState, useEffect } from 'react';
import { wikijsService, WikiPage, WikiPageTree } from '../services/wikijsService';
import { useAuth } from '../contexts/AuthContext';

// Hook pour récupérer toutes les pages
export function useWikiPages() {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPages() {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('wikijs_token');
        const data = await wikijsService.getPages(token || undefined);
        setPages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors de la récupération des pages:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPages();
  }, [user]);

  return { pages, isLoading, error };
}

// Hook pour récupérer une page par ID
export function useWikiPage(id: number | null) {
  const [page, setPage] = useState<WikiPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    async function fetchPage() {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('wikijs_token');
        const data = await wikijsService.getPageById(id, token || undefined);
        setPage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors de la récupération de la page:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPage();
  }, [id]);

  return { page, isLoading, error };
}

// Hook pour rechercher des pages
export function useWikiSearch(query: string) {
  const [results, setResults] = useState<WikiPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    async function search() {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('wikijs_token');
        const data = await wikijsService.searchPages(query, token || undefined);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors de la recherche:', err);
      } finally {
        setIsLoading(false);
      }
    }

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return { results, isLoading, error };
}

// Hook pour récupérer l'arborescence
export function useWikiTree() {
  const [tree, setTree] = useState<WikiPageTree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTree() {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('wikijs_token');
        const data = await wikijsService.getPageTree(token || undefined);
        setTree(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors de la récupération de l\'arborescence:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTree();
  }, []);

  return { tree, isLoading, error };
}

// Hook pour vérifier la connexion à Wiki.js
export function useWikiConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkConnection() {
      try {
        setIsChecking(true);
        const connected = await wikijsService.checkConnection();
        setIsConnected(connected);
      } catch (err) {
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    }

    checkConnection();
  }, []);

  return { isConnected, isChecking };
}
