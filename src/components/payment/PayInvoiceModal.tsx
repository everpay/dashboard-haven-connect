
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { VGSPaymentForm } from './VGSPaymentForm';
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Globe, BanknoteIcon, QrCodeIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PayInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  onPaymentSuccess: () => void;
}

export const PayInvoiceModal = ({ 
  open, 
  onOpenChange, 
  invoice, 
  onPaymentSuccess 
}: PayInvoiceModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('credit-card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const handlePaymentSuccess = async (response: any) => {
    setIsProcessing(true);
    
    try {
      // Update invoice status in the database
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'Paid' })
        .eq('id', invoice.id);

      if (error) throw error;
      
      // Record the transaction
      await supabase
        .from('marqeta_transactions')
        .insert([{
          user_id: invoice.merchant_id,
          amount: invoice.total_amount,
          currency: 'USD',
          status: 'Completed',
          merchant_name: 'Invoice Payment',
          transaction_type: 'payment',
          description: `Payment for invoice #INV-${String(invoice.id).padStart(5, '0')}`,
          payment_method: getPaymentMethodName(),
          card_type: paymentMethod === 'credit-card' ? 'Credit Card' : 'Other'
        }]);
      
      toast({
        title: "Payment Successful",
        description: "Your invoice has been paid successfully",
      });
      
      onPaymentSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error('Error processing payment:', err);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'credit-card': return 'Credit Card';
      case 'bank-transfer': return 'Bank Transfer';
      case 'local-payment': return 'Local Payment Method';
      case 'crypto': return 'Cryptocurrency';
      default: return 'Other';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay Invoice</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-gray-900">Invoice Details</h3>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Invoice Number:</span>
                <span>INV-{String(invoice?.id || '').padStart(5, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">${invoice?.total_amount?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span>
                <span>{invoice?.customer_name || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="credit-card" onValueChange={setPaymentMethod}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="credit-card" className="flex flex-col items-center py-2">
                <CreditCard className="h-4 w-4 mb-1" />
                <span className="text-xs">Card</span>
              </TabsTrigger>
              <TabsTrigger value="bank-transfer" className="flex flex-col items-center py-2">
                <BanknoteIcon className="h-4 w-4 mb-1" />
                <span className="text-xs">Bank</span>
              </TabsTrigger>
              <TabsTrigger value="local-payment" className="flex flex-col items-center py-2">
                <Globe className="h-4 w-4 mb-1" />
                <span className="text-xs">Local</span>
              </TabsTrigger>
              <TabsTrigger value="crypto" className="flex flex-col items-center py-2">
                <QrCodeIcon className="h-4 w-4 mb-1" />
                <span className="text-xs">Crypto</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="credit-card">
              <VGSPaymentForm 
                formId="invoice-payment"
                amount={invoice?.total_amount || 0}
                buttonText="Pay Invoice"
                onSuccess={handlePaymentSuccess}
                onError={(error) => {
                  console.error('Payment error:', error);
                  toast({
                    title: "Payment Failed",
                    description: "There was an error processing your payment",
                    variant: "destructive"
                  });
                }}
              />
            </TabsContent>
            
            <TabsContent value="bank-transfer">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-2">Bank Transfer Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank Name:</span>
                    <span>EverPay Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Number:</span>
                    <span>XXXX-XXXX-XXXX-1234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Routing Number:</span>
                    <span>123456789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference:</span>
                    <span>INV-{String(invoice?.id || '').padStart(5, '0')}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-xs text-gray-500">
                  Please include the invoice number in the reference field when making your transfer.
                  Once we receive your payment, your invoice will be marked as paid.
                </p>
                <Button 
                  className="w-full mt-4 bg-[#1AA47B] hover:bg-[#19363B]"
                  onClick={() => handlePaymentSuccess({})}
                >
                  I've Made This Payment
                </Button>
              </Card>
            </TabsContent>
            
            <TabsContent value="local-payment">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-2">Local Payment Methods</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['Ideal', 'Sofort', 'Alipay', 'WeChat Pay', 'Boleto', 'Oxxo'].map((method) => (
                    <div key={method} className="border rounded p-2 text-center cursor-pointer hover:bg-gray-50">
                      <div className="w-full h-8 bg-gray-100 rounded mb-1"></div>
                      <span className="text-xs">{method}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4 bg-[#1AA47B] hover:bg-[#19363B]"
                  onClick={() => handlePaymentSuccess({})}
                >
                  Continue to Payment
                </Button>
              </Card>
            </TabsContent>
            
            <TabsContent value="crypto">
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-2">Cryptocurrency Payment</h3>
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCodeIcon className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-500 mb-1">Send exactly</p>
                  <p className="font-medium">0.00347 BTC</p>
                  <p className="text-xs text-gray-500 mt-1">to address</p>
                  <p className="text-xs overflow-ellipsis overflow-hidden">3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5</p>
                </div>
                <Button 
                  className="w-full mt-4 bg-[#1AA47B] hover:bg-[#19363B]"
                  onClick={() => handlePaymentSuccess({})}
                >
                  I've Made This Payment
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
