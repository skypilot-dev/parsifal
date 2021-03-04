import { formatArgsForDisplay } from '../formatArgsForDisplay';

describe('formatArgsForDisplay()', () => {
  it('if the map is empty, should return an empty array', () => {
    const messages = formatArgsForDisplay(new Map(), []);

    expect(messages).toStrictEqual([]);
  });

  it('if the map contains resolved arguments, should include a message displaying them', () => {
    const messages = formatArgsForDisplay(new Map([
      ['numericArg', { definition: { name: 'numericArg' }, value: 1 }],
      ['stringArg', { definition: { name: 'stringArg' }, value: 'resolved-value' }],
    ]), []);

    expect(messages).toStrictEqual([
      'Resolved arguments:',
      '  numericArg: 1',
      '  stringArg: "resolved-value"',
    ]);
  });

  it('if the map contains unresolved values, should include a message displaying them', () => {
    const unresolvedPositionalArgs = [1, 'unresolved-value'];
    const messages = formatArgsForDisplay(
      new Map([]),
      unresolvedPositionalArgs
    );

    expect(messages).toStrictEqual([
      'Unresolved arguments: 1, "unresolved-value"',
    ]);
  });
});
