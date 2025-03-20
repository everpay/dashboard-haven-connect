
import axios from "axios";

interface IpInfo {
  ip: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  latitude: number;
  longitude: number;
}

/**
 * Get the user's country based on their IP address
 * @returns Promise<string> ISO-2 country code (e.g., "US", "CA", "MX")
 */
export const getUserCountry = async (): Promise<string> => {
  try {
    // For development, default to US if running locally
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Development environment detected, using US as default country');
      return 'US';
    }

    // Try multiple IP detection services in case one fails
    try {
      const response = await axios.get<IpInfo>('https://ipapi.co/json/');
      if (response.data && response.data.country_code) {
        console.log(`Country detected via ipapi.co: ${response.data.country_code}`);
        return response.data.country_code;
      }
    } catch (error) {
      console.warn('ipapi.co lookup failed, trying alternative service');
    }

    try {
      // Another IP detection service as fallback
      const response = await axios.get('https://api.ipstack.com/check?access_key=53ba2aab72b52780f785e9d796032522');
      console.log(`Country detected via ipstack: ${response.data.country_code}`);
      return response.data.country_code;
    } catch (error) {
      console.warn('ipstack lookup failed');
      
      // Last resort - use a simple IP detection service
      const response = await axios.get('https://api.ipify.org?format=json');
      const ip = response.data.ip;
      const geoResponse = await axios.get(`https://ipwho.is/${ip}`);
      console.log(`Country detected via ipwho.is: ${geoResponse.data.country_code}`);
      return geoResponse.data.country_code;
    }
  } catch (error) {
    console.error("Error fetching user country:", error);
    
    // Default to US if everything fails
    console.log("Using US as fallback country code");
    return 'US';
  }
};
