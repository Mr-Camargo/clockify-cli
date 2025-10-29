// get user info from clockify api
import axios from "axios";
import { getApiKey } from "./config.js";
import handleError from "./error.js";

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
            handleError(error);
        }
    }
};
export default {
    getUserInfo
};