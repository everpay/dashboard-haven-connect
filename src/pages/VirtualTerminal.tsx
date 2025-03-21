
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, AlertCircle, Bank } from "lucide-react";
import { VGSPaymentForm } from "@/components/payment/VGSPaymentForm";
import { toast } from "sonner";
import { BankDetailsForm } from "@/components/payment/BankDetailsForm";

const VirtualTerminal = () => {
  const [activeTab, setActiveTab] = useState("credit-card");
  const [amount, setAmount] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [vgsOpen, setVgsOpen] = useState(false);
  
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
    setVgsOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Virtual Terminal</h1>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Secure Payment Processing</AlertTitle>
          <AlertDescription>
            All card details are processed securely and never stored on our servers.
          </AlertDescription>
        </Alert>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Process Payment</CardTitle>
            <CardDescription>Accept payments via credit card or bank account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      placeholder="0.00"
                      value={amount}
                      onChange={handleAmountChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Customer Email</Label>
                    <Input
                      id="customerEmail"
                      placeholder="customer@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Payment for services"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <Tabs defaultValue="credit-card" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="credit-card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit Card
                  </TabsTrigger>
                  <TabsTrigger value="bank-account" className="flex items-center gap-2">
                    <Bank className="h-4 w-4" />
                    Bank Account
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="credit-card" className="pt-4">
                  <div className="text-center">
                    <Button 
                      onClick={handleSubmitCard}
                      className="bg-[#1AA47B] w-full md:w-auto"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Process Card Payment
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="bank-account" className="pt-4">
                  <BankDetailsForm />
                  <div className="mt-4 text-center">
                    <Button 
                      onClick={handleSubmitBank}
                      className="bg-[#1AA47B] w-full md:w-auto"
                    >
                      <Bank className="mr-2 h-4 w-4" />
                      Process Bank Payment
                    </Button>
                  </div>
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
