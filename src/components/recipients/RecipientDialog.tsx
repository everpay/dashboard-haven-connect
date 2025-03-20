
import React from 'react';
import RecipientForm from '@/components/recipients/RecipientForm';
import { Recipient } from '@/types/recipient.types';

interface RecipientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<Recipient>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  isEdit?: boolean;
}

const RecipientDialog: React.FC<RecipientDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSelectChange,
  onSubmit,
  title,
  isEdit = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => onOpenChange(false)}></div>
        
        <div className="relative inline-block w-full max-w-md px-4 py-5 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl sm:max-w-lg sm:w-full">
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
          </div>
          
          <RecipientForm 
            formData={formData}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isEdit={isEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipientDialog;
