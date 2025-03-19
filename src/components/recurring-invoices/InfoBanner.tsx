
import React from 'react';
import { CalendarClock } from 'lucide-react';

export const InfoBanner = () => {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-emerald-100 rounded-full">
          <CalendarClock className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">What are recurring invoices?</h3>
          <p className="text-sm text-gray-600 mt-1">
            Recurring invoices automatically send invoices to your customers at regular intervals.
            Set up once and your invoices will be automatically created and sent according to your schedule.
          </p>
        </div>
      </div>
    </div>
  );
};
