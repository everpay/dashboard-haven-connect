
import { useEffect, useState } from "react";
import { getUserCountry } from "@/utils/getCountry";

// Define regions
export const REGIONS = {
  NORTH_AMERICA: ['US', 'CA', 'MX'],
  LATIN_AMERICA: ['AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HT', 'HN', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE'],
  EUROPE: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'NO', 'DK', 'FI', 'PT', 'CH', 'AT', 'GR', 'IE', 'PL', 'CZ', 'HU', 'RO'],
  ASIA_PACIFIC: ['CN', 'JP', 'KR', 'IN', 'AU', 'NZ', 'SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'HK', 'TW'],
};

export interface GeoRestrictionOptions {
  // Which regions should have access (default: all)
  allowedRegions?: string[][];
  // Default behavior if geolocation fails or is unavailable
  defaultAllow?: boolean;
  // Debug mode to force a specific country
  debugCountry?: string | null;
}

/**
 * Hook to determine if user should have access based on geographic location
 */
export const useGeoRestriction = (options: GeoRestrictionOptions = {}) => {
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Default options
  const {
    allowedRegions = [REGIONS.NORTH_AMERICA, REGIONS.LATIN_AMERICA, REGIONS.EUROPE, REGIONS.ASIA_PACIFIC],
    defaultAllow = true,
    debugCountry = null
  } = options;

  useEffect(() => {
    const checkCountry = async () => {
      try {
        console.log("Checking country for geo-restriction...");
        setIsLoading(true);
        
        let country = debugCountry;
        
        if (!debugCountry) {
          try {
            country = await getUserCountry();
            console.log("Country detected:", country);
          } catch (countryError) {
            console.error("Error in country detection:", countryError);
            console.log("Defaulting to allowed access due to country detection error");
            setIsAllowed(defaultAllow);
            return;
          }
        }
        
        if (!country) {
          console.log("Country detection failed, using default access policy");
          setIsAllowed(defaultAllow);
          return;
        }
        
        setUserCountry(country);
        
        // Determine which region the country belongs to
        let detectedRegion = null;
        for (const [regionName, countries] of Object.entries(REGIONS)) {
          if (countries.includes(country)) {
            detectedRegion = regionName;
            break;
          }
        }
        
        setUserRegion(detectedRegion);
        
        // Check if user's country is in any of the allowed regions
        const isUserAllowed = allowedRegions.some(region => 
          region.includes(country)
        );
        
        setIsAllowed(isUserAllowed);
        console.log(`Access for country ${country} is ${isUserAllowed ? 'allowed' : 'restricted'}`);
        
      } catch (error) {
        console.error("Critical error in geo-restriction check:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
        // Fall back to allowing access if there's an error
        setIsAllowed(defaultAllow);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkCountry();
  }, [allowedRegions, defaultAllow, debugCountry]);

  return {
    userCountry,
    userRegion,
    isAllowed,
    isLoading,
    error,
    isNorthAmerica: userCountry ? REGIONS.NORTH_AMERICA.includes(userCountry) : false,
    isLatinAmerica: userCountry ? REGIONS.LATIN_AMERICA.includes(userCountry) : false
  };
};

// Create specialized hooks for different payment methods
export const useItsPaidRestriction = () => {
  return useGeoRestriction({
    allowedRegions: [REGIONS.NORTH_AMERICA],
    defaultAllow: false
  });
};

export const usePrometeoRestriction = () => {
  return useGeoRestriction({
    allowedRegions: [REGIONS.LATIN_AMERICA],
    defaultAllow: false
  });
};
