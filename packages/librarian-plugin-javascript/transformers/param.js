import {ParamType} from '../entities';

export default function paramFromPath(paramPath) {
  if (paramPath.isObjectPattern()) {
    return ParamType({
      properties: paramPath
        .get('properties')
        .map((paramPropPath) => paramFromPath(paramPropPath.get('value'))),
    });
  } else if (paramPath.isIdentifier()) {
    return ParamType({name: paramPath.get('name').node});
  } else if (paramPath.isAssignmentPattern()) {
    return ParamType({
      name: paramPath.get('left.name').node,
      default: paramPath.get('right.value').node,
    });
  }

  return {};
}
