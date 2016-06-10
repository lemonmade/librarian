import createID from './id';

class EntityProxy {
  constructor(id) {
    this.id = id;
  }

  getMember(member) {
    return proxy(this.id.clone().appendMember(member));
  }
}

export default function proxy(id) {
  return new EntityProxy(createID(id));
}

export function isProxy(val) {
  return val instanceof EntityProxy;
}
