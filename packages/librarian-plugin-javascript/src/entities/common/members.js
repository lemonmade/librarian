import {arrayOfType} from 'librarian/src/types';
import MemberType from '../member';

const MemberListType = arrayOfType(MemberType);

export default {
  members: {type: MemberListType, default: []},

  // computed

  allMembers: {
    type: MemberListType,
    get: (entity) => entity.members.concat(entity.inheritedMembers),
  },
  inheritedMembers: {
    type: MemberListType,
    get: (entity) => entity.extends ? entity.extends.allMembers : [],
  },

  // methods

  methods: {
    type: MemberListType,
    get: (entity) => entity.members.filter((member) => member.isMethod),
  },
  allMethods: {
    type: MemberListType,
    get: (entity) => entity.allMembers.filter((member) => member.isMethod),
  },

  // properties

  properties: {
    type: MemberListType,
    get: (entity) => entity.members.filter((member) => member.isProperty),
  },
  allProperties: {
    type: MemberListType,
    get: (entity) => entity.allMembers.filter((member) => member.isProperty),
  },
};
