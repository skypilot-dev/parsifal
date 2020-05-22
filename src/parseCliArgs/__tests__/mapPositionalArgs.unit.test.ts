import { ArgumentValue } from '../_types';
import { mapPositionalArgs } from '../mapPositionalArgs';

describe('mapPositionalArgs(:ArgumentValue[]), :PositionalArgumentDef[]', () => {
  it('by default should not map arguments to indices', () => {
    const values = [1, 'b'];

    const argsMap = mapPositionalArgs(values);

    const expected = {};
    expect(argsMap).toEqual(expected);
  });

  it('if `mapAllArgs:true`, should map all arguments to indices', () => {
    const values = [1, 'b'];

    const argsMap = mapPositionalArgs(values, [], { mapAllArgs: true });

    const expected = {
      '0': 1,
      '1': 'b',
    };
    expect(argsMap).toEqual(expected);
  });

  it('should map an array of arguments to an array of strings and return the map', () => {
    const argDefs = [{ name: 'numberOption' }, { name: 'stringOption' }];
    const values = [1, 'a'];

    const args = mapPositionalArgs(values, argDefs);

    const expected = {
      numberOption: 1,
      stringOption: 'a',
    };

    expect(args).toEqual(expected);
  });

  it('if there are more strings than args, should map undefined to the remaining strings', () => {
    const argDefs = [{ name: 'option' }, { name: 'extraOption' }];
    const values = [1];

    const args = mapPositionalArgs(values, argDefs);

    const expected = {
      option: 1,
      extraOption: undefined,
    };

    expect(args).toEqual(expected);
  });

  it('if there are more args than strings & `mapAllArgs:true`, should map the remaining args to indices', () => {
    const argDefs = [{ name: 'option' }];
    const values = [1, 2, 3];

    const args = mapPositionalArgs(values, argDefs, { mapAllArgs: true });

    const expected = {
      option: 1,
      '1': 2,
      '2': 3,
    };

    expect(args).toEqual(expected);
  });

  it('can use definition objects along with strings', () => {
    const argDefs = [{ name: 'stringDefOption' }, { name: 'numberDefOption' }];
    const values = ['a', 3];

    const args = mapPositionalArgs(values, argDefs);

    const expected = {
      stringDefOption: 'a',
      numberDefOption: 3,
    };

    expect(args).toEqual(expected);
  });

  it('if a definition lacks a `name`, by default should not map the argument', () => {
    const argDefs = [{}];
    const values = [1];

    const args = mapPositionalArgs(values, argDefs);

    const expected = {};

    expect(args).toEqual(expected);
  });

  it("if a definition lacks a `name` and `useIndicesAsOptionNames:true`, should map the argument to the def's index", () => {
    const argDefs = [{}];
    const values = [1];

    const args = mapPositionalArgs(values, argDefs, { useIndicesAsOptionNames: true });

    const expected = {
      '0': 1,
    };

    expect(args).toEqual(expected);
  });

  it("if a definition lacks a `name` and `mapAllArgs:true`, should map the argument to the def's index", () => {
    const argDefs = [{}];
    const values = [1];

    const args = mapPositionalArgs(values, argDefs, { mapAllArgs: true });

    const expected = {
      '0': 1,
    };

    expect(args).toEqual(expected);
  });

  it('given an empty array of arguments & no definitions, should return an empty object', () => {
    const values: ArgumentValue[] = [];

    const args = mapPositionalArgs(values);

    const expected = {};

    expect(args).toEqual(expected);
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
    expect(namedArgsMap).toEqual(expected);
  });
});
