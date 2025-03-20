
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ACHPaymentForm } from './ACHPaymentForm';
import { CardPushForm } from './CardPushForm';
import { PaymentMethod } from '@/services/itsPaid';

interface PayoutMethodSelectorProps {
  amount: number;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export const PayoutMethodSelector = ({ 
  amount, 
  onSuccess, 
  onError 
}: PayoutMethodSelectorProps) => {
  const [selectedTab, setSelectedTab] = useState<string>('ach');

  // Map tabs to payment methods
  const getPaymentMethod = (tab: string): PaymentMethod => {
    switch (tab) {
      case 'ach': return 'ACH';
      case 'swift': return 'SWIFT';
      case 'fedwire': return 'FEDWIRE';
      case 'zelle': return 'ZELLE';
      case 'card': return 'CARD_PUSH';
      default: return 'ACH';
    }
  };

  return (
    <Tabs defaultValue="ach" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="grid grid-cols-5 mb-4 w-full bg-muted">
        <TabsTrigger value="ach" className="data-[state=active]:bg-[#1AA47B] data-[state=active]:text-white">ACH</TabsTrigger>
        <TabsTrigger value="swift" className="data-[state=active]:bg-[#1AA47B] data-[state=active]:text-white">SWIFT</TabsTrigger>
        <TabsTrigger value="fedwire" className="data-[state=active]:bg-[#1AA47B] data-[state=active]:text-white">FEDWIRE</TabsTrigger>
        <TabsTrigger value="zelle" className="data-[state=active]:bg-[#1AA47B] data-[state=active]:text-white">ZELLE</TabsTrigger>
        <TabsTrigger value="card" className="data-[state=active]:bg-[#1AA47B] data-[state=active]:text-white">Card Push</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ach">
        <ACHPaymentForm 
          amount={amount} 
          onSuccess={onSuccess} 
          onError={onError} 
          paymentMethod="ACH"
        />
      </TabsContent>
      
      <TabsContent value="swift">
        <ACHPaymentForm 
          amount={amount} 
          onSuccess={onSuccess} 
          onError={onError} 
          paymentMethod="SWIFT"
        />
      </TabsContent>
      
      <TabsContent value="fedwire">
        <ACHPaymentForm 
          amount={amount} 
          onSuccess={onSuccess} 
          onError={onError} 
          paymentMethod="FEDWIRE"
        />
      </TabsContent>
      
      <TabsContent value="zelle">
        <ACHPaymentForm 
          amount={amount} 
          onSuccess={onSuccess} 
          onError={onError} 
          paymentMethod="ZELLE"
        />
      </TabsContent>
      
      <TabsContent value="card">
        <CardPushForm 
          amount={amount} 
          onSuccess={onSuccess} 
          onError={onError} 
        />
      </TabsContent>
    </Tabs>
  );
};
