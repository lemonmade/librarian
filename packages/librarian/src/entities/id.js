export function createID(id) {
  return {
    module: null,
    name: null,
    ...id,
    member: createMember(id.member),
  };
}

function createMember(member) {
  if (!member) { return member; }
  return {
    name: null,
    static: false,
    ...member,
    member: createMember(member.member),
  };
}

export function hashFromID({module, name, member}) {
  return `${module}${name}${memberString(member)}`;
}

function memberString(member) {
  if (!member) { return ''; }
  const {name, static: isStatic, member: subMember} = member;
  return `${isStatic ? '.' : '#'}${name}${memberString(subMember)}`;
}
