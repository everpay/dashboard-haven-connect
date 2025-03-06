
import { useGeoRestriction } from "@/hooks/useGeoRestriction";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const LoadMarqetaJS = () => {
  const isAllowed = useGeoRestriction();
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAllowed && !isLoaded) {
      const script = document.createElement("script");
      script.src = "https://sandbox-assets.marqeta.com/marqeta.js"; // Use production URL if needed
      script.async = true;
      
      script.onload = () => {
        console.log("Marqeta.js Loaded Successfully");
        
        // Initialize Marqeta with your application token
        if (window.marqeta) {
          window.marqeta.initialize({
            applicationToken: '979bb5ae-d4bf-4265-a63c-1d036c81fab2'
          });
          setIsLoaded(true);
          console.log("Marqeta initialized with application token");
        } else {
          console.error("Marqeta object not found in window");
          toast({
            title: "Error",
            description: "Failed to initialize Marqeta API",
            variant: "destructive"
          });
        }
      };
      
      script.onerror = () => {
        console.error("Failed to load Marqeta.js");
        toast({
          title: "Error",
          description: "Failed to load Marqeta API",
          variant: "destructive"
        });
      };
      
      if (!document.querySelector('script[src="https://sandbox-assets.marqeta.com/marqeta.js"]')) {
        document.body.appendChild(script);
      } else {
        if (window.marqeta) {
          window.marqeta.initialize({
            applicationToken: '979bb5ae-d4bf-4265-a63c-1d036c81fab2'
          });
          setIsLoaded(true);
          console.log("Marqeta already loaded and initialized");
        }
      }
    }
  }, [isAllowed, isLoaded, toast]);

  return null; // This component doesn't render anything
};

export default LoadMarqetaJS;
