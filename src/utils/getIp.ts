
import axios from "axios";

export const getUserIp = async (): Promise<string | null> => {
  try {
    const response = await axios.get(
      `https://api.ipstack.com/check?access_key=53ba2aab72b52780f785e9d796032522`
    );
    return response.data.ip; // Returns the user's IP address
  } catch (error) {
    console.error("Error fetching user IP:", error);
    return null;
  }
};
