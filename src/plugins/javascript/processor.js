import fs from 'fs';
import traverse from 'babel-traverse';
import parse from './parse';

import classTransformer from './transformers/class';
import functionTransformer from './transformers/function';

export default function processor(file) {
  console.log(`Processing ${file}`);

  const symbols = [];
  const source = fs.readFileSync(file, 'utf8');
  const ast = parse(source);

  traverse(ast, {
    ClassDeclaration(path) { symbols.push(classTransformer(path)); },
    FunctionDeclaration(path) { symbols.push(functionTransformer(path)); },
  });

  return symbols;
}
