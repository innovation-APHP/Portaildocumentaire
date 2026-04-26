import { Link, useParams, useNavigate } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Calendar, User, Tag, FileText, ChevronRight, ExternalLink, Download, File } from 'lucide-react';
import { getCategoryColor } from '../data/mockDocuments';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { FileViewer } from '../components/FileViewer';
import { useDocument } from '../hooks/useDocuments';

export function DocumentView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { document, loading, error } = useDocument(id!);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Document non trouvé</h2>
            <p className="text-gray-500 mb-6">
              {error || 'Le document que vous recherchez n\'existe pas ou a été supprimé.'}
            </p>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <span>{document.author_name || 'Anonyme'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Créé le:</span>
              <span>{new Date(document.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Mis à jour:</span>
              <span>{new Date(document.updated_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag: any) => (
                  <Badge key={tag.id} variant="secondary" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                    {tag.name}
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
          {/* Lien externe */}
          {document.is_external && document.external_url && (
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <ExternalLink className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Document externe</h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Ce document est hébergé sur une plateforme externe. Cliquez sur le lien ci-dessous pour y accéder.
                    </p>
                    <a
                      href={document.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ouvrir le document
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
              {document.content && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <MarkdownViewer content={document.content} />
                </div>
              )}
            </div>
          )}

          {/* Fichier avec viewer intégré */}
          {!document.is_external && document.file_path && document.file_type && document.file_type !== 'text/markdown' && document.file_type !== 'text/plain' && (
            <div className="space-y-6">
              <FileViewer
                fileUrl={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001'}/${document.file_path}`}
                fileType={document.file_type}
                fileName={document.title}
                content={document.content}
              />
              {document.content && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notes / Description
                  </h3>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded">{document.content}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contenu texte/markdown normal */}
          {!document.is_external && (!document.file_type || document.file_type === 'text/markdown' || document.file_type === 'text/plain') && (
            <MarkdownViewer content={document.content || ''} />
          )}
        </CardContent>
      </Card>

      {/* Related Documents */}
      {document.related_documents && document.related_documents.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents liés
            </h2>
            <div className="space-y-2">
              {document.related_documents.map((relatedDoc: any) => (
                <Link
                  key={relatedDoc.id}
                  to={`/document/${relatedDoc.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {relatedDoc.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}