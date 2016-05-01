import defineType from '../../../types/define';
import {arrayOf, oneOf, nodeType, stringType} from '../../../types/base';

export default defineType('Class', {
  properties: {
    name: {type: stringType, optional: true},
    // extends: {type: identifierType, optional: true},
    members: {type: arrayOf(oneOf(nodeType('Method'), nodeType('Property')))},
  },
  computed: {
    constructor: {
      type: nodeType('Method'),
      get() { return this.members.filter((member) => member.is('Method') && member.kind === 'constructor'); },
    },
    methods: {
      type: arrayOf(nodeType('Method')),
      get() { return this.members.filter((member) => member.is('Method')); },
    },
    properties: {
      type: arrayOf(nodeType('Property')),
      get() { return this.members.filter((member) => member.is('Property')); },
    },
  },
});
