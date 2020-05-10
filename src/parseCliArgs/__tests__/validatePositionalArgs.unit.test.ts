import { ArgumentValue, PositionalArgDefInput, ValidationException } from '../_types';
import { validatePositionalArgs } from '../validatePositionalArgs';

describe('validatePositionalArgs()', () => {
  it('should return no exceptions if no args are required (empty array)', () => {
    const argDefs: PositionalArgDefInput[] = [];
    const values: ArgumentValue[] = [];

    const exceptions = validatePositionalArgs(values, argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return no exceptions if no args are required (string definitions)', () => {
    const argDefs = ['optional1', 'optional2'];
    const values: ArgumentValue[] = [];

    const exceptions = validatePositionalArgs(values, argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return no exceptions if all required args are provided (object definitions)', () => {
    const argDefs: PositionalArgDefInput[] = [{ name: 'optional1' }, { name: 'optional2' }];
    const values: ArgumentValue[] = [];

    const exceptions = validatePositionalArgs(values, argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return exceptions for each missing argument', () => {
    const argDefs: PositionalArgDefInput[] = [
      { name: 'requiredOption', required: true },
      { required: true },
      'optionalOption',
    ];
    const values: ArgumentValue[] = [];

    const exceptions = validatePositionalArgs(values, argDefs);

    const expected = [
      {
        level: 'error',
        message: "'requiredOption' is required",
        name: 'requiredOption',
      },
      {
        level: 'error',
        message: 'the 2nd argument is required',
        name: '1',
      },
    ];
    expect(exceptions).toEqual(expected);
  });
});
