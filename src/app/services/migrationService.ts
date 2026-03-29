import { wikijsService } from './wikijsService';
import { mockDocuments, applications, type Document, type Application } from '../data/mockDocuments';

export interface MigrationResult {
  success: boolean;
  created: number;
  failed: number;
  errors: string[];
  details: Array<{ title: string; status: 'success' | 'error'; error?: string }>;
}

export interface MigrationProgress {
  current: number;
  total: number;
  currentDocument: string;
  status: 'running' | 'completed' | 'error';
}

/**
 * Service de migration des données mockées vers Wiki.js
 */
export const migrationService = {
  /**
   * Migrer toutes les données de démonstration vers Wiki.js
   */
  async migrateAllDocuments(
    token?: string,
    onProgress?: (progress: MigrationProgress) => void
  ): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      created: 0,
      failed: 0,
      errors: [],
      details: [],
    };

    try {
      // Vérifier la connexion
      const isConnected = await wikijsService.checkConnection();
      if (!isConnected) {
        throw new Error('Impossible de se connecter à Wiki.js');
      }

      // Trier les documents par catégorie pour une organisation logique
      const sortedDocs = [...mockDocuments].sort((a, b) => 
        a.category.localeCompare(b.category)
      );

      const total = sortedDocs.length;

      // Migrer chaque document
      for (let i = 0; i < sortedDocs.length; i++) {
        const doc = sortedDocs[i];
        
        // Notification de progression
        if (onProgress) {
          onProgress({
            current: i + 1,
            total,
            currentDocument: doc.title,
            status: 'running',
          });
        }

        try {
          // Construire le path basé sur la catégorie et l'application
          const app = applications.find(a => a.id === doc.application);
          const categoryPath = this.getCategoryPath(doc.category);
          const path = `${categoryPath}/${app?.name.toLowerCase().replace(/\s+/g, '-') || 'general'}/${doc.id}`;

          // Créer la page dans Wiki.js
          await wikijsService.createPage(
            path,
            doc.title,
            doc.content || `# ${doc.title}\n\n${doc.description}`,
            doc.description,
            doc.tags,
            'fr',
            true,
            'markdown',
            token
          );

          result.created++;
          result.details.push({
            title: doc.title,
            status: 'success',
          });

          // Petite pause pour ne pas surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          result.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
          result.errors.push(`${doc.title}: ${errorMessage}`);
          result.details.push({
            title: doc.title,
            status: 'error',
            error: errorMessage,
          });
        }
      }

      result.success = result.failed === 0;

      if (onProgress) {
        onProgress({
          current: total,
          total,
          currentDocument: '',
          status: result.success ? 'completed' : 'error',
        });
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      result.errors.push(`Erreur globale: ${errorMessage}`);
      
      if (onProgress) {
        onProgress({
          current: 0,
          total: mockDocuments.length,
          currentDocument: '',
          status: 'error',
        });
      }

      return result;
    }
  },

  /**
   * Migrer uniquement une catégorie spécifique
   */
  async migrateCategoryDocuments(
    category: 'functional' | 'technical' | 'user',
    token?: string,
    onProgress?: (progress: MigrationProgress) => void
  ): Promise<MigrationResult> {
    const filteredDocs = mockDocuments.filter(doc => doc.category === category);
    
    const result: MigrationResult = {
      success: false,
      created: 0,
      failed: 0,
      errors: [],
      details: [],
    };

    try {
      const isConnected = await wikijsService.checkConnection();
      if (!isConnected) {
        throw new Error('Impossible de se connecter à Wiki.js');
      }

      const total = filteredDocs.length;

      for (let i = 0; i < filteredDocs.length; i++) {
        const doc = filteredDocs[i];
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total,
            currentDocument: doc.title,
            status: 'running',
          });
        }

        try {
          const app = applications.find(a => a.id === doc.application);
          const categoryPath = this.getCategoryPath(doc.category);
          const path = `${categoryPath}/${app?.name.toLowerCase().replace(/\s+/g, '-') || 'general'}/${doc.id}`;

          await wikijsService.createPage(
            path,
            doc.title,
            doc.content || `# ${doc.title}\n\n${doc.description}`,
            doc.description,
            doc.tags,
            'fr',
            true,
            'markdown',
            token
          );

          result.created++;
          result.details.push({
            title: doc.title,
            status: 'success',
          });

          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          result.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
          result.errors.push(`${doc.title}: ${errorMessage}`);
          result.details.push({
            title: doc.title,
            status: 'error',
            error: errorMessage,
          });
        }
      }

      result.success = result.failed === 0;

      if (onProgress) {
        onProgress({
          current: total,
          total,
          currentDocument: '',
          status: result.success ? 'completed' : 'error',
        });
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      result.errors.push(`Erreur globale: ${errorMessage}`);
      
      if (onProgress) {
        onProgress({
          current: 0,
          total: filteredDocs.length,
          currentDocument: '',
          status: 'error',
        });
      }

      return result;
    }
  },

  /**
   * Migrer uniquement une application spécifique
   */
  async migrateApplicationDocuments(
    applicationId: string,
    token?: string,
    onProgress?: (progress: MigrationProgress) => void
  ): Promise<MigrationResult> {
    const filteredDocs = mockDocuments.filter(doc => doc.application === applicationId);
    
    const result: MigrationResult = {
      success: false,
      created: 0,
      failed: 0,
      errors: [],
      details: [],
    };

    try {
      const isConnected = await wikijsService.checkConnection();
      if (!isConnected) {
        throw new Error('Impossible de se connecter à Wiki.js');
      }

      const total = filteredDocs.length;

      for (let i = 0; i < filteredDocs.length; i++) {
        const doc = filteredDocs[i];
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total,
            currentDocument: doc.title,
            status: 'running',
          });
        }

        try {
          const app = applications.find(a => a.id === doc.application);
          const categoryPath = this.getCategoryPath(doc.category);
          const path = `${categoryPath}/${app?.name.toLowerCase().replace(/\s+/g, '-') || 'general'}/${doc.id}`;

          await wikijsService.createPage(
            path,
            doc.title,
            doc.content || `# ${doc.title}\n\n${doc.description}`,
            doc.description,
            doc.tags,
            'fr',
            true,
            'markdown',
            token
          );

          result.created++;
          result.details.push({
            title: doc.title,
            status: 'success',
          });

          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          result.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
          result.errors.push(`${doc.title}: ${errorMessage}`);
          result.details.push({
            title: doc.title,
            status: 'error',
            error: errorMessage,
          });
        }
      }

      result.success = result.failed === 0;

      if (onProgress) {
        onProgress({
          current: total,
          total,
          currentDocument: '',
          status: result.success ? 'completed' : 'error',
        });
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      result.errors.push(`Erreur globale: ${errorMessage}`);
      
      if (onProgress) {
        onProgress({
          current: 0,
          total: filteredDocs.length,
          currentDocument: '',
          status: 'error',
        });
      }

      return result;
    }
  },

  /**
   * Helper pour obtenir le path de la catégorie
   */
  getCategoryPath(category: 'functional' | 'technical' | 'user'): string {
    const paths = {
      functional: 'documentation-fonctionnelle',
      technical: 'documentation-technique',
      user: 'documentation-utilisateur',
    };
    return paths[category];
  },

  /**
   * Obtenir les statistiques de migration
   */
  getMigrationStats() {
    return {
      totalDocuments: mockDocuments.length,
      byCategory: {
        functional: mockDocuments.filter(d => d.category === 'functional').length,
        technical: mockDocuments.filter(d => d.category === 'technical').length,
        user: mockDocuments.filter(d => d.category === 'user').length,
      },
      byApplication: applications.map(app => ({
        id: app.id,
        name: app.name,
        count: mockDocuments.filter(d => d.application === app.id).length,
      })),
      applications: applications,
    };
  },
};
