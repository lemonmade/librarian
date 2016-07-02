import {getTagsFromCommentBlock} from '../../../utilities';
import {locationFromPath, addMemberToEntity, getCommentBlockForPath, getAllUsages} from './utilities';
import {ClassType} from '../entities';

export default function classBuilder(classPath, state, {sourcePath = classPath} = {}) {
  const {builder} = state;
  const tags = getTagsFromCommentBlock(getCommentBlockForPath(sourcePath, state), state);
  const name = classPath.get('id.name').node;

  const result = ClassType({
    ...tags,
    name,
    members: [],
    extends: classPath.has('superClass')
      ? builder.get(classPath.get('superClass'), state)
      : null,
    location: locationFromPath(classPath, state),
  });

  classPath.get('body.body')
    .map((member) => builder.get(member, state))
    .forEach((member) => addMemberToEntity({member, entity: result}));

  state.builder.afterAdd(() => {
    for (const usage of getAllUsages({name, scope: classPath.scope.parent, sourcePath: classPath})) {
      state.builder.get(usage, state);
    }
  });

  return result;
}

classBuilder.handles = (path) => path.isClassDeclaration() || path.isClassExpression();
