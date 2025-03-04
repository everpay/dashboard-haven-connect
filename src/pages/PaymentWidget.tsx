
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Copy, Download, Globe, Palette, Check } from 'lucide-react';
import { VGSPaymentForm } from '@/components/payment/VGSPaymentForm';
import { supabase } from '@/lib/supabase';

const PaymentWidget = () => {
  const [widgetSettings, setWidgetSettings] = useState({
    amount: '100.00',
    title: 'Payment',
    description: 'Please complete your payment',
    primaryColor: '#1AA47B',
    secondaryColor: '#19363B',
    logo: true,
    customerFields: true,
    paymentMethods: ['card', 'bank_transfer', 'local_payment'],
    successUrl: '',
    cancelUrl: '',
    currency: 'USD'
  });
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setWidgetSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const togglePaymentMethod = (method: string) => {
    setWidgetSettings(prev => {
      const methods = [...prev.paymentMethods];
      if (methods.includes(method)) {
        return {
          ...prev,
          paymentMethods: methods.filter(m => m !== method)
        };
      } else {
        return {
          ...prev,
          paymentMethods: [...methods, method]
        };
      }
    });
  };

  const generateWidgetCode = () => {
    // Save widget configuration to database
    const saveWidget = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        const userId = user.user?.id;
        
        const widgetId = Math.random().toString(36).substring(2, 15);
        
        // In a real implementation, we would save the widget configuration
        // to the database here
        
        // For now, just generate the embed code
        const embedCode = `<script src="https://everpayinc.com/widget.js"></script>
<div id="everpay-widget"></div>
<script>
  EverPay.initializeWidget({
    containerId: 'everpay-widget',
    widgetId: '${widgetId}',
    amount: ${parseFloat(widgetSettings.amount)},
    currency: '${widgetSettings.currency}',
    title: '${widgetSettings.title}',
    description: '${widgetSettings.description}',
    theme: {
      primaryColor: '${widgetSettings.primaryColor}',
      secondaryColor: '${widgetSettings.secondaryColor}',
      showLogo: ${widgetSettings.logo},
    },
    customerFields: ${widgetSettings.customerFields},
    paymentMethods: ${JSON.stringify(widgetSettings.paymentMethods)},
    successUrl: '${widgetSettings.successUrl}',
    cancelUrl: '${widgetSettings.cancelUrl}'
  });
</script>`;
        
        setGeneratedCode(embedCode);

        toast({
          title: "Widget created",
          description: "Your payment widget code has been generated",
        });
      } catch (error) {
        console.error('Error creating widget:', error);
        toast({
          title: "Error",
          description: "Failed to create payment widget",
          variant: "destructive"
        });
      }
    };

    saveWidget();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied",
      description: "Widget code copied to clipboard",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Widget</h1>
          <p className="text-gray-500">Create and customize a payment widget to embed on your website</p>
        </div>
        
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="design">Basic Settings</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Widget Configuration</CardTitle>
                <CardDescription>Set up the basic details for your payment widget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        id="amount" 
                        type="text" 
                        className="pl-8" 
                        value={widgetSettings.amount}
                        onChange={(e) => handleSettingChange('amount', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={widgetSettings.currency}
                      onValueChange={(value) => handleSettingChange('currency', value)}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={widgetSettings.title}
                    onChange={(e) => handleSettingChange('title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={widgetSettings.description}
                    onChange={(e) => handleSettingChange('description', e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="customerFields" 
                    checked={widgetSettings.customerFields}
                    onCheckedChange={(checked) => handleSettingChange('customerFields', checked)}
                  />
                  <Label htmlFor="customerFields">Collect customer information</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how your payment widget looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex space-x-2">
                      <div 
                        className="w-10 h-10 rounded border cursor-pointer" 
                        style={{ backgroundColor: widgetSettings.primaryColor }}
                      ></div>
                      <Input 
                        id="primaryColor" 
                        type="text" 
                        value={widgetSettings.primaryColor}
                        onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex space-x-2">
                      <div 
                        className="w-10 h-10 rounded border cursor-pointer" 
                        style={{ backgroundColor: widgetSettings.secondaryColor }}
                      ></div>
                      <Input 
                        id="secondaryColor" 
                        type="text" 
                        value={widgetSettings.secondaryColor}
                        onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="logo" 
                    checked={widgetSettings.logo}
                    onCheckedChange={(checked) => handleSettingChange('logo', checked)}
                  />
                  <Label htmlFor="logo">Show EverPay logo</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment-methods" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Select which payment methods to accept</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="card" 
                      checked={widgetSettings.paymentMethods.includes('card')}
                      onCheckedChange={() => togglePaymentMethod('card')}
                    />
                    <Label htmlFor="card">Credit/Debit Cards</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="bank_transfer" 
                      checked={widgetSettings.paymentMethods.includes('bank_transfer')}
                      onCheckedChange={() => togglePaymentMethod('bank_transfer')}
                    />
                    <Label htmlFor="bank_transfer">Bank Transfer</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="local_payment" 
                      checked={widgetSettings.paymentMethods.includes('local_payment')}
                      onCheckedChange={() => togglePaymentMethod('local_payment')}
                    />
                    <Label htmlFor="local_payment">Local Payment Methods</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="crypto" 
                      checked={widgetSettings.paymentMethods.includes('crypto')}
                      onCheckedChange={() => togglePaymentMethod('crypto')}
                    />
                    <Label htmlFor="crypto">Cryptocurrency</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure additional widget settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="successUrl">Success URL</Label>
                  <Input 
                    id="successUrl" 
                    type="url" 
                    placeholder="https://your-website.com/success"
                    value={widgetSettings.successUrl}
                    onChange={(e) => handleSettingChange('successUrl', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Redirect customers here after successful payment</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cancelUrl">Cancel URL</Label>
                  <Input 
                    id="cancelUrl" 
                    type="url" 
                    placeholder="https://your-website.com/cancel"
                    value={widgetSettings.cancelUrl}
                    onChange={(e) => handleSettingChange('cancelUrl', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Redirect customers here if they cancel the payment</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setPreviewOpen(true)}
            className="flex items-center"
          >
            <Globe className="mr-2 h-4 w-4" />
            Preview Widget
          </Button>
          
          <div className="space-x-2">
            <Button 
              variant="outline" 
              className="bg-white"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={generateWidgetCode}
              className="bg-[#1AA47B] hover:bg-[#19363B]"
            >
              Generate Widget
            </Button>
          </div>
        </div>
        
        {generatedCode && (
          <Card className="border-[#1AA47B] bg-gray-50">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Embed Code</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="text-[#1AA47B]"
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </CardTitle>
              <CardDescription>
                Add this code to your website where you want the payment widget to appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
                {generatedCode}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Widget Preview</DialogTitle>
            <DialogDescription>
              This is how your payment widget will appear to customers
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md p-4" style={{ backgroundColor: 'white' }}>
            {widgetSettings.logo && (
              <div className="flex justify-center mb-4">
                <img 
                  src="/lovable-uploads/Everpay-icon.png" 
                  alt="EverPay Logo" 
                  className="h-8"
                />
              </div>
            )}
            
            <h3 className="text-lg font-bold text-center mb-2" style={{ color: widgetSettings.secondaryColor }}>
              {widgetSettings.title}
            </h3>
            
            <p className="text-sm text-center text-gray-500 mb-4">
              {widgetSettings.description}
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Amount:</span>
                <span className="font-bold">${parseFloat(widgetSettings.amount).toFixed(2)} {widgetSettings.currency}</span>
              </div>
            </div>
            
            <VGSPaymentForm 
              formId="widget-preview" 
              amount={parseFloat(widgetSettings.amount)}
              buttonText="Pay Now"
              className="mt-4"
            />
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaymentWidget;
