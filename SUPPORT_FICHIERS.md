# Support Multi-Formats - Portail Documentaire

## 📁 Nouveauté : Support de tous types de fichiers + Viewers intégrés 🎉

Le portail documentaire supporte maintenant **3 types de documents** avec **visualisation directe** :

1. **Documents Texte** (Markdown, HTML, TXT) - Rendu intégré
2. **Fichiers attachés** (PDF, Word, Excel, PowerPoint, etc.) - **Viewers intégrés ✨**
3. **Liens externes** (Google Drive, SharePoint, URLs)

## 🎬 Nouveauté : Viewers Intégrés

Les fichiers ne nécessitent plus de téléchargement ! Visualisez-les directement dans le portail :

| Format | Viewer | Fonctionnalités |
|--------|--------|-----------------|
| **PDF** | react-pdf | Navigation page par page, sélection de texte, annotations |
| **Word/Excel/PowerPoint** | Google Docs Viewer | Prévisualisation complète dans iframe |
| **Images** (PNG, JPG, SVG) | Natif | Affichage responsive avec zoom |
| **JSON/XML/CSV** | Code formaté | Coloration syntaxique, indentation |
| **Markdown** | MarkdownViewer | Rendu HTML complet avec GFM |

➡️ Voir `VIEWERS_INTEGRATION.md` pour la documentation complète des viewers.

---

## 📝 Types de Documents

### 1. Documents Texte / Markdown

**Formats supportés :**
- `.md` (Markdown)
- `.txt` (Texte brut)
- `.html` (HTML)
- `.json` (JSON)
- `.csv` (CSV)
- `.xml` (XML)

**Fonctionnalités :**
- ✅ Contenu affiché directement dans le portail
- ✅ Rendu Markdown avec mise en forme
- ✅ Recherche full-text dans le contenu
- ✅ Édition en ligne

### 2. Fichiers Attachés

**Formats supportés :**
- 📄 **Documents** : `.pdf`, `.doc`, `.docx`
- 📊 **Tableurs** : `.xls`, `.xlsx`, `.csv`
- 📽️ **Présentations** : `.ppt`, `.pptx`
- 🗜️ **Archives** : `.zip`, `.rar`
- 📋 **Autres** : `.json`, `.xml`

**Caractéristiques :**
- ✅ Upload jusqu'à 50 MB
- ✅ **Viewer intégré pour visualisation directe** 🎬
- ✅ Bouton de téléchargement toujours disponible
- ✅ Aperçu du type de fichier
- ✅ Notes/description optionnelles
- ✅ Stockage sécurisé dans PostgreSQL

**Affichage :**
- **PDF** : Viewer page par page avec navigation
- **Office** : Google Docs Viewer en iframe
- **Images** : Affichage natif responsive
- **Texte** : Coloration syntaxique
- Bouton "Télécharger" en bas de page
- Notes/description affichées séparément

### 3. Liens Externes

**Usage :**
- Documents hébergés sur Google Drive
- Fichiers SharePoint
- Documentation externe
- Confluence, Notion, etc.

**Fonctionnalités :**
- ✅ Simple URL à fournir
- ✅ Bouton "Ouvrir le document" (nouvelle fenêtre)
- ✅ Description optionnelle
- ✅ Badge bleu avec icône lien externe

---

## 🎨 Interface CRUD

### Créer un document

1. **Aller sur `/admin`**
2. **Cliquer "Nouveau document"**
3. **Sélectionner le type :**
   - 🔘 Texte / Markdown
   - 🔘 Fichier (PDF, Word, etc.)
   - 🔘 Lien externe

### Type : Texte / Markdown

```
Titre: Guide d'utilisation
Catégorie: Utilisateur
Description: Guide complet pour les utilisateurs
Contenu: [Éditeur Markdown]
Tags: Guide, Utilisateur
```

### Type : Fichier

```
Titre: Présentation Q1 2026
Catégorie: Fonctionnelle
Description: Résultats du premier trimestre
Fichier: [Upload .pptx max 50MB]
Notes (optionnel): Présentation pour le comité de direction
Tags: Présentation, Q1
```

### Type : Lien Externe

```
Titre: Documentation API Externe
Catégorie: Technique
Description: Documentation de l'API partenaire
URL: https://docs.partenaire.com/api
Description du lien: Accès nécessite un compte partenaire
Tags: API, Externe
```

---

## 🔍 Affichage des Documents

### Documents Texte
- Rendu Markdown complet
- Syntaxe mise en forme
- Liens internes et externes
- Images inline

### Fichiers Attachés
```
┌─────────────────────────────────────┐
│ 📄 Fichier attaché                  │
│                                     │
│ Type: application/pdf               │
│                                     │
│ [📥 Télécharger le fichier]         │
│                                     │
│ Notes / Description                 │
│ Document de spécifications v2.0     │
└─────────────────────────────────────┘
```

### Liens Externes
```
┌─────────────────────────────────────┐
│ 🔗 Document externe                 │
│                                     │
│ Ce document est hébergé sur une     │
│ plateforme externe.                 │
│                                     │
│ [🔗 Ouvrir le document]             │
│                                     │
│ Description                         │
│ Accès nécessite VPN entreprise     │
└─────────────────────────────────────┘
```

---

## 🗄️ Stockage Backend

### Base de Données PostgreSQL

**Nouvelles colonnes :**

```sql
-- Type de fichier uploadé
file_type VARCHAR(50)

-- URL externe si applicable
external_url VARCHAR(2000)

-- Indicateur lien externe
is_external BOOLEAN DEFAULT false
```

**Exemple de requête :**

```sql
-- Document texte
INSERT INTO documents (title, content, file_type)
VALUES ('Guide', '# Contenu markdown', 'text/markdown');

-- Fichier PDF
INSERT INTO documents (title, file_path, file_type)
VALUES ('Rapport', 'uploads/rapport.pdf', 'application/pdf');

-- Lien externe
INSERT INTO documents (title, is_external, external_url)
VALUES ('Doc Google', true, 'https://docs.google.com/...');
```

---

## 📊 Gestion des Uploads

### Configuration

**Fichier : `server/src/middleware/upload.ts`**

```typescript
// Formats acceptés
const allowedExts = [
  '.md', '.txt', '.html',      // Texte
  '.pdf',                      // PDF
  '.doc', '.docx',             // Word
  '.xls', '.xlsx',             // Excel
  '.ppt', '.pptx',             // PowerPoint
  '.zip', '.rar',              // Archives
  '.csv', '.json', '.xml'      // Données
];

// Taille max : 50 MB
limits: { fileSize: 52428800 }
```

### Stockage

**Développement :**
```
./server/uploads/
```

**Production (Docker) :**
```
Volume: uploads-data
Path: /app/uploads
```

---

## 🔐 Sécurité

### Validation

- ✅ Extension de fichier vérifiée
- ✅ Type MIME vérifié
- ✅ Taille limitée (50 MB)
- ✅ Nom de fichier sanitisé
- ✅ Path traversal bloqué

### Permissions

**Upload/Modification :**
- Admin ✅
- Editor ✅
- User ❌

**Téléchargement :**
- Tous les utilisateurs authentifiés ✅

**Liens externes :**
- Ouverts dans nouvelle fenêtre (rel="noopener noreferrer")

---

## 🎯 Cas d'Usage

### 1. Documentation Technique
```
Type: Texte / Markdown
Contenu: Écrit directement dans l'éditeur
Tags: API, Backend, PostgreSQL
```

### 2. Spécifications PDF
```
Type: Fichier
Upload: specifications_v2.pdf (2.5 MB)
Notes: Version validée par l'équipe produit
Tags: Spécifications, Produit
```

### 3. Présentation PowerPoint
```
Type: Fichier
Upload: presentation_q1.pptx (15 MB)
Notes: Présentation conseil d'administration
Tags: Présentation, Q1, Finance
```

### 4. Document Google Drive
```
Type: Lien externe
URL: https://docs.google.com/document/d/abc123
Description: Nécessite compte @entreprise.com
Tags: Collaboratif, Externe
```

### 5. Feuille Excel
```
Type: Fichier
Upload: budget_2026.xlsx (450 KB)
Notes: Budget prévisionnel validé
Tags: Budget, Finance, 2026
```

---

## 📱 Interface Mobile

Tous les types de documents sont **responsive** :

- ✅ Boutons tactiles adaptés
- ✅ Téléchargement mobile optimisé
- ✅ Liens externes s'ouvrent correctement
- ✅ Aperçu fichiers adapté

---

## 🔄 Migration

### Mettre à jour le schéma

```bash
# En mode Docker
docker-compose exec backend psql $DATABASE_URL -f dist/db/schema_update.sql

# En local
psql $DATABASE_URL -f server/src/db/schema_update.sql
```

### Vérifier les colonnes

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'documents';
```

---

## 📚 API

### Créer un document avec fichier

```bash
curl -X POST http://localhost:3001/api/documents \
  -H "Authorization: Bearer <token>" \
  -F "title=Mon document" \
  -F "category=technical" \
  -F "description=Un document PDF" \
  -F "file=@document.pdf" \
  -F "tags=[\"PDF\",\"Technique\"]"
```

### Créer un lien externe

```bash
curl -X POST http://localhost:3001/api/documents \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Documentation externe",
    "category": "technical",
    "is_external": true,
    "external_url": "https://docs.google.com/document/d/abc",
    "content": "Nécessite un compte Google",
    "tags": ["Externe", "Google"]
  }'
```

---

## ✅ Checklist

- [x] Backend supporte tous les formats
- [x] Upload jusqu'à 50 MB
- [x] Interface CRUD avec 3 types
- [x] Affichage adapté par type
- [x] Téléchargement fichiers
- [x] Ouverture liens externes
- [x] Schéma PostgreSQL mis à jour
- [x] Documentation complète

---

**Le portail supporte maintenant tous types de documents ! 🎉**
