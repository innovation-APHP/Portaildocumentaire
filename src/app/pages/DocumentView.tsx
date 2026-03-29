import { Link, useParams, useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Calendar, User, Tag, FileText, ExternalLink, ChevronRight, Layers } from 'lucide-react';
import { mockDocuments, getCategoryLabel, getCategoryColor, applications } from '../data/mockDocuments';
import { MarkdownViewer, useWikiJsLinkTransformer } from '../components/MarkdownViewer';

export function DocumentView() {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const { transformContent } = useWikiJsLinkTransformer();

  const document = mockDocuments.find(doc => doc.id === id);
  
  // Récupérer l'application associée
  const app = document ? applications.find(a => a.id === document.application) : null;

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Document non trouvé</h2>
            <p className="text-gray-500 mb-6">
              Le document que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si c'est un document externe, rediriger
  if (document.isExternal && document.externalUrl) {
    window.open(document.externalUrl, '_blank');
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <ExternalLink className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirection vers un lien externe</h2>
            <p className="text-gray-500 mb-6">
              Ce document est hébergé sur une plateforme externe.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <a href={document.externalUrl} target="_blank" rel="noopener noreferrer">
                <Button>
                  Ouvrir le lien externe
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transformer le contenu pour gérer les liens Wiki.js
  const transformedContent = transformContent(document.content);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      {/* Document Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
            <Badge className={getCategoryColor(document.category)}>
              {document.category === 'functional' && 'Fonctionnelle'}
              {document.category === 'technical' && 'Technique'}
              {document.category === 'user' && 'Utilisateur'}
            </Badge>
          </div>

          <p className="text-gray-600 mb-6">{document.description}</p>

          <Separator className="my-4" />

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="font-medium">Auteur:</span>
              <span>{document.author}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Dernière mise à jour:</span>
              <span>{new Date(document.lastUpdated).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Tags */}
          {document.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {document.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Content */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <MarkdownViewer content={transformedContent} />
        </CardContent>
      </Card>

      {/* Related Documents */}
      {document.relatedDocs && document.relatedDocs.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents liés
            </h2>
            <div className="space-y-2">
              {document.relatedDocs.map(relatedId => {
                const relatedDoc = mockDocuments.find(d => d.id === relatedId);
                if (!relatedDoc) return null;
                return (
                  <Link
                    key={relatedId}
                    to={`/docs/${relatedDoc.category}/${relatedId}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {relatedDoc.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {relatedDoc.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={getCategoryColor(relatedDoc.category)} variant="outline">
                          {relatedDoc.category === 'functional' && 'Fonctionnelle'}
                          {relatedDoc.category === 'technical' && 'Technique'}
                          {relatedDoc.category === 'user' && 'Utilisateur'}
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}