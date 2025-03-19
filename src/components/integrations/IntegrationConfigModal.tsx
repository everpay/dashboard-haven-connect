
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface IntegrationConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationTitle: string;
  onSave: (config: IntegrationConfig) => void;
  integrationType?: 'standard' | 'clisapay' | 'mekapay';
}

export interface IntegrationConfig {
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  merchantName?: string;
  merchantNumber?: string;
  merchantPassword?: string;
  merchantKey?: string;
  authorization?: string;
  endpoint?: string;
}

export const IntegrationConfigModal: React.FC<IntegrationConfigModalProps> = ({
  open,
  onOpenChange,
  integrationTitle,
  onSave,
  integrationType = 'standard'
}) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<IntegrationConfig>({
    apiKey: '',
    secretKey: '',
    merchantId: '',
    merchantName: integrationType === 'clisapay' ? 'EVERPAY' : '',
    merchantNumber: integrationType === 'clisapay' ? 'EVERPAY' : '',
    merchantPassword: integrationType === 'clisapay' ? 'pay147258' : '',
    merchantKey: integrationType === 'clisapay' ? 'beTvmODLata^iPY' : '',
    authorization: '',
    endpoint: integrationType === 'mekapay' ? 'https://mekapayglobal.com/api/charge' : ''
  });
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(
    integrationType === 'clisapay' ? 'clisapay' : 
    integrationType === 'mekapay' ? 'mekapay' : 'standard'
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Different validation rules based on integration type
    if (activeTab === 'standard' && (!config.apiKey || !config.secretKey)) {
      toast({
        title: "Error",
        description: "API Key and Secret Key are required",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'clisapay' && (!config.merchantName || !config.merchantNumber || !config.merchantPassword || !config.merchantKey)) {
      toast({
        title: "Error",
        description: "All Clisapay merchant credentials are required",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === 'mekapay' && (!config.authorization || !config.endpoint)) {
      toast({
        title: "Error",
        description: "Authorization and Endpoint are required for MekaPay",
        variant: "destructive"
      });
      return;
    }

    onSave({...config, integrationType: activeTab as any});
    toast({
      title: "Configuration Saved",
      description: `${integrationTitle} has been configured successfully.`
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Configure {integrationTitle}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="clisapay">Clisapay</TabsTrigger>
            <TabsTrigger value="mekapay">MekaPay</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  value={config.apiKey || ''}
                  onChange={handleChange}
                  placeholder="Enter your API key"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <div className="relative">
                  <Input
                    id="secretKey"
                    name="secretKey"
                    type={showSecretKey ? "text" : "password"}
                    value={config.secretKey || ''}
                    onChange={handleChange}
                    placeholder="Enter your secret key"
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="merchantId">Merchant ID (Optional)</Label>
                <Input
                  id="merchantId"
                  name="merchantId"
                  value={config.merchantId || ''}
                  onChange={handleChange}
                  placeholder="Enter your merchant ID if applicable"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="button" variant="outline" className="mr-2" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Configuration</Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="clisapay" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="merchantName">Merchant Name</Label>
                <Input
                  id="merchantName"
                  name="merchantName"
                  value={config.merchantName || ''}
                  onChange={handleChange}
                  placeholder="Enter merchant name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="merchantNumber">Merchant Number</Label>
                <Input
                  id="merchantNumber"
                  name="merchantNumber"
                  value={config.merchantNumber || ''}
                  onChange={handleChange}
                  placeholder="Enter merchant number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="merchantPassword">Merchant Password</Label>
                <div className="relative">
                  <Input
                    id="merchantPassword"
                    name="merchantPassword"
                    type={showPassword ? "text" : "password"}
                    value={config.merchantPassword || ''}
                    onChange={handleChange}
                    placeholder="Enter merchant password"
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="merchantKey">Merchant Key</Label>
                <div className="relative">
                  <Input
                    id="merchantKey"
                    name="merchantKey"
                    type={showSecretKey ? "text" : "password"}
                    value={config.merchantKey || ''}
                    onChange={handleChange}
                    placeholder="Enter merchant key"
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="button" variant="outline" className="mr-2" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Configuration</Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="mekapay" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="authorization">Authorization Key</Label>
                <div className="relative">
                  <Input
                    id="authorization"
                    name="authorization"
                    type={showSecretKey ? "text" : "password"}
                    value={config.authorization || ''}
                    onChange={handleChange}
                    placeholder="Bearer YOUR_SECRET_KEY"
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  name="endpoint"
                  value={config.endpoint || ''}
                  onChange={handleChange}
                  placeholder="https://mekapayglobal.com/api/charge"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="button" variant="outline" className="mr-2" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Configuration</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
