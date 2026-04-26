# 🚀 Assistant IA - Démarrage Rapide

## ⚡ Configuration en 3 minutes

### 1. Configurer l'URL de votre API RAG

Éditez `.env.local` :

```bash
VITE_RAG_API_URL=http://localhost:8000
VITE_RAG_API_TOKEN=                    # Optionnel
```

### 2. Vérifier que votre API RAG fonctionne

```bash
# Test simple
curl http://localhost:8000/health

# Test de requête
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Test", "max_results": 3}'
```

### 3. Lancer le portail et tester

```bash
# L'application se recharge automatiquement
# Ouvrir: http://localhost:8080/chat
```

✅ **C'est tout !** Votre assistant IA est opérationnel.

---

## 📋 Contrat d'API Minimal

Votre API doit exposer :

### POST /query

**Request:**
```json
{
  "query": "Votre question ici",
  "max_results": 3
}
```

**Response:**
```json
{
  "answer": "La réponse générée...",
  "sources": [
    {
      "document_id": "doc-1",
      "title": "Titre du document",
      "excerpt": "Extrait pertinent...",
      "score": 0.95
    }
  ]
}
```

### GET /health

**Response:** `200 OK`

---

## 🎯 Mode Mock (Sans API)

Laissez `VITE_RAG_API_URL` vide pour tester sans API :

```bash
# .env.local
VITE_RAG_API_URL=
```

L'assistant fonctionnera avec des réponses prédéfinies intelligentes.

---

## 📖 Documentation Complète

- **Guide détaillé:** `ASSISTANT_IA_RAG.md`
- **Spécification Swagger:** `rag-api-swagger.yaml`
- **Exemple d'API:** Voir `ASSISTANT_IA_RAG.md` section "Exemple d'API RAG"

---

## 🐛 Problème ?

**Console navigateur (F12) :**
```
🤖 Service RAG: Mode API réelle - http://localhost:8000
✅ API RAG opérationnelle
```

Si vous voyez `⚠️ API RAG non accessible`, vérifiez :
1. L'API est bien démarrée
2. L'URL est correcte dans `.env.local`
3. Pas d'erreur CORS (voir doc complète)

---

**Besoin d'aide ?** Consultez `ASSISTANT_IA_RAG.md` pour le guide complet.
