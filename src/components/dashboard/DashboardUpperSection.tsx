
import React from 'react';
import { SalesChart } from './SalesChart';
import { PaymentMethodsCard } from './PaymentMethodsCard';
import { TimeframeOption } from '@/utils/timeframeUtils';
import { TimeframeSelector } from '@/components/charts/TimeframeSelector';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface DashboardUpperSectionProps {
  chartData: any[];
  timeframe: TimeframeOption;
  setTimeframe: (timeframe: TimeframeOption) => void;
  paymentMethodData: any[];
}

export const DashboardUpperSection = ({ 
  chartData,
  timeframe,
  setTimeframe,
  paymentMethodData 
}: DashboardUpperSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <Card className="h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Mar 14, 2024 - Mar 21, 2024</CardDescription>
              </div>
              <TimeframeSelector 
                timeframe={timeframe} 
                setTimeframe={setTimeframe} 
              />
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart data={chartData} />
          </CardContent>
        </Card>
      </div>
      
      <PaymentMethodsCard data={paymentMethodData} />
    </div>
  );
};
