
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2, DollarSign } from 'lucide-react';
import { FinupService } from '@/services/FinupService';

interface FundCardFormProps {
  cardToken: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const FundCardForm: React.FC<FundCardFormProps> = ({
  cardToken,
  onSuccess,
  onCancel
}) => {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await FinupService.fundCard(cardToken, parseFloat(amount));
      
      toast({
        title: "Card funded",
        description: `Successfully added $${parseFloat(amount).toFixed(2)} to your card.`
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error funding card:', error);
      toast({
        title: "Failed to fund card",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="bg-[#1AA47B] hover:bg-[#19363B]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Fund Card'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
