
import React from 'react';
import { Card } from "@/components/ui/card";

interface CustomerSummaryProps {
  customerData: any[];
  colors: string[];
}

export const CustomerSummary = ({ customerData, colors }: CustomerSummaryProps) => {
  return (
    <Card className="p-6">
      <h3 className="font-medium text-lg mb-4">Customers Summary</h3>
      <div className="space-y-4">
        {customerData?.map((segment) => (
          <div key={segment.name} className="flex justify-between items-center">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: colors[customerData.indexOf(segment) % colors.length] }}
              ></div>
              <span>{segment.name} Customers</span>
            </div>
            <span className="font-bold">{segment.value}</span>
          </div>
        ))}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center font-bold">
            <span>Total Customers</span>
            <span>{customerData?.reduce((sum, item) => sum + item.value, 0)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
