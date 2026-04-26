import { createContext, useContext, useState, type ReactNode } from 'react';
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
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const reloadConfig = async () => {
    setConfig(configService.getConfig());
  };

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
