
import React, { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Link as LinkIcon, Copy, Eye, Settings, Globe, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HostedPaymentPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentLink, setPaymentLink] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [expiresAfter, setExpiresAfter] = useState('7');
  const [oneTime, setOneTime] = useState(true);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  
  // Theme options for payment page
  const [theme, setTheme] = useState('default');
  const [buttonColor, setButtonColor] = useState('#1AA47B');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#19363B');
  const [headerColor, setHeaderColor] = useState('#F9F9F9');
  const [logoUrl, setLogoUrl] = useState('');
  const [fontFamily, setFontFamily] = useState('system-ui');
  
  // Payment page settings have been moved to the Settings page
  const [collectBillingAddress, setCollectBillingAddress] = useState(true);
  const [collectShippingAddress, setCollectShippingAddress] = useState(false);
  const [allowCoupons, setAllowCoupons] = useState(false);
  
  const generatePaymentLink = () => {
    // This would typically call an API to create a payment link in a real application
    const randomId = Math.random().toString(36).substring(2, 10);
    const mockPaymentLink = `https://pay.everpayinc.com/${randomId}`;
    setPaymentLink(mockPaymentLink);
    
    toast({
      title: "Payment link created",
      description: "Your hosted payment page has been created successfully.",
    });
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink);
    toast({
      title: "Copied to clipboard",
      description: "Payment link has been copied to your clipboard.",
    });
  };
  
  const previewPaymentPage = () => {
    // Create a basic HTML preview of what the payment page would look like
    if (previewIframeRef.current) {
      const iframeDoc = previewIframeRef.current.contentDocument || previewIframeRef.current.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Payment Preview</title>
              <style>
                body {
                  font-family: ${fontFamily}, -apple-system, BlinkMacSystemFont, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background-color: ${backgroundColor};
                  color: ${textColor};
                }
                .payment-container {
                  max-width: 500px;
                  margin: 0 auto;
                  background-color: white;
                  border-radius: 8px;
                  padding: 20px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                  display: flex;
                  align-items: center;
                  background-color: ${headerColor};
                  margin: -20px -20px 20px -20px;
                  padding: 20px;
                  border-top-left-radius: 8px;
                  border-top-right-radius: 8px;
                }
                .logo {
                  max-height: 40px;
                  margin-right: 10px;
                }
                .title {
                  font-size: 24px;
                  font-weight: 600;
                  color: ${textColor};
                }
                .amount {
                  font-size: 36px;
                  font-weight: 700;
                  margin: 20px 0;
                  text-align: center;
                }
                .description {
                  color: #666;
                  margin-bottom: 20px;
                }
                .form-group {
                  margin-bottom: 15px;
                }
                label {
                  display: block;
                  margin-bottom: 5px;
                  font-weight: 500;
                }
                input {
                  width: 100%;
                  padding: 10px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  font-size: 16px;
                }
                .pay-button {
                  width: 100%;
                  padding: 12px;
                  background-color: ${buttonColor};
                  color: white;
                  border: none;
                  border-radius: 4px;
                  font-size: 16px;
                  font-weight: 600;
                  cursor: pointer;
                  margin-top: 20px;
                }
                .powered-by {
                  text-align: center;
                  font-size: 12px;
                  color: #999;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="payment-container">
                <div class="header">
                  ${logoUrl ? `<img src="${logoUrl}" class="logo" alt="Logo" />` : ''}
                  <div class="title">Payment</div>
                </div>
                <div class="amount">${currency} ${parseFloat(amount || '0').toFixed(2)}</div>
                <div class="description">${description || 'Payment'}</div>
                
                <div class="form-group">
                  <label for="card">Card Information</label>
                  <input type="text" id="card" placeholder="1234 1234 1234 1234" />
                </div>
                
                <div class="form-group" style="display: flex; gap: 10px;">
                  <div style="flex: 1;">
                    <label for="expiry">Expiry</label>
                    <input type="text" id="expiry" placeholder="MM/YY" />
                  </div>
                  <div style="flex: 1;">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" placeholder="123" />
                  </div>
                </div>
                
                ${collectBillingAddress ? `
                <div class="form-group">
                  <label for="billing">Billing Address</label>
                  <input type="text" id="billing" placeholder="123 Main St" />
                </div>
                ` : ''}
                
                ${collectShippingAddress ? `
                <div class="form-group">
                  <label for="shipping">Shipping Address</label>
                  <input type="text" id="shipping" placeholder="123 Main St" />
                </div>
                ` : ''}
                
                ${allowCoupons ? `
                <div class="form-group">
                  <label for="coupon">Promo Code</label>
                  <input type="text" id="coupon" placeholder="Enter code" />
                </div>
                ` : ''}
                
                <button class="pay-button">Pay ${currency} ${parseFloat(amount || '0').toFixed(2)}</button>
                
                <div class="powered-by">Powered by everpayinc.com</div>
              </div>
            </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
    
    toast({
      title: "Preview generated",
      description: "See the preview below",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Hosted Payment Page</h1>
            <p className="text-gray-500">Create customizable payment pages for your customers</p>
          </div>
          
          <Button 
            onClick={() => navigate('/settings')}
            variant="outline"
          >
            <Settings className="h-4 w-4 mr-2" />
            Payment Page Settings
          </Button>
        </div>
        
        <Tabs defaultValue="create">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Payment Page</CardTitle>
                  <CardDescription>Configure details for your payment page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-id">Customer ID (Optional)</Label>
                    <Input 
                      id="customer-id" 
                      placeholder="Enter customer ID" 
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input 
                        id="amount" 
                        placeholder="0.00" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={currency} 
                        onValueChange={setCurrency}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Payment for..." 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expires">Expires After (days)</Label>
                      <Select 
                        value={expiresAfter} 
                        onValueChange={setExpiresAfter}
                      >
                        <SelectTrigger id="expires">
                          <SelectValue placeholder="Select expiration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="365">365 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="one-time" className="block mb-2">One-Time Use</Label>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="one-time" 
                          checked={oneTime}
                          onCheckedChange={setOneTime}
                        />
                        <Label htmlFor="one-time">
                          {oneTime ? 'Yes' : 'No'}
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={generatePaymentLink} 
                    className="bg-[#1AA47B] text-white hover:bg-[#19363B] w-full"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Generate Payment Link
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Link</CardTitle>
                  <CardDescription>Use this URL to share with your customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentLink ? (
                    <>
                      <div className="relative">
                        <Input 
                          value={paymentLink} 
                          readOnly 
                          className="pr-20"
                        />
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="absolute right-0 top-0 h-full"
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={previewPaymentPage}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy URL
                        </Button>
                      </div>
                      
                      <div className="rounded-md bg-gray-50 p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Check className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-800">Ready to use</h3>
                            <div className="mt-1 text-sm text-gray-500">
                              <p>Share this link with your customers to accept payments.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <LinkIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No payment link</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Configure your payment options and generate a link.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {paymentLink && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <div className="border rounded-lg overflow-hidden h-[500px]">
                  <iframe 
                    ref={previewIframeRef}
                    className="w-full h-full"
                    title="Payment Preview"
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="customize">
            <Card>
              <CardHeader>
                <CardTitle>Customize Payment Page</CardTitle>
                <CardDescription>Change appearance and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Page Theme</Label>
                      <Select 
                        value={theme} 
                        onValueChange={setTheme}
                      >
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="classic">Classic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="button-color">Button Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="button-color" 
                          type="color"
                          value={buttonColor}
                          onChange={(e) => setButtonColor(e.target.value)}
                          className="w-16 p-1 h-10"
                        />
                        <Input 
                          value={buttonColor} 
                          onChange={(e) => setButtonColor(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bg-color">Background Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="bg-color" 
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-16 p-1 h-10"
                        />
                        <Input 
                          value={backgroundColor} 
                          onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="text-color" 
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-16 p-1 h-10"
                        />
                        <Input 
                          value={textColor} 
                          onChange={(e) => setTextColor(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="header-color">Header Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="header-color" 
                          type="color"
                          value={headerColor}
                          onChange={(e) => setHeaderColor(e.target.value)}
                          className="w-16 p-1 h-10"
                        />
                        <Input 
                          value={headerColor} 
                          onChange={(e) => setHeaderColor(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="font-family">Font Family</Label>
                      <Select 
                        value={fontFamily} 
                        onValueChange={setFontFamily}
                      >
                        <SelectTrigger id="font-family">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system-ui">System Default</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="logo-url">Company Logo URL</Label>
                      <Input 
                        id="logo-url" 
                        placeholder="https://yourdomain.com/logo.png" 
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 relative min-h-[300px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="mx-auto h-10 w-10 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium">Preview will appear here</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          Generate a payment link to see a live preview
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#1AA47B] text-white hover:bg-[#19363B]">
                  Save Customizations
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HostedPaymentPage;
