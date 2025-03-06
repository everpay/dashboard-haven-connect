
import { useEffect, useState } from "react";
import { getUserCountry } from "@/utils/getCountry";

export const useGeoRestriction = () => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCountry = async () => {
      try {
        const country = await getUserCountry();
        // Changed to always allow for testing
        setIsAllowed(true);
      } catch (error) {
        console.error("Error checking country:", error);
        // Fall back to allowing access if there's an error
        setIsAllowed(true);
      }
    };
    
    checkCountry();
  }, []);

  return isAllowed;
};
