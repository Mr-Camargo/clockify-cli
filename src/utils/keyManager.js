import chalk from 'chalk';
import inquirer from 'inquirer';
import {setApiKey, getApiKey, removeApiKey, getAPIKeyFile} from './config.js';
import {getUserInfo} from './userInfo.js';
import handleError from './error.js';
import ora from 'ora';

export const promptForApiKey = async () => {
  const {apiKey} = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your Clockify API key:',
      validate: (input) => {
        if (!input || input.trim().length === 0) {
          return 'API key cannot be empty';
        }
        return true;
      },
    },
  ]);
  try {
    setApiKey(apiKey);
    const spinner = ora({
      text: chalk.gray('Contacting Clockify Services...'),
      spinner: 'toggle6',
    }).start();
    try {
      const userInfo = await getUserInfo();
      spinner.stop();
      console.log(
        chalk.green(
          `\n✓ API key saved successfully! Logged in as ${userInfo.name} (${userInfo.email})\n`
        )
      );
    } catch (error) {
      spinner.fail();
      removeApiKey();
      handleError(error);
    }
  } catch (error) {
    handleError(error);
  }
};

export const promptForApiKeyImport = async () => {
  const {importKeyFile} = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'importKeyFile',
      message:
        'An API key has been found in the API_KEY file. Would you like to import it?',
      default: false,
    },
  ]);
  if (importKeyFile) {
    return await importKeyFromFile();
  }
};

export const importKeyFromFile = async (condition) => {
  try {
    if (condition === 'overwrite' && getApiKey() === (await getAPIKeyFile())) {
      return console.log(
        chalk.yellow(
          '\nYou are already logged in with the API key from the API_KEY file!'
        )
      );
    }
    const apiKey = await getAPIKeyFile();
    setApiKey(apiKey);
    const spinner = ora({
      text: chalk.gray('Contacting Clockify Services...'),
      spinner: 'toggle6',
    }).start();
    try {
      const userInfo = await getUserInfo();
      spinner.stop();
      const action =
        condition === 'overwrite' ? 'replaced from file' : 'imported from file';
      return console.log(
        chalk.green(
          `\n✓ API key ${action}! Logged in as ${userInfo.name} (${userInfo.email})\n`
        )
      );
    } catch (error) {
      spinner.stop();
      removeApiKey();
      handleError(error);
    }
  } catch (error) {
    handleError(error);
  }
};

export const importKeyFromArgument = async (apiKey) => {
  try {
    const currentApiKey = getApiKey();
    if (currentApiKey === apiKey) {
      return console.log(
        chalk.yellow(
          '\nYou are already logged in with the API key that you have provided!'
        )
      );
    }

    setApiKey(apiKey);
    const spinner = ora({
      text: chalk.gray('Contacting Clockify Services...'),
      spinner: 'toggle6',
    }).start();
    try {
      const userInfo = await getUserInfo();
      spinner.stop();
      return console.log(
        chalk.green(
          `\n✓ API key imported from argument! Logged in as ${userInfo.name} (${userInfo.email})\n`
        )
      );
    } catch (error) {
      spinner.stop();
      removeApiKey();
      handleError(error);
    }
  } catch (error) {
    handleError(error);
  }
};
