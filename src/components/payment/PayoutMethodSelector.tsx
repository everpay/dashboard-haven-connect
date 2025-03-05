
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ACHPaymentForm } from './ACHPaymentForm';
import { CardPushForm } from './CardPushForm';
import { PaymentMethod } from '@/services/ItsPaidService';

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

  return (
    <Tabs defaultValue="ach" value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="ach">ACH</TabsTrigger>
        <TabsTrigger value="swift">SWIFT</TabsTrigger>
        <TabsTrigger value="fedwire">FEDWIRE</TabsTrigger>
        <TabsTrigger value="zelle">ZELLE</TabsTrigger>
        <TabsTrigger value="card">Card Push</TabsTrigger>
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
