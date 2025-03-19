
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, X } from 'lucide-react';

interface AlertBannerProps {
  onSetUpClick: () => void;
}

export const AlertBanner = ({ onSetUpClick }: AlertBannerProps) => {
  return (
    <Alert variant="success" className="bg-[hsl(var(--alert-success-background))] border-[hsl(var(--alert-success-border))]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-emerald-100/20 rounded-full">
            <FileText className="h-4 w-4 text-[hsl(var(--alert-success-foreground))]" />
          </div>
          <AlertDescription className="text-sm alert-success-text">
            Set up recurring invoices to automate your billing process.
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="link" 
            className="text-[hsl(var(--alert-success-foreground))] px-2 py-1 h-auto"
            onClick={onSetUpClick}
          >
            Set Up Now
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-[hsl(var(--alert-success-foreground))]">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};
