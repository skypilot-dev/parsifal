import { ParsedArgsResult, parseCliArgs, DefinitionsMap } from '../index';

/* TODO: Enable this function to parse quoted strings */
function toArgs(argString: string): string[] {
  return argString.split(' ');
}

describe('parseCliArgs()', () => {
  it('by default should parse positional arguments', () => {
    const parsedArgs: ParsedArgsResult = parseCliArgs(undefined, {
      args: ['a', '1', 'quoted value'],
    });

    const expected = {
      _positional: ['a', 1, 'quoted value'], // all positional args
      _unparsed: [],
    };
    expect(parsedArgs).toEqual(expected);
  });

  it("should treat arguments after '--' as unparsed arguments", () => {
    const parsedArgs: ParsedArgsResult = parseCliArgs(undefined, {
      args: toArgs('1 -- 2 3'),
    });

    const expected = {
      _positional: [1], // all positional args
      _unparsed: ['2', '3'],
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('can assign a name to an argument', () => {
    const definitions = {
      positional: ['a', 'b'],
    };

    const parsedArgs: ParsedArgsResult = parseCliArgs(definitions, {
      args: toArgs('1 2 -- 3'),
    });

    const expected = {
      _positional: [1, 2], // all positional args
      _unparsed: ['3'],
      a: 1,
      b: 2,
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('can map all args without definitions to their indices', () => {
    const definitions = {};

    const parsedArgs: ParsedArgsResult = parseCliArgs(definitions, {
      args: toArgs('1 2 -- 3'),
      mapAllArgs: true,
    });

    const expected = {
      _positional: [1, 2], // all positional args
      _unparsed: ['3'],
      '0': 1,
      '1': 2,
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('if positional-argument defs have invalid required/optional order, should throw an error', () => {
    const definitions = {
      positional: [{ required: false }, { required: true }],
    };

    expect(() => {
      parseCliArgs(definitions);
    }).toThrow();
  });

  it('if positional-argument defs have conflicting names, should throw an error', () => {
    const definitions = {
      positional: [{ name: 'option1' }, 'option1'],
    };

    expect(() => {
      parseCliArgs(definitions);
    }).toThrow();
  });

  it('when `useIndicesAsOptionNames: true`, should use indices for unnamed options', () => {
    const definitions = {
      positional: [{}, {}],
      useIndicesAsOptionNames: true,
    };

    const args = parseCliArgs(definitions);

    const expected = {
      '0': undefined,
      '1': undefined,
      _positional: [],
      _unparsed: [],
    };
    expect(args).toEqual(expected);
  });

  it('if positional-argument defs have a name that conflicts with an index, should throw an error', () => {
    const definitions: DefinitionsMap = {
      positional: [{}, '0'],
    };
    const options = {
      useIndicesAsOptionNames: true,
    };

    expect(() => {
      parseCliArgs(definitions, options);
    }).toThrow('Invalid definitions');
  });
});
