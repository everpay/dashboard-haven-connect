
import React, { useEffect } from 'react';

interface PrelineLayoutProps {
  children: React.ReactNode;
}

const PrelineLayout: React.FC<PrelineLayoutProps> = ({ children }) => {
  useEffect(() => {
    // Initialize Preline UI components when the component mounts
    import('preline/preline').then(({ HSStaticMethods }) => {
      HSStaticMethods.autoInit();
    });
    
    // Re-initialize Preline UI components when the children change
    return () => {
      import('preline/preline').then(({ HSStaticMethods }) => {
        HSStaticMethods.autoInit();
      });
    };
  }, [children]);

  return <>{children}</>;
};

export default PrelineLayout;
