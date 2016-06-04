import {allEntities} from './utils';

describe.only('augmenting', () => {
  it('works', () => {
    const first = allEntities(`
      function foo() {}
      foo.bar = 'baz';
      foo.baz = 3;
    `)[0];
    console.log(first.members);
  });
});
