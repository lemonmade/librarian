import proxy from 'librarian/src/proxy';

export default function createProxy(...args) {
  const newProxy = proxy(...args);

  newProxy.resolve = (library) => {
    const id = newProxy.id.clone();
    let member = id.member;
    delete id.member;

    function getValue(entity) {
      return entity && entity.value ? entity.value : entity;
    }

    function memberFinder(aMember) {
      return aMember.name === member.name && aMember.static === member.static;
    }

    let result = getValue(library.find((entity) => id.equals(entity.id)));
    console.log(result, member);

    while (member && result) {
      console.log(member);
      result = getValue(result.members && result.members.find(memberFinder));
      member = member.member;
    }

    return result;
  };

  return newProxy;
}
