
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VGSPaymentForm } from '@/components/payment/VGSPaymentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { CopyIcon, Share2Icon, PlusIcon, CheckIcon } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

const PaymentLink = () => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('create');
  const [paymentId, setPaymentId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const handleCreatePaymentLink = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        toast({
          title: "Error",
          description: "Please enter a valid amount",
          variant: "destructive"
        });
        return;
      }

      // Generate a unique payment ID
      const paymentId = uuidv4();
      
      // Create a payment record in the database
      const { data, error } = await supabase
        .from('payment_links')
        .insert([
          { 
            id: paymentId,
            amount: parseFloat(amount),
            description,
            customer_email: customerEmail,
            customer_name: customerName,
            status: 'pending',
            merchant_id: (await supabase.auth.getUser()).data.user?.id
          }
        ]);

      if (error) {
        console.error('Error creating payment link:', error);
        toast({
          title: "Error",
          description: "Failed to create payment link",
          variant: "destructive"
        });
        return;
      }

      // Generate the payment link
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/payment/${paymentId}`;
      
      setGeneratedLink(link);
      setPaymentId(paymentId);
      setActiveTab('share');
      
      toast({
        title: "Success",
        description: "Payment link created successfully",
      });
    } catch (error) {
      console.error('Error creating payment link:', error);
      toast({
        title: "Error",
        description: "Failed to create payment link",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Payment link copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Payment Link',
          text: `Payment request for $${amount} - ${description}`,
          url: generatedLink,
        });
        
        toast({
          title: "Shared",
          description: "Payment link shared successfully",
        });
      } else {
        // Fallback to clipboard if Web Share API is not available
        copyToClipboard();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Links</h1>
          <p className="text-gray-500">Create and share payment links with your customers</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Link</TabsTrigger>
            <TabsTrigger value="share" disabled={!generatedLink}>Share Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create Payment Link</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Payment for services"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerName">Customer Name (Optional)</Label>
                  <Input 
                    id="customerName" 
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="customerEmail">Customer Email (Optional)</Label>
                  <Input 
                    id="customerEmail" 
                    type="email"
                    placeholder="customer@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleCreatePaymentLink}
                  className="w-full bg-[#1AA47B] hover:bg-[#19363B]"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Payment Link
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="share">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Share Payment Link</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Payment Details:</p>
                  <p>Amount: ${parseFloat(amount).toFixed(2)}</p>
                  {description && <p>Description: {description}</p>}
                  {customerName && <p>Customer: {customerName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="paymentLink">Payment Link</Label>
                  <div className="flex mt-1">
                    <Input 
                      id="paymentLink" 
                      value={generatedLink}
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      onClick={copyToClipboard}
                    >
                      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={copyToClipboard}
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  
                  <Button
                    className="flex-1 bg-[#1AA47B] hover:bg-[#19363B]"
                    onClick={handleShare}
                  >
                    <Share2Icon className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setActiveTab('create');
                    setAmount('');
                    setDescription('');
                    setCustomerEmail('');
                    setCustomerName('');
                    setGeneratedLink('');
                  }}
                >
                  Create Another Link
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Payment Form</h2>
          <p className="text-sm text-gray-500 mb-4">Test the payment form that your customers will see</p>
          
          <VGSPaymentForm 
            formId="test-payment" 
            amount={parseFloat(amount) || 10.00}
            onSuccess={(response) => {
              console.log('Payment successful:', response);
            }}
            onError={(error) => {
              console.error('Payment failed:', error);
            }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentLink;
