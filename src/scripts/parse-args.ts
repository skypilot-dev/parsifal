import { parseCliArgs } from '../parseCliArgs';

const parsedArgs = parseCliArgs({
  named: [
    { name: 'myNamedArg', aliases:  ['n'] },
  ],
  positional: [
    { name: 'positional' },
  ],
});

console.log('parsedArgs:', parsedArgs)
