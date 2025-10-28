// Example: src/commands/project.js
import { Command } from "commander";

const projectCommand = new Command("project")
  .description("Manage Clockify projects");

projectCommand
  .command("list")
  .description("List all projects")
  .action(async () => {
    // Implementation
  });

projectCommand
  .command("create")
  .description("Create a new project")
  .option("-n, --name <name>", "Project name")
  .action(async (options) => {
    // Implementation
  });

export default projectCommand;