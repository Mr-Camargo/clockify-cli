import chalk from "chalk";
import inquirer from "inquirer";
import { setApiKey, removeApiKey } from "./config.js";
import { getUserInfo } from "./userInfo.js";
import { handleError } from "./error.js";

export const promptForApiKey = async () => {
    const { apiKey } = await inquirer.prompt([
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
    try {
        setApiKey(apiKey);
        try {
            const userInfo = await getUserInfo();
            console.log(chalk.green(`\n✓ API key saved successfully! Logged in as ${userInfo.name} (${userInfo.email})\n`));
        } catch (error) {
            handleError(error);
            removeApiKey();
            process.exit(1);
        }
    } catch (error) {
        removeApiKey();
        handleError(error);
    }
};

export default promptForApiKey;