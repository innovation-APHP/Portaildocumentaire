# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [1.0.0] - 2026-03-21

### 🎉 Version initiale - Portail Documentaire Wiki.js

Cette première version majeure offre un portail documentaire complet pour naviguer et gérer la documentation stockée dans Wiki.js.

### 🐛 Corrections et améliorations (Version finale)

- **Correction de l'erreur `getPageByPath is not a function`**
  - Ajout de la query GraphQL `GET_PAGE_BY_PATH` dans wikijsService
  - Ajout de la méthode `getPageByPath()` pour récupérer une page par son chemin
  
- **Élimination des erreurs au démarrage**
  - Suppression du log `"URL Wiki.js non configurée"` en mode normal
  - Suppression de l'erreur `"Failed to fetch"` quand Wiki.js n'est pas configuré
  - Gestion intelligente avec erreur spécifique `WIKIJS_NOT_CONFIGURED`
  
- **Mode dégradé élégant**
  - Utilisation silencieuse de la configuration par défaut au premier lancement
  - Pas de logs d'erreur inutiles dans la console
  - Interface utilisateur claire avec messages informatifs (pas d'erreurs)
  
- **Configuration Wiki.js unifiée**
  - Migration vers `wikijs_url` et `wikijs_token` (cohérence complète)
  - Mise à jour du composant `WikiJsSettings` avec test de connexion
  - URL dynamique depuis localStorage dans toutes les requêtes GraphQL
  
- **Résilience et robustesse**
  - Vérification de la configuration avant toute tentative de connexion
  - Fallback intelligent : Cache → Config par défaut
  - Application 100% fonctionnelle même sans Wiki.js configuré

---

## ✨ Fonctionnalités principales

### 🏠 Navigation et Interface

- **Page d'accueil** avec statistiques en temps réel
  - Compteur de documents, applications et catégories
  - Cartes de catégories cliquables
  - Liste des documents récemment mis à jour
  
- **Navigation multi-catégories**
  - Documentation Fonctionnelle (spécifications, processus métier)
  - Documentation Technique (architecture, API, bases de données)
  - Documentation Utilisateur (guides, tutoriels, FAQ)

- **Interface responsive** et moderne avec Tailwind CSS v4
- **Thème cohérent** avec design system complet

### 📚 Gestion des Documents

- **Listing paginé** avec filtres avancés
  - Filtrage par catégorie
  - Filtrage par tags multiples
  - Recherche textuelle en temps réel
  - Tri par date de mise à jour

- **Affichage détaillé des documents**
  - Rendu Markdown complet avec syntax highlighting
  - Support GitHub Flavored Markdown (tableaux, listes de tâches)
  - Métadonnées complètes (auteur, date, tags)
  - Navigation entre documents connexes (Related Docs)

- **Liens intelligents**
  - Liens internes entre documents (`doc:tech-001`, `/document/tech-001`, `[[tech-001]]`)
  - Détection automatique des liens externes (icône + nouvel onglet)
  - Transformation automatique des liens Wiki.js

### 🌳 Vue Arborescente

- **Organisation par applications**
  - Visualisation hiérarchique des documents
  - Regroupement par catégorie
  - Interface collapsible/expandable
  - Indicateurs visuels par type de document

### 🤖 Assistant IA Conversationnel

- **Chat intégré avec RAG (Retrieval Augmented Generation)**
  - Interface conversationnelle fluide
  - Historique des messages persisté
  - Suggestions de questions
  - Citations des sources avec liens directs
  - Support de l'API RAG personnalisée

### 🔐 Authentification

- **Système d'authentification complet**
  - Connexion avec email/mot de passe
  - Session persistée dans localStorage
  - Routes protégées
  - Page de login avec UI moderne
  - Logout avec confirmation

### 🔧 Intégration Wiki.js

- **Service API GraphQL complet**
  - Connexion à Wiki.js configurable
  - CRUD complet sur les pages
  - Recherche et filtrage
  - Support des tags et métadonnées

- **Système de migration avancé**
  - Migration complète de tous les documents
  - Migration par catégorie (fonctionnelle, technique, utilisateur)
  - Migration par application
  - Barre de progression en temps réel
  - Gestion des erreurs avec retry
  - Logs détaillés de migration

### ⚙️ Configuration Dynamique

- **Éditeur de configuration intégré**
  - Configuration stockée dans Wiki.js (`/config/app-settings`)
  - Édition des libellés de l'application
  - Personnalisation des catégories (labels, descriptions)
  - Textes des pages (accueil, chat)
  - Activation/désactivation des fonctionnalités
  - Cache intelligent avec fallback
  - Bouton "Éditer dans Wiki.js" pour modifications avancées

- **Paramètres Wiki.js**
  - Configuration de l'URL Wiki.js
  - Gestion du token d'authentification
  - Test de connexion
  - Stockage sécurisé

### 📝 Rendu Markdown Avancé

- **Composant MarkdownViewer**
  - Titres avec styles personnalisés
  - Code avec coloration syntaxique
  - Tableaux responsifs avec hover
  - Citations stylisées
  - Listes numérotées et à puces
  - Images avec ombres
  - Support HTML sanitizé

- **Formats supportés**
  - GFM (GitHub Flavored Markdown)
  - Tables
  - Task lists
  - Strikethrough
  - Emoji

### 🎨 Design & UX

- **Composants UI Radix UI**
  - Cards, Buttons, Inputs, Dialogs
  - Badges, Tabs, Separators
  - Accordions, Progress bars
  - Tooltips, Popovers

- **Icônes Lucide React**
  - Plus de 50 icônes utilisées
  - Design cohérent et moderne

- **Animations Motion**
  - Transitions fluides
  - Effets au scroll
  - Micro-interactions

### 📊 Données de Démonstration

- **16 documents exemple** couvrant :
  - 6 applications (Gestion Commandes, API, Mobile, CRM, Analytics, Plateforme E-commerce)
  - 3 catégories (Fonctionnelle, Technique, Utilisateur)
  - Tags multiples pour chaque document
  - Liens entre documents connexes
  - Mix de documents internes et externes

---

## 🏗️ Architecture Technique

### Stack Technologique

- **React 18.3.1** avec TypeScript
- **React Router 7.13.0** (Data mode)
- **Tailwind CSS 4.1.12**
- **Vite 6.3.5** (build tool)
- **React Markdown 10.1.0** + plugins (remark-gfm, rehype-raw, rehype-sanitize)

### Structure du Projet

```
src/
├── app/
│   ├── components/          # Composants réutilisables
│   │   ├── ui/              # Composants UI de base (Radix)
│   │   ├── Layout.tsx       # Layout principal avec navigation
│   │   ├── MarkdownViewer.tsx    # Rendu Markdown
│   │   ├── ConfigEditor.tsx      # Éditeur de configuration
│   │   ├── MigrationPanel.tsx    # Panel de migration
│   │   └── WikiJsSettings.tsx    # Paramètres Wiki.js
│   ├── contexts/            # Contexts React
│   │   ├── AuthContext.tsx       # Authentification
│   │   └── ConfigContext.tsx     # Configuration
│   ├── hooks/               # Custom hooks
│   │   ├── useAppConfig.ts       # Hook configuration
│   │   └── ...
│   ├── pages/               # Pages de l'application
│   │   ├── Home.tsx
│   │   ├── DocumentList.tsx
│   │   ├── DocumentView.tsx
│   │   ├── ApplicationTree.tsx
│   │   ├── ChatPage.tsx
│   │   ├── Login.tsx
│   │   └── Settings.tsx
│   ├── services/            # Services métier
│   │   ├── wikijsService.ts      # API Wiki.js GraphQL
│   │   ├── migrationService.ts   # Migration de données
│   │   ├── configService.ts      # Gestion configuration
│   │   └── ragService.ts         # API RAG pour chatbot
│   ├── data/                # Données mock
│   │   └── mockDocuments.ts
│   ├── utils/               # Utilitaires
│   │   └── markdownExamples.ts
│   ├── routes.tsx           # Configuration des routes
│   └── App.tsx              # Point d'entrée
└── styles/                  # Styles globaux
    ├── index.css
    ├── tailwind.css
    ├── theme.css
    ├── markdown.css
    └── fonts.css
```

### Services & API

- **wikijsService** : Communication GraphQL avec Wiki.js
- **migrationService** : Migration batch des documents
- **configService** : Gestion configuration depuis Wiki.js
- **ragService** : Interrogation API RAG pour l'assistant IA

### State Management

- **Context API** pour l'authentification et la configuration
- **localStorage** pour la persistance (token, config cache)
- **React hooks** pour le state local

---

## 📋 Configuration Requise

### Prérequis

- Node.js 18+
- Instance Wiki.js accessible
- API RAG (optionnel, pour l'assistant IA)

### Variables d'Environnement

Configuration stockée dans localStorage :
- `wikijs_url` : URL de l'instance Wiki.js
- `wikijs_token` : Token d'authentification Wiki.js
- `rag_api_url` : URL de l'API RAG (optionnel)
- `app_config_cache` : Cache de la configuration

---

## 🚀 Installation & Démarrage

### Installation

```bash
npm install
# ou
pnpm install
```

### Développement

```bash
npm run dev
```

### Build Production

```bash
npm run build
```

---

## 📖 Guide d'Utilisation

### 1. Configuration initiale

1. Se connecter à l'application (email/mot de passe)
2. Aller dans **Paramètres**
3. Configurer l'**URL Wiki.js** et le **token**
4. Tester la connexion
5. (Optionnel) Personnaliser la configuration de l'application

### 2. Migration des données

1. Dans **Paramètres** → **Migration de données**
2. Choisir le mode :
   - **Migration complète** : Tous les documents
   - **Par catégorie** : Une catégorie spécifique
   - **Par application** : Une application spécifique
3. Lancer la migration
4. Suivre la progression en temps réel

### 3. Personnalisation

1. Dans **Paramètres** → **Configuration de l'application**
2. Modifier les libellés, catégories, textes des pages
3. Activer/désactiver les fonctionnalités
4. Sauvegarder → Configuration stockée dans Wiki.js

### 4. Navigation

- **Page d'accueil** : Vue d'ensemble + documents récents
- **Catégories** : Parcourir par type de documentation
- **Arborescence** : Vue hiérarchique par application
- **Recherche** : Filtrer et rechercher dans les documents
- **Chat** : Poser des questions à l'assistant IA

---

## 🔒 Sécurité

- ✅ Authentification requise par défaut
- ✅ Routes protégées avec `ProtectedRoute`
- ✅ Sanitisation HTML pour le Markdown (rehype-sanitize)
- ✅ Token stocké en localStorage (⚠️ prévoir HTTPOnly cookies en production)
- ✅ Validation des liens (internes vs externes)

---

## 🐛 Bugs Connus & Limitations

### Limitations actuelles

- Pas de pagination côté serveur (tous les documents chargés)
- Token d'authentification en localStorage (pas HTTPOnly)
- Pas de gestion des permissions granulaires
- Recherche côté client uniquement
- Pas de support offline

### Améliorations futures (v1.1+)

- [ ] Pagination serveur avec infinite scroll
- [ ] Authentification OAuth/SSO
- [ ] Permissions granulaires par document
- [ ] Mode offline avec service worker
- [ ] Export PDF des documents
- [ ] Commentaires et annotations
- [ ] Historique des versions
- [ ] Notifications push
- [ ] Mode sombre complet

---

## 📄 Licence

Projet privé - Tous droits réservés

---

## 👥 Contributeurs

- Version initiale : Mars 2026

---

## 🙏 Remerciements

- **Wiki.js** pour la plateforme de documentation
- **Radix UI** pour les composants accessibles
- **Tailwind CSS** pour le framework CSS
- **Lucide** pour les icônes
- **React Markdown** pour le rendu Markdown

---

**Version 1.0.0** - Portail Documentaire prêt pour la production ! 🚀