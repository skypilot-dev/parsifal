import { PositionalArgumentDef, ValidationException } from '../../_types';
import { validateOptionNames } from '../validateOptionNames';

describe('validateOptionNames', () => {
  it('given no definitions, should return no exceptions', () => {
    const argDefInputs: PositionalArgumentDef[] = [];

    const exceptions = validateOptionNames(argDefInputs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('given nonconflicting option names, should return an empty array', () => {
    const argDefInputs: PositionalArgumentDef[] = [
      { name: 'option1' },
      { name: 'option2' },
      { name: 'option3' },
    ];

    const exceptions = validateOptionNames(argDefInputs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('given an array containing duplicate names, should return an exception', () => {
    const argDefStrings: PositionalArgumentDef[] = [
      { name: 'option1' },
      { name: 'option1' },
    ];

    const exceptions = validateOptionNames(argDefStrings);

    expect(exceptions.length).toBeGreaterThan(0);
  });
});
