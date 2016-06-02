import {ClassType} from '../entities';
import {locationFromPath, exportDetailsFromPath} from '../utilities';

export default function classBuilder(classPath, state) {
  const {builder} = state;
  const name = classPath.get('id.name').node;

  return ClassType({
    name,
    superclass: classPath.has('superClass')
      ? builder.get(classPath.get('superClass.name'), state)
      : null,
    members: classPath.get('body.body')
      .map((member) => builder.get(member, state))
      .filter((member) => member != null),
    export: exportDetailsFromPath(classPath, {name}),
    location: locationFromPath(classPath, state),
  });
}

classBuilder.handles = (path) => path.isClassDeclaration();
