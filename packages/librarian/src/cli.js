import {run} from '.';

(async () => {
  try {
    await run();
  } catch (error) {
    console.log(error.stack);
  }
})();
