
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PayoutMethodSelector } from './PayoutMethodSelector';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface PayoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const PayoutModal = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}: PayoutModalProps) => {
  const [amount, setAmount] = useState<string>('');
  const [showPaymentMethods, setShowPaymentMethods] = useState<boolean>(false);
  const { toast } = useToast();

  const handleContinue = () => {
    // Validate amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero",
        variant: "destructive"
      });
      return;
    }

    setShowPaymentMethods(true);
  };

  const handleReset = () => {
    setAmount('');
    setShowPaymentMethods(false);
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      // Record the transaction in the database
      const { error } = await supabase
        .from('marqeta_transactions')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user?.id,
          amount: Number(amount),
          currency: 'USD',
          status: 'pending',
          merchant_name: 'Payout',
          transaction_type: 'payout',
          description: 'Fund transfer',
          payment_method: response.TRANSACTION_SEND_METHOD || 'bank_transfer',
          metadata: response
        }]);

      if (error) {
        console.error('Error recording transaction:', error);
      }

      toast({
        title: "Payout Initiated",
        description: "Your payout has been successfully initiated",
      });

      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
      handleReset();
    } catch (err) {
      console.error('Error processing payout:', err);
      toast({
        title: "Error",
        description: "There was an error processing your payout",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) handleReset();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{showPaymentMethods ? "Select Payment Method" : "Initialize Payout"}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {!showPaymentMethods ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleContinue} 
                className="w-full bg-[#1AA47B] hover:bg-[#19363B]"
              >
                Continue
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <Label>Amount:</Label>
                  <span className="text-xl font-bold">${parseFloat(amount).toFixed(2)}</span>
                </div>
              </div>
              
              <PayoutMethodSelector 
                amount={Number(amount)}
                onSuccess={handlePaymentSuccess}
                onError={(error) => {
                  toast({
                    title: "Payment Failed",
                    description: "There was an error processing your payment",
                    variant: "destructive"
                  });
                }}
              />
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setShowPaymentMethods(false)}
              >
                Back
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
