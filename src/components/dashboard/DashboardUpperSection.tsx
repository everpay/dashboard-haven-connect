
import React from 'react';
import { SalesChart } from './SalesChart';
import { PaymentMethodsCard } from './PaymentMethodsCard';
import { TimeframeOption } from '@/utils/timeframeUtils';
import { TimeframeSelector } from '@/components/charts/TimeframeSelector';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
      <div className="md:col-span-2">
        <SalesChart 
          chartData={chartData} 
          timeframe={timeframe} 
          onTimeframeChange={setTimeframe}
          paymentMethodData={paymentMethodData}
        />
      </div>
      <div className="md:col-span-1">
        <div className="mb-3">
          <TimeframeSelector 
            currentTimeframe={timeframe} 
            onTimeframeChange={setTimeframe}
          />
        </div>
        <div className="h-full">
          <PaymentMethodsCard data={paymentMethodData} />
        </div>
      </div>
    </div>
  );
};
