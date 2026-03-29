import { Settings as SettingsIcon } from 'lucide-react';
import { WikiJsSettings } from '../components/WikiJsSettings';
import { MigrationPanel } from '../components/MigrationPanel';
import { ConfigEditor } from '../components/ConfigEditor';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        </div>
        <p className="text-gray-600">
          Configurez votre portail documentaire et la connexion à Wiki.js
        </p>
      </div>

      <div className="space-y-6">
        <WikiJsSettings />
        <ConfigEditor />
        <MigrationPanel />
      </div>
    </div>
  );
}