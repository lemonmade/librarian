import paramFromPath from './param';

const PROPERTY_TYPE = 'property';
const METHOD_TYPE = 'method';
const CONSTRUCTOR_TYPE = 'constructor';

export default function classFromPath(classPath) {
  return {
    name: classPath.get('id.name').node,
    superclass: classPath.has('superClass') ? classPath.get('superClass.name').node : null,
    members: classPath.get('body.body')
      .map(memberFromPath)
      .filter((member) => member != null),
    get constructor() { return this.members.find((member) => member.type === CONSTRUCTOR_TYPE); },
    get properties() { return this.members.filter((member) => member.type === PROPERTY_TYPE); },
    get methods() { return this.members.filter((member) => member.type === METHOD_TYPE); },
  };
}

function memberFromPath(memberPath) {
  if (memberPath.isClassProperty()) {
    return propertyFromPath(memberPath);
  } else if (memberPath.equals('kind', 'constructor')) {
    return constructorFromPath(memberPath);
  } else if (memberPath.equals('kind', 'method')) {
    return methodFromPath(memberPath);
  } else {
    return null;
  }
}

function propertyFromPath(propertyPath) {
  const node = propertyPath.node;

  return {
    type: PROPERTY_TYPE,
    name: node.key.name,
    static: node.static,
  };
}

function constructorFromPath(constructorPath) {
  return {
    ...methodFromPath(constructorPath),
    type: CONSTRUCTOR_TYPE,
  };
}

function methodFromPath(methodPath) {
  let name;
  const node = methodPath.node;

  if (node.computed) {
    const evaluated = methodPath.get('key').evaluate();
    if (evaluated.confident) { name = evaluated.value; }
  } else {
    name = node.key.name;
  }

  if (name == null) { return null; }

  return {
    name,
    type: METHOD_TYPE,
    params: methodPath.get('params').map(paramFromPath),
    async: node.async,
    generator: node.generator,
    static: node.static,
  };
}
