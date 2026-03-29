# 📚 Portail Documentaire Wiki.js

> Version 1.0.0 - Votre documentation centralisée et intelligente

Un portail moderne et intuitif pour naviguer, rechercher et interagir avec votre documentation Wiki.js. Intègre un assistant IA conversationnel pour des réponses contextuelles instantanées.

---

## 🎯 Démarrage en 30 secondes

```bash
npm install && npm run dev
```

**Identifiants par défaut :**
- Email : `admin@example.com`
- Mot de passe : `admin123`

**💡 L'application fonctionne immédiatement avec 16 documents de démonstration !**  
Wiki.js est optionnel - Configurez-le quand vous êtes prêt.

### 📖 Guides disponibles

> **🗂️ Voir [DOCS_INDEX.md](./DOCS_INDEX.md) pour l'index complet de la documentation**

| Guide | Description |
|-------|-------------|
| **[DOCKER_QUICK.md](./DOCKER_QUICK.md)** | 🐳 **Déploiement Docker en 3 commandes** (COMMENCE ICI si Docker !) |
| **[HOW_TO_DEPLOY.md](./HOW_TO_DEPLOY.md)** | 🎯 Comment déployer concrètement ? |
| **[DEPLOYMENT_QUICK.md](./DEPLOYMENT_QUICK.md)** | ⚡ Déploiement en 5 minutes (Vercel/VPS/Docker) |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | 🚀 Guide complet de déploiement production |
| **[DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)** | 🐳 Guide Docker complet avec toutes les options |
| **[QUICK_START_WIKIJS.md](./QUICK_START_WIKIJS.md)** | 🔌 Connexion Wiki.js en 2 étapes |
| **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** | 📋 Guide de migration détaillé |
| **[NPM_COMMANDS.md](./NPM_COMMANDS.md)** | 💻 Liste complète des commandes npm |
| **[WIKIJS_SETUP.txt](./WIKIJS_SETUP.txt)** | 📄 Récapitulatif visuel ASCII |

---

## 🌟 Fonctionnalités

### 📖 Navigation Documentaire

- **Vue par catégories** : Fonctionnelle, Technique, Utilisateur
- **Vue arborescente** : Organisation hiérarchique par application
- **Recherche avancée** : Filtres multiples, recherche textuelle temps réel
- **Liens intelligents** : Navigation fluide entre documents connexes

### ✨ Rendu Markdown Enrichi

- Support **GitHub Flavored Markdown** (tableaux, listes de tâches)
- **Coloration syntaxique** pour les blocs de code
- **Liens internes** automatiques entre documents
- **Sanitisation HTML** pour la sécurité

### 🤖 Assistant IA Conversationnel

- **RAG (Retrieval Augmented Generation)** pour réponses contextuelles
- **Citations des sources** avec liens directs vers documents
- **Suggestions de questions** intelligentes
- **Historique persisté** des conversations

### 🔄 Intégration Wiki.js

- **API GraphQL complète** pour CRUD des pages
- **Migration de données** batch avec suivi de progression
- **Synchronisation bidirectionnelle** avec Wiki.js
- **Support complet** des tags et métadonnées

### ⚙️ Configuration Dynamique

- **Édition centralisée** des libellés et textes
- **Configuration stockée** dans Wiki.js (`/config/app-settings`)
- **Cache intelligent** avec fallback
- **Activation/désactivation** des fonctionnalités en temps réel

### 🔐 Authentification & Sécurité

- **Routes protégées** avec authentification requise
- **Sessions persistées** 
- **Token management** pour Wiki.js
- **HTML sanitization** pour Markdown

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- Instance Wiki.js accessible
- (Optionnel) API RAG pour l'assistant IA

### Installation

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build pour production
npm run build
```

### Configuration

1. **Connexion** (Première utilisation)
   - Email : `admin@example.com`
   - Mot de passe : `admin123`

2. **Configuration Wiki.js** (Optionnel)
   - Allez dans **Paramètres** ⚙️
   - Section **"Paramètres Wiki.js"**
   - Entrez l'URL de votre Wiki.js : `http://localhost:3000`
   - Ajoutez votre token d'authentification (clé API ou JWT)
   - Cliquez sur **Tester** puis **Sauvegarder**

3. **Migration des données** (Optionnel)
   - Section **"Migration de données"** dans les Paramètres
   - Choisissez le mode : Complète, Par catégorie, ou Par application
   - Lancez la migration (environ 30 secondes pour 16 documents)
   - Suivez la progression en temps réel

**💡 Note :** Le portail fonctionne immédiatement avec **16 documents de démonstration** sans configuration ! La connexion à Wiki.js est optionnelle.

**📖 Guide complet :** Voir [`MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md) pour les instructions détaillées.

---

## 📂 Structure du Projet

```
portail-documentaire/
├── src/
│   ├── app/
│   │   ├── components/       # Composants réutilisables
│   │   ├── contexts/         # Contexts (Auth, Config)
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Pages de l'application
│   │   ├── services/         # Services API (Wiki.js, RAG)
│   │   ├── data/             # Données mock
│   │   └── utils/            # Utilitaires
│   └── styles/               # Styles globaux
├── CHANGELOG.md              # Historique des versions
├── VERSION                   # Version actuelle
└── package.json
```

---

## 🛠️ Stack Technique

- **React 18.3.1** - Framework UI
- **TypeScript** - Typage statique
- **React Router 7** - Routing avec Data mode
- **Tailwind CSS 4** - Framework CSS
- **Vite 6** - Build tool
- **Radix UI** - Composants accessibles
- **React Markdown** - Rendu Markdown
- **Lucide React** - Icônes
- **Motion** - Animations

---

## 📖 Documentation

### Pages Principales

| Page | Description |
|------|-------------|
| **Accueil** (`/`) | Statistiques, catégories, documents récents |
| **Documents** (`/docs/:category`) | Liste filtrée par catégorie |
| **Document** (`/document/:id`) | Vue détaillée avec Markdown |
| **Arborescence** (`/tree`) | Vue hiérarchique par application |
| **Chat** (`/chat`) | Assistant IA conversationnel |
| **Paramètres** (`/settings`) | Configuration et migration |

### Formats de Liens Markdown

```markdown
# Liens internes (navigation dans l'app)
[Documentation API](doc:tech-001)
[Guide utilisateur](/document/user-002)
[[func-001]]  # Format Wiki.js

# Liens externes (nouvel onglet)
[React Docs](https://react.dev)
```

### Configuration (`/config/app-settings` dans Wiki.js)

```json
{
  "labels": {
    "appName": "Portail Documentaire",
    "appDescription": "Votre documentation centralisée",
    "welcomeMessage": "Bienvenue sur le portail",
    "searchPlaceholder": "Rechercher..."
  },
  "categories": {
    "functional": {
      "label": "Documentation Fonctionnelle",
      "description": "Spécifications et règles métier",
      "icon": "FileText"
    },
    // ... technical, user
  },
  "features": {
    "chatEnabled": true,
    "searchEnabled": true,
    "treeViewEnabled": true,
    "authRequired": true
  }
}
```

---

## 🔧 Services

### `wikijsService`

Service complet pour interagir avec l'API GraphQL de Wiki.js :

- `testConnection()` - Tester la connexion
- `getAllPages()` - Récupérer toutes les pages
- `getPageById()` - Récupérer une page par ID
- `createPage()` - Créer une nouvelle page
- `updatePage()` - Mettre à jour une page
- `deletePage()` - Supprimer une page

### `configService`

Gestion de la configuration de l'application :

- `loadFromWikiJs()` - Charger depuis Wiki.js
- `saveToWikiJs()` - Sauvegarder dans Wiki.js
- `getConfig()` - Récupérer du cache
- `clearCache()` - Invalider le cache

### `migrationService`

Migration batch des données vers Wiki.js :

- `migrateAll()` - Migrer tous les documents
- `migrateByCategory()` - Migrer une catégorie
- `migrateByApplication()` - Migrer une application

### `ragService`

Interrogation de l'API RAG pour l'assistant IA :

- `query()` - Poser une question
- `getSuggestions()` - Obtenir des suggestions

---

## 🎨 Personnalisation

### Modifier les Couleurs

Éditer `/src/styles/theme.css` :

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  /* ... */
}
```

### Ajouter une Catégorie

1. Éditer la configuration dans Wiki.js
2. Ajouter la route dans `routes.tsx`
3. Mettre à jour les types TypeScript

---

## 📊 Métriques

- **16 documents** de démonstration
- **6 applications** référencées
- **3 catégories** de documentation
- **50+ composants** UI réutilisables

---

## 🐛 Support & Contributions

### Rapporter un Bug

Créer une issue avec :
- Description du problème
- Étapes pour reproduire
- Comportement attendu vs observé
- Version de l'application

### Proposer une Fonctionnalité

Décrire :
- Le besoin utilisateur
- La solution proposée
- Les impacts potentiels

---

## 📅 Roadmap

### Version 1.1 (À venir)

- [ ] Mode sombre complet
- [ ] Export PDF des documents
- [ ] Commentaires et annotations
- [ ] Notifications push

### Version 1.2

- [ ] Authentification OAuth/SSO
- [ ] Permissions granulaires
- [ ] Mode offline avec service worker
- [ ] Historique des versions

---

## 📄 Licence

Projet privé - Tous droits réservés © 2026

---

## 🙏 Remerciements

Développé avec ❤️ en utilisant :
- [Wiki.js](https://wiki.js.org/) - Plateforme de documentation
- [React](https://react.dev/) - Framework UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Composants accessibles

---

**Version 1.0.0** - Mars 2026

*Portail Documentaire Wiki.js - Documentation centralisée et intelligente* 📚✨