/**
 * Exemples de formats de liens supportés dans le Markdown
 */

export const markdownLinkExamples = `
# Exemples de liens dans les documents

## Liens internes entre documents

### Format 1 : Lien direct avec ID de document
Pour référencer un autre document, utilisez : \`[Nom du document](doc:tech-001)\`

Exemple : [Architecture API REST](doc:tech-001)

### Format 2 : Lien avec path complet
Vous pouvez aussi utiliser : \`[Nom du document](/document/tech-001)\`

Exemple : [Base de Données - Schéma Commandes](/document/tech-002)

### Format 3 : Liens Wiki.js (seront transformés automatiquement)
Format Wiki.js : \`[[tech-001]]\` sera transformé automatiquement

Exemple avec relatedDocs :
- Voir aussi [[func-001]]
- Consulter [[user-002]]

## Liens externes

Les liens externes s'ouvrent dans un nouvel onglet avec une icône :

[Documentation React Officielle](https://react.dev)
[MDN Web Docs](https://developer.mozilla.org)

## Fonctionnalités Markdown supportées

### Tableaux

| Fonctionnalité | Support | Description |
|---------------|---------|-------------|
| Liens internes | ✅ | Navigation entre documents |
| Liens externes | ✅ | Ouvre dans nouvel onglet |
| Code syntax | ✅ | Coloration syntaxique |
| Tableaux | ✅ | GitHub Flavored Markdown |

### Code

\`\`\`javascript
// Exemple de code
function hello() {
  console.log("Hello World!");
}
\`\`\`

Code inline : \`const x = 42;\`

### Listes

- Premier élément
- Deuxième élément
  - Sous-élément
  - Autre sous-élément
- Troisième élément

### Citations

> Ceci est une citation importante
> Elle peut s'étendre sur plusieurs lignes

### Images

![Exemple](https://via.placeholder.com/400x200)

---

## Résumé des formats de liens

1. **\`doc:ID\`** → Lien vers document par ID
2. **\`/document/ID\`** → Lien vers document avec path absolu
3. **\`[[ID]]\`** → Format Wiki.js (transformé automatiquement)
4. **URL complète** → Lien externe
`;

export const sampleDocumentWithLinks = {
  id: 'sample-with-links',
  title: 'Exemple de Document avec Liens',
  category: 'technical' as const,
  application: 'api',
  description: 'Démonstration des différents formats de liens supportés',
  content: markdownLinkExamples,
  tags: ['exemple', 'markdown', 'liens'],
  lastUpdated: '2026-03-20',
  author: 'Système',
  isExternal: false,
  relatedDocs: ['tech-001', 'func-001', 'user-002'],
};
