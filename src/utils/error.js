import chalk from "chalk";

export const handleError = (error) => {
    if (error.name === 'ExitPromptError') {
        console.log(chalk.gray('\nBye!'));
        process.exit(2);
    }
    
    if (!error.response) {
        console.error(chalk.red(`\n✗ Network Error: ${error.message}\n`));
        return process.exit(1);
    }
    switch (error.response?.status) {
        case 401:
            console.error(chalk.red("\n✗ Unauthorized: Invalid API key. Please check your API key and try again."));
            return process.exit(1);
        case 403:
            console.error(chalk.red("\n✗ Forbidden: You do not have permission to access this resource."));
            return process.exit(1);
        case 404:
            console.error(chalk.red("\n✗ Not Found: The requested resource could not be found."));
            return process.exit(1);
        case 500:
            console.error(chalk.red("\n✗ Internal Server Error: Something went wrong with Clockify Services. Please try again later."));
            return process.exit(1);
        default:
            console.error(chalk.red(`\n✗ An error occurred: ${error.message}\n`));
            return process.exit(1);
    }
};

export default handleError;