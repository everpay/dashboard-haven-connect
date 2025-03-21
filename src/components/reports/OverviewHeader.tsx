
import React from 'react';
import { TimeframeSelector } from "@/components/charts/TimeframeSelector";
import { TimeframeOption } from "@/utils/timeframeUtils";

interface OverviewHeaderProps {
  timeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
}

export const OverviewHeader = ({ timeframe, onTimeframeChange }: OverviewHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Reports Overview</h1>
        <p className="text-muted-foreground text-sm">View key metrics and analytics for your business</p>
      </div>
      <TimeframeSelector 
        currentTimeframe={timeframe} 
        onTimeframeChange={onTimeframeChange} 
        className="mt-2 md:mt-0"
      />
    </div>
  );
};
