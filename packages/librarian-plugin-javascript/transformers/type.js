import {TypeType} from '../entities';

export default function typeFromPath(typePath) {
  return typeFromAnnotation(typePath.get('typeAnnotation'));
}

function typeFromAnnotation(annotation) {
  const {node} = annotation;
  let types;

  switch (node.type) {
  case 'StringTypeAnnotation': return TypeType({type: 'string'});
  case 'NumberTypeAnnotation': return TypeType({type: 'number'});
  case 'BooleanTypeAnnotation': return TypeType({type: 'boolean'});

  case 'NullableTypeAnnotation':
    const subtype = typeFromAnnotation(annotation.get('typeAnnotation'));
    if (subtype == null) { return null; }
    subtype.nullable = true;
    return subtype;

  case 'UnionTypeAnnotation':
    types = annotation
      .get('types')
      .map((type) => typeFromAnnotation(type))
      .filter((type) => type != null);
    return types.length > 1 ? TypeType({types, union: true}) : types[0];

    case 'IntersectionTypeAnnotation':
      types = annotation
        .get('types')
        .map((type) => typeFromAnnotation(type))
        .filter((type) => type != null);
      return types.length > 1 ? TypeType({types, intersection: true}) : types[0];

  default: return null;
  }
}
