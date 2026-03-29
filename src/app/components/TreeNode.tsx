import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight, ChevronDown, FileText, Folder, ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';
import { Document, getCategoryColor } from '../data/mockDocuments';

interface TreeNodeProps {
  label: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
  count?: number;
  color?: string;
}

export function TreeNode({ label, children, defaultExpanded = false, icon, count, color }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = !!children;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          hasChildren ? 'cursor-pointer hover:bg-gray-50' : ''
        }`}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <button className="p-0 hover:bg-transparent">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        {icon ? (
          <div className={`w-6 h-6 rounded flex items-center justify-center ${color || 'bg-gray-100'}`}>
            {icon}
          </div>
        ) : (
          <Folder className="h-5 w-5 text-gray-400" />
        )}
        <span className="font-medium text-gray-900 flex-1">{label}</span>
        {count !== undefined && (
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        )}
      </div>
      {isExpanded && children && <div className="ml-6 mt-1 space-y-1">{children}</div>}
    </div>
  );
}

interface DocumentNodeProps {
  document: Document;
}

export function DocumentNode({ document }: DocumentNodeProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="w-4" />
      <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
      {document.isExternal ? (
        <a
          href={document.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-sm text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1"
        >
          <span className="truncate">{document.title}</span>
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </a>
      ) : (
        <Link
          to={`/docs/${document.category}/${document.id}`}
          className="flex-1 text-sm text-gray-700 hover:text-blue-600 transition-colors truncate"
        >
          {document.title}
        </Link>
      )}
      <Badge className={`${getCategoryColor(document.category)} text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity`}>
        {document.category === 'functional' && 'Func'}
        {document.category === 'technical' && 'Tech'}
        {document.category === 'user' && 'User'}
      </Badge>
    </div>
  );
}
