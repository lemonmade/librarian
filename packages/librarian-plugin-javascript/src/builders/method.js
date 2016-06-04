import {getCommentBlockForPath, getTagsFromCommentBlock} from 'librarian/src/utilities';
import paramBuilder, {mergeParamDetails} from './param';
import {FunctionType, ValueType, MemberType} from '../entities';
import {locationFromPath} from '../utilities';

export default function methodBuilder(methodPath, state) {
  let name;
  const {node} = methodPath;
  const commentBlock = getCommentBlockForPath(methodPath);
  const {param: params, ...commentTags} = getTagsFromCommentBlock(commentBlock, state);

  if (node.computed) {
    const evaluated = methodPath.get('key').evaluate();
    if (evaluated.confident) { name = evaluated.value; }
  } else {
    name = node.key.name;
  }

  if (name == null) { return null; }

  return MemberType({
    key: ValueType({value: name}),
    value: FunctionType({
      params: mergeParamDetails(
        methodPath.get('params').map((param) => paramBuilder(param, state)),
        params
      ),
      async: node.async,
      generator: node.generator,
    }),
    static: node.static,
    location: locationFromPath(methodPath, state),
    ...commentTags,
  });
}

methodBuilder.handles = (path) => path.isClassMethod();
