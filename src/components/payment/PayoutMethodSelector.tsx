
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Building, Send, Lock } from 'lucide-react';

interface PayoutMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  region: 'northAmerica' | 'latinAmerica' | 'global';
}

export const PayoutMethodSelector: React.FC<PayoutMethodSelectorProps> = ({
  value,
  onChange,
  region = 'global'
}) => {
  
  // Define payment methods based on region
  const getPaymentMethods = () => {
    switch (region) {
      case 'northAmerica':
        return [
          { id: 'ach', label: 'ACH', icon: <Building className="h-4 w-4" /> },
          { id: 'wire', label: 'Wire', icon: <Send className="h-4 w-4" /> },
          { id: 'zelle', label: 'Zelle', icon: <Send className="h-4 w-4" /> }
        ];
      case 'latinAmerica':
        return [
          { id: 'pix', label: 'PIX', icon: <Send className="h-4 w-4" /> },
          { id: 'ted', label: 'TED', icon: <Building className="h-4 w-4" /> },
          { id: 'spei', label: 'SPEI', icon: <Building className="h-4 w-4" /> }
        ];
      default: // global
        return [
          { id: 'ach', label: 'ACH', icon: <Building className="h-4 w-4" /> },
          { id: 'wire', label: 'Wire', icon: <Send className="h-4 w-4" /> },
          { id: 'swift', label: 'SWIFT', icon: <Lock className="h-4 w-4" /> },
          { id: 'card_push', label: 'Card Push', icon: <CreditCard className="h-4 w-4" /> }
        ];
    }
  };

  const paymentMethods = getPaymentMethods();
  
  // Ensure we have a valid value based on the available methods
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethods.some(m => m.id === value)) {
      onChange(paymentMethods[0].id);
    }
  }, [region, value, onChange]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Payment Method</label>
      <Tabs value={value} onValueChange={onChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          {paymentMethods.map(method => (
            <TabsTrigger 
              key={method.id}
              value={method.id}
              className="flex items-center gap-1 text-xs py-1.5 px-3"
            >
              {method.icon}
              <span>{method.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
