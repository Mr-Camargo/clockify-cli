// get user info from clockify api
import axios from 'axios';
import handleError from '../utils/error.js';
import {apiHeaders} from '../utils/apiHeaders.js';

export const getUserInfo = async () => {
  try {
    const response = await axios.get('https://api.clockify.me/api/v1/user', {
      headers: apiHeaders(),
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
