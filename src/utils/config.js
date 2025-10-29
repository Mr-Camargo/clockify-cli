import Conf from "conf";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import handleError from "./error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const API_KEY_PATH = path.join(projectRoot, "API_KEY");

const config = new Conf({
  projectName: "clockify-cli",
  encryptionKey: "your-optional-encryption-key",
});

export const isFirstRun = () => {
  return !config.has("firstRun");
};

export const setFirstRun = () => {
  return config.set("firstRun", false);
};

export const setApiKey = (apiKey) => {
  config.set("apiKey", apiKey);
};

export const getApiKey = () => {
  return config.get("apiKey");
};

export const removeApiKey = () => {
  config.delete("apiKey");
};

export const hasApiKey = () => {
  return config.has("apiKey");
};

export const setWorkspaceId = (workspaceId) => {
  config.set("workspaceId", workspaceId);
};

export const getWorkspaceId = () => {
  return config.get("workspaceId");
};

export const hasAPIKeyFile = async () => {
  try {
    await fs.access(API_KEY_PATH);
    return true;
  } catch {
    return false;
  }
};

export const getAPIKeyFile = async () => {
  if (!await hasAPIKeyFile()) {
    throw new Error(handleError("API key file does not exist."));
  } else {
    try {
      const content = await fs.readFile(API_KEY_PATH, 'utf8');
      return content.trim();
    } catch {
      return false;
    }
  }
};

export default config;