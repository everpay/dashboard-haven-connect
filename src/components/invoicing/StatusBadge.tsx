
import React from 'react';
import { Check, X } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusColors: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  
  const normalizedStatus = status.toLowerCase();
  const colorClass = statusColors[normalizedStatus] || 'bg-gray-100 text-gray-800';
  
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {normalizedStatus === 'paid' ? (
        <Check className="w-3 h-3 mr-1" />
      ) : normalizedStatus === 'overdue' ? (
        <X className="w-3 h-3 mr-1" />
      ) : null}
      <span className="capitalize">{normalizedStatus}</span>
    </div>
  );
};
