
import React, { useState } from 'react';
import { TimeframeSelector } from '../charts/TimeframeSelector';
import { TimeframeOption } from '@/utils/timeframeUtils';

export const DashboardHeader = () => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7d');
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <TimeframeSelector 
        currentTimeframe={timeframe}
        onTimeframeChange={setTimeframe}
        className="bg-[#0F1623]"
      />
    </div>
  );
};
