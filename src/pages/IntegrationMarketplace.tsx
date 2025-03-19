import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Grid, Search, Shield, CreditCard, Zap, Lock, Target, Wallet, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { IntegrationConfigModal } from '@/components/integrations/IntegrationConfigModal';
import { useToast } from '@/components/ui/use-toast';
import { RequestIntegrationModal } from '@/components/integrations/RequestIntegrationModal';
import { supabase } from '@/lib/supabase';

// Payment processor types
const processorTypes = [
  { id: 'credit-card', name: 'Card Processors', icon: <CreditCard className="h-5 w-5" /> },
  { id: 'ach', name: 'ACH Processors', icon: <Wallet className="h-5 w-5" /> },
  { id: 'payout', name: 'Payout Providers', icon: <Zap className="h-5 w-5" /> },
  { id: 'fraud', name: 'Fraud Prevention', icon: <Shield className="h-5 w-5" /> },
  { id: 'kyc', name: 'KYC/KYB', icon: <Lock className="h-5 w-5" /> },
  { id: 'conversion', name: 'Conversion Tools', icon: <Target className="h-5 w-5" /> },
];

// Integration data with added new processors
const integrations = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept payments online with Stripe\'s flexible and scalable payment platform.',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg',
    type: 'credit-card',
    popular: true,
    regions: ['Global'],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Enable customers to pay with their PayPal account or credit card.',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg',
    type: 'credit-card',
    popular: true,
    regions: ['Global'],
  },
  {
    id: 'clisapay',
    name: 'Clisapay',
    description: 'Popular payment processor tailored for global merchant transactions.',
    logo: '/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png',
    type: 'credit-card',
    popular: true,
    regions: ['Global', 'Asia'],
  },
  {
    id: 'mekapay',
    name: 'MekaPay',
    description: 'Process debit/credit card transactions with advanced security features.',
    logo: '/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png',
    type: 'credit-card',
    popular: true,
    regions: ['Global'],
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Process payments online and in-person with Square\'s secure platform.',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/square.svg',
    type: 'credit-card',
    popular: false,
    regions: ['US', 'Canada', 'Australia', 'UK'],
  },
  {
    id: 'adyen',
    name: 'Adyen',
    description: 'Global payment processing platform with advanced fraud prevention.',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/adyen.svg',
    type: 'credit-card',
    popular: false,
    regions: ['Global'],
  },
  {
    id: 'plaid',
    name: 'Plaid',
    description: 'Connect with user bank accounts securely for ACH and account verification.',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/plaid.svg',
    type: 'ach',
    popular: true,
    regions: ['US', 'Canada', 'UK'],
  },
  {
    id: 'dwolla',
    name: 'Dwolla',
    description: 'Send, receive, and facilitate ACH payments through a modern API.',
    logo: '/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png',
    type: 'ach',
    popular: false,
    regions: ['US'],
  },
  {
    id: 'its-paid',
    name: 'ItsPaid',
    description: 'Global payout solution with support for multiple payment methods.',
    logo: '/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png',
    type: 'payout',
    popular: true,
    regions: ['Global'],
  },
  {
    id: 'marqeta',
    name: 'Marqeta',
    description: 'Issue virtual and physical cards with advanced controls and features.',
    logo: '/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png',
    type: 'credit-card',
    popular: true,
    regions: ['US', 'EU', 'APAC'],
  },
  {
    id: 'finicity',
    name: 'Finicity',
    description: 'Connect to financial accounts and transactions in real-time.',
    logo: '/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png',
    type: 'ach',
    popular: false,
    regions: ['US'],
  },
  {
    id: 'prometric',
    name: 'Prometric',
    description: 'Bank verification service specializing in LATAM markets.',
    logo: '/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png',
    type: 'ach',
    popular: false,
    regions: ['LATAM'],
  },
  {
    id: 'vgs',
    name: 'Very Good Security (VGS)',
    description: 'Secure sensitive data without changing your codebase.',
    logo: '/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png',
    type: 'fraud',
    popular: true,
    regions: ['Global'],
  },
  {
    id: 'inai',
    name: 'Inai',
    description: 'Unified payment stack to accept payments worldwide.',
    logo: '/lovable-uploads/e9695f43-3adc-4862-829d-ca77e914daf9.png',
    type: 'credit-card',
    popular: false,
    regions: ['Global'],
  },
];

const IntegrationMarketplace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const handleIntegrationClick = (integration: any) => {
    setSelectedIntegration(integration);
    setConfigModalOpen(true);
  };

  const handleSaveConfig = async (config: any) => {
    try {
      // Save the configuration to the database
      const { data, error } = await supabase
        .from('payment_processors')
        .insert({
          name: selectedIntegration.name,
          type: selectedIntegration.type,
          configuration: config,
          status: 'active'
        });
        
      if (error) throw error;
      
      toast({
        title: "Integration Configured",
        description: `${selectedIntegration?.name} has been successfully configured.`,
      });
    } catch (err) {
      console.error('Error saving payment processor:', err);
      toast({
        title: "Configuration Error",
        description: "Failed to save the integration. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRequestIntegration = (data: any) => {
    toast({
      title: "Integration Request Sent",
      description: "We've received your request and will review it shortly.",
    });
    setRequestModalOpen(false);
  };

  // Filter integrations based on search term and selected type
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = searchTerm 
      ? integration.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        integration.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesType = selectedType 
      ? integration.type === selectedType
      : true;
    
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/integrations')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Integration Marketplace</h1>
              <p className="text-gray-500">Discover and connect payment tools and services</p>
            </div>
          </div>
          <Button onClick={() => setRequestModalOpen(true)} className="bg-[#E3FFCC] text-[#19363B] hover:bg-[#D1EEBB]">
            Request New Integration
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-1">
                  <Button 
                    variant={selectedType === null ? "secondary" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => setSelectedType(null)}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    All Integrations
                  </Button>
                  
                  {processorTypes.map(type => (
                    <Button 
                      key={type.id}
                      variant={selectedType === type.id ? "secondary" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setSelectedType(type.id)}
                    >
                      {type.icon}
                      <span className="ml-2">{type.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search integrations" 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              <Button variant="outline" className="sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            {filteredIntegrations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map(integration => (
                  <Card key={integration.id} className="overflow-hidden border">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                          <img src={integration.logo} alt={integration.name} className="w-6 h-6" />
                        </div>
                        {integration.popular && (
                          <Badge className="bg-[#E3FFCC] text-[#19363B] hover:bg-[#D1EEBB]">Popular</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mt-3">{integration.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-1 mt-2">
                        {integration.regions.map(region => (
                          <Badge key={region} variant="outline" className="text-xs">
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleIntegrationClick(integration)}
                      >
                        Configure
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium mb-2">No integrations found</h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any integrations matching your search criteria.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedType(null);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {selectedIntegration && (
        <IntegrationConfigModal
          open={configModalOpen}
          onOpenChange={setConfigModalOpen}
          integrationTitle={selectedIntegration.name}
          onSave={handleSaveConfig}
          integrationType={selectedIntegration.id === 'clisapay' ? 'clisapay' : 
                         selectedIntegration.id === 'mekapay' ? 'mekapay' : 'standard'}
        />
      )}

      <RequestIntegrationModal
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
        onSubmit={handleRequestIntegration}
      />
    </DashboardLayout>
  );
};

export default IntegrationMarketplace;
