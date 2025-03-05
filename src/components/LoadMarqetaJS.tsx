
import { useGeoRestriction } from "@/hooks/useGeoRestriction";
import { useEffect } from "react";

const LoadMarqetaJS = () => {
  const isAllowed = useGeoRestriction();

  useEffect(() => {
    if (isAllowed) {
      const script = document.createElement("script");
      script.src = "https://sandbox-assets.marqeta.com/marqeta.js"; // Use production URL if needed
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Marqeta.js Loaded");
        
        // Initialize Marqeta with your application token
        if (window.marqeta) {
          window.marqeta.initialize({
            applicationToken: '979bb5ae-d4bf-4265-a63c-1d036c81fab2'
          });
        }
      };
    }
  }, [isAllowed]);

  return null; // This component doesn't render anything
};

export default LoadMarqetaJS;
