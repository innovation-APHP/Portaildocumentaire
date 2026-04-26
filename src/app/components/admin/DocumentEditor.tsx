import { useState, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { apiClient } from '../../services/apiClient';
import { toast } from 'sonner';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface DocumentEditorProps {
  document: any | null;
  onClose: () => void;
}

export function DocumentEditor({ document, onClose }: DocumentEditorProps) {
  const [formData, setFormData] = useState({
    title: document?.title || '',
    category: document?.category || 'functional',
    description: document?.description || '',
    content: document?.content || '',
    external_url: document?.external_url || '',
    is_external: document?.is_external || false,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(
    document?.tags?.map((t: Tag) => t.name) || []
  );
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [documentType, setDocumentType] = useState<'text' | 'file' | 'external'>(
    document?.is_external ? 'external' : document?.file_path ? 'file' : 'text'
  );

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    try {
      const tags = await apiClient.getTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function toggleTag(tagName: string) {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  }

  async function handleAddNewTag() {
    if (!newTagName.trim()) return;

    try {
      const newTag = await apiClient.createTag({ name: newTagName.trim() });
      setAvailableTags([...availableTags, newTag]);
      setSelectedTags([...selectedTags, newTag.name]);
      setNewTagName('');
      toast.success('Tag créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création du tag');
      console.error(error);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      const textFormats = ['md', 'txt', 'html', 'json', 'xml', 'csv'];

      // Seulement lire le contenu pour les fichiers texte
      if (ext && textFormats.includes(ext)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData({ ...formData, content: event.target.result as string });
          }
        };
        reader.readAsText(selectedFile);
      } else {
        // Pour les autres fichiers (PDF, DOCX, etc.), on met juste le titre du fichier
        setFormData({
          ...formData,
          content: `Fichier attaché: ${selectedFile.name}\nType: ${selectedFile.type}\nTaille: ${(selectedFile.size / 1024).toFixed(2)} KB`
        });
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('content', formData.content);
      submitData.append('tags', JSON.stringify(selectedTags));
      submitData.append('is_external', String(documentType === 'external'));

      if (documentType === 'external' && formData.external_url) {
        submitData.append('external_url', formData.external_url);
      }

      if (file) {
        submitData.append('file', file);
      }

      if (document?.id) {
        await apiClient.updateDocument(document.id, submitData);
        toast.success('Document mis à jour avec succès');
      } else {
        await apiClient.createDocument(submitData);
        toast.success('Document créé avec succès');
      }

      onClose();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-y-auto z-50">
      <Card className="w-full max-w-4xl my-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {document ? 'Modifier le document' : 'Nouveau document'}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="functional">Fonctionnelle</option>
              <option value="technical">Technique</option>
              <option value="user">Utilisateur</option>
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg min-h-[100px]"
            />
          </div>

          <div>
            <Label>Type de document *</Label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="documentType"
                  value="text"
                  checked={documentType === 'text'}
                  onChange={(e) => setDocumentType(e.target.value as 'text' | 'file' | 'external')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Texte / Markdown</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="documentType"
                  value="file"
                  checked={documentType === 'file'}
                  onChange={(e) => setDocumentType(e.target.value as 'text' | 'file' | 'external')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Fichier (PDF, Word, etc.)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="documentType"
                  value="external"
                  checked={documentType === 'external'}
                  onChange={(e) => setDocumentType(e.target.value as 'text' | 'file' | 'external')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Lien externe</span>
              </label>
            </div>
          </div>

          {documentType === 'external' && (
            <div>
              <Label htmlFor="external_url">URL du document externe *</Label>
              <Input
                id="external_url"
                name="external_url"
                type="url"
                value={formData.external_url}
                onChange={handleInputChange}
                placeholder="https://exemple.com/document.pdf"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Lien vers un document hébergé ailleurs (Google Drive, SharePoint, etc.)
              </p>
            </div>
          )}

          {documentType === 'file' && (
            <div>
              <Label htmlFor="file">Importer un fichier</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="file"
                  type="file"
                  accept=".md,.txt,.html,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.csv,.json,.xml"
                  onChange={handleFileChange}
                />
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              {file && (
                <p className="text-sm text-gray-600 mt-2">
                  Fichier sélectionné: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés : .md, .txt, .html, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .csv, .json, .xml (max 50MB)
              </p>
            </div>
          )}

          {documentType === 'text' && (
            <div>
              <Label htmlFor="content">Contenu (Markdown) *</Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg min-h-[300px] font-mono text-sm"
                required
              />
            </div>
          )}

          {documentType === 'file' && (
            <div>
              <Label htmlFor="content">Contenu / Notes (optionnel)</Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg min-h-[150px] font-mono text-sm"
                placeholder="Ajoutez des notes ou une description du fichier..."
              />
            </div>
          )}

          {documentType === 'external' && (
            <div>
              <Label htmlFor="content">Description du lien externe</Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg min-h-[150px]"
                placeholder="Ajoutez une description ou des instructions pour accéder au document..."
              />
            </div>
          )}

          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  className="px-3 py-1 rounded-full text-sm transition-all"
                  style={{
                    backgroundColor: selectedTags.includes(tag.name) ? tag.color : tag.color + '20',
                    color: selectedTags.includes(tag.name) ? 'white' : tag.color,
                    border: `1px solid ${tag.color}`,
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Nouveau tag..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewTag())}
              />
              <Button type="button" variant="outline" onClick={handleAddNewTag}>
                Ajouter
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
