import {TypeType} from '../entities';

export default function typeBuilder(typePath, state) {
  const {builder} = state;

  if (typePath.isTypeAlias()) {
    return builder.set(typePath, builder.get(typePath.get('right'), state));
  } else if (typePath.isGenericTypeAnnotation()) {
    return builder.set(typePath, builder.get(typePath.get('id'), state));
  } else {
    return builder.set(typePath, typeFromAnnotation(typePath, state), {isSourcePath: true});
  }
}

typeBuilder.handles = (path) => (
  path.node.type.endsWith('TypeAnnotation') ||
  path.isTypeAlias()
);

function typeFromAnnotation(annotation, state) {
  if (annotation.has('typeAnnotation')) {
    return typeFromAnnotation(annotation.get('typeAnnotation'), state);
  }

  if (annotation.isStringTypeAnnotation()) { return TypeType({type: 'string'}); }
  if (annotation.isNumberTypeAnnotation()) { return TypeType({type: 'number'}); }
  if (annotation.isBooleanTypeAnnotation()) { return TypeType({type: 'boolean'}); }

  const {builder} = state;

  if (annotation.isNullableTypeAnnotation()) {
    const subtype = builder.get(annotation.get('typeAnnotation'), state);
    if (subtype == null) { return null; }
    subtype.nullable = true;
    return subtype;
  }

  if (annotation.isUnionTypeAnnotation()) {
    const types = annotation
      .get('types')
      .map((type) => builder.get(type, state))
      .filter((type) => type != null);
    return types.length > 1 ? TypeType({types, union: true}) : types[0];
  }

  if (annotation.isIntersectionTypeAnnotation()) {
    const types = annotation
      .get('types')
      .map((type) => builder.get(type, state))
      .filter((type) => type != null);
    return types.length > 1 ? TypeType({types, intersection: true}) : types[0];
  }

  if (annotation.isObjectTypeAnnotation()) {
    return TypeType({type: 'Object'});
  }

  return null;
}

export function guessTypeFromPath(path) {
  if (path.isStringLiteral() || path.isTemplateLiteral()) { return TypeType({type: 'string'}); }
  if (path.isNumericLiteral()) { return TypeType({type: 'number'}); }
  if (path.isBooleanLiteral()) { return TypeType({type: 'boolean'}); }
  return null;
}
