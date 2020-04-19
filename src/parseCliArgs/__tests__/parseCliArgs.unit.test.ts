import { ArgumentsMap, parseCliArgs } from '../parseCliArgs';

function toArgs(argString: string): string[] {
  return argString.split(' ');
}

describe('parseCliArgs(:ParseCliArgsOptions)', () => {
  it('given positional arguments with names, should sequentially map the values to the names', () => {
    const parsedArgs: ArgumentsMap = parseCliArgs({
      args: toArgs('value1 value2'),
      argumentDefs: [
        { isPositional: true, name: 'option1' },
        { isPositional: true, name: 'option2' },
      ],
    });

    const expected = {
      option1: 'value1',
      option2: 'value2',
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('by default should parse undefined positional arguments', () => {
    const parsedArgs: ArgumentsMap = parseCliArgs({
      args: ['a', '1', 'quoted value'],
    });

    const expected = {
      '0': 'a',
      '1': 1,
      '2': 'quoted value',
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('given definitions for only some positional arguments, should map them in sequence', () => {
    const parsedArgs: ArgumentsMap = parseCliArgs({
      args: ['a', '1', 'quoted value'],
      argumentDefs: [
        { isPositional: true, name: 'string1' },
        { isPositional: true, name: 'number1' },
      ],
    });

    const expected = {
      'string1': 'a',
      'number1': 1,
      '2': 'quoted value',
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('by default should treat numeric arguments as numbers', () => {
    /* Note that negative values are not treated as numbers. */
    const parsedArgs: ArgumentsMap = parseCliArgs({
      args: toArgs('value1 2 0.3'),
      argumentDefs: [
        { isPositional: true, name: 'string1' },
        { isPositional: true, name: 'number1' },
        { isPositional: true, name: 'number2' },
      ],
    });

    const expected = {
      string1: 'value1',
      number1: 2,
      number2: 0.3,
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('by default, should treat all args after a stop as positional arguments', () => {
    const parsedArgs: ArgumentsMap = parseCliArgs({
      args: toArgs('a 1 -- --option -o'),
    });

    const expected: ArgumentsMap = {
      '0': 'a',
      '1': 1,
      '2': '--option',
      '3': '-o',
    };
    console.log('parsedArgs:', parsedArgs);
    expect(parsedArgs).toEqual(expected);
  });

  it('when separateAfterStopArgs=true, should treat all args after a stop as unparsed arguments', () => {
    const parsedArgs: ArgumentsMap = parseCliArgs({
      args: toArgs('-- --option -o'),
      separateAfterStopArgs: true,
    });

    const expected: ArgumentsMap = {
      '--': ['--option', '-o'],
    };
    console.log('parsedArgs:', parsedArgs);
    expect(parsedArgs).toEqual(expected);
  });

  it('should parse named arguments without the need for definitions', () => {
    const parsedArgs = parseCliArgs({
      args: toArgs('--option2=1 --option1=a'),
    });

    const expected: ArgumentsMap = {
      option1: 'a',
      option2: 1,
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('should parse named arguments without the need for definitions', () => {
    const parsedArgs = parseCliArgs({
      args: toArgs('--option2=1 -o=a'),
    });

    const expected = {
      o: 'a',
      option2: 1,
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('when requireNamedArgDefs=true, should throw an error if given unnamed args', () => {
    expect(() => {
      parseCliArgs({
        args: toArgs('--option2=1'),
        requireNamedArgDefs: true,
      });
    }).toThrow();
  });

  it('should treat an option without a value as a boolean', () => {
    const parsedArgs = parseCliArgs({
      args: toArgs('--bool'),
    });

    const expected: ArgumentsMap = {
      bool: true,
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('should understand aliases', () => {
    const parsedArgs: ArgumentsMap = parseCliArgs({
      args: toArgs('-a --alias=1'),
      argumentDefs: [
        { name: 'all', aliases: ['a'] },
        { name: 'actual', aliases: ['alias'] },
      ],
    });

    const expected = {
      all: true,
      actual: 1,
    };
    expect(parsedArgs).toEqual(expected);
  });

  it('if an option (including aliased versions) is used multiple times, return an array of all values', () => {
    const parsedArgs: ArgumentsMap = parseCliArgs({
      args: toArgs('-c=1 --count=2 --count=3'),
      argumentDefs: [
        { name: 'count', aliases: ['c'] },
      ],
    });

    const expected: ArgumentsMap = { count: [1, 2, 3] };
    expect(parsedArgs).toEqual(expected);
  });

  it("should exit with 1 if a required positional argument isn't supplied", () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    parseCliArgs({
      args: toArgs(''),
      argumentDefs: [{ required: true }],
      exitProcessWhenTesting: true,
    });
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore()
  });

  it("should exit with 1 if a required named argument isn't supplied", () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    parseCliArgs({
      args: toArgs('--option2=a'),
      argumentDefs: [
        { name: 'color', required: true, valueLabel: 'hexademical color' },
        { name: 'option2' },
      ],
      exitProcessWhenTesting: true,
    });
    expect(mockExit).toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });
});
