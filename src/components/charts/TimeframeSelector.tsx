
import React, { useEffect } from 'react';
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
  // Ensure the currentTimeframe is valid
  useEffect(() => {
    if (!currentTimeframe || !timeframeOptions.some(option => option.value === currentTimeframe)) {
      console.log("Setting default timeframe in TimeframeSelector component");
      onTimeframeChange('7days');
    }
  }, [currentTimeframe, onTimeframeChange]);
  
  const handleTimeframeChange = (value: string) => {
    console.log("TimeframeSelector - changing timeframe to:", value);
    onTimeframeChange(value as TimeframeOption);
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-sm mr-2 text-foreground">Timeframe:</span>
      <div className="relative">
        <Select 
          value={currentTimeframe} 
          onValueChange={handleTimeframeChange}
          defaultValue="7days"
        >
          <SelectTrigger className="w-36 h-8 text-sm bg-card border-input text-foreground">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-foreground min-w-[140px]">
            {timeframeOptions.map(option => (
              <SelectItem 
                key={option.value} 
                value={option.value} 
                className="text-sm text-foreground hover:bg-accent cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
