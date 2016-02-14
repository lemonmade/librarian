/* @flow */

class Foo {}

type Options = {
  foo: number,
} & {bar: Array<any>};

/**
 * Class export documentation.
 */
export default class Bar extends Foo {

  /** A property with type. */
  prop: {something?: ?string} | Array<Foo>;

  /** Method docs */
  someMethod(arg1: string = 'foobar', {foo, bar}:Options = {}): ?Options {
  }
}

/** somethingElse export docs */
export function somethingElse() {}

/** andAnotherThing docs */
function andAnotherThing() {}

class Baz {}

export {andAnotherThing as someOtherThing, Baz};
