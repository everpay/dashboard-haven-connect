
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VGSPaymentForm } from '@/components/payment/VGSPaymentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { CopyIcon, Share2Icon, PlusIcon, CheckIcon } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';
import { withValidation } from '@/lib/zodMiddleware';
import { Badge } from '@/components/ui/badge';

// Define payment link schema
const paymentLinkSchema = z.object({
  amount: z.string()
    .min(1, "Amount is required")
    .refine(val => !isNaN(Number(val)), "Amount must be a number")
    .refine(val => Number(val) > 0, "Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  customerEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  customerName: z.string().optional(),
});

type PaymentLinkFormValues = z.infer<typeof paymentLinkSchema>;

const PaymentLink = () => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('create');
  const [paymentId, setPaymentId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const handleCreatePaymentLink = async () => {
    const formData: PaymentLinkFormValues = {
      amount,
      description,
      customerEmail,
      customerName
    };

    withValidation(
      paymentLinkSchema,
      async (validatedData) => {
        try {
          setFormErrors({});
          const paymentId = uuidv4();
          
          const { data, error } = await supabase
            .from('payment_links')
            .insert([
              { 
                id: paymentId,
                amount: parseFloat(validatedData.amount),
                description: validatedData.description,
                customer_email: validatedData.customerEmail,
                customer_name: validatedData.customerName,
                status: 'pending',
                merchant_id: (await supabase.auth.getUser()).data.user?.id
              }
            ]);

          if (error) {
            throw error;
          }

          const baseUrl = window.location.origin;
          const link = `${baseUrl}/payment/${paymentId}`;
          
          setGeneratedLink(link);
          setPaymentId(paymentId);
          setActiveTab('share');
          
          toast.success("Payment link created successfully");
        } catch (error: any) {
          console.error('Error creating payment link:', error);
          toast.error(error.message || "Failed to create payment link");
        }
      },
      (error) => {
        setFormErrors(error.errors);
        const errorMessages = Object.values(error.errors)
          .flat()
          .filter(Boolean)
          .join(', ');
          
        toast.error(errorMessages || "Please check the form fields");
      }
    )(formData);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Payment link copied to clipboard");
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error("Failed to copy link");
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
        
        toast.success("Payment link shared successfully");
      } else {
        copyToClipboard();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Helper to show field error
  const getFieldError = (field: string) => {
    return formErrors[field] && formErrors[field].length > 0 ? (
      <p className="text-xs text-red-500 mt-1">{formErrors[field][0]}</p>
    ) : null
  }

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
                    className={formErrors.amount ? 'border-red-500' : ''}
                  />
                  {getFieldError('amount')}
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Payment for services"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={formErrors.description ? 'border-red-500' : ''}
                  />
                  {getFieldError('description')}
                </div>
                
                <div>
                  <Label htmlFor="customerName">Customer Name (Optional)</Label>
                  <Input 
                    id="customerName" 
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={formErrors.customerName ? 'border-red-500' : ''}
                  />
                  {getFieldError('customerName')}
                </div>
                
                <div>
                  <Label htmlFor="customerEmail">Customer Email (Optional)</Label>
                  <Input 
                    id="customerEmail" 
                    type="email"
                    placeholder="customer@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className={formErrors.customerEmail ? 'border-red-500' : ''}
                  />
                  {getFieldError('customerEmail')}
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
                  <div className="mt-2">
                    <Badge variant="success">Ready to Share</Badge>
                  </div>
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
                    setFormErrors({});
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
              toast.success("Test payment successful");
            }}
            onError={(error) => {
              console.error('Payment failed:', error);
              toast.error("Test payment failed");
            }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentLink;
