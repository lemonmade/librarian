import defineType from '../../../types/define';
import {arrayOf, oneOf, stringType, nodeType} from '../../../types/base';
import MethodType from './method';
import PropertyType from './property';

export default defineType('Class', {
  properties: {
    name: {type: stringType, optional: true},
    members: {type: arrayOf(oneOf(nodeType(MethodType), nodeType(PropertyType)))},
    // extends: {type: identifierType, optional: true},
  },
  computed: {
    ctor: {
      type: nodeType(MethodType),
      get() {
        return this.members.filter((member) => member.is(MethodType) && member.kind === 'constructor')[0];
      },
    },
    methods: {
      type: arrayOf(nodeType(MethodType)),
      get() { return this.members.filter((member) => member.is(MethodType)); },
    },
    properties: {
      type: arrayOf(nodeType(PropertyType)),
      get() { return this.members.filter((member) => member.is(PropertyType)); },
    },
  },
});
