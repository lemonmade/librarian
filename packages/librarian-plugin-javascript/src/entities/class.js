import define from 'librarian/src/entities';
import {arrayOf, oneOf, stringType, nodeType} from 'librarian/src/types';
import {basicProperties, exportProperties} from './common';
import MethodType from './method';
import PropertyType from './property';

export default define({
  name: 'JavaScript:Class',
  properties: {
    ...basicProperties,
    ...exportProperties,

    name: {type: stringType, optional: true},
    members: {
      type: arrayOf(
        oneOf({
          name: 'JavaScriptClassMember',
          types: [nodeType(MethodType), nodeType(PropertyType)],
        })
      ),
    },

    // Computed
    ctor: {
      type: nodeType(MethodType),
      get: (entity) => (
        entity.members.find(
          (member) => MethodType.check(member) && member.kind === 'constructor'
        )
      ),
    },
    methods: {
      type: arrayOf(nodeType(MethodType)),
      get: (entity) => entity.members.filter((member) => MethodType.check(member)),
    },
    properties: {
      type: arrayOf(nodeType(PropertyType)),
      get: (entity) => entity.members.filter((member) => PropertyType.check(member)),
    },
  },
});
