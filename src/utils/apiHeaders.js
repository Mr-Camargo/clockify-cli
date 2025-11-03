import {getApiKey} from '../utils/config.js';

export const apiHeaders = () => ({
  'X-Api-Key': getApiKey(),
  'Content-Type': 'application/json',
});
