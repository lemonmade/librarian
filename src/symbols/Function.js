/* @flow */

import Base from './Base';
import Param from './Param';
import Type from './Type';

type FunctionMetadata = {
  returns: ?Type,
  name: string,
  params: Array<Param>,
  isAsync: bool,
  isGenerator: bool,
};

export default class Function extends Base {
  static fromFunctionPath(functionPath) {
    return new this(functionAttributesFromPath(functionPath));
  }

  _type: string = 'Function';
  params: Array<Param>;
  returns: ?Type;
  isAsync: bool;
  isGenerator: bool;

  constructor({name, params, returns, isAsync, isGenerator}:FunctionMetadata) {
    super();
    this.name = name;
    this.params = params;
    this.returns = returns;
    this.isAsync = isAsync;
    this.isGenerator = isGenerator;
  }
}

export function functionAttributesFromPath(functionPath): FunctionMetadata {
  return {
    name: functionPath.has('id') ? functionPath.get('id.name').node : '',
    params: functionPath.get('params').map((param) => Param.fromParamPath(param)),
    returns: Type.fromTypeAnnotationPath(functionPath.get('returnType')),
    isAsync: functionPath.get('async').node,
    isGenerator: functionPath.get('generator').node,
  };
}
