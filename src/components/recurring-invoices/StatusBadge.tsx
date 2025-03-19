
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const colorMap: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  
  return (
    <Badge variant="outline" className={`${colorMap[status] || 'bg-gray-100 text-gray-800'} capitalize`}>
      {status}
    </Badge>
  );
};
