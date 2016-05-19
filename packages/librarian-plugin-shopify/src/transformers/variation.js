import {VariationType} from '../entities';

export default function variationFromObject(object) {
  const {description} = object;

  return VariationType({
    ...object,
    description: description && description.replace(/([^\n])\n([^\n])/g, '$1 $2'),
  });
}
