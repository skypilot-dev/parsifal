import { ArgumentDef, ValidationException } from '../_types';
import { validateConstrainedValue } from '../validateConstrainedValue';

describe('validateConstrainedValue(value, :ArgumentDef)', () => {
  it('when the value is among the valid values, should return an empty array', () => {
    const argDef: ArgumentDef = {
      validValues: [1, 2],
    };
    const value = 1;

    const exceptions = validateConstrainedValue(value, argDef);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('when `validValues` is undefined, should always return an empty array', () => {
    const argDef: ArgumentDef = {};
    const values = [0, 1, 'a', true, false];

    values.forEach((value) => {
      const exceptions = validateConstrainedValue(value, argDef);

      const expected: ValidationException[] = [];
      expect(exceptions).toEqual(expected);
    })
  });

  it('when the value is undefined, should return an empty array (because required values are validated elsewhere)', () => {
    const argDef: ArgumentDef = {
      validValues: [],
    };
    const value = undefined;

    const exceptions = validateConstrainedValue(value, argDef);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('when the value is not among `validValues`, should return an exception', () => {
    const argDef: ArgumentDef = {
      validValues: [1, 'a', true],
    };
    const values = [0, 2, 'b', false];


    values.forEach((value) => {
      const exceptions: ValidationException[] = validateConstrainedValue(value, argDef);
      if (exceptions.length < 1) {
        console.log(`invalidValue: ${value}`);
      }
      expect(exceptions).toHaveLength(1);
    })
  });

  it('can handle valid values of mixed types', () => {
    const argDef: ArgumentDef = {
      validValues: [1, 'a', false, undefined],
    };
    const values = [1, 'a', false];

    values.forEach((value) => {
      expect(validateConstrainedValue(value, argDef)).toEqual([]);
    });
  });
});
