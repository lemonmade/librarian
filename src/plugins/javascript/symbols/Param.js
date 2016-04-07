import Base from './Base';
import Type from './Type';

export default class Param extends Base {
  static fromParamPath(paramPath) {
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

  _type = 'Param';

  constructor({name, type, default: defaultValue}) {
    super();
    this.name = name;
    this.type = type;
    this.default = defaultValue;
  }
}
