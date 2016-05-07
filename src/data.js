import {
  ClassType,
  MethodType,
  PropertyType,
  ParamType,
  FunctionType,
  TypeType,
} from './plugins/javascript/types';

import {string, number} from './plugins/javascript/types/type';

export default {
  classes: [
    ClassType({
      name: 'Foo',
      members: [
        MethodType({name: 'foo', params: [
          ParamType({name: 'qux', properties: [
            ParamType({name: 'subprop'}),
          ]}),
        ]}),
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
      returns: TypeType({
        types: [
          TypeType({type: 'string'}),
          TypeType({type: 'number', nullable: true}),
        ],
        union: true,
      }),
    }),
  ],
};
