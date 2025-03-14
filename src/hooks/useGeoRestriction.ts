
import { useEffect, useState } from "react";
import { getUserCountry } from "@/utils/getCountry";

export const useGeoRestriction = () => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkCountry = async () => {
      try {
        console.log("Checking country for geo-restriction...");
        setIsLoading(true);
        
        // Default to allowing access during development
        // This ensures features work even if geo-detection fails
        const defaultAllow = true;
        
        try {
          const country = await getUserCountry();
          console.log("Country detected:", country);
          
          // For development/testing, we're allowing all countries
          // In production, you would implement your actual geo-restriction logic here
          setIsAllowed(true);
          
          // Example of geo-restriction logic (commented out for now):
          // const restrictedCountries = ['XX', 'YY']; // Add restricted country codes
          // setIsAllowed(!restrictedCountries.includes(country));
        } catch (countryError) {
          console.error("Error in country detection:", countryError);
          console.log("Defaulting to allowed access due to country detection error");
          // Fall back to allowing access if there's an error with the geo check
          setIsAllowed(defaultAllow);
        }
      } catch (error) {
        console.error("Critical error in geo-restriction check:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        // Fall back to allowing access if there's an error
        setIsAllowed(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkCountry();
  }, []);

  return {
    isAllowed,
    isLoading,
    error
  };
};
