import {ComponentType, PropType} from '../entities';
import {TypeType} from 'librarian-plugin-javascript/src/entities';

export default function componentBuilder(path, state) {
  const body = path.get('body.body');

  const propTypes = body.filter((bodyPath) => (
    bodyPath.isClassProperty({static: true}) &&
    bodyPath.get('key.name').node === 'propTypes' &&
    bodyPath.get('value').isObjectExpression()
  ))[0];

  const props = propTypes == null
    ? []
    : resolveProps(propTypes.get('value'));

  return ComponentType({
    name: path.get('id.name').node,
    props,
  });
}

function resolveProps(propTypes) {
  return propTypes.get('properties')
    .filter((prop) => prop.isObjectProperty())
    .map((prop) => {
      const {isRequired, type} = getPropDetailsFromValue(prop.get('value'));
      const name = prop.get('key.name').node;
      return PropType({name, type, isRequired});
    });
}

const propTypesToType = {
  bool: 'boolean',
  number: 'number',
  string: 'string',
  func: 'function',
};

function getPropDetailsFromValue(value) {
  let isRequired = false;
  let propertyName = getPropertyName(value);

  if (propertyName === 'isRequired') {
    isRequired = true;
    propertyName = getPropertyName(value.get('object'));
  }

  return {
    isRequired,
    type: TypeType({type: propTypesToType[propertyName]}),
  };
}

function getPropertyName(memberPath) {
  const property = memberPath.get('property');

  if (memberPath.get('computed').node) {
    const evaluated = property.evaluate();
    return evaluated.confident ? evaluated.value : null;
  }

  return property.get('name').node;
}

componentBuilder.handles = (path) => (
  path.isClassDeclaration()
);
