import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DocumentsManager } from '../components/admin/DocumentsManager';
import { TagsManager } from '../components/admin/TagsManager';
import { UsersManager } from '../components/admin/UsersManager';
import { CategoriesManager } from '../components/admin/CategoriesManager';
import { ApplicationsManager } from '../components/admin/ApplicationsManager';
import { Shield, Users, Folder, Layers } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Admin() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-gray-600">
            {isAdmin
              ? 'Gestion des documents, catégories, applications, tags et utilisateurs'
              : 'Gestion des documents, catégories, applications et métadonnées'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'} max-w-4xl`}>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="categories">
            <Folder className="h-4 w-4 mr-2" />
            Catégories
          </TabsTrigger>
          <TabsTrigger value="applications">
            <Layers className="h-4 w-4 mr-2" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <DocumentsManager />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoriesManager />
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <ApplicationsManager />
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <TagsManager />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="mt-6">
            <UsersManager />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
