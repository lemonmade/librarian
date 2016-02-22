import * as babylon from 'babylon';

const plugins = [
  'asyncFunctions',
  'asyncGenerators',
  'classConstructorCall',
  'classProperties',
  'decorators',
  'doExpressions',
  'exponentiationOperator',
  'exportExtensions',
  'flow',
  'functionSent',
  'functionBind',
  'jsx',
  'objectRestSpread',
  'trailingFunctionCommas',
];

export default function parse(src: string) {
  const parsed = babylon.parse(src, {
    sourceType: 'module',
    plugins,
  });

  return parsed;
}
