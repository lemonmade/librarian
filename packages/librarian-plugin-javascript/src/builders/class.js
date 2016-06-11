import {getTagsFromCommentBlock} from 'librarian/src/utilities';
import {locationFromPath, addMemberToEntity, getCommentBlockForPath} from './utilities';
import {ClassType} from '../entities';

export default function classBuilder(classPath, state, {sourcePath = classPath} = {}) {
  const {builder} = state;
  const tags = getTagsFromCommentBlock(getCommentBlockForPath(sourcePath, state), state);
  const name = classPath.get('id.name').node;

  const result = ClassType({
    ...tags,
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
