import define from 'librarian/src/entities';
import {arrayOf, oneOf, stringType, nodeType} from 'librarian/src/types';
import BaseType from './base';
import MethodType from './method';
import PropertyType from './property';

export default define('JavaScriptClass', {
  extends: BaseType,
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
        return this.members.filter((member) => MethodType.check(member) && member.kind === 'constructor')[0];
      },
    },
    methods: {
      type: arrayOf(nodeType(MethodType)),
      get() { return this.members.filter((member) => MethodType.check(member)); },
    },
    properties: {
      type: arrayOf(nodeType(PropertyType)),
      get() { return this.members.filter((member) => PropertyType.check(member)); },
    },
  },
});
