import Conf from "conf";

const config = new Conf({
  projectName: "clockify-cli",
  encryptionKey: "your-optional-encryption-key", // Optional: encrypts stored data
});

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

export default config;