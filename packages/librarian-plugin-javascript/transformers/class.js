import paramFromPath from './param';
import {ClassType, PropertyType, MethodType} from '../entities';
import {locationFromPath, exportDetailsFromPath} from '../utilities';

export default function classFromPath(classPath, state) {
  const name = classPath.get('id.name').node;

  return ClassType({
    name,
    superclass: classPath.has('superClass') ? classPath.get('superClass.name').node : null,
    members: classPath.get('body.body')
      .map((member) => memberFromPath(member, state))
      .filter((member) => member != null),
    export: exportDetailsFromPath(classPath, {name}),
    location: locationFromPath(classPath, state),
  });
}

function memberFromPath(memberPath, state) {
  if (memberPath.isClassProperty()) {
    return propertyFromPath(memberPath, state);
  } else {
    return methodFromPath(memberPath, state);
  }
}

function propertyFromPath(propertyPath, state) {
  const node = propertyPath.node;

  return PropertyType({
    name: node.key.name,
    static: node.static,
    location: locationFromPath(propertyPath, state),
  });
}

function methodFromPath(methodPath, state) {
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
    location: locationFromPath(methodPath, state),
  });
}
