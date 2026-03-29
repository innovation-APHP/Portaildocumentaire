export type DocumentCategory = 'functional' | 'technical' | 'user';

export interface Application {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color: string;
}

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  application: string; // ID de l'application
  description: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  author: string;
  isExternal: boolean;
  externalUrl?: string;
  relatedDocs?: string[];
}

export const applications: Application[] = [
  {
    id: 'ecommerce',
    name: 'Plateforme E-commerce',
    description: 'Application de vente en ligne et gestion des commandes',
    color: 'bg-blue-500'
  },
  {
    id: 'portal',
    name: 'Portail Client',
    description: 'Interface client pour la gestion de compte et suivi',
    color: 'bg-green-500'
  },
  {
    id: 'backoffice',
    name: 'Backoffice Admin',
    description: 'Outil d\'administration interne',
    color: 'bg-purple-500'
  },
  {
    id: 'api',
    name: 'API Gateway',
    description: 'Services API et intégrations',
    color: 'bg-orange-500'
  },
  {
    id: 'mobile',
    name: 'Application Mobile',
    description: 'Application mobile iOS et Android',
    color: 'bg-pink-500'
  }
];

export const mockDocuments: Document[] = [
  // Documentation Fonctionnelle
  {
    id: 'func-001',
    title: 'Spécifications Fonctionnelles - Module Authentification',
    category: 'functional',
    application: 'portal',
    description: 'Spécifications détaillées du module d\'authentification incluant les cas d\'usage et les règles métier.',
    content: `# Spécifications Fonctionnelles - Module Authentification

## Vue d'ensemble
Ce document décrit les spécifications fonctionnelles du module d'authentification de la plateforme.

## Cas d'usage
1. **Connexion utilisateur** : L'utilisateur peut se connecter avec email/mot de passe
2. **Mot de passe oublié** : Processus de réinitialisation par email
3. **Authentification multi-facteurs** : Support de 2FA via SMS ou application

## Règles métier
- Le mot de passe doit contenir au minimum 8 caractères
- Maximum 5 tentatives de connexion avant blocage temporaire
- Session valide pendant 24h d'inactivité`,
    tags: ['authentification', 'sécurité', 'spécifications'],
    lastUpdated: '2026-03-15',
    author: 'Marie Dubois',
    isExternal: false,
    relatedDocs: ['tech-001', 'user-002']
  },
  {
    id: 'func-002',
    title: 'Processus de Gestion des Commandes',
    category: 'functional',
    application: 'ecommerce',
    description: 'Workflow complet de gestion des commandes depuis la création jusqu\'à la livraison.',
    content: `# Processus de Gestion des Commandes

## Étapes du processus
1. Création de commande
2. Validation
3. Préparation
4. Expédition
5. Livraison

## Règles de validation
- Vérification du stock disponible
- Contrôle des informations de livraison
- Validation du paiement`,
    tags: ['commandes', 'workflow', 'business'],
    lastUpdated: '2026-03-10',
    author: 'Pierre Martin',
    isExternal: false,
    relatedDocs: ['func-003', 'tech-002']
  },
  {
    id: 'func-003',
    title: 'Politique de Retours et Remboursements',
    category: 'functional',
    application: 'ecommerce',
    description: 'Règles et processus pour la gestion des retours produits et remboursements clients.',
    content: `# Politique de Retours et Remboursements

## Conditions de retour
- Délai : 30 jours après réception
- Produit dans son emballage d'origine
- Non utilisé et non endommagé

## Processus de remboursement
1. Demande de retour par le client
2. Validation par le service client
3. Retour du produit
4. Inspection
5. Remboursement sous 7 jours`,
    tags: ['retours', 'politique', 'client'],
    lastUpdated: '2026-03-08',
    author: 'Sophie Laurent',
    isExternal: false
  },

  // Documentation Technique
  {
    id: 'tech-001',
    title: 'Architecture API REST - Service Authentification',
    category: 'technical',
    application: 'api',
    description: 'Documentation technique de l\'API REST pour le service d\'authentification.',
    content: `# Architecture API REST - Service Authentification

## Endpoints

### POST /api/auth/login
Authentifie un utilisateur et retourne un token JWT.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "expiresIn": 86400
}
\`\`\`

### POST /api/auth/refresh
Renouvelle le token d'authentification.

## Sécurité
- Utilisation de JWT avec RS256
- Rotation des clés tous les 90 jours
- Rate limiting: 5 requêtes/minute`,
    tags: ['api', 'rest', 'authentification', 'jwt'],
    lastUpdated: '2026-03-14',
    author: 'Thomas Bernard',
    isExternal: false,
    relatedDocs: ['func-001', 'tech-003']
  },
  {
    id: 'tech-002',
    title: 'Base de Données - Schéma Commandes',
    category: 'technical',
    application: 'ecommerce',
    description: 'Schéma de base de données pour le module de gestion des commandes.',
    content: `# Base de Données - Schéma Commandes

## Tables

### orders
- id (UUID, PK)
- customer_id (UUID, FK)
- status (ENUM)
- total_amount (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### order_items
- id (UUID, PK)
- order_id (UUID, FK)
- product_id (UUID, FK)
- quantity (INTEGER)
- unit_price (DECIMAL)

## Index
- idx_orders_customer_id
- idx_orders_status
- idx_orders_created_at`,
    tags: ['database', 'schema', 'postgresql'],
    lastUpdated: '2026-03-12',
    author: 'Thomas Bernard',
    isExternal: false
  },
  {
    id: 'tech-003',
    title: 'Guide de Déploiement Docker',
    category: 'technical',
    application: 'backoffice',
    description: 'Instructions pour déployer l\'application avec Docker et Docker Compose.',
    content: `# Guide de Déploiement Docker

## Prérequis
- Docker 20.10+
- Docker Compose 2.0+

## Configuration

### docker-compose.yml
\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=secret
\`\`\`

## Déploiement
\`\`\`bash
docker-compose up -d
\`\`\``,
    tags: ['docker', 'déploiement', 'devops'],
    lastUpdated: '2026-03-05',
    author: 'Lucas Petit',
    isExternal: false
  },
  {
    id: 'tech-004',
    title: 'Documentation React - Composants',
    category: 'technical',
    application: 'mobile',
    description: 'Lien vers la documentation officielle React.',
    content: '',
    tags: ['react', 'frontend', 'externe'],
    lastUpdated: '2026-03-01',
    author: 'Référence externe',
    isExternal: true,
    externalUrl: 'https://react.dev/reference/react'
  },

  // Documentation Utilisateur
  {
    id: 'user-001',
    title: 'Guide de Démarrage Rapide',
    category: 'user',
    application: 'portal',
    description: 'Guide pour les nouveaux utilisateurs pour démarrer avec la plateforme.',
    content: `# Guide de Démarrage Rapide

## Bienvenue !
Ce guide vous aidera à démarrer rapidement avec la plateforme.

## Étape 1 : Créer votre compte
1. Rendez-vous sur la page d'inscription
2. Remplissez le formulaire avec vos informations
3. Validez votre email

## Étape 2 : Première connexion
1. Connectez-vous avec vos identifiants
2. Complétez votre profil
3. Configurez vos préférences

## Étape 3 : Découvrir l'interface
- **Tableau de bord** : Vue d'ensemble de votre activité
- **Navigation** : Menu latéral pour accéder aux différentes sections
- **Aide** : Icône d'aide disponible sur chaque page`,
    tags: ['démarrage', 'tutorial', 'nouveaux utilisateurs'],
    lastUpdated: '2026-03-18',
    author: 'Équipe Support',
    isExternal: false,
    relatedDocs: ['user-002', 'user-003']
  },
  {
    id: 'user-002',
    title: 'Comment Se Connecter et Gérer Son Compte',
    category: 'user',
    application: 'portal',
    description: 'Instructions détaillées pour la connexion et la gestion du compte utilisateur.',
    content: `# Comment Se Connecter et Gérer Son Compte

## Connexion
1. Accédez à la page de connexion
2. Saisissez votre email et mot de passe
3. Cliquez sur "Se connecter"

### Mot de passe oublié ?
1. Cliquez sur "Mot de passe oublié"
2. Entrez votre email
3. Suivez le lien reçu par email

## Gérer votre compte
### Modifier vos informations
- Accédez à "Mon profil"
- Cliquez sur "Modifier"
- Mettez à jour vos informations
- Enregistrez les modifications

### Changer votre mot de passe
- Allez dans "Paramètres de sécurité"
- Cliquez sur "Changer le mot de passe"
- Suivez les instructions`,
    tags: ['compte', 'connexion', 'sécurité'],
    lastUpdated: '2026-03-16',
    author: 'Équipe Support',
    isExternal: false,
    relatedDocs: ['func-001']
  },
  {
    id: 'user-003',
    title: 'Passer une Commande',
    category: 'user',
    application: 'ecommerce',
    description: 'Guide étape par étape pour passer une commande sur la plateforme.',
    content: `# Passer une Commande

## Étapes

### 1. Parcourir le catalogue
- Utilisez la barre de recherche
- Filtrez par catégorie
- Consultez les fiches produits

### 2. Ajouter au panier
- Sélectionnez la quantité
- Cliquez sur "Ajouter au panier"
- Continuez vos achats ou passez commande

### 3. Finaliser la commande
1. Accédez au panier
2. Vérifiez les articles
3. Saisissez l'adresse de livraison
4. Choisissez le mode de paiement
5. Validez la commande

### 4. Suivi de commande
- Consultez "Mes commandes"
- Suivez l'état de livraison
- Recevez des notifications`,
    tags: ['commande', 'achat', 'tutoriel'],
    lastUpdated: '2026-03-13',
    author: 'Équipe Support',
    isExternal: false
  },
  {
    id: 'user-004',
    title: 'FAQ - Questions Fréquentes',
    category: 'user',
    application: 'portal',
    description: 'Réponses aux questions les plus fréquemment posées.',
    content: `# FAQ - Questions Fréquentes

## Compte

**Q: Comment réinitialiser mon mot de passe ?**
R: Cliquez sur "Mot de passe oublié" sur la page de connexion et suivez les instructions.

**Q: Puis-je modifier mon adresse email ?**
R: Oui, dans les paramètres de votre compte, section "Informations personnelles".

## Commandes

**Q: Combien de temps pour recevoir ma commande ?**
R: En général 3-5 jours ouvrés selon votre localisation.

**Q: Comment retourner un produit ?**
R: Consultez notre politique de retours dans la documentation fonctionnelle.

## Paiement

**Q: Quels modes de paiement acceptez-vous ?**
R: Carte bancaire, PayPal, et virement bancaire.`,
    tags: ['faq', 'aide', 'support'],
    lastUpdated: '2026-03-11',
    author: 'Équipe Support',
    isExternal: false
  },
  {
    id: 'user-005',
    title: 'Tutoriel Vidéo - Prise en main',
    category: 'user',
    application: 'portal',
    description: 'Lien vers notre série de tutoriels vidéo sur YouTube.',
    content: '',
    tags: ['vidéo', 'tutoriel', 'externe'],
    lastUpdated: '2026-03-07',
    author: 'Équipe Marketing',
    isExternal: true,
    externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];

export const getCategoryLabel = (category: DocumentCategory): string => {
  const labels = {
    functional: 'Documentation Fonctionnelle',
    technical: 'Documentation Technique',
    user: 'Documentation Utilisateur'
  };
  return labels[category];
};

export const getCategoryColor = (category: DocumentCategory): string => {
  const colors = {
    functional: 'bg-blue-100 text-blue-800',
    technical: 'bg-purple-100 text-purple-800',
    user: 'bg-green-100 text-green-800'
  };
  return colors[category];
};