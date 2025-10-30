import chalk from 'chalk';

const handleError = (error) => {
  if (error.name === 'ExitPromptError') {
    console.log(chalk.gray('\nBye!'));
    process.exit(2);
  }

  // Check for actual network connectivity issues
  const networkErrorCodes = [
    'ECONNREFUSED',
    'ENOTFOUND',
    'ECONNRESET',
    'ETIMEDOUT',
    'ENETUNREACH',
    'ECONNABORTED',
  ];
  if (!error.response && networkErrorCodes.includes(error.code)) {
    const message =
      error.message ||
      error.code ||
      'Unable to connect to Clockify services. Please check your internet connection.';
    console.error(chalk.red(`\n✗ Network Error: ${message}\n`));
    return process.exit(1);
  }

  switch (error.response?.status) {
    case 401:
      console.error(
        chalk.red(
          '\n✗ Unauthorized: Invalid API key. Please check your API key and try again.'
        )
      );
      return process.exit(1);
    case 403:
      console.error(
        chalk.red(
          '\n✗ Forbidden: You do not have permission to access this resource.'
        )
      );
      return process.exit(1);
    case 404:
      console.error(
        chalk.red('\n✗ Not Found: The requested resource could not be found.')
      );
      return process.exit(1);
    case 500:
      console.error(
        chalk.red(
          '\n✗ Internal Server Error: Something went wrong with Clockify Services. Please try again later.'
        )
      );
      return process.exit(1);
    default: {
      const errorMsg =
        error.message ||
        error.response?.statusText ||
        'An unknown error occurred';
      console.error(chalk.red(`\n✗ ${errorMsg}\n`));
      return process.exit(1);
    }
  }
};

export default handleError;
