import {createTag} from 'librarian/src/tags';
import {TypeType} from '../entities';

export default createTag({
  name: 'type',
  process(content) {
    return typeFromString(content[0]);
  },
});

export function typeFromString(string) {
  return TypeType({type: string});
}
