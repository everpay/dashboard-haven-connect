
import { useEffect, useState } from "react";
import { getUserCountry } from "@/utils/getCountry";

export const useGeoRestriction = () => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCountry = async () => {
      try {
        console.log("Checking country for geo-restriction...");
        const country = await getUserCountry();
        console.log("Country detected:", country);
        
        // For development/testing, we're allowing all countries
        // In production, you would implement your actual geo-restriction logic here
        setIsAllowed(true);
        
        // Example of geo-restriction logic (commented out for now):
        // const restrictedCountries = ['XX', 'YY']; // Add restricted country codes
        // setIsAllowed(!restrictedCountries.includes(country));
      } catch (error) {
        console.error("Error checking country:", error);
        // Fall back to allowing access if there's an error with the geo check
        setIsAllowed(true);
      }
    };
    
    checkCountry();
  }, []);

  return isAllowed;
};
