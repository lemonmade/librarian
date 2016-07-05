import {ComponentType, PropType} from '../entities';
import {TypeType} from '../../javascript/entities';
import {getAllUsages} from '../../javascript/builders/utilities';

export default function componentBuilder(path, state) {
  const {builder} = state;
  const body = path.get('body.body');

  const propTypes = body.filter && body.filter((bodyPath) => (
    (
      bodyPath.isClassProperty({static: true}) &&
      bodyPath.get('key.name').node === 'propTypes'
    ) || (
      bodyPath.isClassProperty({static: false}) &&
      bodyPath.get('key.name').node === 'props' &&
      bodyPath.has('typeAnnotation')
    )
  ))[0];

  const id = path.get('id');
  const name = id.isIdentifier() ? id.node.name : null;
  const props = propTypes == null
    ? []
    : resolveProps(propTypes, state);

  const component = ComponentType({name, props});
  builder.set(path, component);

  for (const usage of getAllUsages({name, scope: path.scope.parent, sourcePath: path})) {
    const expression = usage.get('expression');
    const left = expression.get('left');
    const right = expression.get('right');
    if (expression.isAssignmentExpression() && right.isObjectExpression() && left.matchesPattern('*.propTypes')) {
      component.props = resolveObjectProps(right, state);
    } else {
      builder.get(usage, state);
    }
  }

  return component;
}

function resolveProps(propTypes, state) {
  return propTypes.isClassProperty({static: true})
    ? resolveObjectProps(propTypes.get('value'), state)
    : resolveTypeProps(propTypes.get('typeAnnotation.typeAnnotation'), state);
}

function resolveTypeProps(propTypes, state) {
  const {builder} = state;
  const object = builder.getPath(propTypes, state);

  if (object == null || !object.isObjectTypeAnnotation()) { return []; }

  return object.get('properties')
    .filter((prop) => prop.isObjectTypeProperty())
    .map((prop) => {
      const type = builder.get(prop.get('value'));
      const name = prop.get('key.name').node;
      const isRequired = !prop.get('key.name').node;
      return PropType({name, type, isRequired});
    });
}

function resolveObjectProps(propTypes, state) {
  const {builder} = state;
  const object = builder.getPath(propTypes, state);

  if (object == null || !object.isObjectExpression()) { return []; }

  return object.get('properties')
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

componentBuilder.handles = (path) => isClassBasedComponent(path) || isStatelessComponent(path);

function isStatelessComponent(path) {
  if (!path.isFunction()) { return false; }
  if (!path.get('body').isBlockStatement()) {
    return path.get('body').isJSXElement();
  }

  let hasJSXReturn = false;

  path.traverse({
    ReturnStatement(returnPath) {
      const isCorrectScope = (returnPath.scope.getFunctionParent().path.node === path.node);
      if (isCorrectScope && returnPath.get('argument').isJSXElement()) {
        hasJSXReturn = true;
        returnPath.stop();
      }
    },
  });

  return hasJSXReturn;
}

function isClassBasedComponent(path) {
  const superClass = path.get('superClass');
  return path.isClassDeclaration() && (
    superClass.matchesPattern('React.Component') ||
    (superClass.isIdentifier() && superClass.get('name').node === 'Component')
  );
}
