
import React from 'react';
import { InteractiveBarChart } from "@/components/charts/InteractiveBarChart";
import { TimeframeSelector } from "@/components/charts/TimeframeSelector";
import { TimeframeOption, formatDateRange } from "@/utils/timeframeUtils";

interface SalesChartProps {
  chartData: any[];
  timeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
}

export const SalesChart = ({ chartData, timeframe, onTimeframeChange }: SalesChartProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-sm font-semibold">Sales Overview</h2>
          <p className="text-xs text-muted-foreground">{formatDateRange(timeframe)}</p>
        </div>
        <TimeframeSelector 
          currentTimeframe={timeframe} 
          onTimeframeChange={onTimeframeChange}
        />
      </div>
      <InteractiveBarChart 
        data={chartData}
        valuePrefix="$"
        title="Sales Overview"
      />
    </div>
  );
};
