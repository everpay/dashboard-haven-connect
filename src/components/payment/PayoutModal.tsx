
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PayoutMethodSelector } from './PayoutMethodSelector';
import { supabase } from '@/lib/supabase';
import { useGeoRestriction } from '@/hooks/useGeoRestriction';
import { getItsPaidService } from '@/services/itsPaid';
import { prometeoService } from '@/services/prometeo/PrometeoService';
import { TransactionData } from '@/services/itsPaid/types';

interface PayoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('ach');
  const [isLoading, setIsLoading] = useState(false);
  const { isNorthAmerica, isLatinAmerica } = useGeoRestriction();

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    recipientName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    swiftCode: '',
    description: '',
    email: ''
  });

  // Reset the form when opening/closing the modal
  useEffect(() => {
    if (!open) {
      // Reset form on close
      setFormData({
        amount: '',
        recipientName: '',
        accountNumber: '',
        routingNumber: '',
        bankName: '',
        swiftCode: '',
        description: '',
        email: ''
      });
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayoutMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Select which payment API to use based on the user's location
      const paymentApi = isLatinAmerica ? 'prometeo' : 'itspaid';
      let result;

      if (paymentApi === 'prometeo') {
        // Use Prometeo for Latin America
        // In a real implementation, we would use the Prometeo API to process the payment
        result = {
          status: 'processing',
          id: `PT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          amount: parseFloat(formData.amount)
        };
      } else {
        // Use ItsPaid for North America
        const itsPaidService = await getItsPaidService();
        
        // Format the payout data for ItsPaid - now properly typed as TransactionData
        const transactionData: Partial<TransactionData> = {
          SEND_METHOD: paymentMethod.toUpperCase() as any,
          SEND_CURRENCY_ISO3: 'USD',
          SEND_AMOUNT: parseFloat(formData.amount),
          RECIPIENT_FULL_NAME: formData.recipientName,
          PUBLIC_TRANSACTION_DESCRIPTION: formData.description || `Payment of $${formData.amount} via ${paymentMethod.toUpperCase()}`,
        };

        // Add appropriate fields based on payment method
        if (paymentMethod === 'zelle') {
          transactionData.RECIPIENT_ZELLE_ADDRESS = formData.email || formData.accountNumber;
        } else {
          transactionData.RECIPIENT_BANK_ACCOUNT = formData.accountNumber;
          transactionData.RECIPIENT_BANK_ROUTING = formData.routingNumber;
          transactionData.RECIPIENT_BANK_NAME = formData.bankName;
        }
        
        // In development, we'll bypass the actual API call and return mock data
        // In production, we would use: 
        // result = await itsPaidService.sendMoney(transactionData);
        result = {
          TRANSACTION_ID: `ITX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          TRANSACTION_STATUS: 'PENDING',
          TRANSACTION_SEND_AMOUNT: parseFloat(formData.amount),
          TRANSACTION_SEND_METHOD: paymentMethod.toUpperCase(),
          TRANSACTION_CURRENCY_ISO3: 'USD'
        };
      }

      // Save transaction to database
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .insert([
          {
            amount: formData.amount,
            currency: 'USD',
            payment_method: paymentMethod,
            description: formData.description || `Payment to ${formData.recipientName}`,
            status: 'pending',
            transaction_type: 'payout',
            metadata: {
              provider: paymentApi,
              RECIPIENT_FULL_NAME: formData.recipientName,
              ...result
            }
          }
        ]);

      if (error) throw error;

      toast({
        title: "Payout initiated",
        description: `Your ${paymentMethod.toUpperCase()} payment of $${formData.amount} has been submitted.`,
      });

      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);

    } catch (error) {
      console.error('Error creating payout:', error);
      toast({
        title: "Error",
        description: "There was a problem initiating your payout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Payout</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <PayoutMethodSelector 
            value={paymentMethod} 
            onChange={handlePayoutMethodChange}
            region={isLatinAmerica ? 'latinAmerica' : 'northAmerica'}
          />

          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              name="recipientName"
              placeholder="John Doe"
              value={formData.recipientName}
              onChange={handleInputChange}
              required
            />
          </div>

          {paymentMethod === 'zelle' ? (
            <div className="space-y-2">
              <Label htmlFor="email">Zelle Email or Phone Number</Label>
              <Input
                id="email"
                name="email"
                placeholder="recipient@example.com or +1234567890"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  placeholder={isLatinAmerica ? "Banco do Brasil" : "Bank of America"}
                  value={formData.bankName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  placeholder="000123456789"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="routingNumber">
                  {isLatinAmerica ? 'Agency Number' : 'Routing Number'}  
                </Label>
                <Input
                  id="routingNumber"
                  name="routingNumber"
                  placeholder={isLatinAmerica ? "1234" : "021000021"}
                  value={formData.routingNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {isLatinAmerica && (
                <div className="space-y-2">
                  <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                  <Input
                    id="swiftCode"
                    name="swiftCode"
                    placeholder="BOFAUS3N"
                    value={formData.swiftCode}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              name="description"
              placeholder="Payment for services"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-[#1AA47B]"
            >
              {isLoading ? 'Processing...' : 'Send Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
