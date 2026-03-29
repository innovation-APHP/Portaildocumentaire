#!/usr/bin/env node

/**
 * Script CLI pour migrer les documents de démonstration vers Wiki.js
 * 
 * Usage:
 *   node scripts/migrate-to-wikijs.js --url=http://localhost:3000 --token=YOUR_TOKEN
 *   node scripts/migrate-to-wikijs.js --url=http://localhost:3000 --token=YOUR_TOKEN --category=technical
 *   node scripts/migrate-to-wikijs.js --url=http://localhost:3000 --token=YOUR_TOKEN --app=app-001
 */

import { mockDocuments, applications } from '../src/app/data/mockDocuments.ts';

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Parser les arguments
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    const [key, value] = arg.replace('--', '').split('=');
    args[key] = value;
  });
  return args;
}

// Afficher l'aide
function showHelp() {
  console.log(`
${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}
${colors.bright}  Migration des Documents vers Wiki.js${colors.reset}
${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}

${colors.bright}Usage:${colors.reset}
  node scripts/migrate-to-wikijs.js --url=<URL> --token=<TOKEN> [OPTIONS]

${colors.bright}Arguments requis:${colors.reset}
  ${colors.green}--url${colors.reset}      URL de votre instance Wiki.js (ex: http://localhost:3000)
  ${colors.green}--token${colors.reset}    Token JWT ou clé API Wiki.js

${colors.bright}Options:${colors.reset}
  ${colors.yellow}--category${colors.reset}  Migrer uniquement une catégorie
              Valeurs: functional, technical, user
  
  ${colors.yellow}--app${colors.reset}       Migrer uniquement une application
              Valeurs: app-001 à app-006
  
  ${colors.yellow}--dry-run${colors.reset}   Simuler la migration sans créer de pages
  
  ${colors.yellow}--help${colors.reset}      Afficher cette aide

${colors.bright}Exemples:${colors.reset}
  ${colors.blue}# Migration complète (16 documents)${colors.reset}
  node scripts/migrate-to-wikijs.js --url=http://localhost:3000 --token=eyJhbGc...

  ${colors.blue}# Migration par catégorie${colors.reset}
  node scripts/migrate-to-wikijs.js --url=http://localhost:3000 --token=eyJhbGc... --category=technical

  ${colors.blue}# Migration par application${colors.reset}
  node scripts/migrate-to-wikijs.js --url=http://localhost:3000 --token=eyJhbGc... --app=app-001

  ${colors.blue}# Test sans créer de pages${colors.reset}
  node scripts/migrate-to-wikijs.js --url=http://localhost:3000 --token=eyJhbGc... --dry-run

${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}
`);
}

// Obtenir le path de la catégorie
function getCategoryPath(category) {
  const paths = {
    functional: 'documentation-fonctionnelle',
    technical: 'documentation-technique',
    user: 'documentation-utilisateur',
  };
  return paths[category];
}

// Créer une page dans Wiki.js via GraphQL
async function createPageInWikiJs(url, token, path, title, content, description, tags) {
  const mutation = `
    mutation {
      pages {
        create(
          content: ${JSON.stringify(content)},
          description: ${JSON.stringify(description)},
          editor: "markdown",
          isPublished: true,
          isPrivate: false,
          locale: "fr",
          path: "${path}",
          tags: ${JSON.stringify(tags)},
          title: ${JSON.stringify(title)}
        ) {
          responseResult {
            succeeded
            errorCode
            slug
            message
          }
          page {
            id
            path
            title
          }
        }
      }
    }
  `;

  const response = await fetch(`${url}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: mutation }),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  const createResult = result.data.pages.create;
  if (!createResult.responseResult.succeeded) {
    throw new Error(createResult.responseResult.message || 'Échec de la création');
  }

  return createResult.page;
}

// Tester la connexion à Wiki.js
async function testConnection(url, token) {
  try {
    const response = await fetch(`${url}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: '{ pages { list { id } } }',
      }),
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return !result.errors;
  } catch (error) {
    return false;
  }
}

// Barre de progression
function showProgress(current, total, title) {
  const percentage = Math.round((current / total) * 100);
  const barLength = 40;
  const filledLength = Math.round((barLength * current) / total);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  
  process.stdout.write(`\r${colors.cyan}[${bar}]${colors.reset} ${percentage}% - ${colors.bright}${title}${colors.reset}          `);
}

// Fonction principale
async function main() {
  const args = parseArgs();

  // Afficher l'aide
  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Vérifier les arguments requis
  if (!args.url || !args.token) {
    console.error(`${colors.red}❌ Erreur: --url et --token sont requis${colors.reset}\n`);
    console.log(`Utilisez ${colors.yellow}--help${colors.reset} pour voir l'aide\n`);
    process.exit(1);
  }

  const isDryRun = args['dry-run'] !== undefined;

  console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}  🚀 Migration vers Wiki.js${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`${colors.blue}📍 URL:${colors.reset} ${args.url}`);
  console.log(`${colors.blue}🔑 Token:${colors.reset} ${args.token.substring(0, 20)}...`);
  
  if (isDryRun) {
    console.log(`${colors.yellow}⚠️  Mode simulation (dry-run)${colors.reset}`);
  }
  
  console.log('');

  // Test de connexion
  console.log(`${colors.yellow}🔌 Test de connexion...${colors.reset}`);
  const isConnected = await testConnection(args.url, args.token);
  
  if (!isConnected) {
    console.error(`${colors.red}❌ Impossible de se connecter à Wiki.js${colors.reset}`);
    console.error(`${colors.red}   Vérifiez l'URL et le token${colors.reset}\n`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✓ Connexion établie${colors.reset}\n`);

  // Filtrer les documents
  let docsToMigrate = mockDocuments;
  let modeDescription = 'Migration complète';

  if (args.category) {
    docsToMigrate = mockDocuments.filter(doc => doc.category === args.category);
    modeDescription = `Migration catégorie: ${args.category}`;
    
    if (docsToMigrate.length === 0) {
      console.error(`${colors.red}❌ Catégorie invalide: ${args.category}${colors.reset}`);
      console.error(`${colors.yellow}   Valeurs possibles: functional, technical, user${colors.reset}\n`);
      process.exit(1);
    }
  }

  if (args.app) {
    docsToMigrate = mockDocuments.filter(doc => doc.application === args.app);
    const app = applications.find(a => a.id === args.app);
    modeDescription = `Migration application: ${app?.name || args.app}`;
    
    if (docsToMigrate.length === 0) {
      console.error(`${colors.red}❌ Application invalide: ${args.app}${colors.reset}`);
      console.error(`${colors.yellow}   Valeurs possibles: app-001, app-002, app-003, app-004, app-005, app-006${colors.reset}\n`);
      process.exit(1);
    }
  }

  console.log(`${colors.bright}${modeDescription}${colors.reset}`);
  console.log(`${colors.blue}📊 Documents à migrer: ${docsToMigrate.length}${colors.reset}\n`);

  // Trier par catégorie
  const sortedDocs = [...docsToMigrate].sort((a, b) => 
    a.category.localeCompare(b.category)
  );

  // Migration
  const results = {
    success: [],
    failed: [],
  };

  console.log(`${colors.bright}Progression:${colors.reset}\n`);

  for (let i = 0; i < sortedDocs.length; i++) {
    const doc = sortedDocs[i];
    
    showProgress(i + 1, sortedDocs.length, doc.title.substring(0, 50));

    if (isDryRun) {
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 100));
      results.success.push(doc.title);
      continue;
    }

    try {
      // Construire le path
      const app = applications.find(a => a.id === doc.application);
      const categoryPath = getCategoryPath(doc.category);
      const path = `${categoryPath}/${app?.name.toLowerCase().replace(/\s+/g, '-') || 'general'}/${doc.id}`;

      // Créer la page
      await createPageInWikiJs(
        args.url,
        args.token,
        path,
        doc.title,
        doc.content || `# ${doc.title}\n\n${doc.description}`,
        doc.description,
        doc.tags
      );

      results.success.push(doc.title);

      // Pause pour ne pas surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      results.failed.push({
        title: doc.title,
        error: error.message,
      });
    }
  }

  console.log(`\n\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}  📊 Résultats de la migration${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`${colors.green}✓ Créés avec succès: ${results.success.length}${colors.reset}`);
  console.log(`${colors.red}✗ Échecs: ${results.failed.length}${colors.reset}\n`);

  if (results.failed.length > 0) {
    console.log(`${colors.bright}${colors.red}Documents en erreur:${colors.reset}\n`);
    results.failed.forEach(({ title, error }) => {
      console.log(`  ${colors.red}✗${colors.reset} ${title}`);
      console.log(`    ${colors.yellow}→ ${error}${colors.reset}`);
    });
    console.log('');
  }

  if (isDryRun) {
    console.log(`${colors.yellow}⚠️  Mode simulation - Aucune page n'a été créée${colors.reset}\n`);
  } else {
    console.log(`${colors.green}✓ Migration terminée !${colors.reset}\n`);
  }

  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error(`\n${colors.red}❌ Erreur fatale:${colors.reset}`, error.message);
  process.exit(1);
});

// Exécuter
main();
