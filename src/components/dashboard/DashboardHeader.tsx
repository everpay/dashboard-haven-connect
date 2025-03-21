
import React, { useState, useEffect } from 'react';
import { TimeframeSelector } from '../charts/TimeframeSelector';
import { TimeframeOption } from '@/utils/timeframeUtils';

export const DashboardHeader = () => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7days');
  
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      
      <div className="w-full md:w-auto rounded-md px-3 py-2 border border-border">

      </div>
    </div>
  );
};
