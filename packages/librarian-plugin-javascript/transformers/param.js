import typeFromPath, {guessTypeFromPath} from './type';
import {ParamType} from '../entities';

export default function paramFromPath(paramPath) {
  const type = paramPath.has('typeAnnotation') ? typeFromPath(paramPath.get('typeAnnotation')) : null;

  if (paramPath.isObjectPattern()) {
    return ParamType({
      type,
      properties: paramPath
        .get('properties')
        .map((paramPropPath) => paramFromPath(paramPropPath.get('value'))),
    });
  } else if (paramPath.isIdentifier()) {
    return ParamType({type, name: paramPath.get('name').node});
  } else if (paramPath.isAssignmentPattern()) {
    return ParamType({
      name: paramPath.get('left.name').node,
      type: type || guessTypeFromPath(paramPath.get('right')),
      default: paramPath.get('right.value').node,
    });
  }

  return {};
}
