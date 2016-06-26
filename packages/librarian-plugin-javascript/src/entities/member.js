import define from 'librarian/src/entities';
import {BooleanType, StringType, oneOfTypes, IdentifierType} from 'librarian/src/types';
import createID from 'librarian/src/id';

import FunctionType from './function';
import ValueType from './value';
import TypeType from './type';
import {getValueEntities} from './value-entity';
import {basicProperties} from './common';

// lazy load this to prevent circular dependencies
let MemberValueType;

export default define({
  name: 'Member',
  source: 'ESNext',
  properties: () => {
    MemberValueType = MemberValueType || oneOfTypes({
      name: 'ESNext:Member:Value',
      types: getValueEntities(),
    });

    return {
      ...basicProperties,

      key: {type: ValueType},
      value: {type: MemberValueType, optional: true},
      type: {type: TypeType, optional: true},
      static: {type: BooleanType, default: false},
      memberOf: {type: MemberValueType, optional: true},

      // computed

      id: {
        type: IdentifierType,
        get: (entity) => (
          createID(entity.memberOf.id)
            .clone()
            .appendMember({name: entity.name, static: entity.static})
        ),
      },
      name: {
        type: StringType,
        optional: true,
        get: (entity) => entity.key.value,
      },
      isStatic: {
        type: BooleanType,
        get: (entity) => entity.static,
      },
      isInstance: {
        type: BooleanType,
        get: (entity) => !entity.isStatic,
      },
      isMethod: {
        type: BooleanType,
        get: (entity) => FunctionType.check(entity.value),
      },
      isProperty: {
        type: BooleanType,
        get: (entity) => ValueType.check(entity.value),
      },
    };
  },
});
