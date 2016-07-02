import createID from './id';

class EntityProxy {
  constructor(id) {
    this.id = id;
  }

  getMember(member) {
    return proxy(this.id.clone().appendMember(member));
  }

  resolve(library) {
    const id = this.id.clone();
    let member = id.unresolved.member;
    delete id.unresolved.member;

    function getValue(entity) {
      return entity && entity.value ? entity.value : entity;
    }

    function memberFinder(aMember) {
      return aMember.name === member.name && aMember.static === member.static;
    }

    let result = getValue(library.find((entity) => id.equals(entity.id)));

    while (member && result) {
      result = getValue(result.members && result.members.find(memberFinder));
      member = member.member;
    }

    return result;
  }
}

export default function proxy(id) {
  return new EntityProxy(createID(id));
}

export function isProxy(val) {
  return val instanceof EntityProxy;
}
