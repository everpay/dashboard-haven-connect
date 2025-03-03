
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

interface IntegrationConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  integrationTitle: string;
  onSave: (config: IntegrationConfig) => void;
}

export interface IntegrationConfig {
  apiKey: string;
  secretKey: string;
  merchantId?: string;
}

export const IntegrationConfigModal: React.FC<IntegrationConfigModalProps> = ({
  open,
  onOpenChange,
  integrationTitle,
  onSave
}) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<IntegrationConfig>({
    apiKey: '',
    secretKey: '',
    merchantId: ''
  });
  const [showSecretKey, setShowSecretKey] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.apiKey || !config.secretKey) {
      toast({
        title: "Error",
        description: "API Key and Secret Key are required",
        variant: "destructive"
      });
      return;
    }

    onSave(config);
    toast({
      title: "Configuration Saved",
      description: `${integrationTitle} has been configured successfully.`
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure {integrationTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              name="apiKey"
              value={config.apiKey}
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
                value={config.secretKey}
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
              value={config.merchantId}
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
      </DialogContent>
    </Dialog>
  );
};
