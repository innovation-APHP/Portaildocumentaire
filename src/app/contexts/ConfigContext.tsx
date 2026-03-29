import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { configService, type AppConfig } from '../services/configService';

interface ConfigContextType {
  config: AppConfig;
  isLoading: boolean;
  error: string | null;
  reloadConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(configService.getConfig());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('wikijs_token') || undefined;
      const loadedConfig = await configService.loadFromWikiJs(token);
      setConfig(loadedConfig);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('Erreur lors du chargement de la configuration:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadConfig = async () => {
    configService.clearCache();
    await loadConfig();
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, isLoading, error, reloadConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig doit être utilisé dans un ConfigProvider');
  }
  return context;
}
