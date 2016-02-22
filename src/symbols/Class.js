import Base from './Base';
import Method from './Method';

export default class Class extends Base {
  static fromClassPath(classPath) {
    const methods = classPath
      .get('body.body')
      .filter((statement) => statement.isClassMethod())
      .map((method) => Method.fromMethodPath(method));

    return new this({name: classPath.get('id.name').node, methods});
  }

  _type = 'Class';

  constructor({name, methods}) {
    super();
    this.name = name;
    this.methods = methods || [];
  }
}
