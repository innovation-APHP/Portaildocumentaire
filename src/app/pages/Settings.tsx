import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Database, User, Palette, Info, Shield, Server, CheckCircle, XCircle, Save, RotateCcw, Loader2, Zap, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { connectionConfig } from '../services/connectionConfig';

export function Settings() {
  const { user } = useAuth();
  const [apiUrl, setApiUrl] = useState('');
  const [isMockMode, setIsMockMode] = useState(true);

  // États pour la configuration
  const [configApiUrl, setConfigApiUrl] = useState('');
  const [configRagUrl, setConfigRagUrl] = useState('');
  const [configRagToken, setConfigRagToken] = useState('');
  const [configDbHost, setConfigDbHost] = useState('');
  const [configDbPort, setConfigDbPort] = useState('');
  const [configDbName, setConfigDbName] = useState('');
  const [configDbUser, setConfigDbUser] = useState('');
  const [configDbPassword, setConfigDbPassword] = useState('');
  const [hasCustomConfig, setHasCustomConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingBackend, setIsTestingBackend] = useState(false);
  const [isTestingRag, setIsTestingRag] = useState(false);
  const [showDbPassword, setShowDbPassword] = useState(false);

  useEffect(() => {
    // Charger la configuration actuelle
    const currentApiUrl = connectionConfig.getApiUrl();
    const currentRagUrl = connectionConfig.getRagApiUrl();
    const currentRagToken = connectionConfig.getRagApiToken();
    const dbConfig = connectionConfig.getDbConfig();

    setApiUrl(currentApiUrl);
    setConfigApiUrl(currentApiUrl);
    setConfigRagUrl(currentRagUrl);
    setConfigRagToken(currentRagToken);
    setConfigDbHost(dbConfig.host);
    setConfigDbPort(dbConfig.port);
    setConfigDbName(dbConfig.database);
    setConfigDbUser(dbConfig.user);
    setConfigDbPassword(dbConfig.password);
    setIsMockMode(!currentApiUrl || currentApiUrl === '');
    setHasCustomConfig(connectionConfig.hasCustomConfig());
  }, []);

  const handleSaveConfig = () => {
    setIsSaving(true);
    try {
      const config: any = {};

      if (configApiUrl.trim()) {
        config.apiUrl = configApiUrl.trim();
      }
      if (configRagUrl.trim()) {
        config.ragApiUrl = configRagUrl.trim();
      }
      if (configRagToken.trim()) {
        config.ragApiToken = configRagToken.trim();
      }

      // Configuration PostgreSQL
      if (configDbHost.trim()) {
        config.dbHost = configDbHost.trim();
      }
      if (configDbPort.trim()) {
        config.dbPort = configDbPort.trim();
      }
      if (configDbName.trim()) {
        config.dbName = configDbName.trim();
      }
      if (configDbUser.trim()) {
        config.dbUser = configDbUser.trim();
      }
      if (configDbPassword.trim()) {
        config.dbPassword = configDbPassword.trim();
      }

      connectionConfig.saveConfig(config);
      toast.success('Configuration sauvegardée ! La page va se recharger...');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      setIsSaving(false);
    }
  };

  const handleResetConfig = () => {
    connectionConfig.clearConfig();
  };

  const handleTestBackend = async () => {
    if (!configApiUrl.trim()) {
      toast.error('Veuillez entrer une URL API backend');
      return;
    }

    setIsTestingBackend(true);
    const result = await connectionConfig.testBackendConnection(configApiUrl);
    setIsTestingBackend(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleTestRag = async () => {
    if (!configRagUrl.trim()) {
      toast.error('Veuillez entrer une URL API RAG');
      return;
    }

    setIsTestingRag(true);
    const result = await connectionConfig.testRagConnection(configRagUrl, configRagToken);
    setIsTestingRag(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const systemInfo = {
    mode: isMockMode ? 'Mock (Démonstration)' : 'API PostgreSQL',
    version: '1.0.0',
    backend: isMockMode ? 'Données Mock' : 'Express + PostgreSQL',
    auth: 'JWT',
    storage: isMockMode ? 'LocalStorage' : 'PostgreSQL 15',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        </div>
        <p className="text-gray-600">
          Gérez les paramètres de votre portail documentaire
        </p>
      </div>

      <div className="space-y-6">
        {/* Informations Système */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle>Informations Système</CardTitle>
            </div>
            <CardDescription>
              État actuel et configuration du portail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Mode de fonctionnement</Label>
                <div className="flex items-center gap-2 mt-1">
                  {isMockMode ? (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                      <XCircle className="h-3 w-3 mr-1" />
                      {systemInfo.mode}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {systemInfo.mode}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Version</Label>
                <p className="text-sm font-medium mt-1">{systemInfo.version}</p>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Backend</Label>
                <p className="text-sm font-medium mt-1">{systemInfo.backend}</p>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Authentification</Label>
                <p className="text-sm font-medium mt-1">{systemInfo.auth}</p>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Stockage</Label>
                <p className="text-sm font-medium mt-1">{systemInfo.storage}</p>
              </div>

              <div>
                <Label className="text-sm text-gray-500">URL API</Label>
                <p className="text-sm font-medium mt-1">
                  {apiUrl || <span className="text-gray-400">Non configurée (Mode Mock)</span>}
                </p>
              </div>
            </div>

            {isMockMode && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Mode Démonstration Actif</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      L'application fonctionne avec des données de démonstration. Les modifications ne sont pas sauvegardées.
                      Pour utiliser le backend PostgreSQL, configurez VITE_API_URL dans .env.local
                    </p>
                    <p className="text-sm text-yellow-700 mt-2">
                      <strong>Pour activer le mode production :</strong>
                    </p>
                    <code className="block mt-1 p-2 bg-yellow-100 rounded text-xs">
                      ./START_POSTGRES.sh
                    </code>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration des Connexions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                <CardTitle>Configuration des Connexions</CardTitle>
              </div>
              {hasCustomConfig && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Personnalisé
                </Badge>
              )}
            </div>
            <CardDescription>
              Configurez les URLs de connexion à vos services backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Backend PostgreSQL */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiUrl">URL de l'API Backend (PostgreSQL)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestBackend}
                  disabled={isTestingBackend || !configApiUrl.trim()}
                >
                  {isTestingBackend ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Test...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3 w-3 mr-1" />
                      Tester
                    </>
                  )}
                </Button>
              </div>
              <Input
                id="apiUrl"
                type="url"
                placeholder="http://localhost:3001/api"
                value={configApiUrl}
                onChange={(e) => setConfigApiUrl(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Laissez vide pour utiliser le mode Mock (démonstration sans backend).
                {!hasCustomConfig && import.meta.env.VITE_API_URL && (
                  <span className="block mt-1 text-blue-600">
                    Valeur actuelle (.env): {import.meta.env.VITE_API_URL}
                  </span>
                )}
              </p>
            </div>

            <Separator />

            {/* API RAG */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="ragUrl">URL de l'API RAG (Assistant IA)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestRag}
                  disabled={isTestingRag || !configRagUrl.trim()}
                >
                  {isTestingRag ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Test...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3 w-3 mr-1" />
                      Tester
                    </>
                  )}
                </Button>
              </div>
              <Input
                id="ragUrl"
                type="url"
                placeholder="http://localhost:8000"
                value={configRagUrl}
                onChange={(e) => setConfigRagUrl(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                URL de votre système RAG pour l'assistant IA. Laissez vide pour désactiver.
                {!hasCustomConfig && import.meta.env.VITE_RAG_API_URL && (
                  <span className="block mt-1 text-blue-600">
                    Valeur actuelle (.env): {import.meta.env.VITE_RAG_API_URL}
                  </span>
                )}
              </p>
            </div>

            {/* Token RAG */}
            <div className="space-y-3">
              <Label htmlFor="ragToken">Token d'authentification RAG (optionnel)</Label>
              <Input
                id="ragToken"
                type="password"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                value={configRagToken}
                onChange={(e) => setConfigRagToken(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Token Bearer pour l'authentification à l'API RAG (si requise).
              </p>
            </div>

            <Separator />

            {/* Configuration PostgreSQL Directe */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Connexion PostgreSQL</h3>
              </div>
              <p className="text-xs text-gray-600">
                Configuration de la connexion directe à la base de données PostgreSQL.
                <strong className="text-amber-700"> ⚠️ Le backend doit être redémarré après modification.</strong>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Host */}
                <div className="space-y-2">
                  <Label htmlFor="dbHost">Hôte PostgreSQL</Label>
                  <Input
                    id="dbHost"
                    type="text"
                    placeholder="localhost"
                    value={configDbHost}
                    onChange={(e) => setConfigDbHost(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    {!hasCustomConfig && import.meta.env.VITE_DB_HOST && (
                      <span className="text-blue-600">
                        Valeur .env: {import.meta.env.VITE_DB_HOST}
                      </span>
                    )}
                    {!import.meta.env.VITE_DB_HOST && 'Défaut: localhost'}
                  </p>
                </div>

                {/* Port */}
                <div className="space-y-2">
                  <Label htmlFor="dbPort">Port</Label>
                  <Input
                    id="dbPort"
                    type="text"
                    placeholder="5432"
                    value={configDbPort}
                    onChange={(e) => setConfigDbPort(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    {!hasCustomConfig && import.meta.env.VITE_DB_PORT && (
                      <span className="text-blue-600">
                        Valeur .env: {import.meta.env.VITE_DB_PORT}
                      </span>
                    )}
                    {!import.meta.env.VITE_DB_PORT && 'Défaut: 5432'}
                  </p>
                </div>

                {/* Database Name */}
                <div className="space-y-2">
                  <Label htmlFor="dbName">Nom de la base de données</Label>
                  <Input
                    id="dbName"
                    type="text"
                    placeholder="portail_doc"
                    value={configDbName}
                    onChange={(e) => setConfigDbName(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    {!hasCustomConfig && import.meta.env.VITE_DB_NAME && (
                      <span className="text-blue-600">
                        Valeur .env: {import.meta.env.VITE_DB_NAME}
                      </span>
                    )}
                    {!import.meta.env.VITE_DB_NAME && 'Défaut: portail_doc'}
                  </p>
                </div>

                {/* User */}
                <div className="space-y-2">
                  <Label htmlFor="dbUser">Utilisateur PostgreSQL</Label>
                  <Input
                    id="dbUser"
                    type="text"
                    placeholder="postgres"
                    value={configDbUser}
                    onChange={(e) => setConfigDbUser(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    {!hasCustomConfig && import.meta.env.VITE_DB_USER && (
                      <span className="text-blue-600">
                        Valeur .env: {import.meta.env.VITE_DB_USER}
                      </span>
                    )}
                    {!import.meta.env.VITE_DB_USER && 'Défaut: postgres'}
                  </p>
                </div>

                {/* Password */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dbPassword">Mot de passe PostgreSQL</Label>
                  <div className="relative">
                    <Input
                      id="dbPassword"
                      type={showDbPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={configDbPassword}
                      onChange={(e) => setConfigDbPassword(e.target.value)}
                      className="font-mono text-sm pr-20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                      onClick={() => setShowDbPassword(!showDbPassword)}
                    >
                      {showDbPassword ? 'Masquer' : 'Afficher'}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Mot de passe pour se connecter à PostgreSQL
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 flex items-start gap-2">
                  <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Important :</strong> Ces paramètres sont sauvegardés localement dans le navigateur.
                    Pour que le backend les utilise, vous devez soit :
                    <br />
                    1. Exporter ces paramètres dans <code className="bg-amber-100 px-1 rounded">server/.env</code>
                    <br />
                    2. Redémarrer le serveur backend après modification
                  </span>
                </p>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder et Recharger
                  </>
                )}
              </Button>

              {hasCustomConfig && (
                <Button
                  variant="outline"
                  onClick={handleResetConfig}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
            </div>

            {hasCustomConfig && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Configuration personnalisée active.</strong> Ces paramètres sont prioritaires sur les variables d'environnement (.env).
                </p>
              </div>
            )}

            {!hasCustomConfig && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-600">
                  Aucune configuration personnalisée. L'application utilise les variables d'environnement (.env).
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profil Utilisateur */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <CardTitle>Profil Utilisateur</CardTitle>
            </div>
            <CardDescription>
              Informations sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={user?.name || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="role">Rôle</Label>
                <div className="mt-2">
                  <Badge variant="secondary" className="capitalize">
                    <Shield className="h-3 w-3 mr-1" />
                    {user?.role}
                  </Badge>
                </div>
              </div>

              <div>
                <Label htmlFor="userId">ID Utilisateur</Label>
                <Input
                  id="userId"
                  value={user?.id || ''}
                  disabled
                  className="bg-gray-50 font-mono text-xs"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Permissions</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Lecture documents</Badge>
                <Badge variant="outline">Recherche</Badge>
                <Badge variant="outline">Chat Assistant IA</Badge>
                {(user?.role === 'admin' || user?.role === 'editor') && (
                  <>
                    <Badge variant="outline" className="bg-blue-50">Création documents</Badge>
                    <Badge variant="outline" className="bg-blue-50">Modification documents</Badge>
                    <Badge variant="outline" className="bg-blue-50">Gestion tags</Badge>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Badge variant="outline" className="bg-purple-50">Administration complète</Badge>
                    <Badge variant="outline" className="bg-purple-50">Gestion utilisateurs</Badge>
                    <Badge variant="outline" className="bg-purple-50">Suppression documents</Badge>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Backend (si mode API) */}
        {!isMockMode && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                <CardTitle>Configuration Backend</CardTitle>
              </div>
              <CardDescription>
                Paramètres de connexion PostgreSQL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiUrl">URL de l'API</Label>
                <Input
                  id="apiUrl"
                  value={apiUrl}
                  disabled
                  className="bg-gray-50 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Configurée via VITE_API_URL dans .env.local
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Mode Production Actif</p>
                    <p className="text-sm text-green-700 mt-1">
                      Vous utilisez le backend PostgreSQL avec persistance des données.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documentation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              <CardTitle>Documentation Technique</CardTitle>
            </div>
            <CardDescription>
              Guides et ressources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <a
                href="/CONFIGURATION_INTERFACE.md"
                target="_blank"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                🎛️ Guide Configuration via Interface
              </a>
              <a
                href="/PARAMETRES_QUICKSTART.md"
                target="_blank"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                ⚡ Configuration Rapide (3 étapes)
              </a>
              <Separator className="my-2" />
              <a
                href="/ASSISTANT_IA_RAG.md"
                target="_blank"
                className="text-sm text-blue-600 hover:underline"
              >
                🤖 Guide Assistant IA avec RAG
              </a>
              <a
                href="/ASSISTANT_IA_QUICKSTART.md"
                target="_blank"
                className="text-sm text-blue-600 hover:underline"
              >
                🚀 Assistant IA - Démarrage Rapide
              </a>
              <Separator className="my-2" />
              <a
                href="/MIGRATION_POSTGRES.md"
                target="_blank"
                className="text-sm text-blue-600 hover:underline"
              >
                📖 Guide de Migration PostgreSQL
              </a>
              <a
                href="/FICHIERS_CHANGES.md"
                target="_blank"
                className="text-sm text-blue-600 hover:underline"
              >
                📝 Liste des Fichiers Modifiés
              </a>
              <a
                href="/MODE_MOCK_INFO.md"
                target="_blank"
                className="text-sm text-blue-600 hover:underline"
              >
                🎭 Documentation Mode Mock
              </a>
            </div>

            <Separator className="my-4" />

            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Architecture :</p>
              <ul className="space-y-1 text-xs">
                <li>• Frontend : React + TypeScript + Tailwind CSS</li>
                <li>• Backend : Node.js + Express</li>
                <li>• Base de données : PostgreSQL 15</li>
                <li>• Authentification : JWT</li>
                <li>• Recherche : Full-text search PostgreSQL</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {isMockMode && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="font-semibold text-gray-900">Passer en mode Production ?</h3>
                <p className="text-sm text-gray-600">
                  Pour utiliser PostgreSQL avec persistance des données, lancez le backend et configurez l'URL de l'API.
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => {
                    toast.info('Consultez MIGRATION_POSTGRES.md pour les instructions complètes');
                  }}>
                    Voir le guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
