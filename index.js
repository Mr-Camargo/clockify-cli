#!/usr/bin/env node

import {program} from 'commander';
import runFirstTimeSetup from './src/utils/onboarding.js';
import {isFirstRun} from './src/utils/config.js';
import registerCommands from './src/utils/commandRegistration.js';

// Check for first run and execute onboarding if needed
if (isFirstRun()) {
  await runFirstTimeSetup();
}

program
  .version('1.0.0-delta')
  .description(
    'Command Line Interface (CLI) application to interact with the Clockify API'
  );

// Register commands

await registerCommands(program);

program.parse(process.argv);
