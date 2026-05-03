# 🤖 Intégration API RAG - Guide Complet

## 📖 Vue d'ensemble

Ce guide explique comment intégrer votre API RAG (Retrieval-Augmented Generation) avec le portail documentaire. L'API RAG permet à l'assistant IA de répondre aux questions des utilisateurs en se basant sur la documentation.

---

## 🎯 Fonctionnement

**Flux de conversation :**

```
Utilisateur → Question
    ↓
Frontend → POST /query avec question + historique
    ↓
API RAG → Recherche dans la base documentaire
    ↓
API RAG → Génération de la réponse
    ↓
Frontend ← Réponse + sources
    ↓
Utilisateur ← Affichage de la réponse
```

---

## 📡 Spécification de l'API

### 1. Endpoint : POST /query

**URL :** `{VITE_RAG_API_URL}/query`

**Description :** Envoie une question et reçoit une réponse générée avec les sources documentaires.

#### Requête

**Headers :**
```http
Content-Type: application/json
Authorization: Bearer {VITE_RAG_API_TOKEN}  # Optionnel
```

**Body :**
```json
{
  "query": "Comment fonctionne l'authentification ?",
  "conversation_history": [
    {
      "role": "user",
      "content": "Bonjour",
      "timestamp": "2026-05-03T14:30:00Z"
    },
    {
      "role": "assistant",
      "content": "Bonjour ! Comment puis-je vous aider ?",
      "timestamp": "2026-05-03T14:30:01Z"
    }
  ],
  "max_results": 5,
  "context": []
}
```

**Champs de la requête :**

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `query` | string | ✅ Oui | La question de l'utilisateur |
| `conversation_history` | array | ❌ Non | Historique de la conversation pour le contexte |
| `max_results` | number | ❌ Non | Nombre maximum de sources à retourner (défaut: 5) |
| `context` | array | ❌ Non | Contexte additionnel (IDs de documents, etc.) |

#### Réponse

**Status Code :** `200 OK`

**Body :**
```json
{
  "answer": "L'authentification fonctionne via un système JWT. Les utilisateurs se connectent avec leur email et mot de passe via l'endpoint POST /api/auth/login, qui retourne un token JWT valide 7 jours. Ce token doit être inclus dans le header Authorization des requêtes suivantes.",
  "sources": [
    {
      "document_id": "doc-auth-001",
      "title": "Spécifications Fonctionnelles - Module Authentification",
      "excerpt": "Le module d'authentification permet aux utilisateurs de se connecter avec leur email et mot de passe...",
      "score": 0.95
    },
    {
      "document_id": "doc-api-002",
      "title": "Architecture API REST - Service Authentification",
      "excerpt": "POST /api/auth/login - Authentifie un utilisateur et retourne un token JWT...",
      "score": 0.87
    }
  ],
  "conversation_id": "conv-12345",
  "confidence": 0.92
}
```

**Champs de la réponse :**

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `answer` | string | ✅ Oui | La réponse générée par le RAG |
| `sources` | array | ❌ Non | Liste des documents sources utilisés |
| `sources[].document_id` | string | ❌ Non | ID unique du document source |
| `sources[].title` | string | ❌ Non | Titre du document |
| `sources[].excerpt` | string | ❌ Non | Extrait pertinent du document |
| `sources[].score` | number | ❌ Non | Score de pertinence (0-1) |
| `conversation_id` | string | ❌ Non | ID de conversation pour le suivi |
| `confidence` | number | ❌ Non | Niveau de confiance de la réponse (0-1) |

---

### 2. Endpoint : GET /health

**URL :** `{VITE_RAG_API_URL}/health`

**Description :** Vérifie que l'API RAG est opérationnelle.

#### Requête

**Headers :**
```http
Authorization: Bearer {VITE_RAG_API_TOKEN}  # Optionnel
```

#### Réponse

**Status Code :** `200 OK`

**Body :**
```json
{
  "status": "ok",
  "timestamp": "2026-05-03T14:30:00Z",
  "version": "1.0.0"
}
```

---

### 3. Endpoint : POST /search (Optionnel)

**URL :** `{VITE_RAG_API_URL}/search`

**Description :** Recherche de documents sans génération de réponse.

#### Requête

**Body :**
```json
{
  "query": "authentification",
  "max_results": 10
}
```

#### Réponse

**Body :**
```json
{
  "results": [
    {
      "document_id": "doc-auth-001",
      "title": "Spécifications Fonctionnelles - Module Authentification",
      "excerpt": "...",
      "score": 0.95
    }
  ]
}
```

---

## ⚙️ Configuration Frontend

### Fichier .env.local

```bash
# URL de base de votre API RAG
VITE_RAG_API_URL=http://localhost:8000

# Token d'authentification (optionnel)
VITE_RAG_API_TOKEN=sk-your-secret-token-here
```

### Via l'interface Paramètres

1. Menu > **Paramètres** ⚙️
2. Section **"Configuration des Connexions"**
3. Remplir :
   - **URL de l'API RAG** : `http://localhost:8000`
   - **Token RAG** : `sk-your-token` (optionnel)
4. Cliquer sur **"Tester"** pour vérifier la connexion
5. **"Sauvegarder et Recharger"**

---

## 🔧 Implémentation de l'API RAG

### Exemple avec Python FastAPI

```python
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import List, Optional
import openai  # ou votre LLM de choix

app = FastAPI()

# Modèles de données
class ConversationMessage(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None

class QueryRequest(BaseModel):
    query: str
    conversation_history: Optional[List[ConversationMessage]] = []
    max_results: Optional[int] = 5
    context: Optional[List[str]] = []

class DocumentSource(BaseModel):
    document_id: str
    title: str
    excerpt: str
    score: float

class QueryResponse(BaseModel):
    answer: str
    sources: List[DocumentSource]
    conversation_id: Optional[str] = None
    confidence: Optional[float] = None

# Endpoint /query
@app.post("/query", response_model=QueryResponse)
async def query_rag(
    request: QueryRequest,
    authorization: Optional[str] = Header(None)
):
    # Vérification du token (optionnel)
    if authorization:
        token = authorization.replace("Bearer ", "")
        # Valider le token ici
        pass
    
    # 1. Rechercher les documents pertinents dans votre base vectorielle
    # Exemple avec une base vectorielle (Pinecone, Weaviate, ChromaDB, etc.)
    relevant_docs = search_documents(request.query, max_results=request.max_results)
    
    # 2. Construire le contexte pour le LLM
    context = "\n\n".join([
        f"Document: {doc['title']}\n{doc['content']}"
        for doc in relevant_docs
    ])
    
    # 3. Construire l'historique de conversation
    conversation = []
    for msg in request.conversation_history:
        conversation.append({
            "role": msg.role,
            "content": msg.content
        })
    
    # 4. Générer la réponse avec le LLM
    prompt = f"""Tu es un assistant IA pour un portail documentaire.
Réponds à la question de l'utilisateur en te basant sur les documents suivants:

{context}

Question: {request.query}

Réponds de manière claire et concise. Si l'information n'est pas dans les documents, dis-le."""
    
    conversation.append({
        "role": "user",
        "content": prompt
    })
    
    # Appel au LLM (OpenAI, Anthropic, Llama, etc.)
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=conversation,
        temperature=0.7,
        max_tokens=500
    )
    
    answer = response.choices[0].message.content
    
    # 5. Formater les sources
    sources = [
        DocumentSource(
            document_id=doc['id'],
            title=doc['title'],
            excerpt=doc['content'][:200] + "...",
            score=doc['score']
        )
        for doc in relevant_docs
    ]
    
    return QueryResponse(
        answer=answer,
        sources=sources,
        conversation_id=f"conv-{generate_id()}",
        confidence=0.85
    )

# Endpoint /health
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Fonction helper pour rechercher des documents
def search_documents(query: str, max_results: int = 5):
    # Implémentez votre logique de recherche vectorielle ici
    # Exemple avec ChromaDB, Pinecone, Weaviate, etc.
    # Retourner une liste de documents avec leurs scores
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Exemple avec Node.js Express

```javascript
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /query
app.post('/query', async (req, res) => {
  try {
    const { query, conversation_history = [], max_results = 5 } = req.body;
    
    // Vérification du token
    const token = req.headers.authorization?.replace('Bearer ', '');
    // Valider le token si nécessaire
    
    // 1. Rechercher les documents pertinents
    const relevantDocs = await searchDocuments(query, max_results);
    
    // 2. Construire le contexte
    const context = relevantDocs
      .map(doc => `Document: ${doc.title}\n${doc.content}`)
      .join('\n\n');
    
    // 3. Générer la réponse avec le LLM
    const messages = [
      {
        role: 'system',
        content: `Tu es un assistant IA pour un portail documentaire.
Réponds aux questions en te basant sur les documents fournis.`
      },
      ...conversation_history.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: `Contexte:\n${context}\n\nQuestion: ${query}`
      }
    ];
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });
    
    const answer = completion.choices[0].message.content;
    
    // 4. Formater la réponse
    const sources = relevantDocs.map(doc => ({
      document_id: doc.id,
      title: doc.title,
      excerpt: doc.content.substring(0, 200) + '...',
      score: doc.score
    }));
    
    res.json({
      answer,
      sources,
      conversation_id: `conv-${Date.now()}`,
      confidence: 0.85
    });
    
  } catch (error) {
    console.error('RAG query error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /health
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Fonction de recherche de documents
async function searchDocuments(query, maxResults) {
  // Implémentez votre logique de recherche vectorielle
  // Retourner un tableau de documents avec scores
  return [];
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`RAG API running on http://localhost:${PORT}`);
});
```

---

## 🧪 Tests

### Test avec curl

```bash
# Test de santé
curl http://localhost:8000/health

# Test de requête simple
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "query": "Comment fonctionne l authentification ?",
    "max_results": 3
  }'

# Test avec historique de conversation
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Et le mot de passe oublié ?",
    "conversation_history": [
      {
        "role": "user",
        "content": "Comment fonctionne l authentification ?"
      },
      {
        "role": "assistant",
        "content": "L authentification utilise JWT..."
      }
    ]
  }'
```

### Test depuis l'interface

1. Allez sur **Assistant IA** dans le menu
2. Posez une question : "Comment fonctionne l'authentification ?"
3. Vérifiez la réponse et les sources affichées
4. Continuez la conversation pour tester l'historique

---

## 🔐 Sécurité

### Authentification

**Token Bearer :**
```http
Authorization: Bearer sk-your-secret-token-here
```

**Validation côté serveur :**
```python
def validate_token(token: str) -> bool:
    # Vérifier le token dans votre base
    # Ou utiliser JWT
    return token == os.getenv("RAG_API_SECRET_TOKEN")

@app.post("/query")
async def query(request: QueryRequest, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token requis")
    
    token = authorization.replace("Bearer ", "")
    if not validate_token(token):
        raise HTTPException(status_code=403, detail="Token invalide")
    
    # Traiter la requête...
```

### Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/query")
@limiter.limit("10/minute")
async def query_rag(request: QueryRequest):
    # Traiter la requête...
    pass
```

---

## 📊 Monitoring et Logs

### Logs recommandés

```python
import logging

logger = logging.getLogger(__name__)

@app.post("/query")
async def query_rag(request: QueryRequest):
    logger.info(f"Query received: {request.query[:50]}...")
    
    start_time = time.time()
    
    # Traitement...
    
    elapsed_time = time.time() - start_time
    logger.info(f"Query completed in {elapsed_time:.2f}s")
    
    return response
```

### Métriques à surveiller

- **Nombre de requêtes** par minute/heure
- **Temps de réponse** moyen
- **Taux d'erreur** (%)
- **Nombre de documents** retrouvés en moyenne
- **Score de confiance** moyen

---

## 🚀 Déploiement

### Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build
docker build -t rag-api .

# Run
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=your-key \
  -e RAG_API_SECRET_TOKEN=your-token \
  rag-api
```

### Production

```bash
# Avec Gunicorn + Uvicorn
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

---

## 📚 Documentation complète

Pour plus d'informations, consultez :
- `ASSISTANT_IA_RAG.md` - Guide d'intégration RAG
- `rag-api-swagger.yaml` - Spécification OpenAPI complète
- `ASSISTANT_IA_QUICKSTART.md` - Démarrage rapide

---

**Votre API RAG est maintenant prête à être intégrée ! 🤖✨**
