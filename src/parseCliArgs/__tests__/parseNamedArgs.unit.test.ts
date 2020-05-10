import { ArgumentsMap } from '../_types';
import { parseNamedArgs } from '../parseNamedArgs';

describe('parseNamedArgs(:ArgumentsMap, :NamedArgDefInput[])', () => {
  it('should return an object containing the entries whose keys are among the option names', () => {
    const definitions = ['option1', { name: 'option3' }];
    const argsMap: ArgumentsMap = {
      option1: 1,
      option2: 2,
      option3: 'a',
    };

    const namedArgsMap = parseNamedArgs(argsMap, definitions);

    const expected = {
      option1: 1,
      option3: 'a',
    };
    expect(namedArgsMap).toEqual(expected);
  });

  it('should map `undefined` to options that are undefined', () => {
    const definitions = ['option1', { name: 'option2' }];
    const argsMap: ArgumentsMap = {};

    const namedArgsMap = parseNamedArgs(argsMap, definitions);

    const expected = {
      option1: undefined,
      option2: undefined,
    };
    expect(namedArgsMap).toEqual(expected);
  });
});
