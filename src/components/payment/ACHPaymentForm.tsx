
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getItsPaidService, PaymentMethod } from '@/services/ItsPaidService';
import { useRecipients } from '@/hooks/useRecipients';

interface ACHPaymentFormProps {
  amount: number;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
  paymentMethod?: PaymentMethod;
}

export const ACHPaymentForm = ({ 
  amount, 
  onSuccess, 
  onError,
  paymentMethod = 'ACH'
}: ACHPaymentFormProps) => {
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethod);
  const { addRecipient } = useRecipients();

  // Update selected method when the paymentMethod prop changes
  useEffect(() => {
    setSelectedMethod(paymentMethod);
  }, [paymentMethod]);

  const validateForm = () => {
    // For Zelle, we only need recipient name and account number (email/phone)
    if (selectedMethod === 'ZELLE') {
      if (!recipientName || !accountNumber) {
        toast.error('Please enter recipient name and Zelle email/phone');
        return false;
      }
      return true;
    }
    
    // For other methods, we need recipient name, account number, and routing number
    if (!recipientName) {
      toast.error('Please enter recipient name');
      return false;
    }
    
    if (!accountNumber) {
      toast.error('Please enter account number');
      return false;
    }
    
    if (!routingNumber) {
      toast.error('Please enter routing number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      console.log('Starting payment process...');
      
      // Initialize the service with configuration
      const itsPaidService = await getItsPaidService();

      // Format data based on the selected payment method
      const transactionData: any = {
        SEND_METHOD: selectedMethod,
        SEND_CURRENCY_ISO3: 'USD',
        SEND_AMOUNT: amount,
        RECIPIENT_FULL_NAME: recipientName,
        PUBLIC_TRANSACTION_DESCRIPTION: description || `Payment of $${amount} via ${selectedMethod}`,
      };

      // Add appropriate fields based on payment method
      if (selectedMethod === 'ZELLE') {
        transactionData.RECIPIENT_ZELLE_ADDRESS = accountNumber;
      } else {
        transactionData.RECIPIENT_BANK_ACCOUNT = accountNumber;
        transactionData.RECIPIENT_BANK_ROUTING = routingNumber;
        transactionData.RECIPIENT_BANK_NAME = bankName || 'Unknown Bank';
      }
      
      console.log('Transaction data:', transactionData);

      // Send the payment
      const response = await itsPaidService.sendMoney(transactionData);
      console.log('Payment response:', response);
      
      // Split the recipient name into first and last names
      const nameParts = recipientName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Add the recipient to the recipients database
      try {
        console.log('Adding recipient to database...');
        const recipientData = {
          first_names: firstName,
          last_names: lastName,
          full_name: recipientName,
          email_address: selectedMethod === 'ZELLE' && accountNumber.includes('@') ? accountNumber : undefined,
          telephone_number: selectedMethod === 'ZELLE' && !accountNumber.includes('@') ? accountNumber : undefined,
        };
        
        // Only include these fields if they exist in the database schema
        // Try to add them one at a time to avoid schema errors
        try {
          await supabase.from('recipients').select('bank_account_number').limit(1);
          Object.assign(recipientData, { bank_account_number: selectedMethod !== 'ZELLE' ? accountNumber : undefined });
        } catch (e) {
          console.log('bank_account_number column may not exist, skipping');
        }
        
        try {
          await supabase.from('recipients').select('bank_routing_number').limit(1);
          Object.assign(recipientData, { bank_routing_number: routingNumber || undefined });
        } catch (e) {
          console.log('bank_routing_number column may not exist, skipping');
        }
        
        try {
          await supabase.from('recipients').select('bank_name').limit(1);
          Object.assign(recipientData, { bank_name: bankName || undefined });
        } catch (e) {
          console.log('bank_name column may not exist, skipping');
        }
        
        console.log('Recipient data:', recipientData);
        const result = await addRecipient(recipientData);
        console.log('Recipient added:', result);
      } catch (recipientError) {
        console.error('Error adding recipient:', recipientError);
        // Don't fail the transaction if recipient creation fails
      }
      
      toast.success(`${selectedMethod} payment initiated successfully`);
      onSuccess(response);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 bg-card">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="paymentType">Payment Method</Label>
            <Select 
              value={selectedMethod} 
              onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
            >
              <SelectTrigger id="paymentType" className="bg-background text-foreground">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACH">ACH</SelectItem>
                <SelectItem value="SWIFT">SWIFT</SelectItem>
                <SelectItem value="FEDWIRE">FEDWIRE</SelectItem>
                <SelectItem value="ZELLE">ZELLE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Recipient Name</Label>
            <Input
              id="name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              className="bg-background text-foreground"
            />
          </div>

          {selectedMethod === 'ZELLE' ? (
            <div>
              <Label htmlFor="zelleEmail">Recipient Zelle Email/Phone</Label>
              <Input
                id="zelleEmail"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Email or phone number registered with Zelle"
                required
                className="bg-background text-foreground"
              />
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="bg-background text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  required
                  className="bg-background text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Payment purpose"
              className="bg-background text-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1AA47B] hover:bg-[#19363B]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Send $${amount} via ${selectedMethod}`
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
