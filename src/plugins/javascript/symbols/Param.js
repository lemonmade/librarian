export default function paramFromPath(paramPath) {
  if (paramPath.isObjectPattern()) {
    return {
      properties: paramPath
        .get('properties')
        .map((paramPropPath) => paramFromPath(paramPropPath.get('value'))),
    };
  } else if (paramPath.isIdentifier()) {
    return {name: paramPath.get('name').node};
  } else if (paramPath.isAssignmentPattern()) {
    return {
      name: paramPath.get('left.name').node,
      default: paramPath.get('right.value').node,
    };
  }

  return {};
}
