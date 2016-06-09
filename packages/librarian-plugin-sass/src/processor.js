// import tags from './tags';

import SCSSCommentParser from 'scss-comment-parser';
import mixinBuilder from './builders/mixin';

export default function processor({filename, source}, {config}) {
  config.logger(`Processing ${filename}`, {
    plugin: 'sass',
  });

  const parser = new SCSSCommentParser({});

  return [
    mixinBuilder(parser.parse(source)[0]),
  ];
}
