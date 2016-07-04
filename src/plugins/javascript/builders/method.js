import {getTagsFromCommentBlock} from '../../../utilities';

import paramBuilder, {mergeParamDetails} from './param';
import {locationFromPath, getCommentBlockForPath} from './utilities';
import {FunctionType, ValueType, MemberType} from '../entities';

export default function methodBuilder(methodPath, state) {
  let name;
  const {node} = methodPath;
  const {builder} = state;
  const commentBlock = getCommentBlockForPath(methodPath);
  const {param: params, ...commentTags} = getTagsFromCommentBlock(commentBlock, state);

  if (node.computed) {
    const evaluated = methodPath.get('key').evaluate();
    if (evaluated.confident) { name = evaluated.value; }
  } else {
    name = node.key.name;
  }

  return builder.set(methodPath, name && MemberType({
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
  }), {isSourcePath: true});
}

methodBuilder.handles = (path) => path.isClassMethod();
