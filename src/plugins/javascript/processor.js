import traverse from 'babel-traverse';
import Builder from './builder';

import * as Builders from './builders';
import {addValueEntities, resetValueEntities} from './entities';
import parse from './parse';
import tags from './tags';

const builders = Object.values(Builders);

export default function createProcessor({
  customBuilders = [],
  customValueEntities = [],
} = {}) {
  const builder = new Builder(customBuilders.concat(builders));

  function processFile(filename, config) {
    config.logger(`Processing ${filename}`, {
      plugin: 'javascript',
    });

    let modulePath;

    traverse(parse(config.getSource(filename)), {
      Program: (path) => { modulePath = path; },
    });

    return Builders.moduleBuilder(modulePath, {filename, builder, tags, config});
  }

  return async function processor(files, config) {
    addValueEntities(customValueEntities);

    const processResults = files.map((file) => processFile(file, config));

    // console.log('FORCING RESOLVE');
    // process.nextTick(() => builder.resolve());

    resetValueEntities();

    return await Promise.all(processResults);
  };
}
