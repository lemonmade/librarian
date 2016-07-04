import {locationFromPath} from './utilities';
import {ValueType} from '../entities';

export default function objectFromPath(objectPath, state) {
  const {builder} = state;
  return builder.set(
    objectPath,
    ValueType({location: locationFromPath(objectPath, state)}),
    {isSourcePath: true}
  );
}

objectFromPath.handles = (path) => path.isObjectExpression();
