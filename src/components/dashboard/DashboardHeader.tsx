
import React, { useState, useEffect } from 'react';
import { TimeframeSelector } from '../charts/TimeframeSelector';
import { TimeframeOption } from '@/utils/timeframeUtils';

export const DashboardHeader = () => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7days');
  
  console.log("DashboardHeader rendering with timeframe:", timeframe);
  
  useEffect(() => {
    console.log("DashboardHeader mounted with timeframe:", timeframe);
  }, []);
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      
      <div className="w-full md:w-auto bg-card rounded-md px-3 py-2 border border-border">
        <TimeframeSelector 
          currentTimeframe={timeframe}
          onTimeframeChange={(newTimeframe) => {
            console.log("Timeframe changed to:", newTimeframe);
            setTimeframe(newTimeframe);
          }}
        />
      </div>
    </div>
  );
};
