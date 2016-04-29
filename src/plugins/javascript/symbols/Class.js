import paramFromPath from './param';

export default function classFromPath(classPath) {
  const body = classPath.get('body.body');
  const constructor = body.find((statement) => statement.equals('kind', 'constructor'));

  return {
    name: classPath.get('id.name').node,
    superclass: classPath.has('superClass')
      ? classPath.get('superClass.name').node
      : null,
    constructor: constructor && methodFromPath(constructor),
    methods: body
      .filter((statement) => statement.equals('kind', 'method'))
      .map(methodFromPath),
  };
}

function methodFromPath(methodPath) {
  return {
    name: methodPath.get('key.name').node,
    params: methodPath.get('params').map(paramFromPath),
  };
}
