import {FunctionType, ParamType} from '../entities';

export default function mixinBuilder({context, ...tags}, {filename}) {
  return FunctionType({
    ...tags,
    name: context.name,
    params: context.params.map(ParamType),
    location: {
      file: filename,
      start: {line: context.line.start},
      end: {line: context.line.end},
    },
  });
}

mixinBuilder.handles = ({context}) => context.type === 'function';
