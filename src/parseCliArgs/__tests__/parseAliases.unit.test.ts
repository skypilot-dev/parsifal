import { parseAliases } from '../parseAliases';

describe('parseAliases()', () => {
  it('should', () => {
    const aliasDefs = [
      { name: 'actual1', aliases: ['alias1a', 'alias1b'] },
      { name: 'unaliased' },
      { name: 'actual3', aliases: ['alias3'] },
    ];

    const aliasMap = parseAliases(aliasDefs);

    const expected = {
      alias1a: 'actual1',
      alias1b: 'actual1',
      alias3: 'actual3',
    };
    expect(aliasMap).toEqual(expected);
  });
});
