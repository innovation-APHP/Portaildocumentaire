# 🧪 Tester l'API RAG - Guide Pratique

## 🚀 Démarrage Rapide (5 minutes)

### Option 1 : Serveur de démonstration inclus

**1. Démarrer le serveur RAG de démo**

```bash
# Depuis la racine du projet
./START_RAG_SERVER.sh
```

Le serveur démarre sur `http://localhost:8000`

**2. Configurer le frontend**

**Via l'interface Paramètres :**
1. Menu > **Paramètres** ⚙️
2. Section "Configuration des Connexions"
3. **URL de l'API RAG** : `http://localhost:8000`
4. **Token RAG** : `demo-token-change-me`
5. Cliquer sur **"Tester"** → doit afficher "Connexion RAG réussie !"
6. **"Sauvegarder et Recharger"**

**Ou via .env.local :**
```bash
VITE_RAG_API_URL=http://localhost:8000
VITE_RAG_API_TOKEN=demo-token-change-me
```

**3. Tester l'assistant**

1. Menu > **Assistant IA** 🤖
2. Posez une question : "Comment fonctionne l'authentification ?"
3. La réponse devrait apparaître avec les sources

✅ **Ça marche !** L'assistant IA est maintenant opérationnel.

---

## 🧪 Tests manuels avec curl

### Test 1 : Vérifier la santé de l'API

```bash
curl http://localhost:8000/health
```

**Réponse attendue :**
```json
{
  "status": "ok",
  "timestamp": "2026-05-03T14:30:00",
  "version": "1.0.0",
  "documents_count": 6
}
```

### Test 2 : Question simple

```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token-change-me" \
  -d '{
    "query": "Comment fonctionne l authentification ?",
    "max_results": 3
  }'
```

**Réponse attendue :**
```json
{
  "answer": "D'après la documentation, le module d'authentification...",
  "sources": [
    {
      "document_id": "doc-auth-001",
      "title": "Spécifications Fonctionnelles - Module Authentification",
      "excerpt": "Le module d'authentification permet...",
      "score": 0.95
    }
  ],
  "conversation_id": "conv-1714744200.123",
  "confidence": 0.92
}
```

### Test 3 : Question avec historique de conversation

```bash
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
        "content": "L authentification utilise JWT avec email et mot de passe."
      }
    ],
    "max_results": 2
  }'
```

### Test 4 : Recherche de documents

```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "commandes",
    "max_results": 5
  }'
```

---

## 📊 Questions de test recommandées

### Questions sur l'authentification
- "Comment fonctionne l'authentification ?"
- "Quel est le format du token JWT ?"
- "Comment réinitialiser mon mot de passe ?"
- "Combien de temps dure une session ?"

### Questions sur les commandes
- "Quel est le processus de gestion des commandes ?"
- "Combien de temps pour recevoir ma commande ?"
- "Comment suivre ma commande ?"

### Questions sur les retours
- "Comment retourner un produit ?"
- "Quel est le délai pour les remboursements ?"
- "Quelles sont les conditions de retour ?"

### Questions techniques
- "Quelle est l'architecture de l'API ?"
- "Comment déployer avec Docker ?"
- "Quel est le schéma de la base de données ?"

### Questions générales
- "Quels modes de paiement acceptez-vous ?"
- "Comment créer un compte ?"
- "Où trouver la documentation ?"

---

## 🔍 Vérifier les logs

### Logs du serveur RAG

Pendant que le serveur tourne, vous verrez :

```
📥 Query reçue: Comment fonctionne l'authentification ?
📚 Documents trouvés: 2
✅ Réponse générée (confiance: 0.92)
```

### Logs du frontend

Dans DevTools (F12) > Console :

```
🤖 Assistant IA activé: http://localhost:8000
✅ API RAG opérationnelle
```

---

## 🐛 Dépannage

### Erreur : "RAG API non configurée"

**Cause :** `VITE_RAG_API_URL` n'est pas défini

**Solution :**
1. Vérifiez `.env.local` : `VITE_RAG_API_URL=http://localhost:8000`
2. Ou configurez via Paramètres
3. Rechargez la page

### Erreur : "API RAG non accessible"

**Cause :** Le serveur RAG n'est pas démarré

**Solution :**
```bash
# Vérifier si le serveur tourne
curl http://localhost:8000/health

# Si non, démarrer le serveur
./START_RAG_SERVER.sh
```

### Erreur : "Token invalide"

**Cause :** Le token ne correspond pas

**Solution :**
1. Vérifiez que le token est bien `demo-token-change-me`
2. Ou lancez le serveur avec un token personnalisé :
```bash
export RAG_API_SECRET_TOKEN=mon-token
./START_RAG_SERVER.sh
```

### Erreur : "Port 8000 déjà utilisé"

**Cause :** Un autre processus utilise le port 8000

**Solution :**
```bash
# Trouver le processus
lsof -i :8000

# Ou changer le port dans example-rag-server.py
# Ligne : uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Pas de réponse dans l'assistant

**Vérifications :**

1. **Serveur RAG actif ?**
```bash
curl http://localhost:8000/health
```

2. **Configuration correcte ?**
   - Paramètres > Configuration des Connexions
   - Vérifier URL et Token
   - Cliquer sur "Tester"

3. **Console navigateur (F12)**
   - Rechercher les erreurs
   - Vérifier les requêtes réseau

4. **Logs serveur RAG**
   - Vérifier si les requêtes arrivent
   - Regarder les erreurs éventuelles

---

## 📈 Performances

### Temps de réponse attendu

- **Serveur démo** : 100-500ms
- **Avec LLM réel** (OpenAI, etc.) : 1-3s
- **Avec base vectorielle** : 500ms-2s

### Optimisations possibles

1. **Cache des réponses** fréquentes
2. **Recherche vectorielle** (ChromaDB, Pinecone)
3. **LLM plus rapide** (Llama, Mistral)
4. **Streaming** des réponses

---

## 🔄 Passer à une API RAG réelle

### 1. Avec OpenAI

```python
# Modifier example-rag-server.py
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_answer(query: str, documents: List[dict]) -> str:
    context = "\n\n".join([
        f"Document: {doc['title']}\n{doc['content']}"
        for doc in documents
    ])
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Tu es un assistant IA pour un portail documentaire."},
            {"role": "user", "content": f"Contexte:\n{context}\n\nQuestion: {query}"}
        ],
        temperature=0.7,
        max_tokens=500
    )
    
    return response.choices[0].message.content
```

### 2. Avec une base vectorielle

```python
# Ajouter ChromaDB
import chromadb

# Initialiser ChromaDB
client = chromadb.Client()
collection = client.create_collection("documents")

# Indexer les documents
for doc in DEMO_DOCUMENTS:
    collection.add(
        documents=[doc['content']],
        metadatas=[{"title": doc['title'], "id": doc['id']}],
        ids=[doc['id']]
    )

# Rechercher
def search_documents(query: str, max_results: int = 5):
    results = collection.query(
        query_texts=[query],
        n_results=max_results
    )
    return results
```

---

## 📚 Ressources

### Documentation
- `API_RAG_INTEGRATION.md` - Guide complet d'intégration
- `ASSISTANT_IA_RAG.md` - Documentation RAG détaillée
- `http://localhost:8000/docs` - Documentation interactive (Swagger)

### Exemples de code
- `example-rag-server.py` - Serveur de démonstration
- `src/app/services/ragClient.ts` - Client frontend
- `src/app/components/AIAssistant.tsx` - Interface utilisateur

### Outils recommandés
- **Postman** - Pour tester les endpoints
- **curl** - Pour les tests en ligne de commande
- **DevTools** (F12) - Pour déboguer le frontend

---

**Votre API RAG est prête à être testée ! 🧪✨**
