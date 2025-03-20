
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Building, Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useGeoRestriction, REGIONS } from '@/hooks/useGeoRestriction';
import { supabase } from '@/lib/supabase';

interface PayinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: (newPayin: any) => void;
}

interface PayinData {
  id: string;
  transaction_id: string;
  source: string;
  method: string;
  date: string;
  status: string;
  amount: number;
  description: string;
  customer_name: string;
  customer_email: string;
  payment_processor: string;
  currency: string;
  fee: number;
}

export const PayinModal: React.FC<PayinModalProps> = ({
  open,
  onOpenChange,
  onPaymentSuccess
}) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { userCountry, isNorthAmerica, isLatinAmerica } = useGeoRestriction();
  
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    amount: ''
  });
  const [bankForm, setBankForm] = useState({
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    amount: ''
  });
  const [alternativeForm, setAlternativeForm] = useState({
    amount: '',
    method: isLatinAmerica ? 'pix' : 'pix',
    email: ''
  });

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBankInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAlternativeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAlternativeForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Determine which payment processor to use based on user location
      const paymentProcessor = isLatinAmerica ? 'Prometeo' : 'ItsPaid';
      
      // Get form data based on payment method
      let paymentData = {};
      let amount = 0;
      let method = '';
      let description = '';
      
      if (paymentMethod === 'credit-card') {
        paymentData = cardForm;
        amount = parseFloat(cardForm.amount);
        method = 'Credit Card';
        description = `Card payment by ${cardForm.name}`;
      } else if (paymentMethod === 'bank-transfer') {
        paymentData = bankForm;
        amount = parseFloat(bankForm.amount);
        method = 'Bank Transfer';
        description = `Bank transfer from ${bankForm.accountName}`;
      } else {
        paymentData = alternativeForm;
        amount = parseFloat(alternativeForm.amount);
        method = alternativeForm.method;
        description = `Alternative payment via ${alternativeForm.method.toUpperCase()}`;
      }

      // Create transaction record
      const newPayin: PayinData = {
        id: `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        transaction_id: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        source: method,
        method: method,
        date: new Date().toISOString(),
        status: "Processing",
        amount: amount,
        description: description,
        customer_name: paymentMethod === 'credit-card' ? cardForm.name : 
                       paymentMethod === 'bank-transfer' ? bankForm.accountName : "Customer",
        customer_email: paymentMethod === 'alternative' ? alternativeForm.email : "customer@example.com",
        payment_processor: paymentProcessor,
        currency: "USD",
        fee: parseFloat((amount * 0.029 + 0.30).toFixed(2)) // Sample fee calculation
      };

      // Save to database
      const { data, error } = await supabase
        .from('marqeta_transactions')
        .insert([
          {
            id: newPayin.id,
            amount: newPayin.amount.toString(),
            currency: newPayin.currency,
            status: newPayin.status.toLowerCase(),
            merchant_name: newPayin.customer_name,
            payment_method: newPayin.method,
            description: newPayin.description,
            transaction_type: 'payin',
            metadata: {
              payment_processor: newPayin.payment_processor,
              payment_data: paymentData
            }
          }
        ]);

      if (error) throw error;

      toast({
        title: "Payment Initiated",
        description: `Your ${method} payment of ${newPayin.amount.toFixed(2)} has been submitted.`,
      });

      onPaymentSuccess(newPayin);
      onOpenChange(false);
      resetForms();
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForms = () => {
    setCardForm({
      cardNumber: '',
      expiry: '',
      cvc: '',
      name: '',
      amount: ''
    });
    setBankForm({
      accountName: '',
      accountNumber: '',
      routingNumber: '',
      bankName: '',
      amount: ''
    });
    setAlternativeForm({
      amount: '',
      method: isLatinAmerica ? 'pix' : 'pix',
      email: ''
    });
  };

  // Determine which alternative payment methods to show based on region
  const getAlternativePaymentMethods = () => {
    if (isLatinAmerica) {
      return [
        { value: 'pix', label: 'PIX (Brazil)' },
        { value: 'oxxo', label: 'OXXO (Mexico)' },
        { value: 'boleto', label: 'Boleto (Brazil)' }
      ];
    }
    
    return [
      { value: 'apple_pay', label: 'Apple Pay' },
      { value: 'google_pay', label: 'Google Pay' },
      { value: 'venmo', label: 'Venmo' }
    ];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Payin</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="credit-card" onValueChange={setPaymentMethod} className="w-full mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="credit-card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Card</span>
            </TabsTrigger>
            <TabsTrigger value="bank-transfer" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Bank</span>
            </TabsTrigger>
            <TabsTrigger value="alternative" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>Alternative</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="credit-card">
            <form onSubmit={handlePayment} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={cardForm.amount}
                  onChange={handleCardInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={cardForm.name}
                  onChange={handleCardInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={cardForm.cardNumber}
                  onChange={handleCardInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    value={cardForm.expiry}
                    onChange={handleCardInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    name="cvc"
                    placeholder="123"
                    value={cardForm.cvc}
                    onChange={handleCardInputChange}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing} className="bg-[#1AA47B]">
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="bank-transfer">
            <form onSubmit={handlePayment} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="bankAmount">Amount (USD)</Label>
                <Input
                  id="bankAmount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={bankForm.amount}
                  onChange={handleBankInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  placeholder={isLatinAmerica ? "Banco do Brasil" : "Bank of America"}
                  value={bankForm.bankName}
                  onChange={handleBankInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Holder Name</Label>
                <Input
                  id="accountName"
                  name="accountName"
                  placeholder="John Doe"
                  value={bankForm.accountName}
                  onChange={handleBankInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  placeholder="000123456789"
                  value={bankForm.accountNumber}
                  onChange={handleBankInputChange}
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
                  value={bankForm.routingNumber}
                  onChange={handleBankInputChange}
                  required
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing} className="bg-[#1AA47B]">
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="alternative">
            <form onSubmit={handlePayment} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="altAmount">Amount (USD)</Label>
                <Input
                  id="altAmount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={alternativeForm.amount}
                  onChange={handleAlternativeInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <RadioGroup 
                  value={alternativeForm.method} 
                  onValueChange={(value) => setAlternativeForm(prev => ({ ...prev, method: value }))}
                  className="flex gap-4 flex-wrap"
                >
                  {getAlternativePaymentMethods().map(method => (
                    <div key={method.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={method.value} id={method.value} />
                      <Label htmlFor={method.value}>{method.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  value={alternativeForm.email}
                  onChange={handleAlternativeInputChange}
                  required
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing} className="bg-[#1AA47B]">
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
