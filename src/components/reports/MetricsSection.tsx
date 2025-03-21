
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricChart } from './MetricCharts';

interface MetricsSectionProps {
  mrrData: any[];
  churnData: any[];
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
}

export const MetricsSection = ({ mrrData, churnData, timeframe, setTimeframe }: MetricsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Subscription Metrics</h2>
        <Select 
          value={timeframe} 
          onValueChange={setTimeframe}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MetricChart 
        title="Monthly Recurring Revenue (MRR)" 
        data={mrrData} 
        dataKey="value" 
        color="#1AA47B" 
        tooltipFormatter={(value) => [`$${value}`, 'MRR']}
      />

      <MetricChart 
        title="Churn Rate (%)" 
        data={churnData} 
        dataKey="value" 
        color="#e11d48" 
        tooltipFormatter={(value) => [`${value}%`, 'Churn Rate']}
      />
    </div>
  );
};
