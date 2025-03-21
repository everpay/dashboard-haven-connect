
import { useState, useEffect } from 'react';

export const useVGSScriptLoader = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    // Create a function to initialize VGS Collect
    const loadVGSScript = () => {
      if (!scriptLoaded && loadAttempts < 3) {
        console.log('Attempting to load VGS script, attempt:', loadAttempts + 1);
        
        // Check if script is already in the document
        const existingScript = document.querySelector('script[src*="vgs-collect"]');
        
        if (existingScript) {
          // If script tag exists, check if VGSCollect is available
          if ((window as any).VGSCollect) {
            console.log('VGS Collect already available in window');
            setScriptLoaded(true);
            return;
          } else {
            // Script tag exists but VGSCollect isn't loaded yet, wait a bit
            const checkInterval = setInterval(() => {
              if ((window as any).VGSCollect) {
                console.log('VGS Collect became available');
                clearInterval(checkInterval);
                setScriptLoaded(true);
              }
            }, 100);
            
            // Set a timeout to clear the interval if it takes too long
            setTimeout(() => {
              clearInterval(checkInterval);
              if (!(window as any).VGSCollect) {
                setLoadAttempts(prev => prev + 1);
              }
            }, 2000);
            
            return;
          }
        }
        
        const script = document.createElement('script');
        script.src = 'https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js';
        script.async = true;
        script.id = 'vgs-collect-script';
        
        script.onload = () => {
          console.log('VGS Collect script loaded successfully');
          setScriptLoaded(true);
        };
        
        script.onerror = () => {
          console.error('Failed to load VGS Collect script, attempt:', loadAttempts + 1);
          
          // Try alternative URL on failure
          if (loadAttempts === 0) {
            const altScript = document.createElement('script');
            altScript.src = 'https://js.verygoodvault.com/vgs-collect/vgs-collect-latest.min.js';
            altScript.id = 'vgs-collect-script-alt';
            altScript.async = true;
            
            altScript.onload = () => {
              console.log('VGS Collect script loaded from alternative URL');
              setScriptLoaded(true);
            };
            
            altScript.onerror = () => {
              console.error('Failed to load VGS script from alternative URL');
              setLoadAttempts(prev => prev + 1);
            };
            
            document.body.appendChild(altScript);
          } else {
            setLoadAttempts(prev => prev + 1);
          }
        };
        
        document.body.appendChild(script);
      }
    };
    
    loadVGSScript();
    
    // Cleanup function
    return () => {
      // No need to remove scripts as they should stay loaded
    };
  }, [loadAttempts, scriptLoaded]);

  return { scriptLoaded, loadAttempts };
};
