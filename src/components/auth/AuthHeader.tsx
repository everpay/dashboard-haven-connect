
import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        <img src="/lovable-uploads/Everpay-icon.png" alt="Logo" className="h-8 w-8" />
        <h1 className="ml-1 text-3xl font-bold text-[#19363B]">everpay</h1>
      </div>

      <div className="mt-8">
        <h1 className="text-4xl text-center items-center justify-center font-bold text-gray-900 mb-3">
          {title}
        </h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};
