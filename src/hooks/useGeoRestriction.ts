
import { useEffect, useState } from "react";
import { getUserCountry } from "@/utils/getCountry";

export const useGeoRestriction = () => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCountry = async () => {
      const country = await getUserCountry();
      // Changed to allow all countries for testing purposes
      setIsAllowed(true);
    };
    checkCountry();
  }, []);

  return isAllowed;
};
