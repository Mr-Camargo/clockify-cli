import chalk from 'chalk';
import inquirer from 'inquirer';
import {setApiKey, getApiKey, removeApiKey, getAPIKeyFile} from './config.js';
import {getUserInfo} from './userInfo.js';
import {handleError} from './error.js';
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
      handleError(error);
      await removeApiKey();
      process.exit(1);
    }
  } catch (error) {
    await removeApiKey();
    handleError(error);
  }
};

export const importKeyFromFile = async (condition) => {
  try {
    if (
      condition === 'overwrite' &&
      (await getApiKey()) === (await getAPIKeyFile())
    ) {
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
      handleError(error);
    }
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

export default promptForApiKey;
