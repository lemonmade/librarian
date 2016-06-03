import fs from 'fs';
import traverse from 'babel-traverse';
import parse from './parse';

import tags from './tags';

import Builder, {
  classBuilder,
  functionBuilder,
  valueBuilder,
} from './builders';

export default function processor(file, {config}) {
  config.logger(`Processing ${file}`, {
    plugin: 'javascript',
  });

  const builder = new Builder();
  const symbols = [];
  const source = fs.readFileSync(file, 'utf8');

  traverse(parse(source), {
    ClassDeclaration(...args) { symbols.push(classBuilder(...args)); },
    FunctionDeclaration(...args) { symbols.push(functionBuilder(...args)); },
    VariableDeclarator(...args) { symbols.push(valueBuilder(...args)); },
  }, null, {filename: file, builder, tags});

  return symbols;
}
