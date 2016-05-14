import {FunctionType} from '../entities';
import typeFromPath from './type';
import {paramDetailsFromPath, mergeParamDetails} from './param';
import {getCommentBlockForPath, getTagsFromCommentBlock} from 'librarian/src/utilities';
import {locationFromPath, exportDetailsFromPath} from '../utilities';

export default function functionFromPath(functionPath, state) {
  const name = functionPath.get('id.name').node;
  const commentBlock = getCommentBlockForPath(functionPath);
  const {param: params, ...commentTags} = getTagsFromCommentBlock(commentBlock, state);

  return FunctionType({
    name,
    params: mergeParamDetails(functionPath.get('params').map(paramDetailsFromPath), params),
    location: locationFromPath(functionPath, state),
    export: exportDetailsFromPath(functionPath, {name}),
    returns: functionPath.has('returnType') ? typeFromPath(functionPath.get('returnType')) : null,
    ...commentTags,
  });
}
