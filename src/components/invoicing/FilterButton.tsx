
import React from 'react';
import { cn } from '@/lib/utils';

interface FilterButtonProps {
  label: string;
  count: number;
  isActive?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const FilterButton = ({ 
  label, 
  count, 
  isActive = false, 
  onClick, 
  icon 
}: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 p-4 text-center border rounded-md transition-colors",
        isActive 
          ? "bg-emerald-50 border-emerald-300 text-emerald-700" 
          : "bg-background border-border hover:bg-muted"
      )}
    >
      <div className="text-sm font-medium flex justify-center items-center gap-1">
        {icon}
        {label}
      </div>
      <div className={cn(
        "text-xl font-semibold mt-1",
        isActive ? "text-emerald-600" : "text-foreground"
      )}>
        {count}
      </div>
    </button>
  );
};
