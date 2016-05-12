import fs from 'fs';
import traverse from 'babel-traverse';
import parse from './parse';

import tags from './tags';
import classTransformer from './transformers/class';
import functionTransformer from './transformers/function';

export default function processor(file) {
  console.log(`Processing ${file}`);

  const symbols = [];
  const source = fs.readFileSync(file, 'utf8');
  const ast = parse(source);

  traverse(ast, {
    ClassDeclaration(...args) { symbols.push(classTransformer(...args)); },
    FunctionDeclaration(...args) { symbols.push(functionTransformer(...args)); },
  }, null, {filename: file, tags});

  return symbols;
}
