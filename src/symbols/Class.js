/* @flow */

import Base from './Base';
import types from 'babel-types';
import Method from './Method';

type ClassMetadata = {
  name: string,
  methods: ?Array<Method>,
};

export default class Class extends Base {
  static fromClassPath(classPath) {
    const methods = classPath.get('body.body')
      .filter((statement) => statement.isClassMethod())
      .map((method) => Method.fromMethodPath(method));

    return new this({name: classPath.get('id.name').node, methods});
  }

  _type: string = 'Class';
  methods: Array<Method>;

  constructor({name, methods}:ClassMetadata) {
    super();
    this.name = name;
    this.methods = methods || [];
  }
}
