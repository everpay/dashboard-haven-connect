
import React from 'react';
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme/ThemeProvider";

interface VGSFormFieldProps {
  id: string;
  label: string;
  className?: string;
}

export const VGSFormField: React.FC<VGSFormFieldProps> = ({ id, label, className }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1 block">{label}</Label>
      <div 
        id={id} 
        className={`mt-1 border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} rounded-md`} 
        style={{ height: '40px', minHeight: '40px', width: '100%' }}
      />
    </div>
  );
};
