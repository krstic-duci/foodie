import chalk from "chalk";

export default {
  info: (...args: any) => console.log(chalk.cyan(...args)),
  warning: (...args: any) => console.log(chalk.yellow(...args)),
  error: (...args: any) => console.log(chalk.red(...args)),
  obj: (...args: any) => console.log(chalk.cyan(JSON.stringify(args, null, 2)))
};
