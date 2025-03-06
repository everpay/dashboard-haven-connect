
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Settings, ExternalLink } from 'lucide-react';

const PaymentSettings = () => {
  const { toast } = useToast();
  
  // Payment page settings
  const [collectBillingAddress, setCollectBillingAddress] = useState(true);
  const [collectShippingAddress, setCollectShippingAddress] = useState(false);
  const [allowCoupons, setAllowCoupons] = useState(false);
  const [collectPhoneNumber, setCollectPhoneNumber] = useState(false);
  
  // Default payment page texts
  const [checkoutTitle, setCheckoutTitle] = useState('Complete Your Payment');
  const [payButtonText, setPayButtonText] = useState('Pay Now');
  const [successMessage, setSuccessMessage] = useState('Thank you for your payment!');
  
  // Security settings
  const [enableRiskScoring, setEnableRiskScoring] = useState(true);
  const [requireCvv, setRequireCvv] = useState(true);
  const [enable3DS, setEnable3DS] = useState(true);
  
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your payment page settings have been updated successfully",
    });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Settings className="h-5 w-5 mr-2" /> 
          Payment Page Settings
        </CardTitle>
        <CardDescription>
          Configure how your hosted payment pages behave
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Customer Information</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="billing-address">Collect Billing Address</Label>
              <p className="text-sm text-gray-500">
                Require customers to provide their billing address
              </p>
            </div>
            <Switch 
              id="billing-address" 
              checked={collectBillingAddress}
              onCheckedChange={setCollectBillingAddress}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="shipping-address">Collect Shipping Address</Label>
              <p className="text-sm text-gray-500">
                Require customers to provide their shipping address
              </p>
            </div>
            <Switch 
              id="shipping-address" 
              checked={collectShippingAddress}
              onCheckedChange={setCollectShippingAddress}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="phone-number">Collect Phone Number</Label>
              <p className="text-sm text-gray-500">
                Require customers to provide their phone number
              </p>
            </div>
            <Switch 
              id="phone-number" 
              checked={collectPhoneNumber}
              onCheckedChange={setCollectPhoneNumber}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="coupons">Allow Promotion Codes</Label>
              <p className="text-sm text-gray-500">
                Enable customers to enter promotion or discount codes
              </p>
            </div>
            <Switch 
              id="coupons" 
              checked={allowCoupons}
              onCheckedChange={setAllowCoupons}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Default Text & Labels</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-title">Checkout Page Title</Label>
              <Input 
                id="checkout-title" 
                value={checkoutTitle}
                onChange={(e) => setCheckoutTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pay-button-text">Pay Button Text</Label>
              <Input 
                id="pay-button-text" 
                value={payButtonText}
                onChange={(e) => setPayButtonText(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="success-message">Success Message</Label>
              <Input 
                id="success-message" 
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Security & Compliance</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="risk-scoring">Enable Risk Scoring</Label>
              <p className="text-sm text-gray-500">
                Automatically detect and block suspicious transactions
              </p>
            </div>
            <Switch 
              id="risk-scoring" 
              checked={enableRiskScoring}
              onCheckedChange={setEnableRiskScoring}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-cvv">Require CVV</Label>
              <p className="text-sm text-gray-500">
                Always require customers to enter card security code
              </p>
            </div>
            <Switch 
              id="require-cvv" 
              checked={requireCvv}
              onCheckedChange={setRequireCvv}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="3ds">Enable 3D Secure</Label>
              <p className="text-sm text-gray-500">
                Add an extra layer of security for online transactions
              </p>
            </div>
            <Switch 
              id="3ds" 
              checked={enable3DS}
              onCheckedChange={setEnable3DS}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Settings className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Advanced Configuration</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  For more advanced options, you can use our API to create and customize 
                  payment pages programmatically.
                </p>
                <p className="mt-2">
                  <Button variant="link" className="p-0 h-auto text-blue-800">
                    View API Documentation
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="bg-[#1AA47B] text-white hover:bg-[#19363B]"
          onClick={saveSettings}
        >
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentSettings;
