// get workspace info from clockify api
import axios from 'axios';
import {getUserInfo} from './userInfo.js';
import handleError from '../utils/error.js';
import {apiHeaders} from '../utils/apiHeaders.js';

export const getWorkspaceInfo = async (item) => {
  try {
    const userInfo = await getUserInfo();
    const response = await axios.get(
      `https://api.clockify.me/api/v1/workspaces/${userInfo.activeWorkspace}`,
      {headers: apiHeaders()}
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
