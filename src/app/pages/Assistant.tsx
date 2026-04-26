import { AIAssistant } from '../components/AIAssistant';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';

export function Assistant() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <AIAssistant mode="page" />
    </div>
  );
}
