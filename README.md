# @skypilot/parsifal

Intelligent and flexible command-line parser

[![npm alpha](https://img.shields.io/npm/v/@skypilot/quick-release/alpha?label=alpha)](https://www.npmjs.com/package/@skypilot/quick-release)
![alpha build](https://img.shields.io/github/workflow/status/skypilot-dev/quick-release/Prerelease?branch=alpha&label=alpha%20build)
[![license: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Example

```javascript
import { parseCliArgs } from 'parsifal';

const parsedArgs = parseCliArgs({
  named: [
    { name: 'myNamedArg' }
  ],
  positional: [
    { name: 'myPositionalArg' },
    { name: 'anotherPositionalArg' },
  ]
});
```

```console
$ node my-script.js --named=1 2 3 unexpectedArg
/*
  parsedArgs = {
    _positional: [2, 3, 'unexpectedArg'],
    _unparsed: [],
    myNamedArg: 1,
    myPositionalArg: 2,
    anotherPositionalArg: 3,
  }
*/
```
