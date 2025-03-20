
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getItsPaidService, PaymentMethod } from '@/services/itsPaid';

interface CardPushFormProps {
  amount: number;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export const CardPushForm = ({ amount, onSuccess, onError }: CardPushFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Form validation
      if (!cardNumber || !expirationMonth || !expirationYear || !recipientName) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }

      // Card validation
      if (cardNumber.length < 15 || cardNumber.length > 19) {
        toast.error('Invalid card number');
        setLoading(false);
        return;
      }

      // Initialize the service with configuration
      const itsPaidService = await getItsPaidService();

      // Format data for card push
      const transactionData = {
        SEND_METHOD: 'CARD_PUSH' as PaymentMethod, // Type cast as PaymentMethod
        SEND_CURRENCY_ISO3: 'USD',
        SEND_AMOUNT: amount,
        RECIPIENT_FULL_NAME: recipientName,
        RECIPIENT_CARD_NUMBER: cardNumber.replace(/\s/g, ''),
        RECIPIENT_CARD_EXPIRATION_MONTH: expirationMonth,
        RECIPIENT_CARD_EXPIRATION_YEAR: expirationYear,
        RECIPIENT_CARD_CVV: cvv,
        PUBLIC_TRANSACTION_DESCRIPTION: description || `Card transfer of $${amount}`,
      };

      // Send the payment
      const response = await itsPaidService.sendMoney(transactionData);
      
      toast.success('Card push payment initiated successfully');
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
            <Label htmlFor="recipientName">Recipient Name</Label>
            <Input
              id="recipientName"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="expirationMonth">Month</Label>
              <Input
                id="expirationMonth"
                value={expirationMonth}
                onChange={(e) => setExpirationMonth(e.target.value)}
                placeholder="MM"
                maxLength={2}
                required
              />
            </div>

            <div>
              <Label htmlFor="expirationYear">Year</Label>
              <Input
                id="expirationYear"
                value={expirationYear}
                onChange={(e) => setExpirationYear(e.target.value)}
                placeholder="YYYY"
                maxLength={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={4}
                type="password"
              />
            </div>
          </div>

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
              `Send $${amount} to Card`
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
