import {MixinType, ParamType} from '../entities';

export default function mixinBuilder({context, ...tags}) {
  console.log(context);
  return MixinType({
    ...tags,
    name: context.name,
    params: context.params.map(ParamType),
  });
}

mixinBuilder.handles = (context) => context.type === 'mixin';
