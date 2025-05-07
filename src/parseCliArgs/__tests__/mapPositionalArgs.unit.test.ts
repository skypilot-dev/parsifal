import { describe, expect, it } from 'vitest';

import type { ArgumentValue } from '~src/parseCliArgs/_types/index.ts';
import { mapPositionalArgs } from '~src/parseCliArgs/mapPositionalArgs.ts';

describe(mapPositionalArgs, () => {
  it('by default does not map arguments to indices', () => {
    const values = [1, 'b'];

    const argsMap = mapPositionalArgs(values);

    const expected = {};
    expect(argsMap).toStrictEqual(expected);
  });

  it('if `mapAllArgs:true`, should map all arguments to indices', () => {
    const values = [1, 'b'];

    const argsMap = mapPositionalArgs(values, [], { mapAllArgs: true });

    const expected = {
      '0': 1,
      '1': 'b',
    };
    expect(argsMap).toStrictEqual(expected);
  });

  it('maps an array of arguments to an array of strings and return the map', () => {
    const argDefs = [{ name: 'numberOption' }, { name: 'stringOption' }];
    const values = [1, 'a'];

    const args = mapPositionalArgs(values, argDefs);

    const expected = {
      numberOption: 1,
      stringOption: 'a',
    };

    expect(args).toStrictEqual(expected);
  });

  it('if there are more strings than args, maps undefined to the remaining strings', () => {
    const argDefs = [{ name: 'option' }, { name: 'extraOption' }];
    const values = [1];

    const args = mapPositionalArgs(values, argDefs);

    const expected = {
      option: 1,
      extraOption: undefined,
    };

    expect(args).toStrictEqual(expected);
  });

  it('if there are more args than strings & `mapAllArgs:true`, maps the remaining args to indices', () => {
    const argDefs = [{ name: 'option' }];
    const values = [1, 2, 3];

    const args = mapPositionalArgs(values, argDefs, { mapAllArgs: true });

    const expected = {
      option: 1,
      '1': 2,
      '2': 3,
    };

    expect(args).toStrictEqual(expected);
  });

  it('can use definition objects along with strings', () => {
    const argDefs = [{ name: 'stringDefOption' }, { name: 'numberDefOption' }];
    const values = ['a', 3];

    const args = mapPositionalArgs(values, argDefs);

    const expected = {
      stringDefOption: 'a',
      numberDefOption: 3,
    };

    expect(args).toStrictEqual(expected);
  });

  it('given an empty array of arguments & no definitions, returns an empty object', () => {
    const values: ArgumentValue[] = [];

    const args = mapPositionalArgs(values);

    const expected = {};

    expect(args).toStrictEqual(expected);
  });

  it('should fall back to default values, if set', () => {
    const definitions = [
      { name: 'option1', defaultValue: 1 },
      { name: 'option2', defaultValue: 'a' },
      { name: 'option3' },
    ];
    const values: ArgumentValue[] = [];

    const namedArgsMap = mapPositionalArgs(values, definitions);

    const expected = {
      option1: 1,
      option2: 'a',
      option3: undefined,
    };
    expect(namedArgsMap).toStrictEqual(expected);
  });
});
