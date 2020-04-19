# @skypilot/parsifal

Intelligent and flexible command-line parser

## Example

```javascript
import { parseCliArgs } from 'parsifal';

const parsedArgs = parseCliArgs({
  argumentDefs: [
    { isPositional: true },
    { name: 'named' }
  ]
});
```

```console
$ node my-script.js positionalValue --named=1
// parsedArgs = { '0': 'positionalValue', named: 1 }
```


```javascript
import { parseCliArgs } from 'parsifal';

const parsedArgs = parseCliArgs({
  argumentDefs: [
   { name: 'positional', isPositional: true },
    { name: 'named', aliases:  ['n'] },
  ]
});
```

```console
$ node my-script.js positionalValue --n 1
// parsedArgs = { positional: 'positionalValue', named: 1 }
```
