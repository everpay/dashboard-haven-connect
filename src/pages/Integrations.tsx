
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MoreVertical, ArrowRight } from 'lucide-react';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { useToast } from '@/components/ui/use-toast';

const Integrations = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('');

  const handleRequestIntegration = () => {
    toast({
      title: "Integration Request Sent",
      description: "Our team will review your request and get back to you soon.",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Payment Integrations</h1>
          <Button onClick={handleRequestIntegration}>
            <Plus className="mr-2 h-4 w-4" /> Request Integration
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Connect your payment workflows and handle transactions with multiple payment processors.
        </p>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for integrations"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="ml-4">
                <Button variant="outline" className="flex items-center">
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IntegrationCard 
                title="Stripe + VGS"
                description="Process payments with Stripe through VGS's secure vault"
                status="active"
                icon1="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                icon2="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg"
                createdBy="Payment Team"
              />
              
              <IntegrationCard 
                title="Square + VGS"
                description="Integrate Square payments with secure token handling"
                status="inactive"
                icon1="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                icon2="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/square.svg"
                createdBy="Emma R."
              />
              
              <IntegrationCard 
                title="PayPal + VGS"
                description="Connect PayPal for direct payment processing"
                status="active"
                icon1="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                icon2="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg"
                createdBy="Payment Team"
              />
              
              <IntegrationCard 
                title="Braintree + VGS"
                description="Use Braintree for recurring payments and subscriptions"
                status="active"
                icon1="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                icon2="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/braintree.svg"
                createdBy="Mark S."
              />
              
              <IntegrationCard 
                title="Adyen + VGS"
                description="Global payment processing with Adyen integration"
                status="inactive"
                icon1="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                icon2="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/adyen.svg"
                createdBy="Antonio R."
              />
              
              <IntegrationCard 
                title="Plaid + VGS"
                description="Connect bank accounts for ACH payments through Plaid"
                status="active"
                icon1="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                icon2="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/plaid.svg"
                createdBy="Mark S."
              />
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Integration Options</h3>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" /> Create Custom Integration
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" /> View Integration Marketplace
                  </Button>
                  
                  <Separator />
                  
                  <h4 className="font-medium text-sm">Recently Used</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-[#E3FFCC] flex items-center justify-center mr-2">
                          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg" alt="Stripe" className="w-4 h-4" />
                        </div>
                        <span>Stripe + VGS</span>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-[#E3FFCC] flex items-center justify-center mr-2">
                          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg" alt="PayPal" className="w-4 h-4" />
                        </div>
                        <span>PayPal + VGS</span>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Integrations;
