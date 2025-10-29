#!/usr/bin/env node

import { program } from "commander";
import runFirstTimeSetup from "./src/utils/onboarding.js";
import { isFirstRun } from "./src/utils/config.js";

// Check for first run and execute onboarding if needed
if (isFirstRun()) {
  await runFirstTimeSetup();
}

process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\nGracefully shutting down...'));
  process.exit(0);
});

// Import Command files onto the program to be registered
import authCommand from "./src/commands/auth.js";
import projectCommand from "./src/commands/project.js";

program.version("Delta 0.0.1").description("Command Line Interface (CLI) application to interact with the Clockify API");

// Register commands
program.addCommand(authCommand);
program.addCommand(projectCommand);

program.parse(process.argv);