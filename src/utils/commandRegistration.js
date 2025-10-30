import {readdir} from 'fs/promises';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const registerCommands = async (program) => {
  // Get the path to the commands directory
  const commandsDir = join(__dirname, '../commands');

  try {
    // Read all files in the commands directory
    const files = await readdir(commandsDir);

    // Filter for .js files only
    const commandFiles = files.filter(
      (file) => file.endsWith('.js') && !file.endsWith('.test.js')
    );

    // Dynamically import and register each command
    for (const file of commandFiles) {
      const filePath = join(commandsDir, file);
      // Dynamic import - works with ES modules
      const {default: command} = await import(filePath);

      if (command) {
        program.addCommand(command);
      }
    }
  } catch (error) {
    console.error('Error loading commands:', error);
  }
};

export default registerCommands;
