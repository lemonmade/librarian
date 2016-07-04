import {locationFromPath} from './utilities';
import {ValueType, MemberType} from '../entities';

export default function propertyBuilder(propertyPath, state) {
  const {node} = propertyPath;
  const {builder} = state;

  return builder.set(propertyPath, MemberType({
    key: ValueType({value: node.key.name}),
    value: builder.get(propertyPath.get('value'), state),
    static: node.static,
    location: locationFromPath(propertyPath, state),
  }), {isSourcePath: true});
}

propertyBuilder.handles = (path) => path.isClassProperty();
