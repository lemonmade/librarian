```js
export default class Foo {}
Foo.Bar = class Bar {}
```

```scss
/// @param $bar The bar param (no type, infer it!)
/// @param {Color} $baz - The baz param.
@mixin foo($bar: base, $baz)
```
