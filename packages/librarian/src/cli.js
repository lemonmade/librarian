import cli from 'commander';
import {run} from '.';

cli
  .version('0.0.1');

cli
  .command('do-something')
  .option('-f, --fun', 'Make it fun!')
  .action((...args) => console.log(args));

cli
  .command('*')
  .option('-c, --[no-]cache', 'Whether to use the cache or not')
  .action((args) => console.log(args));

cli.parse(process.argv);

// console.log(cli);

// if (options.version) {
//   console.log('0.0.1');
// } else {
//   (async () => {
//     try {
//       await run();
//     } catch (error) {
//       console.log(error.stack);
//     }
//   })();
// }
