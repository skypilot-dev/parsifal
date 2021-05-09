import { parseCliArgs } from '../index';
import type { DefinitionsMap, ParsedArgsResult } from '../index';

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
      positional: [{ name: 'pos1', required: false }, { name: 'pos2',  required: true }],
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
    };
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

  it('by default should treat any double-hyphenated argument as a boolean', () => {
    const definitions: DefinitionsMap = {
      named: [{ name: 'implicitTrue' }],
    };
    const options = {
      args: toArgs('--implicitTrue'),
    };

    const args = parseCliArgs(definitions, options);

    const expectedArgs = {
      _positional: [],
      _unparsed: [],
      implicitTrue: true,
    };
    expect(args).toStrictEqual(expectedArgs);
  });

  it("if `valueType` is anything other than 'boolean', the arg should not be treated as a boolean", () => {
    const definitions: DefinitionsMap = {
      named: [
        { name: 'trueString' },
        { name: 'falseString' },
      ],
    };
    const options = {
      args: toArgs('--trueString=true --falseString=false true false'),
    };

    const args = parseCliArgs(definitions, options);

    const expectedArgs = {
      _positional: ['true', 'false'],
      _unparsed: [],
      trueString: 'true',
      falseString: 'false',
    };
    expect(args).toStrictEqual(expectedArgs);
  });

  it("if `valueType: 'boolean'`, 'true' and 'false' should be treated as boolean values", () => {
    const definitions: DefinitionsMap = {
      named: [
        { name: 'explicitTrue', valueType: 'boolean' },
        { name: 'explicitFalse', valueType: 'boolean' },
      ],
    };
    const options = {
      args: toArgs('--explicitTrue=true --explicitFalse=false'),
    };

    const args = parseCliArgs(definitions, options);

    const expectedArgs = {
      _positional: [],
      _unparsed: [],
      explicitTrue: true,
      explicitFalse: false,
    };
    expect(args).toStrictEqual(expectedArgs);
  });

  it("if `valueType: 'string'`, the arg should always be treated as a string", () => {
    const definitions: DefinitionsMap = {
      named: [
        { name: 'booleanString', valueType: 'string' },
        { name: 'numericString', valueType: 'string' },
      ],
      positional: [
        { name: 'booleanString', valueType: 'string' },
        { name: 'numericString', valueType: 'string' },
      ],
    };
    const options = {
      args: toArgs('--booleanString=true --numericString=0'),
    };

    const args = parseCliArgs(definitions, options);

    const expectedArgs = {
      _positional: [],
      _unparsed: [],
      booleanString: 'true',
      numericString: '0',
    };
    expect(args).toStrictEqual(expectedArgs);
  });

  it("if `valueType: 'stringArray`, should convert the value to a string array", () => {
    const definitions: DefinitionsMap = {
      named: [
        { name: 'alphanumericStringArray', valueType: 'stringArray' },
        { name: 'numericStringArray', valueType: 'stringArray' },
      ],
    };
    const options = {
      args: toArgs('--numericStringArray=1,2 --alphanumericStringArray=a,1'),
    };

    const args = parseCliArgs(definitions, options);

    const expectedArgs = {
      _positional: [],
      _unparsed: [],
      alphanumericStringArray: ['a', '1'],
      numericStringArray: ['1', '2'],
    };
    expect(args).toStrictEqual(expectedArgs);
  });

  it("if `valueType: 'integerArray`, should convert the value to an integer array", () => {
    const definitions: DefinitionsMap = {
      named: [
        { name: 'integerArray', valueType: 'integerArray' },
      ],
    };
    const options = {
      args: toArgs('--integerArray=1,2'),
    };

    const args = parseCliArgs(definitions, options);

    const expectedArgs = {
      _positional: [],
      _unparsed: [],
      integerArray: [1, 2],
    };
    expect(args).toStrictEqual(expectedArgs);
  });
});
