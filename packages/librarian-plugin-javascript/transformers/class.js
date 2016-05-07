import paramFromPath from './param';
import {ClassType, PropertyType, MethodType} from '../entities';

export default function classFromPath(classPath) {
  return ClassType({
    name: classPath.get('id.name').node,
    superclass: classPath.has('superClass') ? classPath.get('superClass.name').node : null,
    members: classPath.get('body.body')
      .map(memberFromPath)
      .filter((member) => member != null),
  });
}

function memberFromPath(memberPath) {
  if (memberPath.isClassProperty()) {
    return propertyFromPath(memberPath);
  } else {
    return methodFromPath(memberPath);
  }
}

function propertyFromPath(propertyPath) {
  const node = propertyPath.node;

  return PropertyType({
    name: node.key.name,
    static: node.static,
  });
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

  return MethodType({
    name,
    params: methodPath.get('params').map(paramFromPath),
    async: node.async,
    generator: node.generator,
    static: node.static,
    kind: name === 'constructor' ? 'constructor' : 'method',
  });
}
