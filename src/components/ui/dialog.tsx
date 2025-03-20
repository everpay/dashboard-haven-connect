
import * as React from "react";
import { cn } from "@/lib/utils";

const Dialog = ({ 
  children, 
  open, 
  onOpenChange 
}: { 
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="hs-overlay w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto">
      <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-100 transition-all w-full h-full">
        <div className="flex items-center justify-center w-full h-full">
          <div 
            onClick={() => onOpenChange(false)} 
            className="fixed inset-0 bg-black bg-opacity-50"
          />
          {children}
        </div>
      </div>
    </div>
  );
};

const DialogTrigger = ({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return <div onClick={onClick}>{children}</div>;
};

const DialogContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative bg-white border shadow-sm rounded-xl max-w-lg w-full m-3 p-4 overflow-y-auto",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 mb-4", className)}
      {...props}
    />
  );
};

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex justify-end gap-2 mt-6", className)}
      {...props}
    />
  );
};

const DialogTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
};

const DialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
};
