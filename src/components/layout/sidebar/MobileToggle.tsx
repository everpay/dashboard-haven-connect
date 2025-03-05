
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MobileToggleProps = {
  mobileOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
};

export const MobileToggle: React.FC<MobileToggleProps> = ({ 
  mobileOpen, 
  toggleMobile, 
  closeMobile 
}) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobile}
      >
        <Menu size={24} />
      </Button>

      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden bg-black/50 transition-opacity',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMobile}
      />
    </>
  );
};
