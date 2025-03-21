
import React from 'react';
import { Label } from "@/components/ui/label";

interface VGSFormFieldProps {
  id: string;
  label: string;
  className?: string;
}

export const VGSFormField: React.FC<VGSFormFieldProps> = ({ id, label, className }) => {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1 block">{label}</Label>
      <div id={id} className="mt-1" style={{ height: '40px' }} />
    </div>
  );
};
