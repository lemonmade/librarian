import chalk from 'chalk';

const INFO = 'info';
const WARNING = 'warning';
const ERROR = 'error';

const COLORS = {
  [INFO]: chalk.blue.bind(chalk),
  [WARNING]: chalk.yellow.bind(chalk),
  [ERROR]: chalk.red.bind(chalk),
};

export default function createLogger() {
  function log(message, {type = INFO, plugin} = {}) {
    let finalMessage = `${COLORS[type](type)} ${message}`;

    if (plugin) {
      finalMessage += ` ${chalk.dim(`[plugin: ${plugin}]`)}`;
    }

    console.log(finalMessage);
  }

  log.INFO = INFO;
  log.WARNING = WARNING;
  log.ERROR = ERROR;

  return log;
}
