import { parseCliArgs } from '../parseCliArgs';

const parsedArgs = parseCliArgs({
  named: [
    { name: 'myNamedArg', aliases:  ['n'] },
    { name: 'verbose', valueType: 'boolean' },
  ],
  positional: [
    { name: 'positional' },
  ],
}, { echo: { echoIf: argsMap => argsMap.get('verbose') } });

console.log('parsedArgs:', parsedArgs);
