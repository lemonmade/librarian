import createID from './id';

class EntityProxy {
  constructor(id) {
    this.id = id;
  }
}

export default function proxy(id) {
  return new EntityProxy(createID(id));
}

export function isProxy(val) {
  return val instanceof EntityProxy;
}
