import Function, {functionAttributesFromPath} from './Function';

export default class Method extends Function {
  static fromMethodPath(methodPath) {
    return new this({
      ...functionAttributesFromPath(methodPath),
      name: methodPath.get('key.name').node,
      isStatic: methodPath.get('static').node,
    });
  }

  _type = 'Method';

  constructor({isStatic, ...rest}) {
    super(rest);
    this.isStatic = isStatic;
  }
}
