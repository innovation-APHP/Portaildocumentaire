#!/usr/bin/env python3
"""
Serveur RAG d'exemple pour le portail documentaire
Ce serveur de démonstration montre comment implémenter l'API RAG
"""

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uvicorn
import os

app = FastAPI(title="RAG API Demo", version="1.0.0")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, limitez aux origines autorisées
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
RAG_API_SECRET_TOKEN = os.getenv("RAG_API_SECRET_TOKEN", "demo-token-change-me")

# ============================================================================
# Modèles de données
# ============================================================================

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

class SearchRequest(BaseModel):
    query: str
    max_results: Optional[int] = 10

class SearchResponse(BaseModel):
    results: List[DocumentSource]

# ============================================================================
# Base de documents de démonstration
# ============================================================================

DEMO_DOCUMENTS = [
    {
        "id": "doc-auth-001",
        "title": "Spécifications Fonctionnelles - Module Authentification",
        "content": "Le module d'authentification permet aux utilisateurs de se connecter avec leur email et mot de passe. Le système supporte également l'authentification multi-facteurs (2FA) via SMS ou application. Le mot de passe doit contenir au minimum 8 caractères. Après 5 tentatives échouées, le compte est temporairement bloqué. La session reste valide pendant 24h d'inactivité.",
        "category": "functional",
        "tags": ["authentification", "sécurité", "jwt"]
    },
    {
        "id": "doc-api-002",
        "title": "Architecture API REST - Service Authentification",
        "content": "L'API d'authentification expose POST /api/auth/login qui retourne un token JWT valide pour 7 jours. Le token doit être inclus dans le header Authorization des requêtes suivantes sous la forme 'Bearer TOKEN'. L'API utilise JWT avec l'algorithme RS256 et effectue une rotation des clés tous les 90 jours.",
        "category": "technical",
        "tags": ["api", "rest", "jwt", "sécurité"]
    },
    {
        "id": "doc-orders-003",
        "title": "Processus de Gestion des Commandes",
        "content": "Le workflow de commande comprend 5 étapes : Création, Validation, Préparation, Expédition et Livraison. La validation vérifie le stock disponible et les informations de livraison. Le délai de livraison standard est de 3-5 jours ouvrés. Le système envoie des notifications par email à chaque étape.",
        "category": "functional",
        "tags": ["commandes", "workflow", "business"]
    },
    {
        "id": "doc-returns-004",
        "title": "Politique de Retours et Remboursements",
        "content": "Les clients peuvent retourner un produit dans un délai de 30 jours après réception. Le produit doit être dans son emballage d'origine, non utilisé et non endommagé. Le processus : demande de retour, validation, retour du produit, inspection, remboursement sous 7 jours. Les frais de retour sont à la charge du client sauf en cas de défaut.",
        "category": "user",
        "tags": ["retours", "politique", "client"]
    },
    {
        "id": "doc-db-005",
        "title": "Base de Données - Schéma Commandes",
        "content": "Le schéma de base de données comprend deux tables principales : 'orders' (id, customer_id, status, total_amount, dates) et 'order_items' (id, order_id, product_id, quantity, unit_price). Des index sont configurés sur customer_id, status et created_at pour optimiser les performances.",
        "category": "technical",
        "tags": ["database", "schema", "postgresql"]
    },
    {
        "id": "doc-docker-006",
        "title": "Guide de Déploiement Docker",
        "content": "Le déploiement utilise Docker et Docker Compose. Prérequis : Docker 20.10+ et Docker Compose 2.0+. La configuration docker-compose.yml définit l'application (port 3000) et PostgreSQL 15. Commande de déploiement : docker-compose up -d. Les variables d'environnement sont définies dans .env.",
        "category": "technical",
        "tags": ["docker", "déploiement", "devops"]
    }
]

# ============================================================================
# Fonctions utilitaires
# ============================================================================

def validate_token(authorization: Optional[str]) -> bool:
    """Valide le token d'authentification"""
    if not authorization:
        return True  # Mode démo : autoriser sans token

    token = authorization.replace("Bearer ", "")
    return token == RAG_API_SECRET_TOKEN

def search_documents(query: str, max_results: int = 5) -> List[dict]:
    """Recherche simple dans les documents de démo"""
    query_lower = query.lower()
    query_words = query_lower.split()

    # Calculer le score de pertinence pour chaque document
    scored_docs = []
    for doc in DEMO_DOCUMENTS:
        # Créer un texte de recherche
        search_text = f"{doc['title']} {doc['content']} {' '.join(doc['tags'])}".lower()

        # Calculer le score basique
        score = 0.0

        # Score par mots-clés
        for word in query_words:
            if len(word) > 2:  # Ignorer les mots courts
                count = search_text.count(word)
                score += count * 0.1

        # Bonus si le titre contient le mot
        if any(word in doc['title'].lower() for word in query_words if len(word) > 2):
            score += 0.3

        # Bonus si plusieurs mots sont trouvés
        found_words = sum(1 for word in query_words if len(word) > 2 and word in search_text)
        if found_words > 1:
            score += found_words * 0.1

        if score > 0:
            scored_docs.append({
                **doc,
                'score': min(score, 1.0)  # Limiter à 1.0
            })

    # Trier par score et retourner les meilleurs résultats
    scored_docs.sort(key=lambda x: x['score'], reverse=True)
    return scored_docs[:max_results]

def generate_answer(query: str, documents: List[dict]) -> str:
    """Génère une réponse basée sur les documents trouvés"""
    query_lower = query.lower()

    # Réponses pré-programmées basées sur les mots-clés
    if 'authentification' in query_lower or 'connexion' in query_lower or 'login' in query_lower:
        return """D'après la documentation, le module d'authentification permet aux utilisateurs de se connecter avec leur email et mot de passe. Le système supporte également l'authentification multi-facteurs (2FA) via SMS ou application.

**Caractéristiques principales :**
- Mot de passe minimum 8 caractères
- Blocage après 5 tentatives échouées
- Session valide 24h d'inactivité
- Token JWT valide 7 jours

L'API expose l'endpoint `POST /api/auth/login` qui retourne un token JWT à inclure dans le header Authorization."""

    elif 'commande' in query_lower or 'order' in query_lower:
        return """Le processus de gestion des commandes comprend 5 étapes :

1. **Création** - Le client sélectionne ses produits
2. **Validation** - Vérification du stock et des informations
3. **Préparation** - Préparation en entrepôt
4. **Expédition** - Envoi du colis
5. **Livraison** - Réception par le client (3-5 jours ouvrés)

Le système envoie des notifications email à chaque étape pour tenir le client informé."""

    elif 'retour' in query_lower or 'remboursement' in query_lower:
        return """La politique de retours autorise les clients à retourner un produit dans un délai de **30 jours** après réception.

**Conditions :**
- Produit dans son emballage d'origine
- Non utilisé et non endommagé
- Frais de retour à la charge du client (sauf défaut)

**Processus :**
1. Demande de retour
2. Validation par le service client
3. Retour du produit
4. Inspection
5. Remboursement sous 7 jours"""

    elif 'api' in query_lower or 'rest' in query_lower:
        return """L'architecture API REST expose plusieurs services :

**Authentification :**
- `POST /api/auth/login` - Authentification et obtention du token JWT
- `POST /api/auth/refresh` - Renouvellement du token

**Sécurité :**
- JWT avec algorithme RS256
- Rotation des clés tous les 90 jours
- Rate limiting : 5 requêtes/minute

Le token doit être inclus dans le header `Authorization: Bearer TOKEN`."""

    elif 'docker' in query_lower or 'déploiement' in query_lower:
        return """Le déploiement utilise Docker et Docker Compose :

**Prérequis :**
- Docker 20.10+
- Docker Compose 2.0+

**Configuration :**
Le fichier `docker-compose.yml` définit :
- Application (port 3000)
- PostgreSQL 15

**Déploiement :**
```bash
docker-compose up -d
```

Les variables d'environnement sont définies dans le fichier `.env`."""

    elif 'base de données' in query_lower or 'database' in query_lower:
        return """La base de données PostgreSQL utilise un schéma optimisé :

**Tables principales :**
- `orders` - Commandes (id, customer_id, status, total_amount, dates)
- `order_items` - Articles (id, order_id, product_id, quantity, unit_price)

**Index pour les performances :**
- customer_id
- status
- created_at

Ce schéma permet des requêtes rapides pour le suivi des commandes."""

    elif documents:
        # Réponse générique basée sur les documents trouvés
        top_doc = documents[0]
        excerpt = top_doc['content'][:300]
        return f"""D'après la documentation "{top_doc['title']}", {excerpt}...

Pour plus d'informations, consultez les documents sources ci-dessous."""

    else:
        return """Je peux vous aider avec des informations sur :

- L'authentification et la gestion de compte
- Le processus de commande et livraison
- Les retours et remboursements
- L'architecture technique et les API
- Le déploiement avec Docker
- La base de données

Pouvez-vous préciser votre question ?"""

# ============================================================================
# Endpoints
# ============================================================================

@app.post("/query", response_model=QueryResponse)
async def query_rag(
    request: QueryRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Endpoint principal pour interroger le RAG
    """
    # Validation du token
    if not validate_token(authorization):
        raise HTTPException(status_code=403, detail="Token invalide")

    print(f"\n📥 Query reçue: {request.query}")

    # Rechercher les documents pertinents
    relevant_docs = search_documents(request.query, request.max_results)

    print(f"📚 Documents trouvés: {len(relevant_docs)}")

    # Générer la réponse
    answer = generate_answer(request.query, relevant_docs)

    # Formater les sources
    sources = [
        DocumentSource(
            document_id=doc['id'],
            title=doc['title'],
            excerpt=doc['content'][:200] + "..." if len(doc['content']) > 200 else doc['content'],
            score=doc['score']
        )
        for doc in relevant_docs
    ]

    # Calculer la confiance basée sur le nombre et le score des documents
    if sources:
        avg_score = sum(s.score for s in sources) / len(sources)
        confidence = min(avg_score + 0.2, 1.0)  # Bonus de confiance
    else:
        confidence = 0.3  # Faible confiance si aucun document

    print(f"✅ Réponse générée (confiance: {confidence:.2f})")

    return QueryResponse(
        answer=answer,
        sources=sources,
        conversation_id=f"conv-{datetime.now().timestamp()}",
        confidence=confidence
    )

@app.post("/search", response_model=SearchResponse)
async def search(
    request: SearchRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Endpoint de recherche de documents
    """
    if not validate_token(authorization):
        raise HTTPException(status_code=403, detail="Token invalide")

    relevant_docs = search_documents(request.query, request.max_results)

    results = [
        DocumentSource(
            document_id=doc['id'],
            title=doc['title'],
            excerpt=doc['content'][:200] + "...",
            score=doc['score']
        )
        for doc in relevant_docs
    ]

    return SearchResponse(results=results)

@app.get("/health")
async def health_check():
    """
    Vérification de santé de l'API
    """
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "documents_count": len(DEMO_DOCUMENTS)
    }

@app.get("/")
async def root():
    """
    Page d'accueil de l'API
    """
    return {
        "message": "RAG API Demo - Portail Documentaire",
        "version": "1.0.0",
        "endpoints": {
            "query": "POST /query - Interroger le RAG",
            "search": "POST /search - Rechercher des documents",
            "health": "GET /health - Vérifier la santé",
            "docs": "GET /docs - Documentation interactive"
        },
        "authentication": "Bearer token (optionnel en mode démo)"
    }

# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🤖 Serveur RAG de démonstration")
    print("="*60)
    print(f"📡 URL: http://localhost:8000")
    print(f"📚 Documentation: http://localhost:8000/docs")
    print(f"🔑 Token: {RAG_API_SECRET_TOKEN}")
    print(f"📄 Documents: {len(DEMO_DOCUMENTS)}")
    print("="*60 + "\n")

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
