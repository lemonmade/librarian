import fs from 'fs';
import traverse from 'babel-traverse';
import parse from './parse';

import tags from './tags';
import classTransformer from './transformers/class';
import functionTransformer from './transformers/function';
import valueTransformer from './transformers/value';

export default function processor(file, {config}) {
  config.logger(`Processing ${file}`, {
    plugin: 'javascript',
  });

  const symbols = [];
  const source = fs.readFileSync(file, 'utf8');

  traverse(parse(source), {
    ClassDeclaration(...args) { symbols.push(classTransformer(...args)); },
    FunctionDeclaration(...args) { symbols.push(functionTransformer(...args)); },
    VariableDeclarator(...args) { symbols.push(valueTransformer(...args)); },
  }, null, {filename: file, library: config.library, tags});

  return symbols;
}
