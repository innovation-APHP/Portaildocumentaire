# 🎬 Viewers Intégrés - Démarrage Rapide

## ✨ Nouveauté

Visualisez vos documents **directement dans le portail** sans téléchargement !

---

## 🚀 Formats Supportés

### PDF (.pdf)
- ✅ Navigation page par page
- ✅ Sélection de texte
- ✅ Zoom et annotations
- 📦 Powered by: react-pdf + pdf.js

### Documents Office
- ✅ Word (.doc, .docx)
- ✅ Excel (.xls, .xlsx)
- ✅ PowerPoint (.ppt, .pptx)
- 📦 Powered by: Google Docs Viewer

### Images
- ✅ PNG, JPG, GIF, SVG, WebP
- ✅ Affichage responsive
- 📦 Powered by: HTML natif

### Fichiers Texte
- ✅ JSON, XML, CSV, HTML
- ✅ Coloration syntaxique
- 📦 Powered by: Composant personnalisé

### Markdown
- ✅ Rendu HTML complet
- ✅ GitHub Flavored Markdown
- 📦 Powered by: react-markdown

---

## 📝 Utilisation

### 1. Uploader un fichier

```
Admin > Nouveau document > Type: Fichier > Upload
```

### 2. Visualiser

Cliquez sur le document → Le viewer approprié se charge automatiquement !

### 3. Télécharger (optionnel)

Bouton "Télécharger" toujours disponible en bas du viewer.

---

## 🔧 Installation

Les dépendances sont déjà installées :

```json
{
  "react-pdf": "10.4.1",
  "pdfjs-dist": "5.6.205"
}
```

Pas de configuration nécessaire ! Tout fonctionne out-of-the-box.

---

## 📊 Exemple de Rendu

### PDF

```
┌────────────────────────────────────┐
│                                    │
│      [Page PDF rendue]             │
│                                    │
└────────────────────────────────────┘
  [Précédent] Page 2 sur 10 [Suivant]
       [📥 Télécharger le PDF]
```

### Office (Word, Excel, PowerPoint)

```
┌────────────────────────────────────┐
│ ℹ️ Prévisualisation du document   │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│                                    │
│  [Google Docs Viewer iframe]       │
│                                    │
└────────────────────────────────────┘
     [📥 Télécharger le document]
```

### Image

```
┌────────────────────────────────────┐
│                                    │
│         [Image affichée]           │
│                                    │
└────────────────────────────────────┘
       [📥 Télécharger l'image]
```

---

## 📚 Documentation Complète

- **Guide utilisateur:** `SUPPORT_FICHIERS.md`
- **Documentation technique:** `VIEWERS_INTEGRATION.md`
- **Architecture:** `FICHIERS_CHANGES.md`

---

## 🎯 Cas d'Usage

### Présentation PowerPoint
```bash
# Upload
/admin > Nouveau > Fichier > presentation.pptx

# Résultat
✅ Prévisualisation complète dans Google Docs Viewer
✅ Navigation entre slides
✅ Téléchargement disponible
```

### Rapport PDF
```bash
# Upload
/admin > Nouveau > Fichier > rapport_q1.pdf

# Résultat
✅ Viewer PDF page par page
✅ Sélection de texte
✅ Navigation rapide
```

### Feuille Excel
```bash
# Upload
/admin > Nouveau > Fichier > budget.xlsx

# Résultat
✅ Aperçu des cellules dans iframe
✅ Formules visibles
✅ Téléchargement pour édition
```

---

## ⚡ Performance

| Type       | Chargement | Expérience |
|------------|------------|------------|
| PDF        | ~2-3s      | ⭐⭐⭐⭐⭐   |
| Office     | ~3-5s      | ⭐⭐⭐⭐     |
| Image      | <1s        | ⭐⭐⭐⭐⭐   |
| JSON/XML   | <1s        | ⭐⭐⭐⭐⭐   |
| Markdown   | <1s        | ⭐⭐⭐⭐⭐   |

---

## 🔒 Sécurité

- ✅ PDF rendu dans sandbox navigateur
- ✅ Pas d'exécution de JavaScript PDF
- ✅ Google Docs Viewer respecte les permissions
- ✅ Images affichées via balise sécurisée
- ✅ Fichiers texte affichés en lecture seule

---

## 🐛 Problèmes Courants

### PDF ne s'affiche pas
**Cause:** Worker PDF.js non chargé
**Solution:** Rafraîchir la page (CDN peut être lent)

### Office Viewer affiche "Unable to preview"
**Cause:** Fichier non accessible publiquement
**Solution:** Télécharger le fichier manuellement

### Image CORS error
**Cause:** Backend ne retourne pas les headers CORS
**Solution:** Vérifier configuration CORS dans server/src/index.ts

---

## 🎉 C'est tout !

Les viewers sont **automatiques** et **intelligents**. Uploadez simplement vos fichiers et profitez !

**Questions ?** Consultez `VIEWERS_INTEGRATION.md` pour plus de détails.
