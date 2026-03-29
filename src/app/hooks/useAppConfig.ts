import { useState, useEffect } from 'react';
import { configService, type AppConfig } from '../services/configService';

/**
 * Hook pour utiliser la configuration de l'application
 */
export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig>(configService.getConfig());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger la configuration depuis Wiki.js
   */
  const loadConfig = async () => {
    // Vérifier si Wiki.js est configuré avant de charger
    const wikijsUrl = localStorage.getItem('wikijs_url');
    if (!wikijsUrl) {
      // Utiliser la config par défaut silencieusement
      setConfig(configService.getConfig());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('wikijs_token') || undefined;
      const loadedConfig = await configService.loadFromWikiJs(token);
      setConfig(loadedConfig);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      // Ne pas afficher d'erreur si Wiki.js n'est pas configuré
      if (errorMessage !== 'WIKIJS_NOT_CONFIGURED') {
        setError(errorMessage);
        console.error('Erreur lors du chargement de la configuration:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sauvegarder la configuration dans Wiki.js
   */
  const saveConfig = async (newConfig: AppConfig) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('wikijs_token') || undefined;
      const success = await configService.saveToWikiJs(newConfig, token);
      
      if (success) {
        setConfig(newConfig);
        return true;
      } else {
        throw new Error('Échec de la sauvegarde');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la sauvegarde de la configuration:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Rafraîchir la configuration (forcer le rechargement)
   */
  const refreshConfig = () => {
    configService.clearCache();
    loadConfig();
  };

  /**
   * Réinitialiser à la configuration par défaut
   */
  const resetToDefault = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('wikijs_token') || undefined;
      const success = await configService.initializeDefaultConfig(token);
      
      if (success) {
        await loadConfig();
        return true;
      } else {
        throw new Error('Échec de la réinitialisation');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors de la réinitialisation:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger au montage du composant
  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    isLoading,
    error,
    loadConfig,
    saveConfig,
    refreshConfig,
    resetToDefault,
  };
}

/**
 * Hook pour accéder rapidement à une valeur de configuration spécifique
 */
export function useConfigValue<K extends keyof AppConfig>(key: K): AppConfig[K] {
  const { config } = useAppConfig();
  return config[key];
}