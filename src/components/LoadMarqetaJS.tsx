
import { useGeoRestriction } from "@/hooks/useGeoRestriction";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define the window.marqeta interface
declare global {
  interface Window {
    marqeta?: {
      initialize: (config: { 
        applicationToken: string;
        baseUrl?: string;
        adminAccessToken?: string;
      }) => void;
    };
  }
}

const LoadMarqetaJS = () => {
  const { isAllowed, isLoading: geoLoading, error: geoError } = useGeoRestriction();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  // Marqeta API credentials
  const applicationToken = '979bb5ae-d4bf-4265-a63c-1d036c81fab2';
  const adminAccessToken = 'b9fc74d2-1518-415c-934e-f0579ad1c628';
  const baseUrl = 'https://sandbox-api.marqeta.com/v3/';

  useEffect(() => {
    // Only proceed if geo-restriction check is complete and allowed
    if (geoLoading || isAllowed === null) {
      return; // Still loading geo check
    }

    if (isAllowed === false) {
      console.log("Marqeta loading blocked due to geo-restriction");
      return; // Location is not allowed
    }

    if (!isLoaded && !isError) {
      const loadMarqeta = () => {
        // Check if Marqeta is already loaded
        if (window.marqeta) {
          console.log("Marqeta already available in window object");
          initializeMarqeta();
          return;
        }

        console.log("Attempting to load Marqeta.js...");
        const script = document.createElement("script");
        script.src = "https://assets.marqeta.com/core/marqeta.js";
        script.async = true;
        
        script.onload = () => {
          console.log("Marqeta.js Loaded Successfully");
          initializeMarqeta();
        };
        
        script.onerror = (error) => {
          console.error("Failed to load Marqeta.js", error);
          setIsError(true);
          toast({
            title: "Error",
            description: "Failed to load Marqeta API",
            variant: "destructive"
          });
        };
        
        // Check if script already exists to avoid duplicates
        if (!document.querySelector('script[src="https://assets.marqeta.com/core/marqeta.js"]')) {
          document.body.appendChild(script);
        }
      };

      const initializeMarqeta = () => {
        try {
          if (window.marqeta) {
            console.log("Initializing Marqeta with:", { 
              applicationToken, 
              adminAccessToken: adminAccessToken ? "[HIDDEN]" : undefined,
              baseUrl: baseUrl || undefined
            });
            
            window.marqeta.initialize({
              applicationToken: applicationToken,
              adminAccessToken: adminAccessToken,
              baseUrl: baseUrl
            });
            
            setIsLoaded(true);
            console.log("Marqeta initialized successfully");
            
            // Show success toast
            toast({
              title: "Success",
              description: "Marqeta API initialized successfully",
              variant: "default"
            });
          } else {
            throw new Error("Marqeta object not found in window");
          }
        } catch (error) {
          console.error("Error initializing Marqeta:", error);
          setIsError(true);
          toast({
            title: "Error",
            description: "Failed to initialize Marqeta API: " + (error instanceof Error ? error.message : String(error)),
            variant: "destructive"
          });
        }
      };

      // Reduce delay before loading to ensure quicker initialization
      const timeoutId = setTimeout(() => {
        loadMarqeta();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [isAllowed, geoLoading, isLoaded, isError, toast, applicationToken, adminAccessToken, baseUrl]);

  // If error occurred, provide a retry button
  if (isError) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md z-50">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> Failed to load Marqeta API</span>
        <button 
          onClick={() => {
            setIsError(false);
            setIsLoaded(false);
          }}
          className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  return null; // This component doesn't render anything when working correctly
};

export default LoadMarqetaJS;
