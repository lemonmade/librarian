import Base from './Base';
import Param from './Param';
import Type from './Type';

export default class Function extends Base {
  static fromFunctionPath(functionPath) {
    return new this(functionAttributesFromPath(functionPath));
  }

  _type = 'Function';

  constructor({name, params, returns, isAsync, isGenerator}) {
    super();
    this.name = name;
    this.params = params;
    this.returns = returns;
    this.isAsync = isAsync;
    this.isGenerator = isGenerator;
  }
}

export function functionAttributesFromPath(functionPath) {
  return {
    name: functionPath.has('id') ? functionPath.get('id.name').node : '',
    params: functionPath.get('params').map((param) => Param.fromParamPath(param)),
    returns: Type.fromTypeAnnotationPath(functionPath.get('returnType')),
    isAsync: functionPath.get('async').node,
    isGenerator: functionPath.get('generator').node,
  };
}
