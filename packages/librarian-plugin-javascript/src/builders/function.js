import {getCommentBlockForPath, getTagsFromCommentBlock} from 'librarian/src/utilities';

import paramBuilder, {mergeParamDetails} from './param';
import {locationFromPath, exportDetailsFromPath} from './utilities';
import {FunctionType} from '../entities';

export default function functionBuilder(functionPath, state) {
  const name = functionPath.get('id.name').node;
  const commentBlock = getCommentBlockForPath(functionPath, state);
  const {param: params, ...commentTags} = getTagsFromCommentBlock(commentBlock, state);
  const {builder} = state;

  return FunctionType({
    name,
    params: mergeParamDetails(
      functionPath.get('params').map((param) => paramBuilder(param, state)),
      params
    ),
    location: locationFromPath(functionPath, state),
    export: exportDetailsFromPath(functionPath, {name}),
    async: functionPath.get('async').node,
    generator: functionPath.get('generator').node,
    returns: functionPath.has('returnType')
      ? builder.get(functionPath.get('returnType'), state)
      : null,
    ...commentTags,
  });
}

functionBuilder.handles = (path) => path.isFunctionDeclaration();
