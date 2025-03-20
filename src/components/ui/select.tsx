
import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          "py-2 px-3 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500",
          className
        )}
        ref={ref}
        {...props}
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);

Select.displayName = "Select";

const SelectTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { id?: string }
>(({ className, id, children, ...props }, ref) => {
  return (
    <div 
      ref={ref} 
      id={id}
      className={cn(
        "relative py-2 px-3 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus-within:border-blue-500 focus-within:ring-blue-500",
        className
      )}
      {...props}
    >
      {children}
      <span className="absolute top-1/2 right-3 -translate-y-1/2">
        <svg className="h-3.5 w-3.5 text-gray-500" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
    </div>
  );
});

SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span 
      ref={ref} 
      className={cn("block truncate", className)} 
      {...props} 
    />
  );
});

SelectValue.displayName = "SelectValue";

const SelectContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
      {children}
    </div>
  );
};

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

SelectItem.displayName = "SelectItem";

export { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
};
