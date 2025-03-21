
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, Banknote } from "lucide-react";
import { VGSPaymentForm } from "@/components/payment/VGSPaymentForm";
import { toast } from "sonner";
import { PaymentFormFields } from "@/components/payment/PaymentFormFields";
import { CreditCardPaymentTab } from "@/components/payment/CreditCardPaymentTab";
import { BankAccountPaymentTab } from "@/components/payment/BankAccountPaymentTab";
import { PaymentSecurityAlert } from "@/components/payment/PaymentSecurityAlert";

const VirtualTerminal = () => {
  const [activeTab, setActiveTab] = useState("credit-card");
  const [amount, setAmount] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [vgsOpen, setVgsOpen] = useState(false);
  
  // Bank account form state
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [routingNumber, setRoutingNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
    }
  };
  
  const handleSubmitCard = () => {
    if (!validateForm()) return;
    setVgsOpen(true);
  };
  
  const handleSubmitBank = () => {
    if (!validateForm()) return;
    toast.success("Bank payment processed successfully");
    resetForm();
  };
  
  const handlePaymentSuccess = () => {
    toast.success("Card payment processed successfully");
    resetForm();
  };
  
  const handlePaymentError = (error: any) => {
    toast.error("Payment processing failed");
    console.error("Payment error:", error);
  };
  
  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    
    if (!customerEmail) {
      toast.error("Please enter customer email");
      return false;
    }
    
    if (!customerName) {
      toast.error("Please enter customer name");
      return false;
    }
    
    return true;
  };
  
  const resetForm = () => {
    setAmount("");
    setCustomerEmail("");
    setCustomerName("");
    setDescription("");
    setAccountNumber("");
    setRoutingNumber("");
    setBankName("");
    setVgsOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Virtual Terminal</h1>
        </div>
        
        <PaymentSecurityAlert />
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Process Payment</CardTitle>
            <CardDescription>Accept payments via credit card or bank account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <PaymentFormFields 
                amount={amount}
                customerEmail={customerEmail}
                customerName={customerName}
                description={description}
                onAmountChange={handleAmountChange}
                onCustomerEmailChange={(e) => setCustomerEmail(e.target.value)}
                onCustomerNameChange={(e) => setCustomerName(e.target.value)}
                onDescriptionChange={(e) => setDescription(e.target.value)}
              />
              
              <Separator />
              
              <Tabs defaultValue="credit-card" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="credit-card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit Card
                  </TabsTrigger>
                  <TabsTrigger value="bank-account" className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Bank Account
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="credit-card" className="pt-4">
                  <CreditCardPaymentTab onSubmit={handleSubmitCard} />
                </TabsContent>
                
                <TabsContent value="bank-account" className="pt-4">
                  <BankAccountPaymentTab 
                    accountNumber={accountNumber}
                    routingNumber={routingNumber}
                    bankName={bankName}
                    onAccountNumberChange={setAccountNumber}
                    onRoutingNumberChange={setRoutingNumber}
                    onBankNameChange={setBankName}
                    onSubmit={handleSubmitBank}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start border-t pt-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              All transactions are secure and encrypted
            </div>
          </CardFooter>
        </Card>
        
        <VGSPaymentForm
          formId="virtual-terminal"
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          amount={parseFloat(amount) || 0}
          buttonText="Complete Payment"
          open={vgsOpen}
          onOpenChange={setVgsOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default VirtualTerminal;
