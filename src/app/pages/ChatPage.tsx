import { Card } from '../components/ui/card';
import { ChatBot } from '../components/ChatBot';
import { MessageSquare, Zap, BookOpen, Shield } from 'lucide-react';

export function ChatPage() {
  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Assistant Documentaire IA</h1>
        </div>
        <p className="text-gray-600">
          Interrogez votre documentation en langage naturel grâce à notre système RAG (Retrieval-Augmented Generation)
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm mb-1">Réponses instantanées</h3>
            <p className="text-xs text-gray-600">Obtenez des réponses précises en quelques secondes</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm mb-1">Sources vérifiées</h3>
            <p className="text-xs text-gray-600">Chaque réponse inclut les documents sources</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm mb-1">Contexte intelligent</h3>
            <p className="text-xs text-gray-600">Comprend le contexte de vos questions</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ChatBot />
      </Card>

      {/* Info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Astuce :</strong> Posez des questions en langage naturel comme "Comment fonctionne l'authentification ?" 
          ou "Quel est le délai de livraison ?" pour obtenir les meilleures réponses.
        </p>
      </div>
    </div>
  );
}
