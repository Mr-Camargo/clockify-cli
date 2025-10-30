import {Command} from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import {
  getApiKey,
  removeApiKey,
  hasApiKey,
  hasAPIKeyFile,
} from '../utils/config.js';
import {getUserInfo} from '../utils/userInfo.js';
import {
  promptForApiKey,
  importKeyFromFile,
  importKeyFromArgument,
  promptForApiKeyImport,
} from '../utils/keyManager.js';
import handleError from '../utils/error.js';
import ora from 'ora';
