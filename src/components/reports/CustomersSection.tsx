
import React from 'react';
import { Input } from "@/components/ui/input";
import { CustomerDistribution } from './CustomerDistribution';
import { CustomerSummary } from './CustomerSummary';

interface CustomersSectionProps {
  customerData: any[];
  colors: string[];
}

export const CustomersSection = ({ customerData, colors }: CustomersSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Customer Segments</h2>
        <Input
          type="search"
          placeholder="Search customers..."
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomerDistribution customerData={customerData} colors={colors} />
        <CustomerSummary customerData={customerData} colors={colors} />
      </div>
    </div>
  );
};
