export default function createID(val) {
  if (typeof val === 'string') { return val; }

  const {module, name, member} = val;
  return `id:${module}/${name}${memberString(member)}`;
}

export function isID(val) {
  return typeof val === 'string' && val.indexOf('id:') === 0;
}

function memberString(member) {
  if (!member) { return ''; }
  const {name, static: isStatic, member: subMember} = member;
  return `${isStatic ? '.' : '#'}${name}${memberString(subMember)}`;
}
