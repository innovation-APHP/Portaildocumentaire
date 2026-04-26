import { Link } from 'react-router';
import { BookOpen, FileText, Users, ArrowRight, Clock, Layers, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useConfig } from '../contexts/ConfigContext';
import { useStats } from '../hooks/useStats';

export function Home() {
  const { config } = useConfig();
  const { stats, loading } = useStats();

  const categories = [
    {
      title: config.categories.functional.label,
      description: config.categories.functional.description,
      icon: BookOpen,
      color: 'bg-blue-500',
      href: '/docs/functional',
      count: stats?.documentsByCategory?.functional || 0
    },
    {
      title: config.categories.technical.label,
      description: config.categories.technical.description,
      icon: FileText,
      color: 'bg-purple-500',
      href: '/docs/technical',
      count: stats?.documentsByCategory?.technical || 0
    },
    {
      title: config.categories.user.label,
      description: config.categories.user.description,
      icon: Users,
      color: 'bg-green-500',
      href: '/docs/user',
      count: stats?.documentsByCategory?.user || 0
    }
  ];

  const statsData = [
    { label: 'Documents', value: stats?.totalDocuments || 0, icon: FileText },
    { label: 'Tags', value: stats?.totalTags || 0, icon: Layers },
    { label: 'Catégories', value: 3, icon: BookOpen },
  ];

  const recentDocs = stats?.recentDocuments || [];

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.href.includes(category));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur le Portail Documentaire
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mb-6">
          Accédez à l'ensemble du corpus documentaire de l'organisation : documentation fonctionnelle,
          technique et utilisateur, le tout centralisé et accessible.
        </p>
        <Link to="/chat">
          <Button size="lg" className="gap-2">
            <MessageSquare className="h-5 w-5" />
            Essayer l'Assistant IA
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {statsData.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <stat.icon className="h-10 w-10 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Catégories de Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.href} to={category.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {category.count} {category.count > 1 ? 'documents' : 'document'}
                      </Badge>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Documents Récemment Mis à Jour</h2>
          <Link to="/docs/all">
            <Button variant="outline" size="sm">
              Voir tous les documents
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : recentDocs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucun document récent</div>
          ) : (
            recentDocs.map((doc: any) => {
              const categoryInfo = getCategoryInfo(doc.category);
              const Icon = categoryInfo?.icon || BookOpen;
              return (
                <Link key={doc.id} to={`/document/${doc.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg ${categoryInfo?.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {doc.title}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description || 'Aucune description'}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span>{doc.author_name || 'Anonyme'}</span>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                            {doc.tags && doc.tags.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex gap-1">
                                  {doc.tags.slice(0, 3).map((tag: any) => (
                                    <Badge key={tag.id} variant="secondary" className="text-xs">
                                      {tag.name}
                                    </Badge>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}