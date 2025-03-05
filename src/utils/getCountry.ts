
import axios from "axios";

export const getUserCountry = async (): Promise<string | null> => {
  try {
    const response = await axios.get(
      `https://api.ipstack.com/check?access_key=53ba2aab72b52780f785e9d796032522`
    );
    return response.data.country_code; // Returns country code (e.g., "US", "CA", "GB")
  } catch (error) {
    console.error("Error fetching user country:", error);
    return null;
  }
};
