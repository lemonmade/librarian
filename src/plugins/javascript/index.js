/* eslint no-console: 0 */

import fs from 'fs';
import path from 'path';
import traverse from 'babel-traverse';
import {render as prettyJSONRender} from 'prettyjson';

import parse from './parse';
import symbolize from './symbolize';

function print(object) {
  console.log(prettyJSONRender(object));
}

const contents = fs.readFileSync(
  path.resolve(__dirname, '../test/fixtures/complex-component.js')
).toString();

const ast = parse(contents);
const allExports = {};

function visitExportDefaultDeclaration(exportDefaultDeclaration) {
  const declarationPath = exportDefaultDeclaration.get('declaration');
  allExports.default = symbolize(declarationPath);
}

function visitNamedExportDeclaration(namedExportDeclarationPath) {
  if (namedExportDeclarationPath.has('declaration')) {
    const declarationPath = namedExportDeclarationPath.get('declaration');
    const newExport = symbolize(declarationPath);
    allExports[newExport.name] = newExport;
  }

  namedExportDeclarationPath.get('specifiers').forEach((specifier) => {
    const localName = specifier.get('local.name').node;
    const exportedName = specifier.get('exported.name').node;

    if (!specifier.scope.hasBinding(localName)) { return; }

    const declarationPath = specifier
      .scope
      .getBinding(localName)
      .path;
    allExports[exportedName] = symbolize(declarationPath);
  });
}

traverse(ast, {
  ExportDefaultDeclaration: visitExportDefaultDeclaration,
  ExportNamedDeclaration: visitNamedExportDeclaration,
});

print(allExports);
