import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import {
  setApiKey,
  getApiKey,
  removeApiKey,
  hasApiKey,
} from "../utils/config.js";
import { getUserInfo } from "../utils/userInfo.js";

const authCommand = new Command("auth").description(
  "Manage Clockify authentication"
);

authCommand
  .command("login")
  .description("Store your Clockify API key")
  .action(async () => {
    if (hasApiKey()) {
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
      } else {
        try {
          await removeApiKey();
            console.log(chalk.green("✓ Logged out successfully!"));
        } catch (error) {
          console.error(chalk.red("Failed to logout. Please try again."));
          return console.error(error);
        }
    }
    } 
    const answers = await inquirer.prompt([
      {
        type: "password",
        name: "apiKey",
        message: "Enter your Clockify API key",
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return "API key cannot be empty";
          } else {
            return true;
        }
        },
      },
    ]);

    setApiKey(answers.apiKey);
    console.log(chalk.green("✓ API key saved successfully!"));
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
    if (hasApiKey()) {
      const apiKey = getApiKey();
      const masked = apiKey.slice(0, 4) + "..." + apiKey.slice(-4);
      console.log(chalk.green("✓ Authenticated"));
      console.log(chalk.gray(`API Key: ${masked}`));
      console.log(chalk.gray("User Info:"));
      // Fetch and display user info
      const userInfo = await getUserInfo();
      console.log(chalk.gray(`Name: ${userInfo.name}`));
      console.log(chalk.gray(`Email: ${userInfo.email}`));
    } else {
      console.log(chalk.yellow("Not authenticated"));
      console.log(chalk.gray("Run 'clockify auth login' to authenticate"));
    }
  });

export default authCommand;