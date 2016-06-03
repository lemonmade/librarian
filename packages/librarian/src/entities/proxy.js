import {createID} from './id';

export class EntityProxy {
  constructor(id) {
    this.id = id;
  }
}

export default function proxy(id) {
  return new EntityProxy(createID(id));
}
