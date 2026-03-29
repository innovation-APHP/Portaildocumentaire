import { wikijsService } from './wikijsService';

/**
 * Structure de configuration de l'application
 */
export interface AppConfig {
  // Labels généraux
  labels: {
    appName: string;
    appDescription: string;
    welcomeMessage: string;
    searchPlaceholder: string;
  };
  
  // Catégories de documentation
  categories: {
    functional: { label: string; description: string; icon: string };
    technical: { label: string; description: string; icon: string };
    user: { label: string; description: string; icon: string };
  };
  
  // Pages
  pages: {
    home: {
      title: string;
      subtitle: string;
      ctaText: string;
    };
    chat: {
      title: string;
      placeholder: string;
      welcomeMessage: string;
    };
  };
  
  // Fonctionnalités
  features: {
    chatEnabled: boolean;
    searchEnabled: boolean;
    treeViewEnabled: boolean;
    authRequired: boolean;
  };
  
  // Métadonnées
  metadata: {
    lastUpdated: string;
    version: string;
  };
}

/**
 * Configuration par défaut (fallback si Wiki.js non disponible)
 */
const DEFAULT_CONFIG: AppConfig = {
  labels: {
    appName: 'Portail Documentaire',
    appDescription: 'Votre documentation centralisée',
    welcomeMessage: 'Bienvenue sur le portail documentaire',
    searchPlaceholder: 'Rechercher dans la documentation...',
  },
  categories: {
    functional: {
      label: 'Documentation Fonctionnelle',
      description: 'Spécifications et règles métier',
      icon: 'FileText',
    },
    technical: {
      label: 'Documentation Technique',
      description: 'Architecture et développement',
      icon: 'Code',
    },
    user: {
      label: 'Documentation Utilisateur',
      description: 'Guides et tutoriels',
      icon: 'Users',
    },
  },
  pages: {
    home: {
      title: 'Portail Documentaire',
      subtitle: 'Accédez à toute la documentation de votre organisation',
      ctaText: 'Explorer la documentation',
    },
    chat: {
      title: 'Assistant IA',
      placeholder: 'Posez votre question...',
      welcomeMessage: 'Bonjour ! Je peux vous aider à trouver des informations dans la documentation.',
    },
  },
  features: {
    chatEnabled: true,
    searchEnabled: true,
    treeViewEnabled: true,
    authRequired: true,
  },
  metadata: {
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
  },
};

/**
 * Clé de cache pour localStorage
 */
const CONFIG_CACHE_KEY = 'app_config_cache';
const CONFIG_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Service de gestion de la configuration
 */
export const configService = {
  /**
   * Charger la configuration depuis Wiki.js
   * La page de config doit être au path: /config/app-settings
   */
  async loadFromWikiJs(token?: string): Promise<AppConfig> {
    try {
      // Vérifier si l'URL Wiki.js est configurée
      const wikijsUrl = localStorage.getItem('wikijs_url');
      if (!wikijsUrl) {
        // Ne pas logger d'erreur, c'est un état normal au premier lancement
        return DEFAULT_CONFIG;
      }

      // Récupérer la page de configuration depuis Wiki.js
      const configPage = await wikijsService.getPageByPath('config/app-settings', token);
      
      if (!configPage) {
        console.info('Page de configuration non trouvée dans Wiki.js, utilisation config par défaut');
        return DEFAULT_CONFIG;
      }

      // Parser le contenu (attendu en YAML ou JSON dans un bloc code)
      const config = this.parseConfigContent(configPage.content);
      
      // Merger avec la config par défaut pour les clés manquantes
      const mergedConfig = this.mergeWithDefaults(config);
      
      // Mettre en cache
      this.cacheConfig(mergedConfig);
      
      return mergedConfig;
      
    } catch (error) {
      // Si Wiki.js n'est pas configuré, ne pas logger d'erreur
      if (error instanceof Error && error.message === 'WIKIJS_NOT_CONFIGURED') {
        return DEFAULT_CONFIG;
      }

      console.error('Erreur lors du chargement de la configuration depuis Wiki.js:', error);
      
      // Essayer de récupérer depuis le cache
      const cachedConfig = this.getCachedConfig();
      if (cachedConfig) {
        console.log('Utilisation de la configuration en cache');
        return cachedConfig;
      }
      
      // Fallback sur la config par défaut
      return DEFAULT_CONFIG;
    }
  },

  /**
   * Parser le contenu de la page de configuration
   */
  parseConfigContent(content: string): Partial<AppConfig> {
    try {
      // Chercher un bloc JSON ou YAML dans le markdown
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      const yamlMatch = content.match(/```yaml\n([\s\S]*?)\n```/);
      if (yamlMatch) {
        // Pour simplifier, on accepte aussi du JSON dans un bloc yaml
        return JSON.parse(yamlMatch[1]);
      }

      // Si tout le contenu est du JSON
      return JSON.parse(content);
    } catch (error) {
      console.error('Erreur lors du parsing de la configuration:', error);
      return {};
    }
  },

  /**
   * Merger avec la configuration par défaut
   */
  mergeWithDefaults(partial: Partial<AppConfig>): AppConfig {
    return {
      labels: { ...DEFAULT_CONFIG.labels, ...partial.labels },
      categories: {
        functional: { ...DEFAULT_CONFIG.categories.functional, ...partial.categories?.functional },
        technical: { ...DEFAULT_CONFIG.categories.technical, ...partial.categories?.technical },
        user: { ...DEFAULT_CONFIG.categories.user, ...partial.categories?.user },
      },
      pages: {
        home: { ...DEFAULT_CONFIG.pages.home, ...partial.pages?.home },
        chat: { ...DEFAULT_CONFIG.pages.chat, ...partial.pages?.chat },
      },
      features: { ...DEFAULT_CONFIG.features, ...partial.features },
      metadata: { ...DEFAULT_CONFIG.metadata, ...partial.metadata },
    };
  },

  /**
   * Mettre en cache la configuration
   */
  cacheConfig(config: AppConfig): void {
    try {
      const cacheData = {
        config,
        timestamp: Date.now(),
      };
      localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erreur lors de la mise en cache de la configuration:', error);
    }
  },

  /**
   * Récupérer la configuration depuis le cache
   */
  getCachedConfig(): AppConfig | null {
    try {
      const cached = localStorage.getItem(CONFIG_CACHE_KEY);
      if (!cached) return null;

      const { config, timestamp } = JSON.parse(cached);
      
      // Vérifier si le cache est encore valide
      if (Date.now() - timestamp > CONFIG_CACHE_DURATION) {
        return null;
      }

      return config;
    } catch (error) {
      console.error('Erreur lors de la récupération du cache:', error);
      return null;
    }
  },

  /**
   * Invalider le cache
   */
  clearCache(): void {
    localStorage.removeItem(CONFIG_CACHE_KEY);
  },

  /**
   * Obtenir la configuration (cache ou défaut)
   */
  getConfig(): AppConfig {
    const cached = this.getCachedConfig();
    return cached || DEFAULT_CONFIG;
  },

  /**
   * Sauvegarder la configuration dans Wiki.js
   */
  async saveToWikiJs(config: AppConfig, token?: string): Promise<boolean> {
    try {
      const content = this.formatConfigForWiki(config);
      
      // Essayer de mettre à jour la page existante
      const existingPage = await wikijsService.getPageByPath('config/app-settings', token);
      
      if (existingPage) {
        // Mettre à jour
        await wikijsService.updatePage(
          existingPage.id,
          content,
          'Configuration de l\'application',
          ['config', 'settings', 'app'],
          'Configuration de l\'application',
          token
        );
      } else {
        // Créer une nouvelle page
        await wikijsService.createPage(
          'config/app-settings',
          'Configuration de l\'application',
          content,
          'Configuration de l\'application',
          ['config', 'settings', 'app'],
          'fr',
          true,
          'markdown',
          token
        );
      }

      // Mettre à jour le cache
      this.cacheConfig(config);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration:', error);
      return false;
    }
  },

  /**
   * Formater la configuration pour Wiki.js
   */
  formatConfigForWiki(config: AppConfig): string {
    return `# Configuration de l'application

Cette page contient la configuration de l'application portail documentaire.

> ⚠️ **Attention** : Modifiez cette configuration avec précaution. 
> Une erreur de syntaxe peut empêcher l'application de fonctionner correctement.

## Configuration actuelle

\`\`\`json
${JSON.stringify(config, null, 2)}
\`\`\`

## Description des paramètres

### Labels
- **appName** : Nom de l'application affiché dans l'interface
- **appDescription** : Description courte de l'application
- **welcomeMessage** : Message d'accueil sur la page d'accueil
- **searchPlaceholder** : Texte du placeholder de recherche

### Catégories
Configuration des trois catégories de documentation (fonctionnelle, technique, utilisateur).

### Pages
Textes personnalisés pour chaque page de l'application.

### Features
Active/désactive les fonctionnalités de l'application.

---

*Dernière mise à jour : ${config.metadata.lastUpdated}*
*Version : ${config.metadata.version}*
`;
  },

  /**
   * Générer une configuration par défaut dans Wiki.js
   */
  async initializeDefaultConfig(token?: string): Promise<boolean> {
    return this.saveToWikiJs(DEFAULT_CONFIG, token);
  },
};