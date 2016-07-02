// import tags from './tags';

import SCSSCommentParser from 'scss-comment-parser';
import createBuilder from '../../builder';

import * as Builders from './builders';

const builders = Object.values(Builders);

export default function processor({filename, source}, config) {
  config.logger(`Processing ${filename}`, {
    plugin: 'sass',
  });

  const parser = new SCSSCommentParser({
    _: {
      alias: {},
    },
    param: {
      parse(line) { return line; },
    },
    return: {
      parse(line) { return line; },
    },
  });

  const builder = createBuilder({builders});
  const state = {filename, builder, config};

  parser
    .parse(source)
    .forEach((entity) => builder.get(entity, state));

  return builder.all();
}
