import { ArgumentsMap, NamedArgumentDef, ValidationException } from '../../_types';
import { validateNamedArgs } from '../validateNamedArgs';

describe('validateNamedArgs()', () => {
  it('should return no exceptions if no args are required (empty array)', () => {
    const argDefs: NamedArgumentDef[] = [];
    const argsMap: ArgumentsMap = {};

    const exceptions = validateNamedArgs(argsMap, argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return no exceptions if no args are required', () => {
    const argDefs: NamedArgumentDef[] = [{ name: 'optional1' }, { name: 'optional2' }];
    const argsMap: ArgumentsMap = {};

    const exceptions = validateNamedArgs(argsMap, argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return no exceptions if all required args are provided', () => {
    const argDefs: NamedArgumentDef[] = [
      { name: 'required1', required: true }, { name: 'optional2' },
    ];
    const argsMap: ArgumentsMap = { required1: 1 };

    const exceptions = validateNamedArgs(argsMap, argDefs);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return an exception for each missing argument', () => {
    const argDefs: NamedArgumentDef[] = [
      { name: 'requiredOption1', required: true },
      { name: 'optionalOption' },
      { name: 'requiredOption2', required: true },
    ];
    const argsMap: ArgumentsMap = {};

    const exceptions = validateNamedArgs(argsMap, argDefs);

    const expected = [
      {
        level: 'error',
        message: "'requiredOption1' is required",
        identifiers: ['requiredOption1'],
      },
      {
        level: 'error',
        message: "'requiredOption2' is required",
        identifiers: ['requiredOption2'],
      },
    ];
    expect(exceptions).toEqual(expected);
  });

  it('should return an exception for each invalid value', () => {
    const argDefs: NamedArgumentDef[] = [
      { name: 'option1', validValues: [1, 2] },
      { name: 'option2', validValues: ['a', 'b'] },
    ];
    const argsMap: ArgumentsMap = {
      option1: 3,
      option2: 'c',
    };

    const exceptions = validateNamedArgs(argsMap, argDefs);

    expect(exceptions.length).toBe(2);
  });
});
