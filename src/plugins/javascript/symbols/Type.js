import getFlowType from '../utilities/get-flow-type';

export default class Type {
  static fromTypeAnnotationPath(typeAnnotationPath) {
    return new this({
      types: typeAnnotationPath.has('typeAnnotation') ? getFlowType(typeAnnotationPath.get('typeAnnotation').node) : [],
    });
  }

  union = false;
  intersection = false;

  constructor({types}) {
    this.types = Array.isArray(types) ? types : [types];
  }
}
