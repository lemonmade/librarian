import processor from '../../src/processor';

describe.skip('integration', () => {
  const config = {logger() {}};
  const filename = 'foo.js';

  it('works', () => {
    const source = `export default class Foo {
      static foo() {}
    }`;
    const results = [...processor({filename, source}, {config})]
    console.log(results);
  });
});
