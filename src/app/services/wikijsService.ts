// Configuration Wiki.js
const WIKIJS_API_URL = import.meta.env.VITE_WIKIJS_API_URL || 'http://localhost:3000/graphql';
const WIKIJS_API_KEY = import.meta.env.VITE_WIKIJS_API_KEY || '';

export interface WikiPage {
  id: number;
  path: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPublished: boolean;
  locale: string;
  authorName: string;
  authorEmail: string;
}

export interface WikiPageTree {
  id: number;
  path: string;
  title: string;
  isFolder: boolean;
  children?: WikiPageTree[];
}

// GraphQL Queries
const QUERIES = {
  // Récupérer toutes les pages
  GET_PAGES: `
    query {
      pages {
        list {
          id
          path
          title
          description
          content
          createdAt
          updatedAt
          tags {
            tag
          }
          isPublished
          locale
          creator {
            name
            email
          }
        }
      }
    }
  `,
  
  // Récupérer une page par ID
  GET_PAGE_BY_ID: (id: number) => `
    query {
      pages {
        single(id: ${id}) {
          id
          path
          title
          description
          content
          contentType
          createdAt
          updatedAt
          tags {
            tag
          }
          isPublished
          locale
          creator {
            name
            email
          }
          editor
          render
        }
      }
    }
  `,
  
  // Récupérer une page par path
  GET_PAGE_BY_PATH: (path: string) => `
    query {
      pages {
        singleByPath(path: "${path}", locale: "fr") {
          id
          path
          title
          description
          content
          contentType
          createdAt
          updatedAt
          tags {
            tag
          }
          isPublished
          locale
          creator {
            name
            email
          }
          editor
          render
        }
      }
    }
  `,
  
  // Rechercher des pages
  SEARCH_PAGES: (query: string) => `
    query {
      pages {
        search(query: "${query}") {
          results {
            id
            path
            title
            description
            locale
          }
          totalHits
        }
      }
    }
  `,
  
  // Récupérer l'arborescence
  GET_PAGE_TREE: `
    query {
      pages {
        tree(parent: 0, mode: ALL, includeAncestors: false) {
          id
          path
          title
          isFolder
          pageId
          parent
          locale
        }
      }
    }
  `,
  
  // Authentification
  LOGIN: (email: string, password: string) => `
    mutation {
      authentication {
        login(username: "${email}", password: "${password}", strategy: "local") {
          responseResult {
            succeeded
            errorCode
            slug
            message
          }
          jwt
        }
      }
    }
  `
};

// Fonction helper pour les requêtes GraphQL
async function graphqlRequest<T>(query: string, token?: string): Promise<T> {
  // Récupérer l'URL depuis localStorage ou utiliser la valeur par défaut
  const wikijsUrl = localStorage.getItem('wikijs_url');
  
  // Si aucune URL n'est configurée, lever une erreur spécifique
  if (!wikijsUrl) {
    throw new Error('WIKIJS_NOT_CONFIGURED');
  }
  
  const apiUrl = `${wikijsUrl}/graphql`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Utiliser le token fourni en priorité, sinon le token du localStorage, sinon la clé API
  const storedToken = localStorage.getItem('wikijs_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (storedToken) {
    headers['Authorization'] = `Bearer ${storedToken}`;
  } else if (WIKIJS_API_KEY) {
    headers['Authorization'] = `Bearer ${WIKIJS_API_KEY}`;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Erreur API Wiki.js: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  return result.data;
}

// Services
export const wikijsService = {
  // Authentification
  async login(email: string, password: string): Promise<{ jwt: string; success: boolean }> {
    try {
      const data: any = await graphqlRequest(QUERIES.LOGIN(email, password));
      const loginResult = data.authentication.login;
      
      return {
        jwt: loginResult.jwt,
        success: loginResult.responseResult.succeeded,
      };
    } catch (error) {
      console.error('Erreur de connexion Wiki.js:', error);
      throw error;
    }
  },

  // Récupérer toutes les pages
  async getPages(token?: string): Promise<WikiPage[]> {
    try {
      const data: any = await graphqlRequest(QUERIES.GET_PAGES, token);
      return data.pages.list.map((page: any) => ({
        id: page.id,
        path: page.path,
        title: page.title,
        description: page.description || '',
        content: page.content,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        tags: page.tags.map((t: any) => t.tag),
        isPublished: page.isPublished,
        locale: page.locale,
        authorName: page.creator?.name || 'Unknown',
        authorEmail: page.creator?.email || '',
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des pages:', error);
      throw error;
    }
  },

  // Récupérer une page par ID
  async getPageById(id: number, token?: string): Promise<WikiPage> {
    try {
      const data: any = await graphqlRequest(QUERIES.GET_PAGE_BY_ID(id), token);
      const page = data.pages.single;
      
      return {
        id: page.id,
        path: page.path,
        title: page.title,
        description: page.description || '',
        content: page.content,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        tags: page.tags.map((t: any) => t.tag),
        isPublished: page.isPublished,
        locale: page.locale,
        authorName: page.creator?.name || 'Unknown',
        authorEmail: page.creator?.email || '',
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la page:', error);
      throw error;
    }
  },

  // Récupérer une page par path
  async getPageByPath(path: string, token?: string): Promise<WikiPage> {
    try {
      const data: any = await graphqlRequest(QUERIES.GET_PAGE_BY_PATH(path), token);
      const page = data.pages.singleByPath;
      
      return {
        id: page.id,
        path: page.path,
        title: page.title,
        description: page.description || '',
        content: page.content,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        tags: page.tags.map((t: any) => t.tag),
        isPublished: page.isPublished,
        locale: page.locale,
        authorName: page.creator?.name || 'Unknown',
        authorEmail: page.creator?.email || '',
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la page:', error);
      throw error;
    }
  },

  // Rechercher des pages
  async searchPages(query: string, token?: string): Promise<WikiPage[]> {
    try {
      const data: any = await graphqlRequest(QUERIES.SEARCH_PAGES(query), token);
      return data.pages.search.results.map((page: any) => ({
        id: page.id,
        path: page.path,
        title: page.title,
        description: page.description || '',
        content: '',
        createdAt: '',
        updatedAt: '',
        tags: [],
        isPublished: true,
        locale: page.locale,
        authorName: '',
        authorEmail: '',
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  },

  // Récupérer l'arborescence
  async getPageTree(token?: string): Promise<WikiPageTree[]> {
    try {
      const data: any = await graphqlRequest(QUERIES.GET_PAGE_TREE, token);
      
      // Construire l'arborescence
      const flatTree = data.pages.tree;
      const treeMap = new Map<number, WikiPageTree>();
      const rootNodes: WikiPageTree[] = [];

      // Créer tous les noeuds
      flatTree.forEach((node: any) => {
        treeMap.set(node.id, {
          id: node.pageId || node.id,
          path: node.path,
          title: node.title,
          isFolder: node.isFolder,
          children: [],
        });
      });

      // Construire la hiérarchie
      flatTree.forEach((node: any) => {
        const treeNode = treeMap.get(node.id);
        if (treeNode) {
          if (node.parent === 0) {
            rootNodes.push(treeNode);
          } else {
            const parent = treeMap.get(node.parent);
            if (parent) {
              parent.children = parent.children || [];
              parent.children.push(treeNode);
            }
          }
        }
      });

      return rootNodes;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'arborescence:', error);
      throw error;
    }
  },

  // Vérifier la connexion à l'API
  async checkConnection(): Promise<boolean> {
    try {
      await graphqlRequest(`{ pages { list { id } } }`);
      return true;
    } catch (error) {
      console.error('Impossible de se connecter à Wiki.js:', error);
      return false;
    }
  },

  // Créer une nouvelle page dans Wiki.js
  async createPage(
    path: string,
    title: string,
    content: string,
    description: string,
    tags: string[],
    locale: string = 'fr',
    isPublished: boolean = true,
    editor: string = 'markdown',
    token?: string
  ): Promise<{ id: number; path: string }> {
    const mutation = `
      mutation {
        pages {
          create(
            content: ${JSON.stringify(content)},
            description: ${JSON.stringify(description)},
            editor: "${editor}",
            isPublished: ${isPublished},
            isPrivate: false,
            locale: "${locale}",
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

    try {
      const data: any = await graphqlRequest(mutation, token);
      const result = data.pages.create;
      
      if (!result.responseResult.succeeded) {
        throw new Error(result.responseResult.message || 'Échec de la création de la page');
      }

      return {
        id: result.page.id,
        path: result.page.path,
      };
    } catch (error) {
      console.error('Erreur lors de la création de la page:', error);
      throw error;
    }
  },

  // Mettre à jour une page existante
  async updatePage(
    id: number,
    content: string,
    description: string,
    tags: string[],
    title: string,
    token?: string
  ): Promise<boolean> {
    const mutation = `
      mutation {
        pages {
          update(
            id: ${id},
            content: ${JSON.stringify(content)},
            description: ${JSON.stringify(description)},
            tags: ${JSON.stringify(tags)},
            title: ${JSON.stringify(title)}
          ) {
            responseResult {
              succeeded
              errorCode
              message
            }
          }
        }
      }
    `;

    try {
      const data: any = await graphqlRequest(mutation, token);
      return data.pages.update.responseResult.succeeded;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la page:', error);
      throw error;
    }
  },
};