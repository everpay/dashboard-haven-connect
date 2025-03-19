
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PayoutMethodSelector } from './PayoutMethodSelector';
import { toast } from "sonner";
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
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    // Validate amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than zero");
      toast.error("Invalid amount", {
        description: "Please enter a valid amount greater than zero"
      });
      return;
    }

    setError(null);
    setShowPaymentMethods(true);
  };

  const handleReset = () => {
    setAmount('');
    setShowPaymentMethods(false);
    setError(null);
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      // Record the transaction in the database
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('marqeta_transactions')
        .insert([{
          user_id: userData.user?.id,
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

      toast.success("Payout Initiated", {
        description: "Your payout has been successfully initiated"
      });

      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
      handleReset();
    } catch (err) {
      console.error('Error processing payout:', err);
      toast.error("Error", {
        description: "There was an error processing your payout"
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
          <DialogDescription>
            {showPaymentMethods 
              ? "Choose how you want to send your money" 
              : "Enter the amount you want to send"}
          </DialogDescription>
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
                  className={error ? "border-red-500" : ""}
                />
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
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
                  console.error("Payment error:", error);
                  toast.error("Payment Failed", {
                    description: "There was an error processing your payment"
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
