import jsTypes from './plugins/javascript/types';

const classType = jsTypes.get('Class');
const methodType = jsTypes.get('Method');
const propertyType = jsTypes.get('Property');
const paramType = jsTypes.get('Param');

export default {
  classes: [
    classType({
      name: 'Foo',
      members: [
        methodType({name: 'foo', params: [paramType({name: 'qux'})]}),
        methodType({name: 'bar', params: [], static: true}),
        propertyType({name: 'baz', static: true}),
      ],
    }),
    classType({name: 'Bar', members: []}),
  ],
};
