
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PaymentMethodsChartProps {
  paymentMethodsData: any[];
}

export const PaymentMethodsChart = ({ paymentMethodsData }: PaymentMethodsChartProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-medium text-base mb-4">Sales by Payment Method</h3>
      <div className="h-[300px]">
        {paymentMethodsData && paymentMethodsData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentMethodsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#1AA47B" name="Sales ($)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-full border border-dashed rounded-md">
            <p className="text-muted-foreground">No payment method data available</p>
          </div>
        )}
      </div>
    </Card>
  );
};
