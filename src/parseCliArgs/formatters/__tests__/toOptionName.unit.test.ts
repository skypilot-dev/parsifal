import { describe, expect, it } from 'vitest';

import type { PositionalArgDefInput, PositionalArgumentDef } from '~src/parseCliArgs/_types/index.ts';
import { toOptionName } from '~src/parseCliArgs/formatters/toOptionName.ts';

describe(toOptionName, () => {
  it('given a string, returns the string', () => {
    const argDefString: PositionalArgDefInput = 'option1';
    const index = 0;

    const optionName = toOptionName(argDefString, index);

    const expected = 'option1';
    expect(optionName).toBe(expected);
  });

  it('given `undefined` and an index, returns the index as a string', () => {
    const argDefInput = undefined;
    const index = 1;

    const optionName = toOptionName(argDefInput, index);

    const expected = '1';
    expect(optionName).toBe(expected);
  });

  it('given an argument definition with `name:undefined` and an index, returns the index as a string', () => {
    const argDef = {};
    const index = 1;

    const optionName = toOptionName(argDef, index);

    const expected = '1';
    expect(optionName).toBe(expected);
  });

  it('given an argument definition with a value for `name`, returns the value', () => {
    const argDef: PositionalArgumentDef = { name: 'option1' };
    const index = 0;

    const optionName = toOptionName(argDef, index);

    const expected = 'option1';
    expect(optionName).toBe(expected);
  });
});
