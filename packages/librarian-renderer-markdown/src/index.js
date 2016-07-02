import fs from 'fs';
import path from 'path';

import {ClassType} from '../../librarian-plugin-javascript/src/entities';

import plugin from 'librarian/src/plugin';

export default plugin('Static site generator', ({output = 'library.md'}) => ({
  async render(library, config) {
    config.logger('Rendering markdown', {plugin: 'markdown'});

    let contents = '# Library\n\n## Classes\n\n';

    contents += (
      library
        .findAll((entity) => ClassType.check(entity))
        .map(renderClass)
        .join('\n\n')
    );

    await new Promise((resolve, reject) => {
      fs.writeFile(config.absolutePath(path.join(config.output, output)), contents, (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  },
}));

function renderClass(klass) {
  const {instanceMembers, staticMembers} = getMembers(klass);

  const pieces = [
    `### \`${klass.name}\``,
    klass.description,
    klass.extends && `Extends \`${klass.extends.name}\`.`,
    instanceMembers.map(renderInstanceMember).join('\n\n'),
    staticMembers.map(renderStaticMember).join('\n\n'),
  ].filter((piece) => Boolean(piece));

  return pieces.join('\n\n');
}

function renderInstanceMember(member) {
  return `#### \`${member.memberOf.name}#${member.name}${member.isMethod ? '()' : ''}\``;
}

function renderStaticMember(member) {
  return `#### \`${member.memberOf.name}.${member.name}${member.isMethod ? '()' : ''}\``;
}

function getMembers(klass) {
  return klass.members.reduce((members, member) => {
    if (member.isStatic) {
      members.staticMembers.push(member);
    } else {
      members.instanceMembers.push(member);
    }

    return members;
  }, {instanceMembers: [], staticMembers: []});
}
