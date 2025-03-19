
import React from 'react';

interface FrequencyTextProps {
  frequency: string;
}

export const FrequencyText = ({ frequency }: FrequencyTextProps) => {
  switch(frequency) {
    case 'weekly': return <span>Every week</span>;
    case 'monthly': return <span>Every month</span>;
    case 'quarterly': return <span>Every 3 months</span>;
    case 'yearly': return <span>Every year</span>;
    default: return <span>{frequency}</span>;
  }
};
