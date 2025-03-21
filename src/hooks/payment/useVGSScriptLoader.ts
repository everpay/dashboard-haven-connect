
import { useState, useEffect } from 'react';

export const useVGSScriptLoader = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src="https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js"]')) {
      setScriptLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      console.log('VGS Collect script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load VGS Collect script');
      // Try alternative CDN
      const altScript = document.createElement('script');
      altScript.src = 'https://js.verygoodvault.com/vgs-collect/vgs-collect-latest.min.js';
      altScript.id = 'vgs-collect-script-alt';
      altScript.async = true;
      document.body.appendChild(altScript);
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Cleanup function doesn't remove the script because other components might need it
    };
  }, []);
  
  return { scriptLoaded };
};
