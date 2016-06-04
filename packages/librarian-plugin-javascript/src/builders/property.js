import {ValueType, MemberType} from '../entities';
import {locationFromPath} from '../utilities';

export default function propertyBuilder(propertyPath, state) {
  const node = propertyPath.node;

  return MemberType({
    key: ValueType({value: node.key.name}),
    static: node.static,
    location: locationFromPath(propertyPath, state),
  });
}

propertyBuilder.handles = (path) => path.isClassProperty();
