import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search, Filter, ExternalLink, FileText, ChevronRight } from 'lucide-react';
import { mockDocuments, getCategoryLabel, getCategoryColor, DocumentCategory } from '../data/mockDocuments';

export function DocumentList() {
  const { category } = useParams<{ category: DocumentCategory | 'all' }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filtrer les documents par catégorie
  const filteredByCategory = category && category !== 'all'
    ? mockDocuments.filter(doc => doc.category === category)
    : mockDocuments;

  // Récupérer tous les tags uniques
  const allTags = Array.from(new Set(filteredByCategory.flatMap(doc => doc.tags)));

  // Filtrer par recherche et tags
  const filteredDocs = filteredByCategory.filter(doc => {
    const matchesSearch = searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => doc.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const pageTitle = category && category !== 'all'
    ? getCategoryLabel(category as DocumentCategory)
    : 'Tous les Documents';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
        <p className="text-gray-600">
          {filteredDocs.length} {filteredDocs.length > 1 ? 'documents trouvés' : 'document trouvé'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher par titre, description ou tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtrer par tags :</span>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="h-7 text-xs"
                >
                  Tout effacer
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun document trouvé</p>
              <p className="text-sm text-gray-400 mt-1">
                Essayez de modifier vos critères de recherche
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDocs.map(doc => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    {doc.isExternal ? (
                      <a
                        href={doc.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {doc.title}
                        </h3>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </a>
                    ) : (
                      <Link to={`/docs/${doc.category}/${doc.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors inline-flex items-center gap-2">
                          {doc.title}
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </h3>
                      </Link>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {category === 'all' && (
                      <Badge className={getCategoryColor(doc.category)}>
                        {doc.category === 'functional' && 'Fonctionnelle'}
                        {doc.category === 'technical' && 'Technique'}
                        {doc.category === 'user' && 'Utilisateur'}
                      </Badge>
                    )}
                    {doc.isExternal && (
                      <Badge variant="outline">Externe</Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{doc.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Auteur:</span> {doc.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Mis à jour:</span>{' '}
                    {new Date(doc.lastUpdated).toLocaleDateString('fr-FR')}
                  </span>
                  {doc.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex gap-1 flex-wrap">
                        {doc.tags.map(tag => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-gray-300"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {doc.relatedDocs && doc.relatedDocs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">Documents liés:</p>
                    <div className="flex flex-wrap gap-2">
                      {doc.relatedDocs.map(relatedId => {
                        const relatedDoc = mockDocuments.find(d => d.id === relatedId);
                        if (!relatedDoc) return null;
                        return (
                          <Link key={relatedId} to={`/docs/${relatedDoc.category}/${relatedId}`}>
                            <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer text-xs">
                              {relatedDoc.title}
                            </Badge>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
