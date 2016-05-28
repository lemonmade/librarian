import define from 'librarian/src/entities';
import {arrayOfType, oneOfTypes, StringType, entityType} from 'librarian/src/types';
import {basicProperties, exportProperties} from './common';
import MethodType, {CONSTRUCTOR} from './method';
import PropertyType from './property';

export default define({
  name: 'JavaScript:Class',
  properties: {
    ...basicProperties,
    ...exportProperties,

    name: {type: StringType, optional: true},
    members: {
      type: arrayOfType(
        oneOfTypes({
          name: 'JavaScript:Class:Member',
          types: [entityType(MethodType), entityType(PropertyType)],
        })
      ),
    },

    // Computed

    ctor: {
      type: entityType(MethodType),
      get: (entity) => (
        entity.members.find(
          (member) => MethodType.check(member) && member.kind === CONSTRUCTOR
        )
      ),
    },
    methods: {
      type: arrayOfType(entityType(MethodType)),
      get: (entity) => entity.members.filter((member) => MethodType.check(member)),
    },
    properties: {
      type: arrayOfType(entityType(PropertyType)),
      get: (entity) => entity.members.filter((member) => PropertyType.check(member)),
    },
  },
});
