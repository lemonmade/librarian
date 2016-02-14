/* @flow */

import Function, {functionAttributesFromPath} from './Function';
import type FunctionMetadata from './Function';

type MethodMetadata = {isStatic: bool} & FunctionMetadata;

export default class Method extends Function {
  static fromMethodPath(methodPath) {
    return new this({
      ...functionAttributesFromPath(methodPath),
      name: methodPath.get('key.name').node,
      isStatic: methodPath.get('static').node,
    });
  }

  _type: string = 'Method';
  isStatic: bool;

  constructor({isStatic, ...rest}:MethodMetadata) {
    super(rest);
    this.isStatic = isStatic;
  }
}
