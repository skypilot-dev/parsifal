import { PositionalArgDefInput, ValidationException } from '../_types';
import { validateOptionNames } from '../validateOptionNames';

describe('validateOptionNames', () => {
  it('given no definitions, should return no exceptions', () => {
    const argDefInputs: PositionalArgDefInput[] = [];

    const exceptions = validateOptionNames(argDefInputs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('given nonconflicting option names, should return an empty array', () => {
    const argDefInputs: PositionalArgDefInput[] = [
      'option1',
      'option2',
      { name: 'option3' },
    ];

    const exceptions = validateOptionNames(argDefInputs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('given an array containing duplicate strings, should return an exception', () => {
    const argDefStrings: PositionalArgDefInput[] = ['option1', { name: 'option1' }];

    const exceptions = validateOptionNames(argDefStrings);

    expect(exceptions.length).toBeGreaterThan(0);
  });

  it('when an option name conflicts with an index, by default should return no exceptions', () => {
    const argDefStrings: PositionalArgDefInput[] = [{}, '0'];

    const exceptions = validateOptionNames(argDefStrings);

    expect(exceptions).toEqual([]);
  });

  it('when an option name conflicts with an index and `useIndicesAsOptionNames:true`, should return an exception', () => {
    const argDefStrings: PositionalArgDefInput[] = [{}, '0'];

    const exceptions = validateOptionNames(argDefStrings, { useIndicesAsOptionNames: true });

    expect(exceptions.length).toBeGreaterThan(0);
  });
});
