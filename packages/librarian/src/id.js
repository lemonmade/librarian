class ID {
  constructor(val) {
    this.unresolved = val;
  }

  clone() {
    return createID(deepIDClone(this.unresolved));
  }

  appendMember(member) {
    if (this.isResolved) {
      this.unresolved += memberString(member);
    } else {
      getLastMember(this.unresolved).member = cleanMember(member);
    }

    return this;
  }

  toString() {
    return this.resolved;
  }

  equals(otherID) {
    return typeof otherID === 'string'
      ? this.resolved === otherID
      : this.resolved === otherID.resolved;
  }

  get isResolved() {
    return typeof this.unresolved === 'string';
  }

  get resolved() {
    return idString(this.unresolved);
  }
}

export default function createID(arg) {
  if (isID(arg)) { return arg; }
  return new ID(arg);
}

export function isID(val) {
  return val instanceof ID;
}

function deepIDClone(id) {
  if (!id || typeof id === 'string') { return id; }

  const {...rest, member} = id;
  return {...rest, member: deepIDClone(cleanMember(member))};
}

function getLastMember(id) {
  if (!id.member) { return id; }
  return getLastMember(id.member);
}

function cleanMember(member) {
  if (!member) { return member; }
  if (member.static == null) { member.static = false; }
  if (member.member) { member.member = cleanMember(member.member); }
  return member;
}

function idString(id) {
  if (typeof id === 'string') { return `${id.startsWith('id:') ? '' : 'id:'}${id}`; }

  const {module, name, member} = id;
  return `id:${module}/${name}${memberString(member)}`;
}

function memberString(member) {
  if (!member) { return ''; }
  const {name, static: isStatic, member: subMember} = member;
  return `${isStatic ? '.' : '#'}${name}${memberString(subMember)}`;
}
