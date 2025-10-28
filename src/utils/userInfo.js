// get user info from clockify api
import axios from "axios";
import { getApiKey } from "./config.js";

export const getUserInfo = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("API key not found. Please login first.");
    } else {
        try {
            const response = await axios.get("https://api.clockify.me/api/v1/user", {
                headers: {
                    "X-Api-Key": apiKey
                }
            });
            return response.data;
        }
        catch (error) {
            throw new Error("Failed to fetch user info from Clockify API: " + error.message);
        }
    }
};
export default {
    getUserInfo
};