// get workspace info from clockify api
import axios from 'axios';
import {getApiKey} from '../utils/config.js';
import {getUserInfo} from './userInfo.js';
import handleError from '../utils/error.js';

export const getWorkspaceInfo = async (item) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key not found. Please login first.');
  }

  try {
    const userInfo = await getUserInfo();
    const response = await axios.get(
      `https://api.clockify.me/api/v1/workspaces/${userInfo.activeWorkspace}`,
      {
        headers: {
          'X-Api-Key': apiKey,
        },
      }
    );

    if (!item) return response.data;

    // Support nested paths like 'subdomain.name'
    const path = item.split('.');
    return path.reduce((obj, key) => obj?.[key], response.data);
  } catch (error) {
    handleError(error);
  }
};

export default getWorkspaceInfo;
