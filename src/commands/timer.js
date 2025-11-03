import {Command} from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import {getProjects, findProject} from '../api/projects.js';
import getWorkspaceInfo from '../api/workspace.js';
import {startTimer, activeTimer, stopTimer} from '../api/timeEntries.js';
import {timerDuration} from '../utils/timerDuration.js';
import handleError from '../utils/error.js';
import ora from 'ora';

const timerCommand = new Command('timer').description(
  'Start, stop, and manage timers'
);

timerCommand
  .command('start')
  .description('Start a new timer')
  .option('-d, --description [description]', 'what are you working on?')
  .option('-p, --project [project]', 'what project is this timer for?')
  .action(async (options) => {
    const spinner = ora({
      text: chalk.gray('Contacting Clockify Services...'),
      spinner: 'toggle6',
    }).start();
    try {
      const workspaceInfo = await getWorkspaceInfo();
      const projects = await getProjects();
      spinner.stop();
      if (!options.description) {
        const {description} = await inquirer.prompt([
          {
            type: 'input',
            name: 'description',
            message: 'What is this timer for?',
          },
        ]);
        options.description = description;
      }
      if (
        !options.project &&
        workspaceInfo.workspaceSettings.forceProjects === true
      ) {
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
      }
      await startTimer(options.description, options.project);
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
    const spinner = ora({
      text: chalk.gray('Contacting Clockify Services...'),
      spinner: 'toggle6',
    }).start();
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
    const spinner = ora({
      text: chalk.gray('Contacting Clockify Services...'),
      spinner: 'toggle6',
    }).start();
    try {
      const activeTimerData = await activeTimer();
      if (!activeTimerData) {
        spinner.stop();
        return console.log(
          [
            chalk.yellow('You are not currently running a timer.'),
            chalk.gray("Run 'clockify timer start' to start a new timer"),
          ].join('\n')
        );
      }
      let activeTimerMsg;
      if (activeTimerData) {
        if (activeTimerData.projectId) {
          const project = await findProject(activeTimerData.projectId);
          spinner.stop();
          activeTimerMsg = `${activeTimerData.description} ${chalk.gray(`(${project.name})`)} for ${chalk.green(timerDuration(activeTimerData.timeInterval.start))}.`;
          return console.log(
            chalk.gray(`Currently tracking ${activeTimerMsg}`)
          );
        } else {
          spinner.stop();
          activeTimerMsg = `${activeTimerData.description} for ${chalk.green(timerDuration(activeTimerData.timeInterval.start))}.`;
          return console.log(
            chalk.gray(`Currently tracking ${activeTimerMsg}`)
          );
        }
      } else {
        return console.log(chalk.yellow('No active timer found.'));
      }
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });

export default timerCommand;
