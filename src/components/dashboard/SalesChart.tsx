
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
          <h2 className="text-lg font-semibold">Monthly Sales</h2>
          <p className="text-xs text-muted-foreground">{formatDateRange(timeframe)}</p>
        </div>
        <TimeframeSelector 
          currentTimeframe={timeframe} 
          onTimeframeChange={onTimeframeChange}
        />
      </div>
      <InteractiveBarChart 
        title="Monthly Sales" 
        description="Revenue over the selected period"
        data={chartData}
        valuePrefix="$"
      />
    </div>
  );
};
