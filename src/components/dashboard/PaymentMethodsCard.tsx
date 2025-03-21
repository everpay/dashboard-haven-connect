
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentMethodsList } from './PaymentMethodsList';
import { PaymentMethodsLoading } from './PaymentMethodsLoading';
import { usePaymentMethodsData } from '@/hooks/dashboard/usePaymentMethodsData';
import { PaymentMethod } from '@/utils/paymentMethodUtils';

interface PaymentMethodsCardProps {
  data: PaymentMethod[];
}

export const PaymentMethodsCard = ({ data: initialData }: PaymentMethodsCardProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = usePaymentMethodsData(initialData);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Payment Methods</CardTitle>
        <CardDescription className="text-xs">Revenue by payment method</CardDescription>
      </CardHeader>
      <CardContent className="pb-0 flex-grow overflow-auto">
        {isLoading 
          ? <PaymentMethodsLoading /> 
          : <PaymentMethodsList data={data} />
        }
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <Button 
          variant="outline" 
          className="w-full text-sm"
          onClick={() => navigate('/reports/overview')}
        >
          View Full Report
        </Button>
      </CardFooter>
    </Card>
  );
};
