
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
      };
    }
  }, [isAllowed]);

  return null; // This component doesn't render anything
};

export default LoadMarqetaJS;
