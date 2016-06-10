import {locationFromPath, addMemberToEntity} from './utilities';
import {ClassType} from '../entities';

export default function classBuilder(classPath, state) {
  const {builder} = state;
  const name = classPath.get('id.name').node;

  const result = ClassType({
    name,
    extends: classPath.has('superClass')
      ? builder.get(classPath.get('superClass'), state)
      : null,
    location: locationFromPath(classPath, state),
  });

  classPath.get('body.body')
    .map((member) => builder.get(member, state))
    .forEach((member) => addMemberToEntity({member, entity: result}));

  return result;
}

classBuilder.handles = (path) => path.isClassDeclaration() || path.isClassExpression();
