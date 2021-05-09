import { parseCliArgs } from '../parseCliArgs';

const parsedArgs = parseCliArgs({
  named: [
    { name: 'myNamedArg', aliases:  ['n'] },
    { name: 'verbose', valueType: 'boolean' },
    { name: 'int', valueType: 'integerArray', validRange: [1,2] },
    { name: 'str', valueType: 'stringArray' },
  ],
  positional: [
    { name: 'positional' },
  ],
}, { echo: { echoIf: argsMap => argsMap.get('verbose') } });

console.log('parsedArgs:', parsedArgs);
