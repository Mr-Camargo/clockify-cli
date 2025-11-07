import axios from 'axios';
import {getWorkspaceInfo} from '../api/workspace.js';
import {getUserInfo} from './userInfo.js';
import handleError from '../utils/error.js';
import {apiHeaders} from '../utils/apiHeaders.js';

export const startTimer = async (description, projectId) => {
  try {
    const response = await axios.post(
      `https://api.clockify.me/api/v1/workspaces/${await getWorkspaceInfo('id')}/time-entries`,
      {
        description: description,
        tagIds: [],
        taskId: null,
        projectId: projectId,
        timeInterval: {
          start: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
          end: null,
          duration: null,
        },
      },
      {headers: apiHeaders()}
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const activeTimer = async () => {
  try {
    const userInfo = await getUserInfo();
    const response = await axios.get(
      `https://api.clockify.me/api/v1/workspaces/${userInfo.activeWorkspace}/user/${userInfo.id}/time-entries`,
      {headers: apiHeaders()}
    );
    if (!response.data[0]?.timeInterval.end) {
      return response.data[0];
    }
    return null;
  } catch (error) {
    handleError(error);
  }
};

export const stopTimer = async () => {
  try {
    const activeTimerData = await activeTimer();
    if (!activeTimerData) {
      return Promise.reject(new Error('No active timer found.'));
    }
    const userInfo = await getUserInfo();
    const response = await axios.patch(
      `https://api.clockify.me/api/v1/workspaces/${userInfo.activeWorkspace}/user/${userInfo.id}/time-entries`,
      {
        end: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
      },
      {headers: apiHeaders()}
    );
    return response.data[0];
  } catch (error) {
    handleError(error);
  }
};

export const findTimeEntries = async (count) => {
  try {
    if (count < 0 || !Number.isInteger(count)) {
      return Promise.reject(new Error('Count must be a positive integer.'));
    }
    const userInfo = await getUserInfo();
    const response = await axios.get(
      `https://api.clockify.me/api/v1/workspaces/${userInfo.activeWorkspace}/user/${userInfo.id}/time-entries`,
      {headers: apiHeaders(), params: {'page-size': count}}
    );
    // if there are any time entries, return the data of the time entries
    if (response.data.length === 0) {
      return Promise.reject(new Error('No time entries found.'));
    }
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteTimeEntry = async (count) => {
  try {
    if (count <= 0 || !Number.isInteger(count)) {
      return Promise.reject(new Error('Count must be a positive integer.'));
    }

    // Fetch user info and time entries in parallel
    const [userInfo, timeEntry] = await Promise.all([
      getUserInfo(),
      findTimeEntries(count),
    ]);

    await Promise.all(
      timeEntry.map((entry) =>
        axios.delete(
          `https://api.clockify.me/api/v1/workspaces/${userInfo.activeWorkspace}/time-entries/${entry.id}`,
          {headers: apiHeaders()}
        )
      )
    );

    return timeEntry;
  } catch (error) {
    handleError(error);
  }
};
