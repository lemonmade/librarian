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
  return function processor(files, config) {
    const builder = new Builder({
      tags,
      parse,
      config,
      traverse,
      builders: customBuilders.concat(builders),
    });

    addValueEntities(customValueEntities);

    const results = files.map((file) => builder.getModule(file));

    resetValueEntities();

    return results;
  };
}
