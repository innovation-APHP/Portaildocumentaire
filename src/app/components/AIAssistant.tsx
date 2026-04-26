import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Send, Bot, User, Loader2, AlertCircle, FileText, X, Minimize2, Maximize2 } from 'lucide-react';
import { ragClient, RagMessage } from '../services/ragClient';
import { Link } from 'react-router';

interface AIAssistantProps {
  mode?: 'page' | 'floating';
  onClose?: () => void;
}

export function AIAssistant({ mode = 'page', onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<RagMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isEnabled = ragClient.isEnabled();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !isEnabled) return;

    const userMessage: RagMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await ragClient.query({
        query: userMessage.content,
        conversation_history: messages,
      });

      const assistantMessage: RagMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Optionnel: ajouter les sources si disponibles
      if (response.sources && response.sources.length > 0) {
        const sourcesMessage: RagMessage = {
          role: 'assistant',
          content: `📚 Sources: ${response.sources.map(s => s.title || s.document_id).join(', ')}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, sourcesMessage]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la communication avec l\'assistant');
      console.error('AI Assistant error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
  };

  if (!isEnabled) {
    return (
      <Card className={mode === 'floating' ? 'shadow-xl' : ''}>
        <CardContent className="py-12 text-center">
          <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Assistant IA non configuré</h3>
          <p className="text-sm text-gray-600 mb-4">
            L'assistant IA n'est pas activé. Pour l'activer, configurez l'URL de l'API RAG dans votre fichier .env :
          </p>
          <code className="block text-xs bg-gray-100 p-3 rounded font-mono text-left">
            VITE_RAG_API_URL=http://localhost:8000
          </code>
          <p className="text-xs text-gray-500 mt-4">
            Consultez la documentation pour plus d'informations.
          </p>
        </CardContent>
      </Card>
    );
  }

  const containerClass = mode === 'floating'
    ? 'fixed bottom-4 right-4 w-96 max-h-[600px] shadow-2xl z-50 flex flex-col'
    : 'max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)]';

  return (
    <Card className={containerClass}>
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Assistant IA</CardTitle>
              <p className="text-xs text-gray-500">Posez vos questions sur la documentation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Effacer
              </Button>
            )}
            {mode === 'floating' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                {onClose && (
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-4">
                  Bienvenue ! Je suis votre assistant documentaire.
                </p>
                <div className="text-xs text-gray-400 space-y-2">
                  <p>Exemples de questions :</p>
                  <ul className="list-disc list-inside text-left max-w-md mx-auto">
                    <li>Comment déployer l'application ?</li>
                    <li>Quelle est l'architecture du backend ?</li>
                    <li>Comment configurer l'authentification ?</li>
                  </ul>
                </div>
              </div>
            )}

            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-blue-500'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white ml-12'
                      : 'bg-gray-100 text-gray-900 mr-12'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.timestamp && (
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 px-4 py-2 rounded-lg bg-gray-100">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  <p className="text-sm text-gray-600 mt-1">Réflexion en cours...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">Erreur</p>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="flex-shrink-0 border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Posez votre question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Propulsé par votre système RAG
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
