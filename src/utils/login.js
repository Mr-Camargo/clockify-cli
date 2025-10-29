import axios from "axios";
import { getApiKey } from "./config.js";
import { handleError } from "./error.js";

export const pingClockifyServer = async () => {
    try {
        const apiKey = getApiKey();
        const response = await axios.get("https://api.clockify.me/api/v1/user", {
                headers: {
                    "X-Api-Key": apiKey
                }
            });
            return response.data;
    } catch (error) {
        handleError(error);
    }
};

export default pingClockifyServer;