import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Upload, 
  Database, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  FileText,
  Users,
  Code,
  Package
} from 'lucide-react';
import { migrationService, type MigrationProgress, type MigrationResult } from '../services/migrationService';

export function MigrationPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [selectedMode, setSelectedMode] = useState<'all' | 'category' | 'application'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'functional' | 'technical' | 'user'>('functional');
  const [selectedApp, setSelectedApp] = useState<string>('ecommerce');

  const stats = migrationService.getMigrationStats();

  const handleMigrate = async () => {
    setIsRunning(true);
    setResult(null);
    setProgress(null);

    const token = localStorage.getItem('wikijs_token') || undefined;

    try {
      let migrationResult: MigrationResult;

      if (selectedMode === 'all') {
        migrationResult = await migrationService.migrateAllDocuments(token, setProgress);
      } else if (selectedMode === 'category') {
        migrationResult = await migrationService.migrateCategoryDocuments(
          selectedCategory,
          token,
          setProgress
        );
      } else {
        migrationResult = await migrationService.migrateApplicationDocuments(
          selectedApp,
          token,
          setProgress
        );
      }

      setResult(migrationResult);
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
      setResult({
        success: false,
        created: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
        details: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const progressPercentage = progress 
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-600" />
          <CardTitle>Migration vers Wiki.js</CardTitle>
        </div>
        <CardDescription>
          Importez les données de démonstration dans votre instance Wiki.js
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.totalDocuments}</p>
            <p className="text-xs text-blue-600">documents</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">Fonctionnels</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.byCategory.functional}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <Code className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Techniques</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.byCategory.technical}</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-600 font-medium">Utilisateur</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">{stats.byCategory.user}</p>
          </div>
        </div>

        {/* Mode de migration */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Mode de migration</label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={selectedMode === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedMode('all')}
              disabled={isRunning}
              className="w-full"
            >
              <Database className="h-4 w-4 mr-2" />
              Tout
            </Button>
            <Button
              variant={selectedMode === 'category' ? 'default' : 'outline'}
              onClick={() => setSelectedMode('category')}
              disabled={isRunning}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Catégorie
            </Button>
            <Button
              variant={selectedMode === 'application' ? 'default' : 'outline'}
              onClick={() => setSelectedMode('application')}
              disabled={isRunning}
              className="w-full"
            >
              <Package className="h-4 w-4 mr-2" />
              Application
            </Button>
          </div>

          {/* Sélection de catégorie */}
          {selectedMode === 'category' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sélectionner une catégorie</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={selectedCategory === 'functional' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('functional')}
                  disabled={isRunning}
                  size="sm"
                >
                  Fonctionnelle
                </Button>
                <Button
                  variant={selectedCategory === 'technical' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('technical')}
                  disabled={isRunning}
                  size="sm"
                >
                  Technique
                </Button>
                <Button
                  variant={selectedCategory === 'user' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('user')}
                  disabled={isRunning}
                  size="sm"
                >
                  Utilisateur
                </Button>
              </div>
            </div>
          )}

          {/* Sélection d'application */}
          {selectedMode === 'application' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sélectionner une application</label>
              <div className="grid grid-cols-2 gap-2">
                {stats.applications.map((app) => (
                  <Button
                    key={app.id}
                    variant={selectedApp === app.id ? 'default' : 'outline'}
                    onClick={() => setSelectedApp(app.id)}
                    disabled={isRunning}
                    size="sm"
                    className="justify-start"
                  >
                    <div className={`w-3 h-3 rounded-full ${app.color} mr-2`} />
                    {app.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bouton de migration */}
        <Button
          onClick={handleMigrate}
          disabled={isRunning}
          className="w-full"
          size="lg"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Migration en cours...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Démarrer la migration
            </>
          )}
        </Button>

        {/* Barre de progression */}
        {progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {progress.current} / {progress.total} documents
              </span>
              <span className="font-medium text-blue-600">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {progress.currentDocument && (
              <p className="text-xs text-gray-500 truncate">
                En cours : {progress.currentDocument}
              </p>
            )}
          </div>
        )}

        {/* Résultat */}
        {result && !isRunning && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium mb-1 ${
                    result.success ? 'text-green-900' : 'text-amber-900'
                  }`}>
                    {result.success 
                      ? '✅ Migration terminée avec succès' 
                      : '⚠️ Migration terminée avec des erreurs'}
                  </p>
                  <div className="flex gap-4 text-sm">
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {result.created} créés
                    </Badge>
                    {result.failed > 0 && (
                      <Badge className="bg-red-100 text-red-800 border-red-300">
                        <XCircle className="h-3 w-3 mr-1" />
                        {result.failed} échoués
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Détails des erreurs */}
            {result.errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900 mb-2">Erreurs :</p>
                <ul className="text-xs text-red-800 space-y-1 max-h-40 overflow-y-auto">
                  {result.errors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Liste des documents migrés */}
            {result.details.length > 0 && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                <p className="text-sm font-medium text-gray-900 mb-2">Détails :</p>
                <ul className="text-xs space-y-1">
                  {result.details.map((detail, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      {detail.status === 'success' ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600 flex-shrink-0" />
                      )}
                      <span className="flex-1 truncate">{detail.title}</span>
                      {detail.error && (
                        <span className="text-red-600 text-xs">({detail.error})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Avertissement */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-medium mb-1">Attention</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>La migration crée de nouvelles pages dans Wiki.js</li>
                <li>Assurez-vous d'avoir les permissions nécessaires</li>
                <li>Les pages existantes ne seront pas écrasées</li>
                <li>Vérifiez la connexion à Wiki.js avant de commencer</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
