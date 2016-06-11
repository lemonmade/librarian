export default function resolve(id, lib) {
  id = id.clone();
  let member = id.unresolved.member;
  delete id.unresolved.member;

  function getValue(entity) {
    return entity && entity.value ? entity.value : entity;
  }

  function memberFinder(aMember) {
    return aMember.name === member.name && aMember.static === member.static;
  }

  let result = getValue(lib.find((entity) => id.equals(entity.id)));

  while (member && result) {
    result = getValue(result.members && result.members.find(memberFinder));
    member = member.member;
  }

  return result;
}
