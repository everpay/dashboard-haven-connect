
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Building, Wallet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PayinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: () => void;
}

export const PayinModal: React.FC<PayinModalProps> = ({
  open,
  onOpenChange,
  onPaymentSuccess
}) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
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
    method: 'pix',
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

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      onPaymentSuccess();
      onOpenChange(false);
      resetForms();
    }, 1500);
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
      method: 'pix',
      email: ''
    });
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
                  placeholder="Bank of America"
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
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  name="routingNumber"
                  placeholder="021000021"
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
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix">PIX (Brazil)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oxxo" id="oxxo" />
                    <Label htmlFor="oxxo">OXXO (Mexico)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="boleto" id="boleto" />
                    <Label htmlFor="boleto">Boleto (Brazil)</Label>
                  </div>
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
