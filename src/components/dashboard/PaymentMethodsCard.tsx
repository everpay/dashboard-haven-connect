
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaymentMethod {
  name: string;
  value: number;
}

interface PaymentMethodsCardProps {
  data: PaymentMethod[];
}

export const PaymentMethodsCard = ({ data }: PaymentMethodsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Payment Methods</CardTitle>
        <CardDescription className="text-xs">Revenue by payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((method) => (
            <div key={method.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  method.name === "Credit Card" ? "bg-[#1AA47B]" : 
                  method.name === "ACH" ? "bg-[#19363B]" : "bg-blue-500"
                }`}></div>
                <span className="text-sm">{method.name}</span>
              </div>
              <span className="text-sm font-medium">${method.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
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
