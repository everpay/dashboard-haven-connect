
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';

interface CardActionsProps {
  onAddCard: () => void;
  onCreateVirtualCard: () => void;
  isCreatingCard: boolean;
  isInline?: boolean;
}

const CardActions: React.FC<CardActionsProps> = ({ 
  onAddCard, 
  onCreateVirtualCard, 
  isCreatingCard,
  isInline = false
}) => {
  return (
    <div className={`flex ${isInline ? 'flex-row' : 'flex-col sm:flex-row'} gap-2`}>
      <Button 
        onClick={onAddCard} 
        className="bg-[#1AA47B] hover:bg-[#19363B]"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Card
      </Button>
      <Button 
        onClick={onCreateVirtualCard} 
        className="bg-[#1AA47B] hover:bg-[#19363B]"
        disabled={isCreatingCard}
      >
        {isCreatingCard ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Create Virtual Card
          </>
        )}
      </Button>
    </div>
  );
};

export default CardActions;
