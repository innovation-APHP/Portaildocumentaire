import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { ExternalLink } from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

/**
 * Composant pour afficher du Markdown avec support des liens internes
 */
export function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
  const navigate = useNavigate();

  /**
   * Détecte si un lien est interne (vers un document du portail)
   */
  const isInternalLink = (href: string): boolean => {
    // Liens relatifs ou commençant par /
    if (href.startsWith('/') || !href.includes('://')) {
      return true;
    }
    
    // Liens vers des documents avec pattern spécifique
    // Ex: [[doc:tech-001]], [Documentation](/docs/tech-001)
    if (href.includes('/docs/') || href.includes('/document/')) {
      return true;
    }
    
    return false;
  };

  /**
   * Extrait l'ID du document depuis différents formats de liens
   */
  const extractDocumentId = (href: string): string | null => {
    // Format: [[doc:tech-001]] ou [link](doc:tech-001)
    if (href.startsWith('doc:')) {
      return href.replace('doc:', '');
    }
    
    // Format: /docs/tech-001 ou /document/tech-001
    const docMatch = href.match(/\/(docs?|document)\/([a-z]+-\d+)/i);
    if (docMatch) {
      return docMatch[2];
    }
    
    // Format: /docs/functional/tech-001
    const categoryMatch = href.match(/\/(functional|technical|user)\/([a-z]+-\d+)/i);
    if (categoryMatch) {
      return categoryMatch[2];
    }
    
    // Format simple: tech-001
    const simpleMatch = href.match(/([a-z]+-\d+)/i);
    if (simpleMatch) {
      return simpleMatch[1];
    }
    
    return null;
  };

  /**
   * Gère les clics sur les liens
   */
  const handleLinkClick = (href: string) => (e: React.MouseEvent) => {
    if (isInternalLink(href)) {
      e.preventDefault();
      
      const docId = extractDocumentId(href);
      if (docId) {
        // Navigation vers le document
        navigate(`/document/${docId}`);
      } else if (href.startsWith('/')) {
        // Navigation vers une route interne
        navigate(href);
      }
    }
    // Les liens externes s'ouvrent normalement
  };

  /**
   * Composants personnalisés pour le rendu Markdown
   */
  const components = useMemo(
    () => ({
      // Liens personnalisés
      a: ({ href, children, ...props }: any) => {
        const isInternal = href && isInternalLink(href);
        const docId = href ? extractDocumentId(href) : null;

        return (
          <a
            href={href}
            onClick={href ? handleLinkClick(href) : undefined}
            target={isInternal ? undefined : '_blank'}
            rel={isInternal ? undefined : 'noopener noreferrer'}
            className={`
              ${isInternal 
                ? 'text-blue-600 hover:text-blue-800 hover:underline font-medium' 
                : 'text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1'
              }
            `}
            {...props}
          >
            {children}
            {!isInternal && <ExternalLink className="h-3 w-3 inline" />}
          </a>
        );
      },

      // Titres avec ancres
      h1: ({ children, ...props }: any) => (
        <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-4" {...props}>
          {children}
        </h1>
      ),
      h2: ({ children, ...props }: any) => (
        <h2 className="text-2xl font-bold text-gray-900 mt-5 mb-3" {...props}>
          {children}
        </h2>
      ),
      h3: ({ children, ...props }: any) => (
        <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2" {...props}>
          {children}
        </h3>
      ),
      h4: ({ children, ...props }: any) => (
        <h4 className="text-lg font-semibold text-gray-900 mt-3 mb-2" {...props}>
          {children}
        </h4>
      ),

      // Paragraphes
      p: ({ children, ...props }: any) => (
        <p className="text-gray-700 leading-relaxed mb-4" {...props}>
          {children}
        </p>
      ),

      // Listes
      ul: ({ children, ...props }: any) => (
        <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700" {...props}>
          {children}
        </ul>
      ),
      ol: ({ children, ...props }: any) => (
        <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700" {...props}>
          {children}
        </ol>
      ),
      li: ({ children, ...props }: any) => (
        <li className="ml-4" {...props}>
          {children}
        </li>
      ),

      // Code
      code: ({ inline, className, children, ...props }: any) => {
        if (inline) {
          return (
            <code
              className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        }
        return (
          <code
            className={`block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4 ${className || ''}`}
            {...props}
          >
            {children}
          </code>
        );
      },

      // Blocs de code
      pre: ({ children, ...props }: any) => (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
          {children}
        </pre>
      ),

      // Citations
      blockquote: ({ children, ...props }: any) => (
        <blockquote
          className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-700 bg-blue-50"
          {...props}
        >
          {children}
        </blockquote>
      ),

      // Tableaux
      table: ({ children, ...props }: any) => (
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200" {...props}>
            {children}
          </table>
        </div>
      ),
      thead: ({ children, ...props }: any) => (
        <thead className="bg-gray-50" {...props}>
          {children}
        </thead>
      ),
      tbody: ({ children, ...props }: any) => (
        <tbody className="bg-white divide-y divide-gray-200" {...props}>
          {children}
        </tbody>
      ),
      tr: ({ children, ...props }: any) => (
        <tr {...props}>{children}</tr>
      ),
      th: ({ children, ...props }: any) => (
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider" {...props}>
          {children}
        </th>
      ),
      td: ({ children, ...props }: any) => (
        <td className="px-4 py-3 text-sm text-gray-700" {...props}>
          {children}
        </td>
      ),

      // Ligne horizontale
      hr: ({ ...props }: any) => (
        <hr className="my-6 border-gray-300" {...props} />
      ),

      // Images
      img: ({ src, alt, ...props }: any) => (
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-lg my-4 shadow-sm"
          {...props}
        />
      ),
    }),
    [navigate]
  );

  return (
    <div className={`prose prose-blue max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Hook pour transformer les liens Wiki.js en liens internes
 */
export function useWikiJsLinkTransformer() {
  const transformContent = (content: string): string => {
    // Transformer les liens Wiki.js [[page]] en liens markdown
    let transformed = content.replace(
      /\[\[([^\]]+)\]\]/g,
      (match, pagePath) => {
        // Si c'est un ID de document, créer un lien vers le document
        if (pagePath.match(/^[a-z]+-\d+$/i)) {
          return `[${pagePath}](doc:${pagePath})`;
        }
        // Sinon, créer un lien standard
        return `[${pagePath}](/${pagePath})`;
      }
    );

    // Transformer les liens absolus Wiki.js en liens relatifs
    transformed = transformed.replace(
      /https?:\/\/[^\/]+\/([a-z]+-\d+)/gi,
      (match, docId) => {
        return `[${docId}](doc:${docId})`;
      }
    );

    return transformed;
  };

  return { transformContent };
}
