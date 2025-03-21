
import React from 'react';
import { PaymentMethodItem } from './PaymentMethodItem';
import { PaymentMethod } from '@/utils/paymentMethodUtils';
import { ScrollArea } from "@/components/ui/scroll-area";

interface PaymentMethodsListProps {
  data: PaymentMethod[];
}

export const PaymentMethodsList = ({ data }: PaymentMethodsListProps) => {
  return (
    <ScrollArea className="h-[260px] pr-4">
      <div className="space-y-1">
        {data.map((method) => (
          <PaymentMethodItem key={method.name} method={method} />
        ))}
      </div>
    </ScrollArea>
  );
};
