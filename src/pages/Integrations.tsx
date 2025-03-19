
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, ArrowRight } from 'lucide-react';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const Integrations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [processors, setProcessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcessors = async () => {
      try {
        setLoading(true);
        // Fetch configured payment processors from database
        const { data, error } = await supabase
          .from('payment_processors')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setProcessors(data || []);
      } catch (err) {
        console.error('Error fetching payment processors:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProcessors();
  }, []);

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
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/marketplace')} 
              className="bg-[#1AA47B] text-white hover:bg-[#19363B]"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Integration
            </Button>
            <Button onClick={handleRequestIntegration} className="bg-[#E3FFCC] text-[#19363B] hover:bg-[#D1EEBB]">
              <Plus className="mr-2 h-4 w-4" /> Request Integration
            </Button>
          </div>
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
              {/* Default integrations */}
              <IntegrationCard 
                title="Stripe + VGS"
                description="Process payments with Stripe through VGS's secure vault"
                status="active"
                icon1="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                icon2="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg"
                createdBy="Payment Team"
              />
              
              {/* Add the new Clisapay card */}
              <IntegrationCard 
                title="Clisapay"
                description="Global payment processor with comprehensive merchant services"
                status="active"
                icon1="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                icon2="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                createdBy="Merchant Team"
              />
              
              {/* Add the new MekaPay card */}
              <IntegrationCard 
                title="MekaPay"
                description="Secure payment processing with 3D secure and address verification"
                status="active"
                icon1="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                icon2="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                createdBy="Merchant Team"
              />
              
              {/* Add dynamic processor cards based on database */}
              {processors.map(processor => (
                <IntegrationCard 
                  key={processor.id}
                  title={processor.name}
                  description={`Configured ${new Date(processor.created_at).toLocaleDateString()}`}
                  status={processor.status}
                  icon1="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                  icon2="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png"
                  createdBy="You"
                />
              ))}
              
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
            </div>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Integration Options</h3>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/marketplace')}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Integration
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/marketplace')}>
                    <ArrowRight className="mr-2 h-4 w-4" /> View Integration Marketplace
                  </Button>
                  
                  <Separator />
                  
                  <h4 className="font-medium text-sm">Recently Used</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-[#E3FFCC] flex items-center justify-center mr-2">
                          <img src="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png" alt="Clisapay" className="w-4 h-4" />
                        </div>
                        <span>Clisapay</span>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-[#E3FFCC] flex items-center justify-center mr-2">
                          <img src="/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png" alt="MekaPay" className="w-4 h-4" />
                        </div>
                        <span>MekaPay</span>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-[#E3FFCC] flex items-center justify-center mr-2">
                          <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg" alt="Stripe" className="w-4 h-4" />
                        </div>
                        <span>Stripe + VGS</span>
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
