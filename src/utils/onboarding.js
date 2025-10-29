import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import { setFirstRun } from "./config.js";
import { promptForApiKey } from "./keyManager.js";

export const runFirstTimeSetup = async () => {
    console.log(
        chalk.blue(figlet.textSync("Clockify", { horizontalLayout: "full" }))
    );
    console.log(chalk.cyan("\n👋 Welcome to Clockify CLI!"));
    console.log(chalk.gray("Looks like this is your first time running the app.\n \n"));
    console.log(chalk.gray("To make use of this CLI tool, you will need a Clockify API key.\n"));

    const { shouldSetup } = await inquirer.prompt([
        {
            type: "confirm",
            name: "shouldSetup",
            message: "Would you like to set up your API key now?",
            default: true,
        },
    ]);

    if (shouldSetup) {
        await promptForApiKey();
    } else {
        console.log(chalk.yellow("\nYou can set up your API key later by running:"));
        console.log(chalk.gray("  clockify auth login\n"));
    }

    // Mark first run as complete
    setFirstRun();
};

export default runFirstTimeSetup;