import {arrayOfType} from 'librarian/src/types';
import MemberType from '../member';

const MemberListType = arrayOfType(MemberType);

export default {
  members: {type: MemberListType, default: []},

  // computed

  properties: {
    type: MemberListType,
    get: (entity) => entity.members.filter((member) => member.isProperty),
  },
  methods: {
    type: MemberListType,
    get: (entity) => entity.members.filter((member) => member.isMethod),
  },
  instanceMembers: {
    type: MemberListType,
    get: (entity) => entity.members.filter((member) => member.isInstance),
  },
  instanceMethods: {
    type: MemberListType,
    get: (entity) => entity.instanceMembers.filter((member) => member.isMethod),
  },
  instanceProperties: {
    type: MemberListType,
    get: (entity) => entity.instanceMembers.filter((member) => member.isProperty),
  },
  staticMembers: {
    type: MemberListType,
    get: (entity) => entity.members.filter((member) => member.isStatic),
  },
  staticMethods: {
    type: MemberListType,
    get: (entity) => entity.staticMembers.filter((member) => member.isMethod),
  },
  staticProperties: {
    type: MemberListType,
    get: (entity) => entity.staticMembers.filter((member) => member.isProperty),
  },
};
