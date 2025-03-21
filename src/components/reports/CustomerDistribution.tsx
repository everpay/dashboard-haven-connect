
import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface CustomerDistributionProps {
  customerData: any[];
  colors: string[];
}

export const CustomerDistribution = ({ customerData, colors }: CustomerDistributionProps) => {
  return (
    <Card className="p-6">
      <h3 className="font-medium text-lg mb-4">Customer Distribution</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={customerData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {customerData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Customers']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
