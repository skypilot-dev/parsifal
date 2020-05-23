import { ValidationException } from '../../_types';
import { validateRequiredArgs } from '../validateRequiredArgs';

describe('validateRequiredArgs()', () => {
  it('should return no exceptions if no args are required', () => {
    const argsMap = new Map([
      ['optional1', { definition: { name: 'optional1' }, value: undefined }],
      ['optional2', { definition: { name: 'optional2' }, value: undefined }],
    ]);

    const exceptions = validateRequiredArgs(argsMap);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return no exceptions if all required args are provided', () => {
    const argsMap = new Map([
      ['required1', { definition: { name: 'optional1', required: true }, value: 1 }],
      ['optional2', { definition: { name: 'optional2' }, value: undefined }],
    ]);

    const exceptions = validateRequiredArgs(argsMap);

    const expected: ValidationException[] = [];
    expect(exceptions).toEqual(expected);
  });

  it('should return exceptions for each missing argument', () => {
    const argsMap = new Map([
      ['required1', { definition: { name: 'required1', required: true }, value: undefined }],
      ['required2', { definition: { name: 'required2', required: true }, value: 1 }],
      ['required3', { definition: { name: 'required3', required: true }, value: undefined }],
      ['optional4', { definition: { name: 'optional3', positional: true }, value: undefined }],
    ]);

    const exceptions = validateRequiredArgs(argsMap);

    const expected = [
      {
        level: 'error',
        message: "'required1' is required",
        identifiers: ['required1'],
      },
      {
        level: 'error',
        message: "'required3' is required",
        identifiers: ['required3'],
      },
    ];
    expect(exceptions).toEqual(expected);
  });
});
