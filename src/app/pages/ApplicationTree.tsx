import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Search, FolderTree, Layers } from 'lucide-react';
import { mockDocuments, applications, getCategoryLabel } from '../data/mockDocuments';
import { TreeNode, DocumentNode } from '../components/TreeNode';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

export function ApplicationTree() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les documents par recherche
  const filteredDocs = mockDocuments.filter(doc => {
    if (searchQuery === '') return true;
    return (
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Organiser les documents par application
  const docsByApp = applications.map(app => ({
    ...app,
    documents: filteredDocs.filter(doc => doc.application === app.id),
    byCategory: {
      functional: filteredDocs.filter(doc => doc.application === app.id && doc.category === 'functional'),
      technical: filteredDocs.filter(doc => doc.application === app.id && doc.category === 'technical'),
      user: filteredDocs.filter(doc => doc.application === app.id && doc.category === 'user'),
    }
  }));

  // Organiser les documents par catégorie
  const docsByCategory = [
    {
      category: 'functional' as const,
      label: 'Documentation Fonctionnelle',
      documents: filteredDocs.filter(doc => doc.category === 'functional'),
      byApp: applications.map(app => ({
        ...app,
        documents: filteredDocs.filter(doc => doc.category === 'functional' && doc.application === app.id)
      }))
    },
    {
      category: 'technical' as const,
      label: 'Documentation Technique',
      documents: filteredDocs.filter(doc => doc.category === 'technical'),
      byApp: applications.map(app => ({
        ...app,
        documents: filteredDocs.filter(doc => doc.category === 'technical' && doc.application === app.id)
      }))
    },
    {
      category: 'user' as const,
      label: 'Documentation Utilisateur',
      documents: filteredDocs.filter(doc => doc.category === 'user'),
      byApp: applications.map(app => ({
        ...app,
        documents: filteredDocs.filter(doc => doc.category === 'user' && doc.application === app.id)
      }))
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <FolderTree className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Arborescence Documentaire</h1>
        </div>
        <p className="text-gray-600">
          Navigation hiérarchique par application et catégorie
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Filtrer les documents dans l'arborescence..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tree Views */}
      <Tabs defaultValue="by-app" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="by-app" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Par Application
          </TabsTrigger>
          <TabsTrigger value="by-category" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Par Catégorie
          </TabsTrigger>
        </TabsList>

        {/* Vue par Application */}
        <TabsContent value="by-app" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {docsByApp.map(app => {
                  const hasDocuments = app.documents.length > 0;
                  if (!hasDocuments && searchQuery) return null;

                  return (
                    <TreeNode
                      key={app.id}
                      label={app.name}
                      count={app.documents.length}
                      defaultExpanded={searchQuery !== ''}
                      icon={<Layers className="h-4 w-4 text-white" />}
                      color={app.color}
                    >
                      {/* Sous-catégories */}
                      {app.byCategory.functional.length > 0 && (
                        <TreeNode
                          label="Documentation Fonctionnelle"
                          count={app.byCategory.functional.length}
                          defaultExpanded={searchQuery !== ''}
                        >
                          {app.byCategory.functional.map(doc => (
                            <DocumentNode key={doc.id} document={doc} />
                          ))}
                        </TreeNode>
                      )}
                      {app.byCategory.technical.length > 0 && (
                        <TreeNode
                          label="Documentation Technique"
                          count={app.byCategory.technical.length}
                          defaultExpanded={searchQuery !== ''}
                        >
                          {app.byCategory.technical.map(doc => (
                            <DocumentNode key={doc.id} document={doc} />
                          ))}
                        </TreeNode>
                      )}
                      {app.byCategory.user.length > 0 && (
                        <TreeNode
                          label="Documentation Utilisateur"
                          count={app.byCategory.user.length}
                          defaultExpanded={searchQuery !== ''}
                        >
                          {app.byCategory.user.map(doc => (
                            <DocumentNode key={doc.id} document={doc} />
                          ))}
                        </TreeNode>
                      )}
                    </TreeNode>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vue par Catégorie */}
        <TabsContent value="by-category" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {docsByCategory.map(category => {
                  const hasDocuments = category.documents.length > 0;
                  if (!hasDocuments && searchQuery) return null;

                  return (
                    <TreeNode
                      key={category.category}
                      label={category.label}
                      count={category.documents.length}
                      defaultExpanded={searchQuery !== ''}
                    >
                      {category.byApp.map(app => {
                        if (app.documents.length === 0) return null;
                        return (
                          <TreeNode
                            key={app.id}
                            label={app.name}
                            count={app.documents.length}
                            defaultExpanded={searchQuery !== ''}
                            icon={<Layers className="h-4 w-4 text-white" />}
                            color={app.color}
                          >
                            {app.documents.map(doc => (
                              <DocumentNode key={doc.id} document={doc} />
                            ))}
                          </TreeNode>
                        );
                      })}
                    </TreeNode>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {applications.map(app => {
          const count = mockDocuments.filter(doc => doc.application === app.id).length;
          return (
            <Card key={app.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${app.color} flex items-center justify-center`}>
                    <Layers className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{app.name}</p>
                    <p className="text-xs text-gray-500">{count} {count > 1 ? 'documents' : 'document'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
