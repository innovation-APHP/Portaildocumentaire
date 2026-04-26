# 🤖 Assistant IA avec RAG - Configuration

## 📖 Vue d'ensemble

Le portail documentaire intègre un **assistant IA intelligent** basé sur la technologie RAG (Retrieval-Augmented Generation) qui permet d'interroger votre documentation en langage naturel.

---

## ✨ Fonctionnalités

### Mode Réel (API RAG)
- ✅ Connexion à votre propre API RAG
- ✅ Interrogation de votre base documentaire
- ✅ Réponses contextuelles basées sur vos documents
- ✅ Sources citées avec scores de pertinence
- ✅ Authentification par token Bearer

### Mode Mock (Démo)
- ✅ Fonctionne sans configuration
- ✅ Réponses prédéfinies intelligentes
- ✅ Simulation de recherche documentaire
- ✅ Idéal pour tester l'interface

---

## 🔧 Configuration

### Variables d'Environnement

Ajoutez ces variables dans votre fichier `.env` ou `.env.local` :

```bash
# URL de l'API RAG
VITE_RAG_API_URL=http://localhost:8000

# Token d'authentification (optionnel)
VITE_RAG_API_TOKEN=your-api-token-here
```

### Exemples de Configuration

#### Configuration locale (développement)
```bash
# .env.local
VITE_RAG_API_URL=http://localhost:8000
VITE_RAG_API_TOKEN=
```

#### Configuration production
```bash
# .env
VITE_RAG_API_URL=https://rag-api.monentreprise.com
VITE_RAG_API_TOKEN=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Mode Mock (sans API)
```bash
# .env.local
VITE_RAG_API_URL=
VITE_RAG_API_TOKEN=
```

Laisser `VITE_RAG_API_URL` vide active automatiquement le mode mock.

---

## 🌐 Contrat d'API RAG

Votre API RAG doit exposer les endpoints suivants :

### 1. Endpoint de requête

**POST /query**

**Request:**
```json
{
  "query": "Comment fonctionne l'authentification ?",
  "max_results": 3,
  "conversation_history": []
}
```

**Response:**
```json
{
  "answer": "L'authentification fonctionne avec JWT...",
  "sources": [
    {
      "document_id": "doc-123",
      "title": "Guide d'authentification",
      "excerpt": "Extrait pertinent du document...",
      "score": 0.95,
      "category": "technical"
    }
  ],
  "confidence": 0.87
}
```

### 2. Endpoint de santé

**GET /health**

**Response:**
```json
{
  "status": "ok"
}
```

ou simplement un code `200 OK`.

### 3. Authentification (optionnel)

Si votre API nécessite une authentification, elle doit accepter un header `Authorization` :

```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📋 Format de Réponse Attendu

### Champs Obligatoires

| Champ | Type | Description |
|-------|------|-------------|
| `answer` | string | La réponse générée par le RAG |

### Champs Optionnels

| Champ | Type | Description |
|-------|------|-------------|
| `sources` | array | Liste des documents sources |
| `confidence` | number | Score de confiance (0-1) |
| `conversation_id` | string | ID de conversation |

### Format des Sources

```json
{
  "document_id": "string",     // ID unique du document
  "title": "string",           // Titre du document
  "excerpt": "string",         // Extrait pertinent
  "score": 0.95,               // Score de pertinence (0-1)
  "category": "string",        // Catégorie (optionnel)
  "content": "string"          // Contenu (alternatif à excerpt)
}
```

---

## 🚀 Utilisation

### Accéder à l'Assistant

**Via le menu :**
1. Se connecter au portail
2. Cliquer sur "Assistant IA" dans le menu de navigation
3. Poser vos questions !

**Via l'URL directe :**
```
http://localhost:8080/chat
```

### Exemples de Questions

#### Questions générales
```
Comment fonctionne l'authentification ?
Quel est le processus de déploiement ?
Comment configurer la base de données ?
```

#### Questions spécifiques
```
Où se trouve la documentation de l'API REST ?
Comment gérer les erreurs de validation ?
Quelle est l'architecture du backend ?
```

#### Questions avec contexte
```
J'ai une erreur 401, que faire ?
Comment ajouter un nouvel utilisateur admin ?
Le déploiement Docker échoue, pourquoi ?
```

---

## 🔌 Exemple d'API RAG Compatible

Voici un exemple minimal d'API RAG en Python avec FastAPI :

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class QueryRequest(BaseModel):
    query: str
    max_results: int = 5
    conversation_history: Optional[List] = []

class Source(BaseModel):
    document_id: str
    title: str
    excerpt: str
    score: float
    category: Optional[str] = "technical"

class QueryResponse(BaseModel):
    answer: str
    sources: List[Source]
    confidence: float

@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    # Votre logique RAG ici
    # 1. Rechercher les documents pertinents
    # 2. Générer une réponse avec LLM
    # 3. Retourner la réponse formatée
    
    return QueryResponse(
        answer="Voici la réponse basée sur vos documents...",
        sources=[
            Source(
                document_id="doc-1",
                title="Guide d'utilisation",
                excerpt="Extrait pertinent du document...",
                score=0.95,
                category="user"
            )
        ],
        confidence=0.87
    )

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Démarrage :**
```bash
pip install fastapi uvicorn
python api_rag.py
```

---

## 📊 Swagger de votre API

Si vous avez un Swagger disponible pour votre API RAG, vous pouvez :

1. **Consulter la documentation** à `http://votre-api:port/docs`
2. **Tester les endpoints** directement dans Swagger
3. **Vérifier le contrat d'API** avant l'intégration

### Vérifications Importantes

Assurez-vous que votre API Swagger définit :
- ✅ L'endpoint `POST /query` avec le bon format de request/response
- ✅ L'endpoint `GET /health` pour le monitoring
- ✅ Les schémas de données pour `QueryRequest` et `QueryResponse`
- ✅ L'authentification si nécessaire (Bearer token)

---

## 🧪 Tester l'Intégration

### 1. Vérifier la Configuration

```bash
# Vérifier les variables d'environnement
echo $VITE_RAG_API_URL
echo $VITE_RAG_API_TOKEN
```

### 2. Tester l'API manuellement

```bash
# Test du health check
curl http://localhost:8000/health

# Test d'une requête
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "Test de connexion",
    "max_results": 3
  }'
```

### 3. Vérifier dans le Portail

1. Ouvrir la console du navigateur (F12)
2. Chercher le message de démarrage :
   ```
   🤖 Service RAG: Mode API réelle - http://localhost:8000
   ✅ API RAG opérationnelle
   ```
3. Naviguer vers `/chat`
4. Poser une question de test

---

## 🐛 Dépannage

### L'assistant ne répond pas

**Vérifier:**
1. L'API RAG est bien démarrée : `curl http://localhost:8000/health`
2. L'URL est correcte dans `.env` : `VITE_RAG_API_URL=http://localhost:8000`
3. Le token est valide (si requis)
4. Pas de erreurs CORS (vérifier la console navigateur)

**Solution CORS:**
```python
# Dans votre API RAG
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # URL du portail
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### L'API retourne une erreur 401

**Cause:** Token d'authentification manquant ou invalide

**Solution:**
```bash
# Vérifier le token dans .env
VITE_RAG_API_TOKEN=sk-xxxxxxxxxxxxxxxx

# Tester manuellement
curl -H "Authorization: Bearer sk-xxxxxxxxxxxxxxxx" \
  http://localhost:8000/health
```

### Les sources ne s'affichent pas

**Cause:** Format de réponse incorrect

**Solution:** Vérifier que votre API retourne bien un tableau `sources` avec les champs :
```json
{
  "sources": [
    {
      "document_id": "doc-1",
      "title": "Titre",
      "excerpt": "Extrait...",
      "score": 0.95
    }
  ]
}
```

### Mode Mock au lieu de Real

**Cause:** `VITE_RAG_API_URL` est vide ou l'API est inaccessible

**Solution:**
1. Vérifier `.env.local` :
   ```bash
   cat .env.local | grep RAG
   ```
2. Reconstruire l'application :
   ```bash
   # En local
   pnpm build
   # Redémarrer le dev server
   ```
3. Vérifier la console navigateur pour le mode actif

---

## 📈 Monitoring

### Vérifier la Santé de l'API

Le portail vérifie automatiquement la santé de l'API RAG au démarrage.

**Dans la console navigateur :**
```
🤖 Service RAG: Mode API réelle - http://localhost:8000
✅ API RAG opérationnelle
```

ou

```
🤖 Service RAG: Mode API réelle - http://localhost:8000
⚠️ API RAG non accessible, fallback vers mode mock
```

### Logs Applicatifs

Tous les appels à l'API RAG sont loggés :
```javascript
console.log('Requête RAG:', question);
console.log('Réponse RAG:', response);
console.error('Erreur RAG:', error);
```

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais commiter les tokens** dans Git
   ```bash
   # .gitignore
   .env.local
   .env.production
   ```

2. **Utiliser des variables d'environnement** pour les secrets
   ```bash
   VITE_RAG_API_TOKEN=${RAG_API_TOKEN}
   ```

3. **Activer HTTPS** en production
   ```bash
   VITE_RAG_API_URL=https://rag-api.monentreprise.com
   ```

4. **Limiter les origines CORS** dans l'API RAG
   ```python
   allow_origins=["https://docs.monentreprise.com"]
   ```

5. **Implémenter un rate limiting** dans l'API RAG

---

## 📚 Ressources

### Documentation Officielle
- [RAG (Retrieval-Augmented Generation)](https://en.wikipedia.org/wiki/Prompt_engineering#Retrieval-augmented_generation)
- [FastAPI](https://fastapi.tiangolo.com/)
- [LangChain](https://python.langchain.com/)

### Outils Recommandés
- **Vecteurs:** Pinecone, Weaviate, Chroma
- **LLM:** OpenAI, Anthropic Claude, Ollama
- **Framework:** LangChain, LlamaIndex
- **API:** FastAPI, Express.js

---

## 🎉 Prochaines Étapes

1. ✅ Configurer `VITE_RAG_API_URL` dans `.env`
2. ✅ Tester avec `curl` pour vérifier l'API
3. ✅ Lancer le portail et accéder à `/chat`
4. ✅ Poser des questions et vérifier les réponses
5. ✅ Affiner le prompt system de votre RAG
6. ✅ Monitorer les performances et ajuster

**Votre assistant IA est prêt ! 🚀**
