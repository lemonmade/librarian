import {PropertyType} from '../entities';
import {locationFromPath} from '../utilities';

export default function propertyBuilder(propertyPath, state) {
  const node = propertyPath.node;

  return PropertyType({
    name: node.key.name,
    static: node.static,
    location: locationFromPath(propertyPath, state),
  });
}

propertyBuilder.handles = (path) => path.isClassProperty();
