import { describe, expect, it } from 'vitest';

import { omitAliases } from '../omitAliases';

describe(omitAliases, () => {
  it('omits entries whose keys are aliases', () => {
    const keyValues = {
      actual1: 1,
      actual2: 'two',
      alias1: 1,
      alias2: 'two',
    };
    const aliasMap = {
      alias1: 'actual1',
      alias2: 'actual2',
    };

    const noAliases = omitAliases(keyValues, aliasMap);

    const expected = {
      actual1: 1,
      actual2: 'two',
    };
    expect(noAliases).toEqual(expected);
  });
});
