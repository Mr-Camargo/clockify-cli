import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import {
  getApiKey,
  removeApiKey,
  hasApiKey, hasAPIKeyFile, getAPIKeyFile,
  setApiKey
} from "../utils/config.js";
import { getUserInfo } from "../utils/userInfo.js";
import { promptForApiKey } from "../utils/keyManager.js";
import handleError from "../utils/error.js";
import ora from "ora";

const authCommand = new Command("auth").description(
  "Manage Clockify authentication"
);

authCommand
  .command("login")
  .description("Store your Clockify API key")
  .action(async () => {
    try {
      if (hasAPIKeyFile() && !hasApiKey()) {
        const { importKeyFile } = await inquirer.prompt([
          {
            type: "confirm",
            name: "importKeyFile",
            message: "An API key has been found in the API_KEY file. Would you like to import it?",
            default: false,
          },
        ]);
        if (importKeyFile) {
          try {
            const apiKey = await getAPIKeyFile();
            setApiKey(apiKey);
            const spinner = ora({
              text: chalk.gray("Contacting Clockify Services..."),
              spinner: "toggle6",
            }).start();
            try {
              const userInfo = await getUserInfo();
              spinner.stop();
              return console.log(chalk.green(`\n✓ API key imported from file! Logged in as ${userInfo.name} (${userInfo.email})\n`));
            } catch (error) {
              spinner.stop();
              handleError(error);
            }
          } catch (error) {
            console.log(error);
            handleError(error);
          }
        }
      }

      if (hasAPIKeyFile() && hasApiKey()) {
        const apiKey = await getAPIKeyFile();
        const { overwriteWithAPIKeyFile } = await inquirer.prompt([
          {
            type: "confirm",
            name: "overwriteWithAPIKeyFile",
            message: "You are already logged in, although an API key has been found in the API_KEY file. Would you like to import it?",
            default: false,
          },
        ]);

        if (overwriteWithAPIKeyFile) {
          try {
            if (getApiKey() === apiKey) {
              return console.log(chalk.yellow("\nYou are already logged in with the API key from the API_KEY file!"));
            }
            setApiKey(apiKey);
            const userInfo = await getUserInfo();
            return console.log(chalk.green(`\n✓ API key imported from file! Logged in as ${userInfo.name} (${userInfo.email})\n`));
          } catch (error) {
            return handleError(error);
          }
        }
      }

      if (hasApiKey()) {
        console.log(getApiKey());
        const { confirm } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: "An API key is already stored. Would you like to logout and continue?",
            default: false,
          },
        ]);

        if (!confirm) {
          return;
        }

        try {
          await removeApiKey();
          console.log(getApiKey());
          console.log(chalk.green("\n✓ Logged out successfully!"));
        } catch (error) {
          console.error(chalk.red("\n✗ Failed to logout. Please try again."));
          return console.error(chalk.red(error));
        }
      }

      await promptForApiKey();
    } catch (error) {
      handleError(error);
    }
  });

authCommand
  .command("logout")
  .description("Remove stored API key")
  .action(async () => {
    if (!hasApiKey()) {
      console.log(chalk.yellow("No API key stored."));
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Are you sure you want to log out and remove your API key?",
        default: false,
      },
    ]);

    if (confirm) {
      try {
        await removeApiKey();
        console.log(chalk.green("✓ API key removed successfully!"));
      } catch (error) {
        console.error(chalk.red("Failed to remove API key. Please try again."));
        return console.error(error);
      }
    } else {
      console.log(chalk.blue("That won't happen then. You are still logged in."));
    }
  });

authCommand
  .command("status")
  .description("Check authentication status")
  .action(async () => {
    if (!hasApiKey()) {
      return console.log([chalk.yellow("Not authenticated"), chalk.gray("Run 'clockify auth login' to authenticate")].join("\n"));
    }

    const apiKey = getApiKey();
    const masked = apiKey.slice(0, 4) + "..." + apiKey.slice(-4);

    const spinner = ora({
      text: chalk.gray("Contacting Clockify Services..."),
      spinner: "toggle6",
    }).start();

    try {
      const userInfo = await getUserInfo();
      spinner.stop();

      console.log([
        chalk.green("✓ Authenticated"),
        chalk.gray(`API Key: ${masked}`),
        chalk.gray("User Info:"),
        chalk.gray(`  Name: ${userInfo.name}`),
        chalk.gray(`  Email: ${userInfo.email}`),
      ].join("\n"));
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });

export default authCommand;