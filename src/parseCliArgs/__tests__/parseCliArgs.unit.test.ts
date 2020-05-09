import { ArgumentsMap, parseCliArgs } from '../parseCliArgs';

/* TODO: Enable this function to parse quoted strings */
function toArgs(argString: string): string[] {
  return argString.split(' ');
}

describe('parseCliArgs()', () => {
  it('by default should parse positional arguments', () => {
    const parsedArgs: ArgumentsMap = parseCliArgs(undefined, {
      args: ['a', '1', 'quoted value'],
    });

    const expected = {
      _positional: ['a', 1, 'quoted value'], // all positional args
      _unparsed: [],
    };
    expect(parsedArgs).toEqual(expected);
  });

  it("should treat arguments after '--' as unparsed arguments", () => {
    const parsedArgs: ArgumentsMap = parseCliArgs(undefined, {
      args: toArgs('1 -- 2 3'),
    });

    const expected = {
      _positional: [1], // all positional args
      _unparsed: ['2', '3'],
    };
    expect(parsedArgs).toEqual(expected);
  });
});
