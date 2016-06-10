import {createTag} from 'librarian/src/tags';
import {TypeType} from '../entities';

export default createTag({
  name: 'type',
  multiple: false,
  process(content) {
    return typeFromString(content[0]);
  },
});

export function typeFromString(string) {
  return TypeType({type: string});
}
