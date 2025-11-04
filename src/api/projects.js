// get project info from clockify api
import axios from 'axios';
import {getWorkspaceInfo} from '../api/workspace.js';
import handleError from '../utils/error.js';
import {apiHeaders} from '../utils/apiHeaders.js';

export const getProjects = async (options = []) => {
  try {
    const workspaceId = await getWorkspaceInfo('id');
    const response = await axios.get(
      `https://api.clockify.me/api/v1/workspaces/${workspaceId}/projects`,
      {headers: apiHeaders()}
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

export const findProjectById = async (projectId) => {
  try {
    const workspaceId = await getWorkspaceInfo('id');
    const response = await axios.get(
      `https://api.clockify.me/api/v1/workspaces/${workspaceId}/projects`,
      {headers: apiHeaders()}
    );
    return response.data.find((proj) => proj.id === projectId) || null;
  } catch (error) {
    handleError(error);
  }
};

export const findProjectByName = async (projectName) => {
  try {
    const workspaceId = await getWorkspaceInfo('id');
    const response = await axios.get(
      `https://api.clockify.me/api/v1/workspaces/${workspaceId}/projects`,
      {headers: apiHeaders()}
    );
    return response.data.find((proj) => proj.name === projectName)?.id || null;
  } catch (error) {
    handleError(error);
  }
};
