import { ParsedArgsResult, parseCliArgs, DefinitionsMap } from '../index';

/* TODO: Enable this function to parse quoted strings */
function toArgs(argString: string): string[] {
  return argString.split(' ');
}

describe('parseCliArgs() - definitions', () => {
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

  it('if positional-argument defs have invalid required/optional order, should throw an error', () => {
    const definitions = {
      positional: [{ name: 'pos1', required: false }, {name: 'pos2',  required: true }],
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
});

describe('parseCliArgs() - arguments', () => {
  it('if named arguments are defined, should map values to them', () => {
    const definitions: DefinitionsMap = {
      named: ['option1', 'option2'],
    };
    const options = {
      args: [],
    };

    const args = parseCliArgs(definitions, options);

    const expected = {
      _positional: [],
      _unparsed: [],
      option1: undefined,
      option2: undefined,
    }
    expect(args).toEqual(expected);
  });

  it('if not enough required positional arguments are given, should report the error', () => {
    const definitions: DefinitionsMap = {
      positional: [{ name: 'positional', required: true }],
    };
    const options = {
      args: [],
    };

    expect(() => {
      parseCliArgs(definitions, options);
    }).toThrow();
  });

  it('if any required named argument is not given, should report the error', () => {
    const definitions: DefinitionsMap = {
      named: [{ name: 'option1', required: true }],
    };
    const options = {
      args: [],
    };

    expect(() => {
      parseCliArgs(definitions, options);
    }).toThrow();
  });

  it('if any argument has an invalid value, should report the error', () => {
    const definitions: DefinitionsMap = {
      named: [{ name: 'option1', validValues: [1] }],
    };
    const options = {
      args: toArgs('--option1=2'),
    };

    expect(() => {
      parseCliArgs(definitions, options);
    }).toThrow();
  });
});
