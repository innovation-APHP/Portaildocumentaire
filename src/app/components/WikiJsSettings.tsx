import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Settings, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { wikijsService } from '../services/wikijsService';
import { toast } from 'sonner';

export function WikiJsSettings() {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');

  useEffect(() => {
    // Charger les paramètres depuis localStorage
    const savedUrl = localStorage.getItem('wikijs_url');
    const savedToken = localStorage.getItem('wikijs_token');
    
    if (savedUrl) setUrl(savedUrl);
    if (savedToken) setToken(savedToken);

    // Tester la connexion au chargement si configuré
    if (savedUrl && savedToken) {
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    setIsTestingConnection(true);
    try {
      const isConnected = await wikijsService.checkConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      return isConnected;
    } catch (error) {
      setConnectionStatus('disconnected');
      return false;
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL Wiki.js');
      return;
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('wikijs_url', url);
    if (token) {
      localStorage.setItem('wikijs_token', token);
    }

    toast.success('Configuration sauvegardée !');

    // Tester la connexion
    const isConnected = await checkConnection();
    if (isConnected) {
      toast.success('Connexion à Wiki.js établie !');
    } else {
      toast.warning('Connexion échouée. Vérifiez vos paramètres.');
    }
  };

  const testConnection = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL Wiki.js');
      return;
    }

    // Sauvegarder temporairement pour le test
    const oldUrl = localStorage.getItem('wikijs_url');
    const oldToken = localStorage.getItem('wikijs_token');
    
    localStorage.setItem('wikijs_url', url);
    if (token) {
      localStorage.setItem('wikijs_token', token);
    }

    const isConnected = await checkConnection();

    // Restaurer si le test échoue et qu'on n'a pas sauvegardé
    if (!isConnected && oldUrl !== url) {
      if (oldUrl) {
        localStorage.setItem('wikijs_url', oldUrl);
      }
      if (oldToken) {
        localStorage.setItem('wikijs_token', oldToken);
      }
      toast.error('Connexion échouée. Vérifiez l\'URL et le token.');
    } else if (isConnected) {
      toast.success('Connexion réussie !');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <CardTitle>Configuration Wiki.js</CardTitle>
          </div>
          {connectionStatus !== 'unknown' && (
            <Badge
              className={
                connectionStatus === 'connected'
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-red-100 text-red-800 border-red-300'
              }
            >
              {connectionStatus === 'connected' ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connecté
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Déconnecté
                </>
              )}
            </Badge>
          )}
        </div>
        <CardDescription>
          Configurez la connexion à votre instance Wiki.js
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wikijs-url">URL de Wiki.js</Label>
          <Input
            id="wikijs-url"
            placeholder="http://localhost:3000"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            L'URL de base de votre instance Wiki.js (sans /graphql)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wikijs-token">Token d'authentification</Label>
          <Input
            id="wikijs-token"
            type="password"
            placeholder="Votre token Wiki.js"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Token obtenu après connexion, ou clé API créée dans Wiki.js
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Sauvegarder
          </Button>
          <Button
            onClick={testConnection}
            variant="outline"
            disabled={isTestingConnection || !url}
          >
            {isTestingConnection ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Tester'
            )}
          </Button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Instructions de configuration</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Accédez à votre instance Wiki.js</li>
                <li>Connectez-vous avec vos identifiants</li>
                <li>Le token JWT sera disponible après connexion</li>
                <li>Alternativement : Administration → API Access pour créer une clé API</li>
                <li>L'URL doit être au format: http://votre-wiki.com (sans /graphql)</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-medium mb-1">Mode actuel</p>
              <p className="text-xs">
                {connectionStatus === 'connected'
                  ? '✅ Données réelles de Wiki.js'
                  : '⚠️ Données de démonstration (mockées)'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}