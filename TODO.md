```js
import Bar from './bar';
class Foo extends Bar.Baz {}
```

```js
/// Should go to the class, not the export.
export default class Foo {}
```

```js
export default class Foo {}
Foo.Bar = class Bar {}
```

```scss
/// @param $bar The bar param (no type, infer it!)
/// @param {Color} $baz - The baz param.
@mixin foo($bar: base, $baz)
```
