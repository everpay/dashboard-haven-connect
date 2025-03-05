
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getItsPaidService, PaymentMethod } from '@/services/ItsPaidService';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Form validation
      if (!recipientName || !accountNumber || !routingNumber) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }

      // Initialize the service with configuration
      const itsPaidService = await getItsPaidService();

      // Format data based on the selected payment method
      const transactionData = {
        SEND_METHOD: selectedMethod,
        SEND_CURRENCY_ISO3: 'USD',
        SEND_AMOUNT: amount,
        RECIPIENT_FULL_NAME: recipientName,
        RECIPIENT_BANK_ACCOUNT: accountNumber,
        RECIPIENT_BANK_ROUTING: routingNumber,
        RECIPIENT_BANK_NAME: bankName,
        PUBLIC_TRANSACTION_DESCRIPTION: description || `Payment of $${amount}`,
      };

      // Send the payment
      const response = await itsPaidService.sendMoney(transactionData);
      
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
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="paymentType">Payment Method</Label>
            <Select 
              value={selectedMethod} 
              onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
            >
              <SelectTrigger id="paymentType">
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
                />
              </div>

              <div>
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
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
