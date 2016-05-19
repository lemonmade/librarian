import fs from 'fs';
import traverse from 'babel-traverse';
import parse from './parse';

import tags from './tags';
import classTransformer from './transformers/class';
import functionTransformer from './transformers/function';
import valueTransformer from './transformers/value';

export default function processor(file) {
  console.log(`Processing ${file} with 'librarian-plugin-javascript'`);

  const symbols = [];
  const source = fs.readFileSync(file, 'utf8');
  const ast = parse(source);

  traverse(ast, {
    ClassDeclaration(...args) { symbols.push(classTransformer(...args)); },
    FunctionDeclaration(...args) { symbols.push(functionTransformer(...args)); },
    VariableDeclarator(...args) { symbols.push(valueTransformer(...args)); },
  }, null, {filename: file, tags});

  return symbols;
}
