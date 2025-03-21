
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeframeOption, timeframeOptions } from '@/utils/timeframeUtils';

interface TimeframeSelectorProps {
  currentTimeframe: TimeframeOption;
  onTimeframeChange: (timeframe: TimeframeOption) => void;
  className?: string;
}

export const TimeframeSelector = ({ 
  currentTimeframe, 
  onTimeframeChange,
  className = ''
}: TimeframeSelectorProps) => {
  console.log("Rendering TimeframeSelector with timeframe:", currentTimeframe);
  
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-sm mr-2 text-white">Timeframe:</span>
      <div className="relative">
        <Select 
          value={currentTimeframe} 
          onValueChange={(value) => onTimeframeChange(value as TimeframeOption)}
        >
          <SelectTrigger className="w-36 h-8 text-sm bg-[#1E2736] border-[#1E2736] text-white">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent className="absolute z-50 bg-[#1E2736] border-[#1E2736] text-white min-w-[140px]">
            {timeframeOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className="text-sm text-white hover:bg-[#2E3746] cursor-pointer">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
