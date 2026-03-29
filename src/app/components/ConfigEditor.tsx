import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  Code,
  Users,
  Home,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useAppConfig } from '../hooks/useAppConfig';
import { toast } from 'sonner';
import type { AppConfig } from '../services/configService';

export function ConfigEditor() {
  const { config, isLoading, error, saveConfig, refreshConfig, resetToDefault } = useAppConfig();
  const [editedConfig, setEditedConfig] = useState<AppConfig>(config);
  const [isSaving, setIsSaving] = useState(false);

  // Vérifier si Wiki.js est configuré
  const wikijsUrl = localStorage.getItem('wikijs_url');
  const wikijsToken = localStorage.getItem('wikijs_token');
  const isWikijsConfigured = wikijsUrl && wikijsToken;

  const hasChanges = JSON.stringify(config) !== JSON.stringify(editedConfig);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await saveConfig(editedConfig);
    setIsSaving(false);

    if (success) {
      toast.success('Configuration sauvegardée avec succès !');
    } else {
      toast.error('Erreur lors de la sauvegarde de la configuration');
    }
  };

  const handleReset = async () => {
    if (confirm('Voulez-vous vraiment réinitialiser la configuration par défaut ?')) {
      const success = await resetToDefault();
      if (success) {
        setEditedConfig(config);
        toast.success('Configuration réinitialisée !');
      } else {
        toast.error('Erreur lors de la réinitialisation');
      }
    }
  };

  const handleRefresh = () => {
    refreshConfig();
    setEditedConfig(config);
    toast.info('Configuration rechargée');
  };

  const openWikiJsEditor = () => {
    const url = localStorage.getItem('wikijs_url');
    if (url) {
      window.open(`${url}/config/app-settings`, '_blank');
    } else {
      toast.error('URL Wiki.js non configurée');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-blue-600" />
            <CardTitle>Configuration de l'application</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Recharger
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openWikiJsEditor}
              disabled={!isWikijsConfigured}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Éditer dans Wiki.js
            </Button>
          </div>
        </div>
        <CardDescription>
          Personnalisez les libellés, textes et paramètres de l'application.
          Les modifications sont stockées dans Wiki.js.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isWikijsConfigured && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Wiki.js non configuré</p>
              <p>
                Veuillez d'abord configurer votre connexion à Wiki.js dans la section 
                "Paramètres Wiki.js" ci-dessous pour pouvoir sauvegarder la configuration.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Erreur de chargement</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="labels" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="labels">
              <FileText className="h-4 w-4 mr-2" />
              Labels
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Sparkles className="h-4 w-4 mr-2" />
              Catégories
            </TabsTrigger>
            <TabsTrigger value="pages">
              <Home className="h-4 w-4 mr-2" />
              Pages
            </TabsTrigger>
            <TabsTrigger value="features">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Fonctionnalités
            </TabsTrigger>
          </TabsList>

          {/* Onglet Labels */}
          <TabsContent value="labels" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="appName">Nom de l'application</Label>
                <Input
                  id="appName"
                  value={editedConfig.labels.appName}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    labels: { ...editedConfig.labels, appName: e.target.value }
                  })}
                  placeholder="Portail Documentaire"
                />
              </div>

              <div>
                <Label htmlFor="appDescription">Description</Label>
                <Input
                  id="appDescription"
                  value={editedConfig.labels.appDescription}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    labels: { ...editedConfig.labels, appDescription: e.target.value }
                  })}
                  placeholder="Votre documentation centralisée"
                />
              </div>

              <div>
                <Label htmlFor="welcomeMessage">Message de bienvenue</Label>
                <Input
                  id="welcomeMessage"
                  value={editedConfig.labels.welcomeMessage}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    labels: { ...editedConfig.labels, welcomeMessage: e.target.value }
                  })}
                  placeholder="Bienvenue sur le portail documentaire"
                />
              </div>

              <div>
                <Label htmlFor="searchPlaceholder">Placeholder de recherche</Label>
                <Input
                  id="searchPlaceholder"
                  value={editedConfig.labels.searchPlaceholder}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    labels: { ...editedConfig.labels, searchPlaceholder: e.target.value }
                  })}
                  placeholder="Rechercher dans la documentation..."
                />
              </div>
            </div>
          </TabsContent>

          {/* Onglet Catégories */}
          <TabsContent value="categories" className="space-y-6">
            {/* Fonctionnelle */}
            <div className="p-4 border rounded-lg space-y-3 bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Documentation Fonctionnelle</h3>
              </div>
              <div>
                <Label>Label</Label>
                <Input
                  value={editedConfig.categories.functional.label}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    categories: {
                      ...editedConfig.categories,
                      functional: { ...editedConfig.categories.functional, label: e.target.value }
                    }
                  })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={editedConfig.categories.functional.description}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    categories: {
                      ...editedConfig.categories,
                      functional: { ...editedConfig.categories.functional, description: e.target.value }
                    }
                  })}
                />
              </div>
            </div>

            {/* Technique */}
            <div className="p-4 border rounded-lg space-y-3 bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Documentation Technique</h3>
              </div>
              <div>
                <Label>Label</Label>
                <Input
                  value={editedConfig.categories.technical.label}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    categories: {
                      ...editedConfig.categories,
                      technical: { ...editedConfig.categories.technical, label: e.target.value }
                    }
                  })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={editedConfig.categories.technical.description}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    categories: {
                      ...editedConfig.categories,
                      technical: { ...editedConfig.categories.technical, description: e.target.value }
                    }
                  })}
                />
              </div>
            </div>

            {/* Utilisateur */}
            <div className="p-4 border rounded-lg space-y-3 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Documentation Utilisateur</h3>
              </div>
              <div>
                <Label>Label</Label>
                <Input
                  value={editedConfig.categories.user.label}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    categories: {
                      ...editedConfig.categories,
                      user: { ...editedConfig.categories.user, label: e.target.value }
                    }
                  })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={editedConfig.categories.user.description}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    categories: {
                      ...editedConfig.categories,
                      user: { ...editedConfig.categories.user, description: e.target.value }
                    }
                  })}
                />
              </div>
            </div>
          </TabsContent>

          {/* Onglet Pages */}
          <TabsContent value="pages" className="space-y-6">
            {/* Page d'accueil */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Page d'accueil</h3>
              </div>
              <div>
                <Label>Titre</Label>
                <Input
                  value={editedConfig.pages.home.title}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    pages: {
                      ...editedConfig.pages,
                      home: { ...editedConfig.pages.home, title: e.target.value }
                    }
                  })}
                />
              </div>
              <div>
                <Label>Sous-titre</Label>
                <Input
                  value={editedConfig.pages.home.subtitle}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    pages: {
                      ...editedConfig.pages,
                      home: { ...editedConfig.pages.home, subtitle: e.target.value }
                    }
                  })}
                />
              </div>
              <div>
                <Label>Texte du bouton CTA</Label>
                <Input
                  value={editedConfig.pages.home.ctaText}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    pages: {
                      ...editedConfig.pages,
                      home: { ...editedConfig.pages.home, ctaText: e.target.value }
                    }
                  })}
                />
              </div>
            </div>

            {/* Page Chat */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Assistant IA</h3>
              </div>
              <div>
                <Label>Titre</Label>
                <Input
                  value={editedConfig.pages.chat.title}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    pages: {
                      ...editedConfig.pages,
                      chat: { ...editedConfig.pages.chat, title: e.target.value }
                    }
                  })}
                />
              </div>
              <div>
                <Label>Placeholder</Label>
                <Input
                  value={editedConfig.pages.chat.placeholder}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    pages: {
                      ...editedConfig.pages,
                      chat: { ...editedConfig.pages.chat, placeholder: e.target.value }
                    }
                  })}
                />
              </div>
              <div>
                <Label>Message de bienvenue</Label>
                <Input
                  value={editedConfig.pages.chat.welcomeMessage}
                  onChange={(e) => setEditedConfig({
                    ...editedConfig,
                    pages: {
                      ...editedConfig.pages,
                      chat: { ...editedConfig.pages.chat, welcomeMessage: e.target.value }
                    }
                  })}
                />
              </div>
            </div>
          </TabsContent>

          {/* Onglet Fonctionnalités */}
          <TabsContent value="features" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Assistant IA activé</Label>
                  <p className="text-sm text-gray-500">Activer le chatbot conversationnel</p>
                </div>
                <Switch
                  checked={editedConfig.features.chatEnabled}
                  onCheckedChange={(checked) => setEditedConfig({
                    ...editedConfig,
                    features: { ...editedConfig.features, chatEnabled: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Recherche activée</Label>
                  <p className="text-sm text-gray-500">Activer la recherche dans les documents</p>
                </div>
                <Switch
                  checked={editedConfig.features.searchEnabled}
                  onCheckedChange={(checked) => setEditedConfig({
                    ...editedConfig,
                    features: { ...editedConfig.features, searchEnabled: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Vue arborescente activée</Label>
                  <p className="text-sm text-gray-500">Activer la navigation en arborescence</p>
                </div>
                <Switch
                  checked={editedConfig.features.treeViewEnabled}
                  onCheckedChange={(checked) => setEditedConfig({
                    ...editedConfig,
                    features: { ...editedConfig.features, treeViewEnabled: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label>Authentification requise</Label>
                  <p className="text-sm text-gray-500">Exiger une connexion pour accéder à l'app</p>
                </div>
                <Switch
                  checked={editedConfig.features.authRequired}
                  onCheckedChange={(checked) => setEditedConfig({
                    ...editedConfig,
                    features: { ...editedConfig.features, authRequired: checked }
                  })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                <AlertCircle className="h-3 w-3 mr-1" />
                Modifications non sauvegardées
              </Badge>
            )}
            <span className="text-xs text-gray-500">
              Version: {config.metadata.version}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving || isLoading}
            >
              Réinitialiser
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving || isLoading}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}