import { PositionalArgDefInput, PositionalArgumentDef } from '../_types';
import { toOptionName } from '../toOptionName';

describe('toOptionName(:PositionalArgDefInput)', () => {
  it('given a string, should return the string', () => {
    const argDefString: PositionalArgDefInput = 'option1';
    const index = 0;

    const optionName = toOptionName(argDefString, index);

    const expected = 'option1';
    expect(optionName).toBe(expected);
  });

  it('given `undefined` and an index, should return the index as a string', () => {
    const argDefInput = undefined;
    const index = 1;

    const optionName = toOptionName(argDefInput, index);

    const expected = '1';
    expect(optionName).toBe(expected);
  });

  it('given an argument definition with `name:undefined` and an index, should return the index as a string', () => {
    const argDef: PositionalArgumentDef = {};
    const index = 1;

    const optionName = toOptionName(argDef, index);

    const expected = '1';
    expect(optionName).toBe(expected);
  });

  it('given an argument definition with a value for `name`, should return the value', () => {
    const argDef: PositionalArgumentDef = { name: 'option1' };
    const index = 0;

    const optionName = toOptionName(argDef, index);

    const expected = 'option1';
    expect(optionName).toBe(expected);
  });
});
