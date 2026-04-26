# Visualisation Intégrée des Documents

## 📖 Vue d'ensemble

Le portail documentaire intègre maintenant des **viewers natifs** pour afficher les documents directement dans l'application, sans nécessiter de téléchargement.

---

## 🎯 Types de Documents Supportés

### 1. Documents Markdown / Texte
**Formats:** `.md`, `.txt`

**Viewer:** MarkdownViewer personnalisé
- ✅ Rendu Markdown avec GitHub Flavored Markdown (GFM)
- ✅ Syntaxe colorisée pour les blocs de code
- ✅ Support des tableaux, listes, liens
- ✅ Images inline

### 2. Documents PDF
**Format:** `.pdf`

**Viewer:** react-pdf avec pdf.js
- ✅ Affichage page par page
- ✅ Navigation entre les pages (Précédent/Suivant)
- ✅ Couche de texte (sélection et recherche)
- ✅ Couche d'annotations
- ✅ Bouton de téléchargement

**Caractéristiques:**
- Rendu haute qualité
- Chargement progressif
- Indicateur de progression
- Gestion d'erreur avec fallback

### 3. Documents Office (Word, Excel, PowerPoint)
**Formats:** `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx`

**Viewer:** Google Docs Viewer (iframe)
- ✅ Prévisualisation des documents Word
- ✅ Prévisualisation des feuilles Excel
- ✅ Prévisualisation des présentations PowerPoint
- ✅ Mise en page préservée
- ✅ Bouton de téléchargement en cas de problème

**Note:** Nécessite que le document soit accessible publiquement via URL.

### 4. Fichiers Texte Structurés
**Formats:** `.json`, `.xml`, `.csv`, `.html`

**Viewer:** Affichage en bloc de code formaté
- ✅ Préservation de l'indentation
- ✅ Police monospace
- ✅ Défilement horizontal pour lignes longues
- ✅ Fond gris clair pour meilleure lisibilité

### 5. Images
**Formats:** `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`

**Viewer:** Affichage image natif
- ✅ Taille responsive
- ✅ Zoom automatique
- ✅ Ombres et coins arrondis
- ✅ Bouton de téléchargement

### 6. Autres Formats
**Formats:** `.zip`, `.rar`, autres

**Comportement:** Bouton de téléchargement avec message informatif
- ℹ️ Message "Aperçu non disponible"
- ℹ️ Affichage du type MIME
- 📥 Bouton de téléchargement direct

---

## 🔧 Architecture Technique

### Composant FileViewer

**Fichier:** `src/app/components/FileViewer.tsx`

```typescript
interface FileViewerProps {
  fileUrl: string;      // URL du fichier
  fileType: string;     // Type MIME
  fileName?: string;    // Nom du fichier (optionnel)
  content?: string;     // Contenu texte pour certains types
}
```

**Logique de sélection:**

1. Détecte le type MIME
2. Charge le viewer approprié:
   - `text/markdown` → MarkdownViewer
   - `application/pdf` → react-pdf Document/Page
   - Office MIME types → Google Docs Viewer iframe
   - `application/json`, `text/xml`, etc. → Bloc de code
   - `image/*` → Balise img native
   - Autres → Bouton de téléchargement

### Dépendances NPM

```json
{
  "react-pdf": "10.4.1",
  "pdfjs-dist": "5.6.205"
}
```

**Installation:**
```bash
pnpm add react-pdf pdfjs-dist
```

### Configuration PDF.js Worker

Le worker PDF.js est chargé depuis un CDN:

```typescript
pdfjs.GlobalWorkerOptions.workerSrc = 
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
```

**Alternative:** Héberger le worker localement pour éviter la dépendance CDN.

---

## 🎨 Interface Utilisateur

### Affichage dans DocumentView

**Page:** `src/app/pages/DocumentView.tsx`

**Structure:**
1. **En-tête du document** - Titre, catégorie, description
2. **Métadonnées** - Auteur, dates, tags
3. **Zone de contenu:**
   - Lien externe → Badge bleu + bouton "Ouvrir"
   - Fichier attaché → **FileViewer intégré**
   - Texte/Markdown → MarkdownViewer
4. **Documents liés** (si applicable)

### Viewer PDF - Navigation

```
┌─────────────────────────────────────────┐
│                                         │
│         [Page PDF rendue]               │
│                                         │
└─────────────────────────────────────────┘
         [Précédent] Page 1 sur 5 [Suivant]
              [Télécharger le PDF]
```

### Viewer Office - Google Docs

```
┌─────────────────────────────────────────┐
│ ℹ️ Prévisualisation du document Office  │
│ Si la prévisualisation ne s'affiche     │
│ pas, téléchargez le fichier.           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│                                         │
│    [iframe Google Docs Viewer]          │
│                                         │
└─────────────────────────────────────────┘
        [Télécharger le document]
```

---

## 🚀 Utilisation

### Créer un Document avec Viewer

**1. Via l'Interface Admin (`/admin`)**

```
1. Cliquer "Nouveau document"
2. Choisir le type "Fichier"
3. Uploader un fichier (.pdf, .docx, .xlsx, etc.)
4. Ajouter titre et description
5. Enregistrer
```

**2. Via l'API**

```bash
curl -X POST http://localhost:3001/api/documents \
  -H "Authorization: Bearer <token>" \
  -F "title=Rapport Q1 2026" \
  -F "category=functional" \
  -F "description=Rapport trimestriel" \
  -F "file=@rapport_q1.pdf"
```

### Visualiser un Document

1. Naviguer vers un document
2. Le viewer approprié se charge automatiquement
3. Interagir avec le viewer (navigation, zoom)
4. Option de téléchargement toujours disponible

---

## ⚙️ Configuration et Personnalisation

### Modifier le Worker PDF.js

Pour héberger localement le worker:

```typescript
// Dans FileViewer.tsx
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
```

Puis copier le fichier worker dans `public/`:
```bash
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/
```

### Changer le Service de Viewer Office

Remplacer Google Docs Viewer par Microsoft Office Online:

```typescript
// Dans FileViewer.tsx
const officeViewerUrl = 
  `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`;
```

### Ajouter un Nouveau Type de Viewer

**Exemple: Ajouter un viewer pour les fichiers audio**

```typescript
// Dans FileViewer.tsx
if (fileType?.startsWith('audio/')) {
  return (
    <div className="space-y-4">
      <audio controls className="w-full">
        <source src={fileUrl} type={fileType} />
        Votre navigateur ne supporte pas l'audio.
      </audio>
      <div className="flex justify-center">
        <a href={fileUrl} download className="...">
          Télécharger l'audio
        </a>
      </div>
    </div>
  );
}
```

---

## 🔐 Sécurité

### Considérations

1. **Fichiers PDF:**
   - ✅ Rendu dans le navigateur (sandboxé)
   - ✅ Pas d'exécution de JavaScript PDF malveillant

2. **Documents Office via Google Viewer:**
   - ⚠️ Le fichier doit être accessible publiquement
   - ⚠️ Google conserve temporairement une copie cache
   - ✅ Option: Utiliser Office Online (Microsoft) pour documents privés

3. **Fichiers texte (JSON, XML):**
   - ✅ Affichage en texte brut uniquement
   - ✅ Pas d'exécution de code

4. **Images:**
   - ✅ Balise img standard du navigateur
   - ✅ Pas de risque d'exécution

### Recommandations

- ✅ Toujours valider les types MIME côté serveur
- ✅ Limiter les tailles de fichiers (50 MB max)
- ✅ Scanner les fichiers uploadés avec un antivirus
- ✅ Utiliser CSP (Content Security Policy) pour les iframes

---

## 🐛 Dépannage

### Le PDF ne s'affiche pas

**Problème:** Worker PDF.js non chargé

**Solution:**
```typescript
// Vérifier la console navigateur
console.log(pdfjs.version); // Doit afficher la version

// Tester le CDN manuellement
https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs
```

### Google Docs Viewer affiche "Unable to preview"

**Causes possibles:**
1. Le fichier n'est pas accessible publiquement
2. L'URL contient des caractères non encodés
3. Le fichier est corrompu

**Solution:**
- Vérifier que l'URL est accessible sans authentification
- Utiliser `encodeURIComponent()` pour l'URL
- Télécharger et vérifier le fichier manuellement

### Les images ne s'affichent pas

**Problème:** CORS (Cross-Origin Resource Sharing)

**Solution:**
```typescript
// Dans server/src/index.ts
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));

// Servir les uploads avec headers CORS
app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));
```

---

## 📊 Performance

### Optimisations

1. **PDF:**
   - Chargement page par page (pas tout le document)
   - Cache du worker PDF.js
   - Lazy loading des pages suivantes

2. **Images:**
   - Utiliser `loading="lazy"` pour grandes galeries
   - Compression côté serveur recommandée

3. **Office:**
   - Google Docs Viewer met en cache
   - Considérer des vignettes pour listes de documents

### Métriques

| Type       | Temps chargement* | Taille moyenne |
|------------|-------------------|----------------|
| PDF (5 pg) | ~2-3s             | 500 KB         |
| Word       | ~3-5s (iframe)    | 200 KB         |
| Excel      | ~4-6s (iframe)    | 150 KB         |
| Image      | <1s               | 100 KB         |

*Sur connexion 10 Mbps, avec cache vide

---

## 🔮 Améliorations Futures

### À court terme
- [ ] Zoom in/out pour PDF
- [ ] Recherche dans le PDF
- [ ] Impression directe
- [ ] Mode plein écran

### À moyen terme
- [ ] Viewer vidéo (MP4, WebM)
- [ ] Viewer audio (MP3, WAV)
- [ ] Viewer 3D (STL, OBJ)
- [ ] Annotations sur PDF

### À long terme
- [ ] Collaboration temps réel sur documents
- [ ] Conversion automatique Office → PDF
- [ ] OCR pour PDF scannés
- [ ] Génération de vignettes

---

## 📚 Ressources

### Documentation
- [react-pdf](https://github.com/wojtekmaj/react-pdf)
- [PDF.js](https://mozilla.github.io/pdf.js/)
- [Google Docs Viewer API](https://support.google.com/docs/answer/183965)

### Alternatives
- **PDF:** pdfobject, pdf-viewer-reactjs
- **Office:** Mammoth.js (docx to HTML), SheetJS (Excel)
- **Universel:** FileViewer.js, ViewerJS

---

**Avec ces viewers intégrés, votre portail documentaire offre une expérience utilisateur moderne et fluide ! 📖✨**
