import {getCommentBlockForPath, getTagsFromCommentBlock} from 'librarian/src/utilities';
import {locationFromPath} from './utilities';
import {ValueType} from '../entities';

export default function valueFromPath(valuePath, state) {
  const name = valuePath.get('id.name').node;
  const commentBlock = getCommentBlockForPath(valuePath);

  return ValueType({
    name,
    value: valuePath.get('init.value').node,
    location: locationFromPath(valuePath, state),
    ...getTagsFromCommentBlock(commentBlock, state),
  });
}
