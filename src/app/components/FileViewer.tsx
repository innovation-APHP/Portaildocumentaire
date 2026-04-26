import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { MarkdownViewer } from './MarkdownViewer';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FileViewerProps {
  fileUrl: string;
  fileType: string;
  fileName?: string;
  content?: string;
}

export function FileViewer({ fileUrl, fileType, fileName, content }: FileViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError('Impossible de charger le PDF');
    setLoading(false);
  }

  // Markdown files
  if (fileType === 'text/markdown' || fileType === 'text/plain') {
    return <MarkdownViewer content={content || ''} />;
  }

  // PDF files
  if (fileType === 'application/pdf') {
    return (
      <div className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600">Chargement du PDF...</span>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <a
              href={fileUrl}
              download
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Télécharger le fichier
            </a>
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          className="flex flex-col items-center"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="border border-gray-300 shadow-lg"
          />
        </Document>

        {!loading && !error && numPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
            >
              Précédent
            </Button>
            <span className="text-sm text-gray-600">
              Page {pageNumber} sur {numPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
            >
              Suivant
            </Button>
          </div>
        )}

        {!loading && !error && (
          <div className="flex justify-center">
            <a
              href={fileUrl}
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Télécharger le PDF
            </a>
          </div>
        )}
      </div>
    );
  }

  // Office documents (Word, Excel, PowerPoint) - Use Google Docs Viewer
  if (
    fileType === 'application/msword' ||
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/vnd.ms-excel' ||
    fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    fileType === 'application/vnd.ms-powerpoint' ||
    fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : window.location.origin + '/' + fileUrl;
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;

    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Prévisualisation du document Office
          </p>
          <p className="text-xs text-blue-600">
            Si la prévisualisation ne s'affiche pas correctement, téléchargez le fichier.
          </p>
        </div>

        <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <iframe
            src={googleViewerUrl}
            className="w-full h-full"
            title="Document Preview"
          />
        </div>

        <div className="flex justify-center">
          <a
            href={fileUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Télécharger le document
          </a>
        </div>
      </div>
    );
  }

  // Text files (JSON, XML, CSV, etc.)
  if (
    fileType === 'application/json' ||
    fileType === 'text/xml' ||
    fileType === 'application/xml' ||
    fileType === 'text/csv' ||
    fileType === 'text/html'
  ) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <pre className="whitespace-pre-wrap text-sm font-mono overflow-x-auto">
            {content || 'Contenu non disponible'}
          </pre>
        </div>
        <div className="flex justify-center">
          <a
            href={fileUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Télécharger le fichier
          </a>
        </div>
      </div>
    );
  }

  // Images
  if (fileType?.startsWith('image/')) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <img
            src={fileUrl}
            alt={fileName || 'Image'}
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="flex justify-center">
          <a
            href={fileUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Télécharger l'image
          </a>
        </div>
      </div>
    );
  }

  // Default: Download button for unsupported formats
  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-700 mb-2">
        Aperçu non disponible pour ce type de fichier
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Type: {fileType || 'Inconnu'}
      </p>
      <a
        href={fileUrl}
        download
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <Download className="h-4 w-4" />
        Télécharger le fichier
      </a>
    </div>
  );
}
