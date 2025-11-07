import {Command} from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import {
  getProjects,
  findProjectById,
  findProjectByName,
} from '../api/projects.js';
import getWorkspaceInfo from '../api/workspace.js';
import {
  startTimer,
  activeTimer,
  stopTimer,
  deleteTimeEntry,
  findTimeEntries,
} from '../api/timeEntries.js';
import {timerDuration} from '../utils/timerDuration.js';
import {formatDate} from '../utils/formatDate.js';
import {spinnerConfig} from '../utils/spinnerConfig.js';
import handleError from '../utils/error.js';
import ora from 'ora';

const timerCommand = new Command('timer').description(
  'Start, stop, and manage timers'
);

timerCommand
  .command('start')
  .description('Start a new timer')
  .option('-d, --description <description>', 'what are you working on?')
  .option('-p, --project <project>', 'what project is this timer for?')
  .action(async (options) => {
    const spinner = ora(spinnerConfig).start();
    try {
      const workspaceInfo = await getWorkspaceInfo();
      const projects = await getProjects();
      if (options.project) {
        const projectId = await findProjectByName(options.project);
        if (!projectId) {
          spinner.stop();
          return console.log(
            chalk.red(
              `${options.project} is not a project in your workspace ${workspaceInfo.name}.`
            )
          );
        }
        options.project = projectId;
      }
      if (!options.description) {
        spinner.stop();
        const {description} = await inquirer.prompt([
          {
            type: 'input',
            name: 'description',
            message: 'What is this timer for?',
          },
        ]);
        options.description = description;
        spinner.start();
      }
      if (
        !options.project &&
        workspaceInfo.workspaceSettings.forceProjects === true
      ) {
        spinner.stop();
        const {selectProject} = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectProject',
            message: 'Select a project for this timer:',
            choices: projects.map((project) => ({
              name: project.name,
              value: project.id,
            })),
          },
        ]);
        options.project = selectProject;
        spinner.start();
      }
      await startTimer(options.description, options.project);
      spinner.stop();
      console.log(chalk.green('✓ Timer started successfully!'));
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });

timerCommand
  .command('stop')
  .description('Stop the current timer')
  .action(async () => {
    const spinner = ora(spinnerConfig).start();
    try {
      await stopTimer();
      spinner.stop();
      console.log(chalk.green('✓ Timer stopped successfully!'));
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });

timerCommand
  .command('status')
  .description('Check the status of the current timer')
  .action(async () => {
    const spinner = ora(spinnerConfig).start();
    try {
      const activeTimerData = await activeTimer();
      if (!activeTimerData) {
        spinner.stop();
        return console.log(
          [
            chalk.yellow('You are not currently running a timer.'),
            chalk.gray(
              `Run ${chalk.bold('clockify timer start')} to start a new timer`
            ),
          ].join('\n')
        );
      }
      const activeTimerDuration = timerDuration(
        activeTimerData.timeInterval.start
      );

      // Build message based on project presence
      let activeTimerMsg = `${chalk.white.bold(activeTimerData.description)} for ${chalk.green(activeTimerDuration)}.`;

      if (activeTimerData.projectId) {
        const project = await findProjectById(activeTimerData.projectId);
        activeTimerMsg = `${chalk.white.bold(activeTimerData.description)} ${chalk.gray(`(${project.name})`)} for ${chalk.green(activeTimerDuration)}.`;
      }

      spinner.stop();
      console.log(chalk.gray(`Currently tracking ${activeTimerMsg}`));
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });

timerCommand
  .command('delete')
  .description('Delete the latest timer or more recent timers')
  .option(
    '-n, --number <number>',
    'number of recent timers to delete',
    parseInt
  )
  .action(async (options) => {
    const spinner = ora(spinnerConfig).start();
    try {
      // validate that options.number is a positive number if provided
      if (
        options.number !== undefined &&
        (!Number.isInteger(options.number) || options.number <= 0)
      ) {
        spinner.stop();
        return handleError(
          new Error('Please provide a positive integer in the --number option.')
        );
      }

      // if options.number is 3 or more, prompt user for confirmation

      if (options.number >= 3) {
        spinner.stop();
        const {confirmDelete} = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmDelete',
            message: `Are you sure you want to delete the last ${options.number} time entries? This action cannot be undone.`,
            default: false,
          },
        ]);
        if (!confirmDelete) {
          return console.log(chalk.yellow('✓ Timer deletion cancelled.'));
        }
        spinner.start();
      }

      const desiredCount = options.number || 1;
      const deletedEntries = await deleteTimeEntry(desiredCount);
      spinner.stop();

      if (desiredCount === 1) {
        console.log(chalk.green('✓ Timer deleted successfully!'));
      } else {
        console.log(
          chalk.green(`✓ ${deletedEntries.length} timers deleted successfully!`)
        );
        // for each timer deleted, list description and time duration
        deletedEntries.forEach((entry) => {
          console.log(
            chalk.gray(
              `- ${entry.description} (${
                entry.timeInterval.duration === null
                  ? `${timerDuration(entry.timeInterval.start)}, ${chalk.bold('was running')}`
                  : timerDuration(
                      entry.timeInterval.start,
                      entry.timeInterval.end
                    )
              })`
            )
          );
        });
      }
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });

timerCommand
  .command('list')
  .description('List the latest time entries')
  .option('-n, --number <number>', 'number of recent timers to list', parseInt)
  .action(async (options) => {
    const spinner = ora(spinnerConfig).start();
    try {
      if (
        options.number !== undefined &&
        (!Number.isInteger(options.number) || options.number <= 0)
      ) {
        spinner.stop();
        return handleError(
          new Error('Please provide a positive integer in the --number option.')
        );
      } else if (options.number >= 50) {
        const {confirmList} = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmList',
            message: `Are you sure you want to list the last ${options.number} time entries? This may take a while.`,
            default: false,
          },
        ]);
        if (!confirmList) {
          return console.log(chalk.yellow('✓ Timer listing cancelled.'));
        }
      }

      const timeEntries = await findTimeEntries(options.number || 25);
      const projects = await getProjects('archived');

      spinner.stop();
      if (timeEntries.length === 0) {
        return console.log(chalk.yellow('No time entries found.'));
      }
      console.log(
        chalk.green(`✓ Here's your last ${timeEntries.length} time entries:`)
      );
      timeEntries.forEach((entry) => {
        console.log(
          chalk.gray(
            `${chalk.white.bold(entry.description)} (${
              entry.timeInterval.duration === null
                ? `${timerDuration(entry.timeInterval.start)}, ${chalk.bold('currently running')}`
                : timerDuration(
                    entry.timeInterval.start,
                    entry.timeInterval.end
                  ) + `, ${formatDate(entry.timeInterval.start)}`
            })` +
              ` | ${
                entry.projectId === null
                  ? ``
                  : `${chalk.hex(projects.find((p) => p.id === entry.projectId)?.color || '#FFFFFF')(projects.find((p) => p.id === entry.projectId)?.name || 'Unknown Project')}`
              }`
          )
        );
      });
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });

export default timerCommand;
