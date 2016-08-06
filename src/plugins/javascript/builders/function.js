import {getTagsFromCommentBlock} from '../../../utilities';

import paramBuilder, {mergeParamDetails} from './param';
import {locationFromPath, getCommentBlockForPath} from './utilities';
import {FunctionType} from '../entities';

export default function functionBuilder(functionPath, state) {
  const name = functionPath.get('id.name').node;
  const commentBlock = getCommentBlockForPath(functionPath, state);
  const {param: params, ...commentTags} = getTagsFromCommentBlock(commentBlock, state);
  const {builder} = state;

  return builder.set(functionPath, FunctionType({
    name,
    params: mergeParamDetails(
      functionPath.get('params').map((param) => paramBuilder(param, state)),
      params
    ),
    location: locationFromPath(functionPath, state),
    async: functionPath.get('async').node,
    generator: functionPath.get('generator').node,
    returns: builder.get(functionPath.get('returnType'), state),
    ...commentTags,
  }), {isSourcePath: true});
}

functionBuilder.handles = (path) => path.isFunctionDeclaration() || path.isFunctionExpression();
