
import axios from "axios";
import { supabase } from "@/lib/supabase";

interface GeoLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  region?: string;
}

// Function to get user's current geolocation
export const getCurrentLocation = (): Promise<GeoLocation> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          // Fallback to IP-based location
          getLocationFromIP()
            .then(resolve)
            .catch(reject);
        }
      );
    } else {
      // Fallback to IP-based location if geolocation is not supported
      getLocationFromIP()
        .then(resolve)
        .catch(reject);
    }
  });
};

// Function to get location from IP address using ipstack API
export const getLocationFromIP = async (): Promise<GeoLocation> => {
  try {
    const response = await axios.get(
      `https://api.ipstack.com/check?access_key=53ba2aab72b52780f785e9d796032522`
    );
    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      city: response.data.city,
      country: response.data.country_code,
      region: response.data.region_name
    };
  } catch (error) {
    console.error("Error fetching location from IP:", error);
    // Return a default location (0,0) if all methods fail
    return { latitude: 0, longitude: 0 };
  }
};

// Function to log the transaction with location data
export const logTransactionLocation = async (
  transactionId: string,
  amount: number,
  merchantId: string,
  paymentMethod: string,
  customerEmail: string,
  currency: string = "USD"
): Promise<void> => {
  try {
    // Get the current location
    const location = await getCurrentLocation();
    
    // Create a PostgreSQL POINT string representation
    const pointString = `POINT(${location.longitude} ${location.latitude})`;
    
    // Log transaction data to the database with location
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          id: transactionId,
          merchant_id: merchantId,
          amount: amount,
          currency: currency,
          payment_method: paymentMethod,
          customer_email: customerEmail,
          location: pointString,
          status: "completed",
          ip_address: await getUserIp()
        }
      ]);

    if (error) {
      console.error("Error logging transaction location:", error);
    } else {
      console.log("Transaction location logged successfully:", data);
    }
  } catch (error) {
    console.error("Failed to log transaction location:", error);
  }
};

// Get the user's IP address
export const getUserIp = async (): Promise<string> => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    console.error("Error fetching user IP:", error);
    return "0.0.0.0"; // Return a placeholder IP if fetching fails
  }
};

// Format the location for display
export const formatLocation = (location: GeoLocation): string => {
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.region) parts.push(location.region);
  if (location.country) parts.push(location.country);
  
  return parts.join(", ") || "Unknown Location";
};
