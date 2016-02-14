/* @flow */

export default class Base {
  _type: string;
  name: string;
  description: ?String;

  constructor() {
    this._type = '';
    this.name = '';
    this.description = null;
  }
}
