import { describe, expect, it } from 'vitest';

import type { PositionalArgumentDef } from '~src/parseCliArgs/_types/index.ts';
import { validatePositionalArgDefs } from '~src/parseCliArgs/validators/validatePositionalArgDefs.ts';

describe(validatePositionalArgDefs, () => {
  it('returns no exceptions when the definitions are valid', () => {
    const argDefs: PositionalArgumentDef[] = [{ name: 'a' }, { name: 'option2' }];

    const exceptions = validatePositionalArgDefs(argDefs);

    const expected: string[] = [];
    expect(exceptions).toStrictEqual(expected);
  });

  it('returns no exceptions when no definitions were given', () => {
    const argDefs: PositionalArgumentDef[] = [];

    const exceptions = validatePositionalArgDefs(argDefs);

    const expected: string[] = [];
    expect(exceptions).toStrictEqual(expected);
  });

  it('returns an exception when a required arg follows an optional arg', () => {
    const argDefs: PositionalArgumentDef[] = [
      { name: 'option1', required: false },
      { name: 'option2', required: true },
    ];

    const exceptions = validatePositionalArgDefs(argDefs);

    const expected = [
      {
        level: 'error',
        message:
          'Invalid definitions: Required args must precede optional args (the 1st is optional, but the 2nd is required)',
        identifiers: ['option2'],
      },
    ];
    expect(exceptions).toStrictEqual(expected);
  });
});
