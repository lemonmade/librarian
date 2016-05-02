import {
  ClassType,
  MethodType,
  PropertyType,
  ParamType,
  FunctionType,
} from './plugins/javascript/types';

export default {
  classes: [
    ClassType({
      name: 'Foo',
      members: [
        MethodType({name: 'foo', params: [ParamType({name: 'qux'})]}),
        MethodType({name: 'bar', params: [], static: true}),
        MethodType({name: 'constructor', params: [], kind: 'constructor'}),
        PropertyType({name: 'baz', static: true}),
      ],
    }),
    ClassType({name: 'Bar', members: []}),
  ],

  functions: [
    FunctionType({
      name: 'createTypeContainer',
      async: true,
      params: [
        ParamType({name: 'language'}),
        ParamType({name: 'options'}),
      ],
    }),
  ],
};
