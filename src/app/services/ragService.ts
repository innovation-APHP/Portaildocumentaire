import { mockDocuments } from '../data/mockDocuments';
import { connectionConfig } from './connectionConfig';

const RAG_API_URL = connectionConfig.getRagApiUrl();
const RAG_API_TOKEN = connectionConfig.getRagApiToken();
const USE_REAL_RAG = !!RAG_API_URL;

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: DocumentSource[];
}

export interface DocumentSource {
  id: string;
  title: string;
  category: string;
  relevanceScore: number;
  excerpt: string;
}

export interface RAGResponse {
  answer: string;
  sources: DocumentSource[];
  confidence: number;
}

// Fonction principale pour interroger le RAG
export async function queryRAG(question: string): Promise<RAGResponse> {
  if (USE_REAL_RAG) {
    return queryRealRAG(question);
  } else {
    return queryMockRAG(question);
  }
}

// Appel à l'API RAG réelle
async function queryRealRAG(question: string): Promise<RAGResponse> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (RAG_API_TOKEN) {
      headers['Authorization'] = `Bearer ${RAG_API_TOKEN}`;
    }

    const response = await fetch(`${RAG_API_URL}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: question,
        max_results: 3,
      }),
    });

    if (!response.ok) {
      console.error('RAG API error:', response.status, response.statusText);
      throw new Error(`Erreur API RAG: ${response.status}`);
    }

    const data = await response.json();

    // Adapter la réponse de l'API au format attendu
    return {
      answer: data.answer || data.response || 'Aucune réponse générée.',
      sources: (data.sources || []).map((source: any, index: number) => ({
        id: source.document_id || source.id || `doc-${index}`,
        title: source.title || 'Document sans titre',
        category: source.category || 'technical',
        relevanceScore: source.score || source.relevance || 0.5,
        excerpt: source.excerpt || source.content || source.text || '',
      })),
      confidence: data.confidence || 0.8,
    };
  } catch (error) {
    console.error('Erreur lors de l\'appel au RAG:', error);
    // Fallback sur le mode mock en cas d'erreur
    console.warn('Fallback vers le mode mock RAG');
    return queryMockRAG(question);
  }
}

// Simuler l'appel à une API RAG (mode mock)
async function queryMockRAG(question: string): Promise<RAGResponse> {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  // Logique de recherche simple pour simuler un RAG
  const lowerQuestion = question.toLowerCase();

  // Trouver les documents pertinents
  const relevantDocs = mockDocuments
    .filter(doc => {
      const searchText = `${doc.title} ${doc.description} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
      return searchText.includes(lowerQuestion.split(' ')[0]) ||
             searchText.includes(lowerQuestion.split(' ')[1]) ||
             lowerQuestion.split(' ').some(word => word.length > 4 && searchText.includes(word));
    })
    .map(doc => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      relevanceScore: Math.random() * 0.5 + 0.5, // Score entre 0.5 et 1
      excerpt: doc.description
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);

  // Générer une réponse intelligente basée sur la question
  let answer = '';
  let confidence = 0.8;

  if (lowerQuestion.includes('authentification') || lowerQuestion.includes('connexion') || lowerQuestion.includes('login')) {
    answer = `D'après la documentation, le module d'authentification permet aux utilisateurs de se connecter avec leur email et mot de passe. Le système supporte également l'authentification multi-facteurs (2FA) via SMS ou application. Le mot de passe doit contenir au minimum 8 caractères, et après 5 tentatives échouées, le compte est temporairement bloqué. La session reste valide pendant 24h d'inactivité.\n\nL'API d'authentification expose des endpoints REST, notamment POST /api/auth/login qui retourne un token JWT valide pour l'authentification des requêtes suivantes.`;
  } else if (lowerQuestion.includes('commande') || lowerQuestion.includes('order')) {
    answer = `Le processus de gestion des commandes suit 5 étapes principales :\n\n1. **Création de commande** : Le client sélectionne ses produits\n2. **Validation** : Vérification du stock et des informations de livraison\n3. **Préparation** : Préparation des articles en entrepôt\n4. **Expédition** : Envoi du colis\n5. **Livraison** : Réception par le client (délai de 3-5 jours ouvrés)\n\nLe schéma de base de données utilise deux tables principales : 'orders' et 'order_items', avec des relations vers les clients et produits.`;
  } else if (lowerQuestion.includes('retour') || lowerQuestion.includes('remboursement')) {
    answer = `La politique de retours autorise les clients à retourner un produit dans un délai de 30 jours après réception, à condition qu'il soit dans son emballage d'origine, non utilisé et non endommagé.\n\nLe processus de remboursement se déroule comme suit :\n1. Le client effectue une demande de retour\n2. Le service client valide la demande\n3. Le produit est retourné\n4. Une inspection est effectuée\n5. Le remboursement est effectué sous 7 jours`;
  } else if (lowerQuestion.includes('api') || lowerQuestion.includes('rest') || lowerQuestion.includes('endpoint')) {
    answer = `L'architecture API REST de la plateforme expose plusieurs services :\n\n**Service d'authentification** :\n- POST /api/auth/login : Authentification et obtention d'un token JWT\n- POST /api/auth/refresh : Renouvellement du token\n\nLa sécurité utilise JWT avec l'algorithme RS256, avec une rotation des clés tous les 90 jours et un rate limiting de 5 requêtes par minute pour éviter les attaques.`;
  } else if (lowerQuestion.includes('docker') || lowerQuestion.includes('déploiement') || lowerQuestion.includes('deployment')) {
    answer = `Le déploiement de l'application utilise Docker et Docker Compose. Les prérequis sont Docker 20.10+ et Docker Compose 2.0+.\n\nLa configuration docker-compose.yml définit plusieurs services dont l'application principale (port 3000) et la base de données PostgreSQL 15. Pour déployer, il suffit d'exécuter la commande 'docker-compose up -d'.`;
  } else if (lowerQuestion.includes('base de données') || lowerQuestion.includes('database') || lowerQuestion.includes('bdd')) {
    answer = `La base de données utilise PostgreSQL avec plusieurs schémas optimisés :\n\n**Schéma Commandes** :\n- Table 'orders' : Stocke les informations de commande (id, customer_id, status, montant, dates)\n- Table 'order_items' : Détaille les articles de chaque commande\n\nDes index sont configurés sur customer_id, status et created_at pour optimiser les performances des requêtes.`;
  } else if (lowerQuestion.includes('compte') || lowerQuestion.includes('profil') || lowerQuestion.includes('utilisateur')) {
    answer = `Pour gérer votre compte utilisateur :\n\n**Connexion** : Accédez à la page de connexion et saisissez votre email et mot de passe.\n\n**Mot de passe oublié** : Cliquez sur "Mot de passe oublié" et suivez le lien reçu par email.\n\n**Modification du profil** : Dans "Mon profil", vous pouvez modifier vos informations personnelles et changer votre mot de passe dans "Paramètres de sécurité".`;
  } else if (lowerQuestion.includes('démarrage') || lowerQuestion.includes('commencer') || lowerQuestion.includes('débuter')) {
    answer = `Pour démarrer avec la plateforme, suivez ces étapes :\n\n1. **Créez votre compte** : Inscrivez-vous et validez votre email\n2. **Première connexion** : Connectez-vous et complétez votre profil\n3. **Découvrez l'interface** : Explorez le tableau de bord et le menu de navigation\n\nDes tutoriels vidéo sont également disponibles pour vous accompagner dans la prise en main.`;
  } else if (lowerQuestion.includes('paiement') || lowerQuestion.includes('payment')) {
    answer = `La plateforme accepte plusieurs modes de paiement :\n- Carte bancaire\n- PayPal\n- Virement bancaire\n\nToutes les transactions sont sécurisées et les informations de paiement sont chiffrées.`;
  } else {
    answer = `Je peux vous aider avec des informations sur :\n- L'authentification et la gestion de compte\n- Le processus de commande et livraison\n- Les retours et remboursements\n- L'architecture technique et les API\n- Le déploiement avec Docker\n- La base de données\n\nPouvez-vous préciser votre question ?`;
    confidence = 0.5;
  }

  return {
    answer,
    sources: relevantDocs,
    confidence
  };
}

// Vérifier la santé de l'API RAG
export async function checkRAGHealth(): Promise<boolean> {
  if (!USE_REAL_RAG) {
    return true; // Mode mock toujours disponible
  }

  try {
    const headers: HeadersInit = {};
    if (RAG_API_TOKEN) {
      headers['Authorization'] = `Bearer ${RAG_API_TOKEN}`;
    }

    const response = await fetch(`${RAG_API_URL}/health`, {
      method: 'GET',
      headers,
    });

    return response.ok;
  } catch (error) {
    console.error('RAG health check failed:', error);
    return false;
  }
}

// Retourne le mode actuel
export function getRAGMode(): 'real' | 'mock' {
  return USE_REAL_RAG ? 'real' : 'mock';
}

// Suggestions de questions
export const suggestedQuestions = [
  "Comment fonctionne l'authentification ?",
  "Quel est le processus de gestion des commandes ?",
  "Comment retourner un produit ?",
  "Quelle est l'architecture de l'API REST ?",
  "Comment déployer l'application avec Docker ?",
  "Comment gérer mon compte utilisateur ?",
  "Quels sont les délais de livraison ?",
  "Comment réinitialiser mon mot de passe ?"
];

// Log du mode au démarrage
if (USE_REAL_RAG) {
  console.log('🤖 Service RAG: Mode API réelle -', RAG_API_URL);
  checkRAGHealth().then(healthy => {
    if (healthy) {
      console.log('✅ API RAG opérationnelle');
    } else {
      console.warn('⚠️ API RAG non accessible, fallback vers mode mock');
    }
  });
} else {
  console.log('🤖 Service RAG: Mode mock (VITE_RAG_API_URL non configuré)');
}
