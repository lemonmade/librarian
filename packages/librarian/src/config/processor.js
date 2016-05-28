export default class Processor {
  processors = [];

  add(processor) {
    validateProcessor(processor);
    this.processors.push(processor);
  }

  remove(processor) {
    const {processors} = this;
    const index = typeof processor === 'function'
      ? processors.findIndex((aProcessor) => aProcessor.process === processor)
      : processors.indexOf(processor);

    if (index >= 0) {
      this.processors.splice(index, 1);
    }
  }

  async process(file, ...args) {
    const matchingProcessor = this.processors.find(({match}) => checkMatchAgainstFile(match, file));
    return matchingProcessor
      ? await matchingProcessor.process(file, ...args)
      : null;
  }
}

function checkMatchAgainstFile(match, file) {
  if (match instanceof RegExp) {
    return match.test(file);
  }

  if (typeof match === 'function') {
    return match(file);
  }

  return false;
}

function validateProcessor(processor) {
  const violations = ['name', 'match', 'process'].filter((possibleViolation) => (
    !processor.hasOwnProperty(possibleViolation)
  ));

  if (violations.length) {
    throw new Error(`Your processor ${processor.name ? `(${processor.name}) ` : ''}is invalid. It needs the following method${violations.length > 1 ? 's' : ''}: ${violations.map((violation) => `\`${violation}\``).join(', ')}`);
  }
}
