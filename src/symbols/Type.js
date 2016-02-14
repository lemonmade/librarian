/* @flow */

import getFlowType from '../utilities/get-flow-type';

type TypeMetadata = {types: string};

export default class Type {
  static fromTypeAnnotationPath(typeAnnotationPath: NodePath) {
    return new this({
      types: typeAnnotationPath.has('typeAnnotation') ? getFlowType(typeAnnotationPath.get('typeAnnotation').node) : [],
    });
  }

  types: Array<string>;
  union: bool = false;
  intersection: bool = false;

  constructor({types}:TypeMetadata) {
    this.types = Array.isArray(types) ? types : [types];
  }
}
