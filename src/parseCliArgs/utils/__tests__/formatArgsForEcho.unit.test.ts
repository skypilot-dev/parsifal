import { formatArgsForEcho } from '../formatArgsForEcho';

describe('formatArgsForEcho()', () => {
  it('if the map is empty, should return an empty array', () => {
    const messages = formatArgsForEcho(new Map(), []);

    expect(messages).toStrictEqual([]);
  });

  it('if the map contains resolved arguments, should include a message displaying them', () => {
    const messages = formatArgsForEcho(new Map<string, number | string>([
      ['numericArg', 1],
      ['stringArg', 'resolved-value'],
    ]), []);

    expect(messages).toStrictEqual([
      'Resolved arguments:',
      '  numericArg: 1',
      '  stringArg: "resolved-value"',
    ]);
  });

  it('if the map contains unresolved values, should include a message displaying them', () => {
    const unresolvedPositionalArgs = [1, 'unresolved-value'];
    const messages = formatArgsForEcho(
      new Map([]),
      unresolvedPositionalArgs
    );

    expect(messages).toStrictEqual([
      'Unresolved arguments: 1, "unresolved-value"',
    ]);
  });

  it('by default should not display undefined values', () => {
    const messages = formatArgsForEcho(new Map([
      ['numericArg', undefined],
    ]), []);

    expect(messages).toStrictEqual([]);
  });

  it('if `echoUndefined: true`, should display undefined values', () => {
    const messages = formatArgsForEcho(new Map([
      ['undefinedArg', undefined],
    ]), [], { echoUndefined: true });

    expect(messages).toStrictEqual([
      'Resolved arguments:',
      '  undefinedArg: undefined',
    ]);
  });
});
