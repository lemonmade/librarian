import define from 'librarian/src/entities';
import {arrayOfType, oneOfTypes, StringType} from 'librarian/src/types';
import {basicProperties, exportProperties} from './common';
import MethodType, {CONSTRUCTOR} from './method';
import PropertyType from './property';

const ClassType = define({
  name: 'JavaScript:Class',
  properties: () => ({
    ...basicProperties,
    ...exportProperties,

    name: {type: StringType, optional: true},
    extends: {
      type: ClassType,
      optional: true,
    },
    members: {
      type: arrayOfType(
        oneOfTypes({
          name: 'JavaScript:Class:Member',
          types: [MethodType, PropertyType],
        })
      ),
    },

    // Computed

    ctor: {
      type: MethodType,
      optional: true,
      get: (entity) => (
        entity.members.find(
          (member) => MethodType.check(member) && member.kind === CONSTRUCTOR
        )
      ),
    },
    methods: {
      type: arrayOfType(MethodType),
      get: (entity) => entity.members.filter(MethodType.check),
    },
    properties: {
      type: arrayOfType(PropertyType),
      get: (entity) => entity.members.filter(PropertyType.check),
    },
  }),
});

export default ClassType;
