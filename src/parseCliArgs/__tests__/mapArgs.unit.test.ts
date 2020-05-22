import { ArgumentDefinition, InitialParsedArgs } from '../_types';
import { mapArgs } from '../mapArgs';

describe('mapArgs(:InitialParsedArgs, :ArgumentDefinition[])', () => {
  it('should return a map of values & argument definitions to argument names', () => {
    const argDefs: ArgumentDefinition[] = [
      { name: 'named1', positional: false },
      { name: 'positional1', positional: true },
    ];
    const initialParsedArgs: InitialParsedArgs = {
      _: ['a'],
      '--': [],
      named1: 0,
    };

    const argsMap = mapArgs(initialParsedArgs, argDefs);

    const expected = new Map([
      ['named1', { definition: { name: 'named1', positional: false },  value: 0 }],
      ['positional1', { definition: { name: 'positional1', positional: true },  value: 'a' }],
    ]);
    expect(argsMap).toStrictEqual(expected);
  });

  it('should map undefined to missing arguments', () => {
    const argDefs: ArgumentDefinition[] = [
      { name: 'named1', positional: false },
      { name: 'pos1', positional: true },
      { name: 'pos2', positional: true },
    ];
    const initialParsedArgs: InitialParsedArgs = {
      _: [0],
      '--': [],
    };

    const argsMap = mapArgs(initialParsedArgs, argDefs);

    const expected = new Map([
      ['named1', { definition: { name: 'named1', positional: false },  value: undefined }],
      ['pos1', { definition: { name: 'pos1', positional: true },  value: 0 }],
      ['pos2', { definition: { name: 'pos2', positional: true },  value: undefined }],
    ]);
    expect(argsMap).toStrictEqual(expected);
  });
});
