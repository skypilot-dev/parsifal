import { mapPositionalArgs } from '../mapPositionalArgs';

describe('mapPositionalArgs(: PositionalArgumentDef[], : ArgumentValue[])', () => {
  it('by default should map arguments to indices', () => {
    const values = [1, 'b'];

    const expected = {
      '0': 1,
      '1': 'b',
    };

    const argsMap = mapPositionalArgs([], values);

    expect(argsMap).toEqual(expected);
  });

  it('should map an array of arguments to an array of strings and return the map', () => {
    const argDefs = ['numberOption', 'stringOption'];
    const values = [1, 'a'];

    const args = mapPositionalArgs(argDefs, values);

    const expected = {
      numberOption: 1,
      stringOption: 'a',
    };

    expect(args).toEqual(expected);
  });

  it('if there are more strings than args, should map undefined to the remaining strings', () => {
    const argDefs = ['option', 'extraOption'];
    const values = [1];

    const args = mapPositionalArgs(argDefs, values);

    const expected = {
      option: 1,
      extraOption: undefined,
    };

    expect(args).toEqual(expected);
  });

  it('if there are more args than strings, should map the remaining args to indices', () => {
    const argDefs = ['option'];
    const values = [1, 2, 3];

    const args = mapPositionalArgs(argDefs, values);

    const expected = {
      option: 1,
      '1': 2,
      '2': 3,
    };

    expect(args).toEqual(expected);
  });
});
