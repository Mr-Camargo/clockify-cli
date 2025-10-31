import axios from 'axios';
import {getApiKey} from './utils/config.js';
import {getWorkspaceInfo} from '../api/workspace.js';
import handleError from '../utils/error.js';

export const startTimer = async (taskName, projectId) => {
  const apiKey = getApiKey();
  try {
    const response = await axios.post(
      `https://api.clockify.me/api/v1/workspaces/${getWorkspaceInfo('id')}/time-entries`,
      {
        start: new Date().toISOString(),
        projectId: projectId,
        description: taskName,
        isRunning: true,
      },
      {
        headers: {
          'X-Api-Key': apiKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
