import traverse from 'babel-traverse';
import createBuilder from '../../builder';

import * as Builders from './builders';
import {addValueEntities, resetValueEntities} from './entities';
import parse from './parse';
import tags from './tags';

const builders = Object.values(Builders);

export default function createProcessor({
  customBuilders = [],
  customValueEntities = [],
} = {}) {
  return function processor({filename, source}, config) {
    config.logger(`Processing ${filename}`, {
      plugin: 'javascript',
    });

    const builder = createBuilder({
      builders: customBuilders.concat(builders),
      indexBy(path) {
        const {node} = path;
        const {loc: {start, end}} = node;
        return `${node.type}.${start.line}:${start.column}-${end.line}:${end.column}`;
      },
    });

    addValueEntities(customValueEntities);

    function processDeclaration(...args) { builder.get(...args); }

    traverse(parse(source), {
      Program: processDeclaration,
    }, null, {filename, builder, tags, config});

    resetValueEntities();

    return builder.all();
  };
}
