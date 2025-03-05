
import { useEffect, useState } from "react";
import { getUserCountry } from "@/utils/getCountry";

export const useGeoRestriction = () => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCountry = async () => {
      const country = await getUserCountry();
      setIsAllowed(country !== "US"); // Allow if NOT in the USA
    };
    checkCountry();
  }, []);

  return isAllowed;
};
