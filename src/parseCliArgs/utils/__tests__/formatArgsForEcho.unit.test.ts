import { describe, expect, it } from 'vitest';

import { formatArgsForEcho } from '../formatArgsForEcho';

describe(formatArgsForEcho, () => {
  it('if the map is empty, returns an empty array', () => {
    const messages = formatArgsForEcho(new Map(), []);

    expect(messages).toStrictEqual([]);
  });

  it('if the map contains resolved arguments, includes a message displaying them', () => {
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

  it('if the map contains unresolved values, includes a message displaying them', () => {
    const unresolvedPositionalArgs = [1, 'unresolved-value'];
    const messages = formatArgsForEcho(
      new Map([]),
      unresolvedPositionalArgs
    );

    expect(messages).toStrictEqual([
      'Unresolved arguments: 1, "unresolved-value"',
    ]);
  });

  it('by default does not display undefined values', () => {
    const messages = formatArgsForEcho(new Map([
      ['numericArg', undefined],
    ]), []);

    expect(messages).toStrictEqual([]);
  });

  it('if `echoUndefined: true`, displays undefined values', () => {
    const messages = formatArgsForEcho(new Map([
      ['undefinedArg', undefined],
    ]), [], { echoUndefined: true });

    expect(messages).toStrictEqual([
      'Resolved arguments:',
      '  undefinedArg: undefined',
    ]);
  });
});
