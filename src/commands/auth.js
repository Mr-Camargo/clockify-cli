import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import {
  setApiKey,
  getApiKey,
  removeApiKey,
  hasApiKey,
} from "../utils/config.js";

const authCommand = new Command("auth").description(
  "Manage Clockify authentication"
);

authCommand
  .command("login")
  .description("Store your Clockify API key")
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: "password",
        name: "apiKey",
        message: "Enter your Clockify API key:",
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return "API key cannot be empty";
          }
          return true;
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
        message: "Are you sure you want to remove your API key?",
        default: false,
      },
    ]);

    if (confirm) {
      removeApiKey();
      console.log(chalk.green("✓ API key removed successfully!"));
    } else {
      console.log(chalk.blue("Cancelled."));
    }
  });

authCommand
  .command("status")
  .description("Check authentication status")
  .action(() => {
    if (hasApiKey()) {
      const apiKey = getApiKey();
      const masked = apiKey.slice(0, 4) + "..." + apiKey.slice(-4);
      console.log(chalk.green("✓ Authenticated"));
      console.log(chalk.gray(`API Key: ${masked}`));
    } else {
      console.log(chalk.yellow("Not authenticated"));
      console.log(chalk.gray("Run 'clockify auth login' to authenticate"));
    }
  });

export default authCommand;