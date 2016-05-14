import {TypeType} from '../entities';

export default function typeFromPath(typePath) {
  return typeFromAnnotation(typePath.get('typeAnnotation'));
}

function typeFromAnnotation(annotation) {
  if (annotation.isStringTypeAnnotation()) { return TypeType({type: 'string'}); }
  if (annotation.isNumberTypeAnnotation()) { return TypeType({type: 'number'}); }
  if (annotation.isBooleanTypeAnnotation()) { return TypeType({type: 'boolean'}); }

  if (annotation.isNullableTypeAnnotation()) {
    const subtype = typeFromAnnotation(annotation.get('typeAnnotation'));
    if (subtype == null) { return null; }
    subtype.nullable = true;
    return subtype;
  }

  if (annotation.isUnionTypeAnnotation()) {
    const types = annotation
      .get('types')
      .map((type) => typeFromAnnotation(type))
      .filter((type) => type != null);
    return types.length > 1 ? TypeType({types, union: true}) : types[0];
  }

  if (annotation.isIntersectionTypeAnnotation()) {
    const types = annotation
      .get('types')
      .map((type) => typeFromAnnotation(type))
      .filter((type) => type != null);
    return types.length > 1 ? TypeType({types, intersection: true}) : types[0];
  }

  return null;
}

export function guessTypeFromPath(path) {
  if (path.isStringLiteral() || path.isTemplateLiteral()) { return TypeType({type: 'string'}); }
  if (path.isNumericLiteral()) { return TypeType({type: 'number'}); }
  if (path.isBooleanLiteral()) { return TypeType({type: 'boolean'}); }
  return null;
}
