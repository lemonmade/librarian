import {VariableType} from '../entities';

export default function mixinBuilder({context, ...tags}, {filename}) {
  return VariableType({
    ...tags,
    name: context.name,
    location: {
      file: filename,
      start: {line: context.line.start},
      end: {line: context.line.end},
    },
  });
}

mixinBuilder.handles = ({context}) => context.type === 'variable';
