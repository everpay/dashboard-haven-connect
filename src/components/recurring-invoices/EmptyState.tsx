
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarClock, Plus } from 'lucide-react';

interface EmptyStateProps {
  onNewClick: () => void;
}

export const EmptyState = ({ onNewClick }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="pt-6 pb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-emerald-100 p-3">
            <CalendarClock className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <CardTitle className="text-xl mb-2">No recurring invoices yet</CardTitle>
        <CardDescription>
          Start automating your billing process by creating your first recurring invoice.
        </CardDescription>
        <Button 
          onClick={onNewClick} 
          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Recurring Invoice
        </Button>
      </CardContent>
    </Card>
  );
};
