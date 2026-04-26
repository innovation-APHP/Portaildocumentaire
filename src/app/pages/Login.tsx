import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const IS_MOCK_MODE = !import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL === '';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Portail Documentaire
          </h1>
          <p className="text-gray-600">
            Connectez-vous pour accéder à la documentation
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              {IS_MOCK_MODE ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Mode démonstration - Utilisez les identifiants ci-dessous
                </span>
              ) : (
                'Entrez vos identifiants pour accéder au portail'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-800 font-medium">{error}</p>
                      {IS_MOCK_MODE && (
                        <p className="text-xs text-red-700 mt-2">
                          ⚠️ Utilisez exactement : <code className="bg-red-100 px-1 rounded">admin</code> / <code className="bg-red-100 px-1 rounded">password123</code>
                        </p>
                      )}
                    </div>
                  </div>
                  {IS_MOCK_MODE && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-900">
                        <strong>Mode MOCK actif</strong> - Ouvrez la console (F12) pour voir les logs de débogage
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>

              {IS_MOCK_MODE && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('password123');
                  }}
                  disabled={isLoading}
                >
                  Remplir avec admin
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-2">
            💡 Comptes de démonstration (Mode Mock)
          </p>
          <p className="text-xs text-blue-700 mb-3">
            Utilisez exactement ces identifiants :
          </p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Nom d'utilisateur:</strong> admin <strong>|</strong> <strong>Mot de passe:</strong> password123</li>
            <li>• <strong>Nom d'utilisateur:</strong> editor <strong>|</strong> <strong>Mot de passe:</strong> password123</li>
            <li>• <strong>Nom d'utilisateur:</strong> user <strong>|</strong> <strong>Mot de passe:</strong> password123</li>
          </ul>
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 font-mono">
            🔍 Mode détecté: <strong>{IS_MOCK_MODE ? 'MOCK' : 'API'}</strong>
          </p>
          <p className="text-xs text-gray-500 font-mono mt-1">
            VITE_API_URL: "{import.meta.env.VITE_API_URL || '(vide)'}"
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Ouvrez la console (F12) pour voir les logs de connexion détaillés
          </p>
        </div>
      </div>
    </div>
  );
}
