// get project info from clockify api
import axios from 'axios';
import {getApiKey} from '../utils/config.js';
import {getWorkspaceInfo} from '../api/workspace.js';
import handleError from '../utils/error.js';

export const getProjects = async (options = []) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key not found. Please login first.');
  }

  try {
    const workspaceId = await getWorkspaceInfo('id');
    const response = await axios.get(
      `https://api.clockify.me/api/v1/workspaces/${workspaceId}/projects`,
      {
        headers: {
          'X-Api-Key': apiKey,
        },
      }
    );
    // exclude archived projects
    if (options.includes('archived')) {
      return response.data;
    }
    const activeProjects = response.data.filter((project) => !project.archived);
    return activeProjects;
  } catch (error) {
    handleError(error);
  }
};
