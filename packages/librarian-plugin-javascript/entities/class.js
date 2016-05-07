import define from 'librarian/entities';
import {arrayOf, oneOf, stringType, nodeType} from 'librarian/types';
import MethodType from './method';
import PropertyType from './property';

export default define('Class', {
  properties: {
    name: {type: stringType, optional: true},
    members: {
      type: arrayOf(
        oneOf({name: 'Member', types: [nodeType(MethodType), nodeType(PropertyType)]})
      ),
    },
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