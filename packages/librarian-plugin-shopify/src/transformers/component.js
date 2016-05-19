import {ComponentType} from '../entities';
import variationFromObject from './variation';

export default function classFromObject(object) {
  return ComponentType({
    ...object,
    variations: object.variations.map(variationFromObject),
  });
}
