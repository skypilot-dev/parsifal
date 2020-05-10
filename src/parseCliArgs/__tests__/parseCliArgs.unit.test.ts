import { ParsedArgsResult, parseCliArgs } from '../parseCliArgs';

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

  it('if positional-argument defs are invalid, should throw an error', () => {
    const definitions = {
      positional: [{ required: false }, { required: true }],
    };

    expect(() => {
      parseCliArgs(definitions);
    }).toThrow();
  });
});
