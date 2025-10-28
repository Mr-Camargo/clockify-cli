#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import authCommand from "./src/commands/auth.js";
import projectCommand from "./src/commands/project.js";

program.version("Delta 0.0.1").description("Command Line Interface (CLI) application to interact with the Clockify API");

console.log(
  chalk.blue(figlet.textSync("Clockify", { horizontalLayout: "full" }))
);

// Register commands
program.addCommand(authCommand);

// Add more commands as needed
// program.addCommand(timeEntryCommand);
program.addCommand(projectCommand);

program.parse(process.argv);