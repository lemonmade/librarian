import * as symbols from './symbols';

const symbolizers = {
  ClassDeclaration: visitClass,
  FunctionDeclaration: visitFunction,
};

export default function symbolize(path) {
  return symbolizers[path.get('type').node](path);
}

function visitFunction(functionPath) {
  return symbols.Function.fromFunctionPath(functionPath);
}

function visitClass(classPath) {
  return symbols.Class.fromClassPath(classPath);
}
