
import { sub, format } from 'date-fns';

export type TimeframeOption = '7days' | '14days' | '30days';

export interface TimeframeFilter {
  label: string;
  value: TimeframeOption;
  days: number;
}

export const timeframeOptions: TimeframeFilter[] = [
  { label: 'Last 7 Days', value: '7days', days: 7 },
  { label: 'Last 14 Days', value: '14days', days: 14 },
  { label: 'Last 30 Days', value: '30days', days: 30 },
];

export const getStartDateFromTimeframe = (timeframe: TimeframeOption): Date => {
  const days = timeframeOptions.find(option => option.value === timeframe)?.days || 7;
  return sub(new Date(), { days });
};

export const formatDateRange = (timeframe: TimeframeOption): string => {
  const startDate = getStartDateFromTimeframe(timeframe);
  const endDate = new Date();
  
  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
};

export const filterDataByTimeframe = <T extends { date: string; }>(
  data: T[], 
  timeframe: TimeframeOption
): T[] => {
  const startDate = getStartDateFromTimeframe(timeframe);
  return data.filter(item => new Date(item.date) >= startDate);
};
