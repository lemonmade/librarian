import {locationFromPath} from './utilities';
import {ValueType, MemberType} from '../entities';

export default function propertyBuilder(propertyPath, state) {
  const node = propertyPath.node;

  return MemberType({
    key: ValueType({value: node.key.name}),
    value: state.builder.get(propertyPath.get('value'), state),
    static: node.static,
    location: locationFromPath(propertyPath, state),
  });
}

propertyBuilder.handles = (path) => path.isClassProperty();
