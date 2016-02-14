/* @flow */

import * as types from 'babel-types';
import Base from './Base';
import Type from './Type';

type ParamMetadata = {
  name: string,
  type: ?Type,
  default: ?any,
};

export default class Param extends Base {
  static fromParamPath(paramPath: NodePath) {
    const identifier = paramPath.isIdentifier()
      ? paramPath
      : paramPath.get('left');

    const defaultValue = paramPath.isAssignmentPattern()
      ? paramPath.get('right.value').node
      : null;

    return new this({
      name: identifier.get('name').node,
      type: identifier.get('typeAnnotation') ? Type.fromTypeAnnotationPath(identifier.get('typeAnnotation')) : null,
      default: defaultValue,
    });
  }

  _type: string = 'Param';
  type: ?Type;
  default: ?any;

  constructor({name, type, default: defaultValue}:ParamMetadata) {
    super();
    this.name = name;
    this.type = type;
    this.default = defaultValue;
  }
}
