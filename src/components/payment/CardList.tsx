
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign, Eye, EyeOff, Loader2 } from 'lucide-react';

interface CardListProps {
  cards: any[] | undefined;
  isLoading: boolean;
  error: any;
  onFundCard: (cardToken: string) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, isLoading, error, onFundCard }) => {
  const [revealedCardIndexes, setRevealedCardIndexes] = useState<{ [key: number]: boolean }>({});

  const toggleCardReveal = (index: number) => {
    setRevealedCardIndexes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatCardToken = (token: string) => {
    // Extract the last 4 digits or characters from the token
    const last4 = token.slice(-4);
    return last4;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#1AA47B]" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          Failed to load cards. Please try again.
        </div>
      </Card>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="col-span-full text-center p-12 border border-dashed rounded-lg">
        <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No cards found</h3>
        <p className="text-gray-500 mb-4">You haven't created any cards yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card: any, index: number) => (
        <Card key={card.id} className="p-6 relative overflow-hidden">
          <div className="flex justify-between mb-8">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <span className="font-medium">{card.card_type || 'Virtual'} Card</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {card.status || 'Active'}
            </span>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-5 rounded-lg text-white shadow-md mb-4">
            <div className="flex justify-between mb-8">
              <div>
                <p className="text-xs opacity-80">Card Number</p>
                <p className="font-mono">
                  •••• •••• •••• {revealedCardIndexes[index] ? "1234" : formatCardToken(card.card_token)}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2 text-white h-5 w-5"
                    onClick={() => toggleCardReveal(index)}
                  >
                    {revealedCardIndexes[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </Button>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Expires</p>
                <p>{card.expiration || 'MM/YY'}</p>
              </div>
            </div>
            <p className="uppercase text-sm">Virtual Card</p>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>Created {new Date(card.created_at).toLocaleDateString()}</span>
            <div className="space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-auto"
                onClick={() => onFundCard(card.card_token)}
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Fund
              </Button>
              <Button variant="link" size="sm" className="p-0 h-auto">Manage</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CardList;
