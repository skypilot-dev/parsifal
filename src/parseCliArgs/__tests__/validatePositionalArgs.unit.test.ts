import { ArgumentValue, PositionalArgumentDef, ValidationException } from '../_types';
import { validatePositionalArgs } from '../validatePositionalArgs';

describe('validatePositionalArgs()', () => {
  it('should return no exceptions if no args are required (empty array)', () => {
    const argDefs: PositionalArgumentDef[] = [];
    const values: ArgumentValue[] = [];

    const exceptions = validatePositionalArgs(values, argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return no exceptions if no args are required', () => {
    const argDefs: PositionalArgumentDef[] = [{ name: 'optional1' }, { name: 'optional2' }];
    const values: ArgumentValue[] = [];

    const exceptions = validatePositionalArgs(values, argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return no exceptions if all required args are provided', () => {
    const argDefs: PositionalArgumentDef[] = [
      { name: 'required1', required: true }, { name: 'optional2' },
    ];
    const values: ArgumentValue[] = [1];

    const exceptions = validatePositionalArgs(values, argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return exceptions for each missing argument', () => {
    const argDefs: PositionalArgumentDef[] = [
      { name: 'requiredOption', required: true },
      { required: true },
      { name: 'optionalOption' },
    ];
    const values: ArgumentValue[] = [];

    const exceptions = validatePositionalArgs(values, argDefs);

    const expected = [
      {
        level: 'error',
        message: "'requiredOption' is required",
        identifiers: ['requiredOption'],
      },
      {
        level: 'error',
        message: 'the 2nd argument is required',
        identifiers: ['1'],
      },
    ];
    expect(exceptions).toEqual(expected);
  });
});
