# @skypilot/parsifal

Intelligent and flexible command-line parser

[![npm alpha](https://img.shields.io/npm/v/@skypilot/quick-release/alpha?label=alpha)](https://www.npmjs.com/package/@skypilot/quick-release)
![alpha build](https://img.shields.io/github/workflow/status/skypilotcc/quick-release/Prerelease?branch=alpha&label=alpha%20build)
[![license: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Example

```javascript
import { parseCliArgs } from 'parsifal';

const parsedArgs = parseCliArgs({
  argumentDefs: [
    { isPositional: true },
    { name: 'positional' }
  ]
});
```

```console
$ node my-script.js --named=1 positionalValue 2
// parsedArgs = { '0': 'positionalValue', '1': 2, named: 1, _: [2] }
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
